// Corrige alt text dos ficheiros firedrinks-* (herdaram alt "Financiamento..." do sobe-ficheiros.js).
// Uso: node tools/corrige-alts.js
const { shopify } = require('../src/env');

const ALTS = {
  'firedrinks-header': 'FIREDRINKS — garrafeira online',
  'firedrinks-simbolo': 'FIREDRINKS — símbolo',
  'firedrinks-logo-transparente': 'FIREDRINKS — logótipo',
  'firedrinks-slide-duplo': 'Whisky e Gin em destaque — Aberfeldy 12 e Adamus',
};

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
    if (d.errors) throw new Error(JSON.stringify(d.errors).slice(0, 400));
    return d.data;
  };

  const d = await gql(`query{ files(first: 50, query: "filename:firedrinks*"){ nodes{ id alt preview{ image{ url } } } } }`);
  for (const f of d.files.nodes) {
    const url = (f.preview && f.preview.image && f.preview.image.url) || '';
    const base = Object.keys(ALTS).find((k) => url.includes(k));
    if (!base) { console.log('ignorado:', url.split('/').pop().split('?')[0]); continue; }
    const alt = ALTS[base];
    if (f.alt === alt) { console.log('já ok:', base); continue; }
    const u = await gql(
      `mutation($files:[FileUpdateInput!]!){ fileUpdate(files:$files){ files{ id alt } userErrors{ field message } } }`,
      { files: [{ id: f.id, alt }] },
    );
    const errs = u.fileUpdate.userErrors;
    console.log(errs.length ? `ERRO ${base}: ${JSON.stringify(errs)}` : `corrigido: ${base} → "${alt}"`);
  }
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
