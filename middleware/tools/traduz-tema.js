// Traduz strings EN do tema Various para pt-PT via Translations API.
// O tema trial não aparece em translatableResources(resourceType), mas
// translatableResourcesByIds aceita o gid diretamente (validado 30 jul).
// Uso: node tools/traduz-tema.js            (dry-run: matches + candidatas)
//      node tools/traduz-tema.js --write    (regista as traduções pt-PT)
const { shopify } = require('../src/env');
const LOCALE_CONTENT = 'gid://shopify/OnlineStoreThemeLocaleContent/193307574598';
const LOCALE = 'pt-PT';
const WRITE = process.argv.includes('--write');
const BATCH = 25;

// Mapa valor-EN (normalizado) → tradução PT.
const MAPA = new Map(Object.entries({
  'sort by:': 'Ordenar por:',
  'sort by': 'Ordenar por',
  'filter': 'Filtrar',
  'filters': 'Filtros',
  '{{ count }} products': '{{ count }} produtos',
  '{{ count }} product': '{{ count }} produto',
  '{{ product_count }} products': '{{ product_count }} produtos',
  '{{ product_count }} of {{ count }} products': '{{ product_count }} de {{ count }} produtos',
  '{{ product_count }} of {{ count }} product': '{{ product_count }} de {{ count }} produto',
  'products': 'Produtos',
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
// Para o dry-run: padrões que apanham candidatas cujo formato exato não conhecemos.
const CANDIDATAS = /sort by|filter|search result|all categorie|what are you search|estimated delivery|estimate shipping|^add$|products$/i;
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

  const d = await gql(
    `query($ids:[ID!]!){ translatableResourcesByIds(resourceIds:$ids, first:1){
        nodes{ resourceId
          translatableContent{ key value digest }
          translations(locale:"${LOCALE}"){ key value } } } }`,
    { ids: [LOCALE_CONTENT] },
  );
  const node = d.translatableResourcesByIds.nodes[0];
  if (!node) throw new Error('Recurso de locale content do Various não encontrado.');
  const jaTraduzidas = new Map(node.translations.map((t) => [t.key, t.value]));
  console.log(`${node.translatableContent.length} strings default; ${jaTraduzidas.size} já com tradução ${LOCALE}.`);

  const alvos = [], candidatas = [];
  for (const c of node.translatableContent) {
    if (c.key.startsWith('shopify.checkout') || c.key.startsWith('shopify.sentence')) continue; // geridas pelo Shopify
    const tr = MAPA.get(norm(c.value));
    if (tr) {
      if (jaTraduzidas.get(c.key) === tr) continue; // já está
      alvos.push({ key: c.key, en: c.value, pt: tr, digest: c.digest });
    } else if (!WRITE && CANDIDATAS.test(String(c.value).trim()) && String(c.value).length < 80) {
      candidatas.push(c);
    }
  }

  console.log(`\n${alvos.length} matches do mapa:`);
  for (const a of alvos) console.log(`  · [${a.key}] "${a.en}" → "${a.pt}"`);
  if (!WRITE && candidatas.length) {
    console.log(`\n${candidatas.length} candidatas fora do mapa (rever formatos):`);
    for (const c of candidatas.slice(0, 40)) console.log(`  ? [${c.key}] "${String(c.value).slice(0, 70)}"`);
  }
  if (!WRITE) { console.log('\nDry-run. Correr com --write para registar.'); return; }

  let ok = 0;
  for (let i = 0; i < alvos.length; i += BATCH) {
    const lote = alvos.slice(i, i + BATCH);
    const res = await gql(
      `mutation($id:ID!,$tr:[TranslationInput!]!){ translationsRegister(resourceId:$id, translations:$tr){
          userErrors{ field message } translations{ key } } }`,
      { id: LOCALE_CONTENT, tr: lote.map((a) => ({ key: a.key, value: a.pt, locale: LOCALE, translatableContentDigest: a.digest })) },
    );
    const ue = res.translationsRegister.userErrors;
    if (ue.length) console.log('  ✗ erros no lote:', JSON.stringify(ue));
    ok += res.translationsRegister.translations.length;
  }
  console.log(`\nRegistadas ${ok}/${alvos.length} traduções ${LOCALE}.`);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
