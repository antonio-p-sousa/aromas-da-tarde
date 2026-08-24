// Atribui imagem de capa a cada coleção: usa a foto do produto MAIS VENDIDO/1º da coleção.
// Idempotente: salta coleções que já têm imagem (a menos que FORCE=1).
const { shopify } = require('../src/env');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getToken() {
  const r = await fetch(`https://${shopify.shop}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: shopify.clientId, client_secret: shopify.clientSecret, grant_type: 'client_credentials' }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token: ' + JSON.stringify(j));
  return j.access_token;
}

async function gql(token, query, variables) {
  for (let a = 0; ; a++) {
    const r = await fetch(`https://${shopify.shop}/admin/api/${shopify.apiVersion}/graphql.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    });
    const j = await r.json();
    if (j.errors) {
      const s = JSON.stringify(j.errors);
      if (s.includes('THROTTLED') && a < 10) { await sleep(1500 * (a + 1)); continue; }
      throw new Error(s);
    }
    return j.data;
  }
}

(async () => {
  const token = await getToken();
  console.log('token ok');
  // 1) listar coleções
  const d = await gql(token, `{
    collections(first: 30) { nodes { id title handle image { url }
      products(first: 1, sortKey: BEST_SELLING) { nodes { title featuredMedia { ... on MediaImage { image { url } } } } } } }
  }`);
  for (const c of d.collections.nodes) {
    if (c.image && process.env.FORCE !== '1') { console.log(`SKIP  ${c.title} (já tem imagem)`); continue; }
    const p = c.products.nodes[0];
    const url = p?.featuredMedia?.image?.url;
    if (!url) { console.log(`SEM PRODUTO/IMG  ${c.title}`); continue; }
    if (url.includes('placeholder-produto')) { console.log(`SÓ PLACEHOLDER  ${c.title}`); continue; }
    const u = await gql(token, `
      mutation($input: CollectionInput!) { collectionUpdate(input: $input) {
        collection { id title image { url } } userErrors { field message } } }`,
      { input: { id: c.id, image: { src: url } } });
    const e = u.collectionUpdate.userErrors;
    console.log(e.length ? `ERRO  ${c.title}: ${JSON.stringify(e)}` : `OK    ${c.title}  ←  ${p.title}`);
    await sleep(300);
  }
  console.log('FIM');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });

