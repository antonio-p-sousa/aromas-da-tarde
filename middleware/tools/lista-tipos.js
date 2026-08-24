// Lista os productTypes em uso na loja + coleções existentes (para o plano de categorias).
const { shopify } = require('../src/env');

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
    if (d.errors) throw new Error(JSON.stringify(d.errors));
    return d.data;
  };

  const t = await gql('{ productTypes(first: 100){ edges { node } } }');
  console.log('PRODUCT TYPES em uso:');
  for (const e of t.productTypes.edges) console.log('  ·', e.node);

  let cursor = null;
  console.log('\nCOLEÇÕES existentes:');
  do {
    const c = await gql(
      `query($c:String){ collections(first: 50, after: $c){
          pageInfo{ hasNextPage endCursor }
          nodes{ title handle ruleSet{ rules{ column condition } } productsCount{ count } } } }`,
      { c: cursor },
    );
    for (const n of c.collections.nodes) {
      const regra = n.ruleSet ? n.ruleSet.rules.map((r) => `${r.column}=${r.condition}`).join(',') : 'manual';
      console.log(`  · ${n.title} (${n.handle}) [${regra}] ${n.productsCount.count} produtos`);
    }
    cursor = c.collections.pageInfo.hasNextPage ? c.collections.pageInfo.endCursor : null;
  } while (cursor);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
