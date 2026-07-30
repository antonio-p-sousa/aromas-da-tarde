// MODO DE ESCRITA da sincronização PHC → loja Shopify.
// Por defeito NÃO escreve nada: calcula o plano e mostra-o (igual ao dry-run, mas
// orientado à ação). Só escreve na loja se EXECUTE=1 E CONFIRM=SIM, e mesmo assim
// nunca toca no PHC (o PHC é sempre só-leitura) e aborta se o plano for grande demais.
//
// Uso:
//   node src/sync.js                      # plano, não escreve
//   POLICY=broad node src/sync.js         # plano com a política larga (mostrar esgotados)
//   EXECUTE=1 CONFIRM=SIM node src/sync.js # aplica na loja (só depois de validar em staging)
const phc = require('./phc');
const shop = require('./shopify');
const { diffAgainstShopify } = require('./diff');

const EXECUTE = process.env.EXECUTE === '1' && process.env.CONFIRM === 'SIM';
const POLICY = (process.env.POLICY || 'commercial').toLowerCase(); // 'commercial' | 'broad'
const MAX_CHANGES = parseInt(process.env.MAX_CHANGES || '250', 10); // trava de segurança

async function buildPlan() {
  const articles = await phc.fetchArticles();
  const token = await shop.getToken();
  const { bySku } = await shop.fetchVariantsBySku(token);
  const byRef = new Map(articles.map((a) => [a.ref, a]));
  const vs = diffAgainstShopify(articles, bySku);

  // Quem deve estar visível depende da política.
  const isVisible = (a) => (POLICY === 'broad' ? a.sellable : a.visible);

  const toCreate = articles.filter((a) => isVisible(a) && !bySku.has(a.ref));
  const toHide = [];
  for (const [sku, s] of bySku) {
    const a = byRef.get(sku);
    if (!a || !isVisible(a)) toHide.push({ sku, current: s });
  }
  return {
    token, bySku, byRef,
    toCreate,
    toHide,
    priceUpdates: vs.priceMismatch,
    stockUpdates: vs.stockMismatch,
  };
}

async function main() {
  console.log(`== SYNC PHC → loja == política=${POLICY} · execute=${EXECUTE ? 'SIM' : 'NÃO (só plano)'}`);
  const plan = await buildPlan();
  const total = plan.toCreate.length + plan.toHide.length + plan.priceUpdates.length + plan.stockUpdates.length;
  console.log(`Plano: criar ${plan.toCreate.length} · despublicar ${plan.toHide.length} · preço ${plan.priceUpdates.length} · stock ${plan.stockUpdates.length} (total ${total})`);

  if (!EXECUTE) {
    console.log('\nMODO PLANO — nada foi escrito na loja. Para aplicar: EXECUTE=1 CONFIRM=SIM (após validar em staging).');
    await phc.close();
    return;
  }
  if (total > MAX_CHANGES) {
    console.error(`ABORTADO: plano com ${total} alterações > MAX_CHANGES (${MAX_CHANGES}). Reveja antes de aplicar (ou suba MAX_CHANGES conscientemente).`);
    await phc.close();
    process.exit(3);
  }

  // --- A partir daqui escreve-se na loja. Cada apply* usa uma mutation da Admin API. ---
  // NOTA: validar em staging antes do primeiro sync real. O modo escrita precisa que a
  // camada de leitura traga também inventoryItem.id + location.id + publicationId, que a
  // fase de dry-run (só-leitura) não recolhe. Enquanto isso não estiver ligado, os apply*
  // lançam erro de propósito — é a barreira final contra escritas acidentais.
  for (const a of plan.priceUpdates) await applyPriceUpdate(plan, a);
  for (const a of plan.stockUpdates) await applyStockUpdate(plan, a);
  for (const a of plan.toHide) await applyHide(plan, a);
  for (const a of plan.toCreate) await applyCreate(plan, a);
  await phc.close();
  console.log('SYNC concluído.');
}

// productVariantsBulkUpdate(price) — requer productId + variantId (já os temos em bySku).
async function applyPriceUpdate() { throw new Error('applyPriceUpdate: validar em staging antes de ativar (mutation productVariantsBulkUpdate).'); }
// inventorySetQuantities — requer inventoryItemId + locationId (a leitura tem de os trazer).
async function applyStockUpdate() { throw new Error('applyStockUpdate: falta recolher inventoryItemId/locationId na leitura.'); }
// productUpdate(status: DRAFT) — despublicar, NUNCA apagar.
async function applyHide() { throw new Error('applyHide: validar em staging (productUpdate status DRAFT, nunca delete).'); }
// productSet/productCreate + variante + media — criar produto novo.
async function applyCreate() { throw new Error('applyCreate: validar em staging (productSet com sku/preço/stock/tipo).'); }

main().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
