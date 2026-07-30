// Carrega imagens PHC → produtos Shopify, ao vivo (sem pasta local): por cada produto sem
// imagem real, vai buscar o BLOB ao PHC (ifl, por ref) e anexa-o; apaga o placeholder.
// Idempotente (salta produtos com imagem real) → re-executável. É o caminho usado pelo sync.
const phc = require('./src/phc');
const shop = require('./src/shopify');

const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT) : Infinity;
const PLACEHOLDER_MARK = 'placeholder-produto';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const token = await shop.getToken();
  console.log('token ok');
  let seen = 0, done = 0, skipReal = 0, noImg = 0, noSku = 0, errors = 0;
  for await (const p of shop.productsWithMedia(token)) {
    seen++;
    if (seen > LIMIT) break;
    const sku = (p.variants.nodes[0]?.sku || '').trim();
    if (!sku) { noSku++; continue; }
    const media = p.media.nodes || [];
    if (media.some((m) => m.image?.url && !m.image.url.includes(PLACEHOLDER_MARK))) { skipReal++; continue; }
    const placeholders = media.filter((m) => (m.image?.url || '').includes(PLACEHOLDER_MARK)).map((m) => m.id);
    try {
      const img = await phc.fetchImageByRef(sku);
      if (!img) { noImg++; continue; }
      await shop.uploadProductImage(token, p.id, { buffer: img.buffer, ext: img.ext, ref: sku });
      await shop.deleteProductMedia(token, p.id, placeholders);
      done++;
      if (done % 25 === 0) console.log(`feitos ${done} | sem-img ${noImg} | já-real ${skipReal} | vistos ${seen}`);
    } catch (e) {
      errors++; console.log(`ERRO ${sku}: ${e.message}`);
      if (errors > 40) { console.log('demasiados erros, a parar.'); break; }
    }
    await sleep(150);
  }
  await phc.close();
  console.log(`\nFIM. carregadas ${done} | já-real ${skipReal} | sem imagem PHC ${noImg} | sem sku ${noSku} | erros ${errors} | vistos ${seen}`);
}

main().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
