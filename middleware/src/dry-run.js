// ENSAIO A SECO (dry-run) da sincronização PHC → loja.
// Lê do PHC (SELECT-only) e da Shopify (read_products), compara, e ESCREVE UM RELATÓRIO.
// NÃO grava nada no PHC nem na Shopify. A única escrita é na BDI (snapshot, opcional).
const fs = require('fs');
const path = require('path');
const phc = require('./phc');
const shop = require('./shopify');
const store = require('./store');
const { diffAgainstSnapshot, diffAgainstShopify } = require('./diff');

const NOW = process.env.RUN_TS || new Date(Date.now()).toISOString();
const SAVE = process.env.NO_SAVE !== '1';

async function main() {
  const t0 = Date.now();
  console.log('== DRY-RUN sync PHC → loja ==  (só leitura; não escreve no PHC nem na loja)');

  // 1) Ler PHC (SELECT-only)
  console.log('[PHC] a ler artigos publicáveis (inactivo=0, vaiwww=1)...');
  const articles = await phc.fetchArticles();
  const sellable = articles.filter((a) => a.sellable);
  const visible = articles.filter((a) => a.visible);       // política comercial (em stock, não-excluído)
  const excluded = sellable.filter((a) => a.excluded);      // u_exclu=1
  const zeroPrice = articles.filter((a) => !a.sellable);
  console.log(`[PHC] ${articles.length} publicáveis | ${sellable.length} vendáveis | ${visible.length} visíveis (política comercial) | ${zeroPrice.length} a preço 0`);

  // 2) Ler Shopify (read-only)
  console.log('[Shopify] a obter token e a paginar produtos...');
  const token = await shop.getToken();
  const { bySku, stats } = await shop.fetchVariantsBySku(token, (p) => {
    if (p.page % 5 === 0) console.log(`[Shopify] página ${p.page} | ${p.mapped} SKUs`);
  });
  console.log(`[Shopify] ${stats.products} produtos | ${bySku.size} com SKU | ${stats.variantsNoSku} variantes sem SKU`);

  // 3) Comparações (sem escrever)
  const db = store.open();
  const snapshot = store.loadSnapshot(db);
  const vsSnap = diffAgainstSnapshot(articles, snapshot);
  const vsShop = diffAgainstShopify(articles, bySku);

  // Reconciliação sensível à POLÍTICA de visibilidade (comercial vs larga).
  const byRef = new Map(articles.map((a) => [a.ref, a]));
  const visibleNotInStore = visible.filter((a) => !bySku.has(a.ref)).length;   // criar (política comercial)
  let inStoreShouldHide = 0;                                                    // despublicar (política comercial)
  for (const sku of bySku.keys()) {
    const a = byRef.get(sku);
    if (a && !a.visible) inStoreShouldHide++;
  }

  // 4) Relatório
  const summary = {
    generatedAt: NOW,
    durationMs: Date.now() - t0,
    phc: {
      publishable: articles.length,
      sellable: sellable.length,
      visibleCommercial: visible.length,
      excluded: excluded.length,
      zeroPrice: zeroPrice.length,
      totalStockUnits: sellable.reduce((s, a) => s + Math.max(0, a.stock), 0),
      withStock: sellable.filter((a) => a.stock > 0).length,
      withoutStock: sellable.filter((a) => a.stock <= 0).length,
    },
    shopify: {
      products: stats.products,
      withSku: bySku.size,
      variantsNoSku: stats.variantsNoSku,
    },
    reconciliation: {
      matched: vsShop.matched.length,
      priceMismatch: vsShop.priceMismatch.length,
      stockMismatch: vsShop.stockMismatch.length,
      orphanInShopify: vsShop.orphanInShopify.length,
      zeroPriceInPhc: vsShop.zeroPriceInPhc.length,
    },
    // O nº de "criar" depende da POLÍTICA de visibilidade — reportar as duas.
    policy: {
      broad: { toCreate: vsShop.toCreate.length, note: 'mostrar tudo o que é vendável (inclui esgotados)' },
      commercial: {
        toCreate: visibleNotInStore,
        toHide: inStoreShouldHide,
        note: 'só em stock e não-excluído (u_exclu=0, stock>0) — regra do import de 25 jul',
      },
    },
    sinceLastRun: {
      snapshotSize: snapshot.size,
      firstRun: snapshot.size === 0,
      created: vsSnap.created.length,
      priceChanged: vsSnap.priceChanged.length,
      stockChanged: vsSnap.stockChanged.length,
      nameChanged: vsSnap.nameChanged.length,
      removed: vsSnap.removed.length,
    },
  };

  const outDir = path.join(__dirname, '..', 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = NOW.replace(/[:.]/g, '-');
  const jsonPath = path.join(outDir, `dry-run-${stamp}.json`);
  const detail = { summary, samples: buildSamples(vsShop) };
  fs.writeFileSync(jsonPath, JSON.stringify(detail, null, 2));
  const mdPath = path.join(outDir, `dry-run-${stamp}.md`);
  fs.writeFileSync(mdPath, renderMarkdown(summary, vsShop));

  // 5) Fixar snapshot (BDI nossa — não é a BD do cliente). Desligável com NO_SAVE=1.
  if (SAVE) {
    store.saveSnapshot(db, articles, NOW);
    store.recordRun(db, 'dry-run', summary, NOW);
    console.log('[BDI] snapshot atualizado (deteção de alterações fica armada para a próxima corrida).');
  } else {
    console.log('[BDI] NO_SAVE=1 → snapshot NÃO gravado.');
  }

  await phc.close();
  console.log('\n=== RESUMO ===');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nRelatórios: ${path.basename(mdPath)} , ${path.basename(jsonPath)}`);
}

function buildSamples(vsShop) {
  return {
    toCreate: vsShop.toCreate.slice(0, 20),
    priceMismatch: vsShop.priceMismatch.slice(0, 20),
    stockMismatch: vsShop.stockMismatch.slice(0, 20),
    orphanInShopify: vsShop.orphanInShopify.slice(0, 20),
  };
}

function renderMarkdown(s, vsShop) {
  const L = [];
  L.push(`# Dry-run — sincronização PHC → loja`);
  L.push(`\n_Gerado: ${s.generatedAt} · duração ${(s.durationMs / 1000).toFixed(1)}s · **nada foi escrito no PHC nem na loja**_\n`);
  L.push(`## 1. Catálogo PHC (publicável)`);
  L.push(`| Métrica | Valor |`);
  L.push(`|---|---:|`);
  L.push(`| Artigos publicáveis (inactivo=0, vaiwww=1) | ${s.phc.publishable} |`);
  L.push(`| Vendáveis (epv1 > 0) | ${s.phc.sellable} |`);
  L.push(`| **Visíveis (política comercial: em stock, não-excluído)** | **${s.phc.visibleCommercial}** |`);
  L.push(`| Excluídos (u_exclu=1) | ${s.phc.excluded} |`);
  L.push(`| A preço 0 (excluídos do sync ativo) | ${s.phc.zeroPrice} |`);
  L.push(`| Com stock (>0) | ${s.phc.withStock} |`);
  L.push(`| Sem stock (≤0) | ${s.phc.withoutStock} |`);
  L.push(`| Unidades de stock somadas | ${s.phc.totalStockUnits} |`);
  L.push(`\n## 2. Loja Shopify (estado atual)`);
  L.push(`| Métrica | Valor |`);
  L.push(`|---|---:|`);
  L.push(`| Produtos | ${s.shopify.products} |`);
  L.push(`| Com SKU (=ref) | ${s.shopify.withSku} |`);
  L.push(`| Variantes sem SKU | ${s.shopify.variantsNoSku} |`);
  L.push(`\n## 3. Reconciliação PHC ↔ Shopify (por ref = sku)`);
  L.push(`| Ação que uma sincronização REAL faria | Nº |`);
  L.push(`|---|---:|`);
  L.push(`| Já correspondidos (ref existe em ambos) | ${s.reconciliation.matched} |`);
  L.push(`| **Atualizar preço** (diferente) | ${s.reconciliation.priceMismatch} |`);
  L.push(`| **Atualizar stock** (diferente) | ${s.reconciliation.stockMismatch} |`);
  L.push(`| A rever: SKU na loja sem match no PHC | ${s.reconciliation.orphanInShopify} |`);
  L.push(`| A preço 0 no PHC (não criar) | ${s.reconciliation.zeroPriceInPhc} |`);
  L.push(`\n**Criar/despublicar depende da POLÍTICA de visibilidade:**`);
  L.push(`| Política | Criar | Despublicar |`);
  L.push(`|---|---:|---:|`);
  L.push(`| Comercial (só em stock + não-excluído) — regra de 25 jul | ${s.policy.commercial.toCreate} | ${s.policy.commercial.toHide} |`);
  L.push(`| Larga (mostrar tudo o que é vendável, incl. esgotados) | ${s.policy.broad.toCreate} | — |`);
  L.push(`\n> A loja tem hoje ${s.shopify.products} produtos ≈ ${s.phc.visibleCommercial} visíveis pela política comercial → já estão praticamente alinhados. O "criar em massa" só surge se se decidir mostrar esgotados.`);
  L.push(`\n> Nenhuma destas ações foi executada. Isto é o plano que o sync aplicaria.`);
  L.push(`\n## 4. Alterações desde a última corrida (BDI)`);
  if (s.sinceLastRun.firstRun) {
    L.push(`Primeira execução — sem snapshot anterior. A partir da próxima, esta secção mostra só o delta (preços/stocks/nomes que mudaram).`);
  } else {
    L.push(`| Desde a última corrida | Nº |`);
    L.push(`|---|---:|`);
    L.push(`| Novos artigos | ${s.sinceLastRun.created} |`);
    L.push(`| Preço alterado | ${s.sinceLastRun.priceChanged} |`);
    L.push(`| Stock alterado | ${s.sinceLastRun.stockChanged} |`);
    L.push(`| Nome alterado | ${s.sinceLastRun.nameChanged} |`);
    L.push(`| Deixaram de ser publicáveis | ${s.sinceLastRun.removed} |`);
  }
  L.push(`\n## 5. Amostras (até 20 cada)`);
  L.push(`**A criar:** ${vsShop.toCreate.slice(0, 20).map((x) => x.ref).join(', ') || '—'}`);
  L.push(`\n**Preço divergente:** ${vsShop.priceMismatch.slice(0, 20).map((x) => `${x.ref} (PHC ${x.phc}€ vs loja ${x.shopify}€)`).join('; ') || '—'}`);
  L.push(`\n**Stock divergente:** ${vsShop.stockMismatch.slice(0, 20).map((x) => `${x.ref} (PHC ${x.phc} vs loja ${x.shopify})`).join('; ') || '—'}`);
  L.push(`\n**SKU na loja sem PHC:** ${vsShop.orphanInShopify.slice(0, 20).join(', ') || '—'}`);
  return L.join('\n') + '\n';
}

main().catch((e) => { console.error('FALHOU:', e); process.exit(1); });
