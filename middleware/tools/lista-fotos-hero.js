// Lista fotos de produtos (Whisky/Gin) para compor o banner 2-up do slideshow.
const { shopify } = require('../src/env');

(async () => {
  const r = await fetch(`https://${shopify.shop}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: shopify.clientId, client_secret: shopify.clientSecret, grant_type: 'client_credentials' }),
  });
  const tok = (await r.json()).access_token;
  const g = await fetch(`https://${shopify.shop}/admin/api/2025-07/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': tok },
    body: JSON.stringify({
      query: `query{
        p1: products(first:8, query:"product_type:Whisky"){ nodes{ title featuredMedia{ preview{ image{ url width height } } } } }
        p2: products(first:8, query:"product_type:Gin"){ nodes{ title featuredMedia{ preview{ image{ url width height } } } } }
      }`,
    }),
  });
  const d = await g.json();
  if (d.errors) { console.error(JSON.stringify(d.errors).slice(0, 300)); process.exit(1); }
  for (const k of ['p1', 'p2']) {
    for (const p of d.data[k].nodes) {
      const img = p.featuredMedia && p.featuredMedia.preview.image;
      if (img) console.log(`${k} | ${p.title} | ${img.width}x${img.height} | ${img.url}`);
    }
  }
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
