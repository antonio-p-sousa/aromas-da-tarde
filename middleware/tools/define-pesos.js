// Define peso 1,4 kg nas variantes sem peso (base p/ portes por peso — reunião 25 ago).
// Uso: node tools/define-pesos.js [--write]
const { shopify } = require('../src/env');
const PESO_KG = 1.4;
const WRITE = process.argv.includes('--write');

(async () => {
  const r = await fetch(`https://${shopify.shop}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: shopify.clientId, client_secret: shopify.clientSecret, grant_type: 'client_credentials' }),
  });
  const tok = (await r.json()).access_token;
  const gql = async (query, variables) => {
    const g = await fetch(`https://${shopify.shop}/admin/api/2025-07/graphql.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': tok },
      body: JSON.stringify({ query, variables }),
    });
    const d = await g.json();
    if (d.errors) throw new Error(JSON.stringify(d.errors).slice(0, 300));
    return d.data;
  };

  let cursor = null, total = 0, semPeso = [], comPeso = 0;
  do {
    const d = await gql(
      `query($c:String){ products(first: 100, after: $c){
          pageInfo{ hasNextPage endCursor }
          nodes{ id title variants(first: 1){ nodes{ legacyResourceId inventoryItem{ measurement{ weight{ value unit } } } } } } } }`,
      { c: cursor },
    );
    for (const p of d.products.nodes) {
      total++;
      const v = p.variants.nodes[0];
      if (!v) continue;
      const w = v.inventoryItem.measurement && v.inventoryItem.measurement.weight;
      if (w && w.value > 0) { comPeso++; continue; }
      semPeso.push({ produto: p.title, variantId: v.legacyResourceId });
    }
    cursor = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
  } while (cursor);
  console.log(`${total} produtos · ${comPeso} já com peso · ${semPeso.length} a definir para ${PESO_KG} kg`);

  if (!WRITE) { console.log('Dry-run. --write para aplicar.'); return; }

  let ok = 0, err = 0;
  for (const item of semPeso) {
    const res = await fetch(`https://${shopify.shop}/admin/api/2025-07/variants/${item.variantId}.json`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': tok },
      body: JSON.stringify({ variant: { id: Number(item.variantId), weight: PESO_KG, weight_unit: 'kg' } }),
    });
    if (!res.ok) {
      err++;
      if (err <= 3) console.log('  ✗', item.produto, res.status, (await res.text()).slice(0, 150));
      if (res.status === 429) await new Promise((r2) => setTimeout(r2, 2000));
    } else ok++;
    if (ok % 250 === 0 && ok > 0) console.log(`  ... ${ok}/${semPeso.length}`);
    await new Promise((r2) => setTimeout(r2, 120));
  }
  console.log(`Pesos definidos: ${ok} · erros: ${err}`);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
