// Sobe as barras de financiamento para Conteúdo→Arquivos da loja (CDN).
const { shopify } = require('../src/env');
const fs = require('fs');
const path = require('path');
const FICHEIROS = process.argv.slice(2);

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

  for (let nome of FICHEIROS) {
    const fp = path.resolve(nome);
    const bytes = fs.readFileSync(fp);
    nome = path.basename(fp);

    const st = await gql(
      `mutation($in:[StagedUploadInput!]!){ stagedUploadsCreate(input:$in){
          userErrors{ message } stagedTargets{ url resourceUrl parameters{ name value } } } }`,
      { in: [{ filename: nome, mimeType: 'image/png', resource: 'FILE', httpMethod: 'POST', fileSize: String(bytes.length) }] },
    );
    const t = st.stagedUploadsCreate.stagedTargets[0];
    const form = new FormData();
    for (const p of t.parameters) form.append(p.name, p.value);
    form.append('file', new Blob([bytes], { type: 'image/png' }), nome);
    const up = await fetch(t.url, { method: 'POST', body: form });
    if (!up.ok) throw new Error(`staged upload ${nome}: HTTP ${up.status}`);

    const fc = await gql(
      `mutation($f:[FileCreateInput!]!){ fileCreate(files:$f){ userErrors{ message } files{ id fileStatus } } }`,
      { f: [{ originalSource: t.resourceUrl, alt: 'Financiamento: PRR, República Portuguesa, União Europeia NextGenerationEU, IAPMEI', contentType: 'IMAGE' }] },
    );
    if (fc.fileCreate.userErrors.length) throw new Error(JSON.stringify(fc.fileCreate.userErrors));
    const id = fc.fileCreate.files[0].id;

    // poll até READY para obter o URL CDN
    for (let i = 0; i < 20; i++) {
      await new Promise((res) => setTimeout(res, 1500));
      const q = await gql(`query($id:ID!){ node(id:$id){ ... on MediaImage { fileStatus image { url } } } }`, { id });
      if (q.node.fileStatus === 'READY') { console.log(`${nome} → ${q.node.image.url}`); break; }
      if (q.node.fileStatus === 'FAILED') throw new Error(`${nome}: processamento falhou`);
    }
  }
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });

