// Traduz strings EN restantes do tema Various para pt-PT via Translations API.
// Uso: node traduz-tema.js           (dry-run: mostra o que faria)
//      node traduz-tema.js --write   (regista as traduções)
const { shopify } = require('../src/env');
const THEME_ID = 'gid://shopify/OnlineStoreTheme/193307574598';
const LOCALE = 'pt-PT';
const WRITE = process.argv.includes('--write');

// Mapa valor-EN (normalizado, minúsculas) → tradução PT.
const MAPA = new Map(Object.entries({
  'sort by:': 'Ordenar por:',
  'sort by': 'Ordenar por',
  'filter': 'Filtrar',
  'filters': 'Filtros',
  '{{ count }} products': '{{ count }} produtos',
  '{{ count }} product': '{{ count }} produto',
  '{{ product_count }} products': '{{ product_count }} produtos',
  'add': 'Adicionar',
  '+ add': '+ Adicionar',
  'search results': 'Resultados da pesquisa',
  'all categories': 'Todas as categorias',
  'what are you searching for?': 'O que procura?',
  'estimate shipping': 'Estimar envio',
  'country/region': 'País/região',
  'postal/zip code': 'Código postal',
  'calculate': 'Calcular',
  'province': 'Distrito',
  'shipping rates for your destination:': 'Custos de envio para o seu destino:',
  'please use estimate shipping for more details.': 'Use "Estimar envio" para mais detalhes.',
  'estimated delivery between {{ start_date }} and {{ end_date }}': 'Entrega estimada entre {{ start_date }} e {{ end_date }}',
  'estimated delivery between {{ start_date }} and {{ end_date }}.': 'Entrega estimada entre {{ start_date }} e {{ end_date }}.',
}));
const norm = (s) => String(s).trim().toLowerCase();

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

  const locales = await gql('{ shopLocales { locale primary published } }');
  console.log('Locales da loja:', JSON.stringify(locales.shopLocales));

  // Recursos de conteúdo de locale do tema (um por ficheiro de secção/grupo).
  let cursor = null, alvos = [], total = 0;
  do {
    const d = await gql(
      `query($c:String){ translatableResources(resourceType: ONLINE_STORE_THEME_LOCALE_CONTENT, first: 50, after: $c){
          pageInfo{ hasNextPage endCursor }
          nodes{ resourceId translatableContent{ key value digest locale } } } }`,
      { c: cursor },
    );
    const page = d.translatableResources;
    for (const node of page.nodes) {
      if (!node.resourceId.includes('193307574598')) continue; // só o tema Various
      for (const c of node.translatableContent) {
        total++;
        const tr = MAPA.get(norm(c.value));
        if (tr) alvos.push({ resourceId: node.resourceId, key: c.key, en: c.value, pt: tr, digest: c.digest });
      }
    }
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);

  console.log(`${total} strings percorridas; ${alvos.length} correspondem ao mapa:`);
  for (const a of alvos) console.log(`  · [${a.key}] "${a.en}" → "${a.pt}"`);

  if (!WRITE) { console.log('\nDry-run. Correr com --write para registar.'); return; }

  let ok = 0, err = 0;
  for (const a of alvos) {
    const d = await gql(
      `mutation($id:ID!,$tr:[TranslationInput!]!){ translationsRegister(resourceId:$id, translations:$tr){
          userErrors{ field message } translations{ key locale } } }`,
      { id: a.resourceId, tr: [{ key: a.key, value: a.pt, locale: LOCALE, translatableContentDigest: a.digest }] },
    );
    const ue = d.translationsRegister.userErrors;
    if (ue.length) { err++; console.log('  ✗', a.key, JSON.stringify(ue)); }
    else { ok++; console.log('  ✓', a.key, '→', a.pt); }
  }
  console.log(`\nRegistadas: ${ok} · Erros: ${err}`);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });

