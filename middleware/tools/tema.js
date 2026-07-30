// Ferramenta de tema (Various id 193307574598) via Admin GraphQL — requer read_themes/write_themes.
// SEMPRE com backup antes de escrever. Modos:
//   MODE=dump  node tools/tema.js            → baixa settings_data.json + templates/index.json p/ backup/tema/
//   MODE=put FILE=<local> KEY=<themekey> node tools/tema.js  → sobe um ficheiro (após dump/backup!)
// Ex.: MODE=put FILE=backup/tema/settings_data.patched.json KEY=config/settings_data.json node tools/tema.js
const fs = require('fs');
const path = require('path');
const { shopify } = require('../src/env');

const THEME_ID = process.env.THEME_ID || 'gid://shopify/OnlineStoreTheme/193307574598';
const OUTDIR = path.join(__dirname, '..', 'backup', 'tema');

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
  const r = await fetch(`https://${shopify.shop}/admin/api/${shopify.apiVersion}/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

async function dump(token, keys) {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const d = await gql(token, `
    query($id: ID!, $names: [String!]) {
      theme(id: $id) { id name files(filenames: $names, first: 10) {
        nodes { filename body { ... on OnlineStoreThemeFileBodyText { content } } } } }
    }`, { id: THEME_ID, names: keys });
  for (const f of d.theme.files.nodes) {
    const out = path.join(OUTDIR, f.filename.replace(/\//g, '__'));
    fs.writeFileSync(out, f.body.content);
    console.log('dump:', f.filename, '->', out, `(${f.body.content.length} bytes)`);
  }
}

async function put(token, localFile, themeKey) {
  const content = fs.readFileSync(localFile, 'utf8');
  // backup automático do atual antes de escrever
  await dump(token, [themeKey]);
  const d = await gql(token, `
    mutation($id: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
      themeFilesUpsert(themeId: $id, files: $files) {
        upsertedThemeFiles { filename } userErrors { field message } } }`,
    { id: THEME_ID, files: [{ filename: themeKey, body: { type: 'TEXT', value: content } }] });
  const e = d.themeFilesUpsert.userErrors;
  if (e.length) throw new Error(JSON.stringify(e));
  console.log('upsert OK:', themeKey);
}

(async () => {
  const token = await getToken();
  const mode = process.env.MODE || 'dump';
  if (mode === 'dump') {
    await dump(token, ['config/settings_data.json', 'config/settings_schema.json', 'templates/index.json', 'locales/pt-PT.json', 'locales/pt.json']);
  } else if (mode === 'put') {
    if (!process.env.FILE || !process.env.KEY) throw new Error('MODE=put requer FILE= e KEY=');
    await put(token, process.env.FILE, process.env.KEY);
  } else throw new Error('MODE inválido');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
