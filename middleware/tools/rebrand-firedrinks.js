// Rebrand do copy comercial: "Aromas da Tarde" → "FIREDRINKS" nas traduções pt-PT.
// (A entidade legal continua Aromas da Tarde Unipessoal Lda — não vive nas traduções.)
const { shopify } = require('../src/env');
const T = '193307574598';
const LOCALE = 'pt-PT';
const WRITE = process.argv.includes('--write');

const RECURSOS = [
  `gid://shopify/OnlineStoreThemeLocaleContent/${T}`,
  `gid://shopify/OnlineStoreThemeJsonTemplate/product?theme_id=${T}`,
  `gid://shopify/OnlineStoreThemeJsonTemplate/collection?theme_id=${T}`,
  `gid://shopify/OnlineStoreThemeJsonTemplate/password?theme_id=${T}`,
  `gid://shopify/OnlineStoreThemeJsonTemplate/page.contact?theme_id=${T}`,
  `gid://shopify/OnlineStoreThemeJsonTemplate/index?theme_id=${T}`,
  `gid://shopify/OnlineStoreThemeSectionGroup/header-group?theme_id=${T}`,
  `gid://shopify/OnlineStoreThemeSectionGroup/footer-group?theme_id=${T}`,
];

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

  let total = 0;
  for (const id of RECURSOS) {
    const d = await gql(
      `query($ids:[ID!]!){ translatableResourcesByIds(resourceIds:$ids, first:1){
          nodes{ translatableContent{ key digest } translations(locale:"${LOCALE}"){ key value } } } }`,
      { ids: [id] },
    );
    const node = d.translatableResourcesByIds.nodes[0];
    if (!node) continue;
    const digests = new Map(node.translatableContent.map((c) => [c.key, c.digest]));
    const alvos = node.translations
      .filter((t) => t.value.includes('Aromas da Tarde'))
      .map((t) => ({ key: t.key, pt: t.value.split('Aromas da Tarde').join('FIREDRINKS'), digest: digests.get(t.key) }));
    if (!alvos.length) continue;
    console.log(`${id.split('/').pop().split('?')[0]}:`);
    for (const a of alvos) console.log(`  · [${a.key.slice(0, 70)}] → "${a.pt.replace(/<[^>]+>/g, ' ').trim().slice(0, 70)}"`);
    total += alvos.length;
    if (!WRITE) continue;
    const res = await gql(
      `mutation($id:ID!,$tr:[TranslationInput!]!){ translationsRegister(resourceId:$id, translations:$tr){
          userErrors{ field message } translations{ key } } }`,
      { id, tr: alvos.map((a) => ({ key: a.key, value: a.pt, locale: LOCALE, translatableContentDigest: a.digest })) },
    );
    const ue = res.translationsRegister.userErrors;
    if (ue.length) console.log('  ✗', JSON.stringify(ue));
  }
  console.log(WRITE ? `\nRebrand: ${total} traduções atualizadas.` : `\nDry-run: ${total} alvos. --write para aplicar.`);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
