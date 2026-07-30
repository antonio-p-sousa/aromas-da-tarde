// Camada de leitura da Shopify (Admin GraphQL). No dry-run só se lê (read_products).
// Token obtido por client_credentials (app custom já instalada na loja).
const { shopify } = require('./env');

const BASE = `https://${shopify.shop}/admin`;

async function getToken() {
  const res = await fetch(`https://${shopify.shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: shopify.clientId,
      client_secret: shopify.clientSecret,
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error('Shopify token falhou: ' + res.status + ' ' + (await res.text()));
  const j = await res.json();
  return j.access_token;
}

async function gql(token, query, variables = {}) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${BASE}/api/${shopify.apiVersion}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    });
    const j = await res.json();
    if (j.errors && JSON.stringify(j.errors).includes('THROTTLED')) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors));
    return j.data;
  }
  throw new Error('GraphQL: esgotadas as tentativas (THROTTLED).');
}

const PRODUCTS_QUERY = `
query($cursor: String) {
  products(first: 100, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      title
      status
      totalInventory
      variants(first: 5) {
        nodes { id sku price inventoryQuantity }
      }
    }
  }
}`;

// Devolve um Map sku(=ref) -> { productId, variantId, title, status, price, inventory }
async function fetchVariantsBySku(token, onPage) {
  const bySku = new Map();
  let cursor = null, page = 0, seen = 0, noSku = 0;
  do {
    const data = await gql(token, PRODUCTS_QUERY, { cursor });
    const conn = data.products;
    for (const p of conn.nodes) {
      seen++;
      for (const v of p.variants.nodes) {
        const sku = (v.sku || '').trim();
        if (!sku) { noSku++; continue; }
        bySku.set(sku, {
          productId: p.id,
          variantId: v.id,
          title: p.title,
          status: p.status,
          price: Number(v.price),
          inventory: v.inventoryQuantity == null ? null : Number(v.inventoryQuantity),
        });
      }
    }
    cursor = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
    page++;
    if (onPage) onPage({ page, seen, mapped: bySku.size });
  } while (cursor);
  return { bySku, stats: { products: seen, variantsNoSku: noSku } };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Escrita de media (usado só pelo sync/ferramenta de imagens, nunca no dry-run) ---
const mimeFor = (ext) => (String(ext).toLowerCase() === 'png' ? 'image/png' : 'image/jpeg');

// Carrega um buffer de imagem e anexa-o ao produto. { buffer, ext, ref } → media criada.
async function uploadProductImage(token, productId, { buffer, ext, ref }) {
  const filename = `${ref}.${String(ext).toLowerCase()}`;
  const mime = mimeFor(ext);
  const d = await gql(token, `
    mutation($input:[StagedUploadInput!]!){ stagedUploadsCreate(input:$input){
      stagedTargets{ url resourceUrl parameters{ name value } } userErrors{ message } } }`,
    { input: [{ filename, mimeType: mime, httpMethod: 'POST', resource: 'IMAGE' }] });
  if (d.stagedUploadsCreate.userErrors.length) throw new Error('stage: ' + JSON.stringify(d.stagedUploadsCreate.userErrors));
  const t = d.stagedUploadsCreate.stagedTargets[0];
  const form = new FormData();
  for (const pr of t.parameters) form.append(pr.name, pr.value);
  form.append('file', new Blob([buffer], { type: mime }), filename);
  const up = await fetch(t.url, { method: 'POST', body: form });
  if (!up.ok) throw new Error('upload ' + up.status + ' ' + (await up.text()).slice(0, 200));
  const m = await gql(token, `
    mutation($productId:ID!,$media:[CreateMediaInput!]!){ productCreateMedia(productId:$productId, media:$media){
      media{ ... on MediaImage { id } } mediaUserErrors{ message } } }`,
    { productId, media: [{ originalSource: t.resourceUrl, mediaContentType: 'IMAGE' }] });
  if (m.productCreateMedia.mediaUserErrors.length) throw new Error('addMedia: ' + JSON.stringify(m.productCreateMedia.mediaUserErrors));
}

async function deleteProductMedia(token, productId, mediaIds) {
  if (!mediaIds || !mediaIds.length) return;
  const d = await gql(token, `
    mutation($productId:ID!,$mediaIds:[ID!]!){ productDeleteMedia(productId:$productId, mediaIds:$mediaIds){
      deletedMediaIds mediaUserErrors{ message } } }`, { productId, mediaIds });
  if (d.productDeleteMedia.mediaUserErrors.length) throw new Error('deleteMedia: ' + JSON.stringify(d.productDeleteMedia.mediaUserErrors));
}

// Percorre produtos com sku + media (para saber quais faltam imagem real / têm placeholder).
async function* productsWithMedia(token) {
  let cursor = null;
  do {
    const d = await gql(token, `
      query($c:String){ products(first:60, after:$c){ pageInfo{ hasNextPage endCursor }
        nodes{ id variants(first:1){ nodes{ sku } }
          media(first:15){ nodes{ id ... on MediaImage { image{ url } } } } } } }`, { c: cursor });
    for (const n of d.products.nodes) yield n;
    cursor = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
  } while (cursor);
}

module.exports = { getToken, gql, fetchVariantsBySku, uploadProductImage, deleteProductMedia, productsWithMedia };
