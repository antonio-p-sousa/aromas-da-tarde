// Motor de comparação. NÃO escreve em lado nenhum — só calcula diferenças.
const { hashArticle } = require('./store');
const { cents } = require('./price');

// (A) PHC vs snapshot anterior (BDI): o que mudou desde a última execução.
function diffAgainstSnapshot(articles, snapshot) {
  const nowRefs = new Set(articles.map((a) => a.ref));
  const created = [], priceChanged = [], stockChanged = [], nameChanged = [], otherChanged = [];
  for (const a of articles) {
    const prev = snapshot.get(a.ref);
    if (!prev) { created.push(a.ref); continue; }
    if (prev.hash === hashArticle(a)) continue;
    if (cents(prev.price) !== cents(a.price)) priceChanged.push(a.ref);
    if (Number(prev.stock) !== a.stock) stockChanged.push(a.ref);
    if ((prev.title || '') !== a.title) nameChanged.push(a.ref);
    if (cents(prev.price) === cents(a.price) && Number(prev.stock) === a.stock && (prev.title || '') === a.title) {
      otherChanged.push(a.ref);
    }
  }
  // Presentes no snapshot mas já não publicáveis no PHC → candidatos a despublicar (nunca apagar).
  const removed = [];
  for (const ref of snapshot.keys()) if (!nowRefs.has(ref)) removed.push(ref);
  return { created, priceChanged, stockChanged, nameChanged, otherChanged, removed };
}

// (B) PHC vs Shopify: reconciliação por ref(PHC) ↔ sku(Shopify).
function diffAgainstShopify(articles, bySku) {
  const toCreate = [];        // vendável no PHC, ausente na loja
  const priceMismatch = [];   // existe em ambos, preço diferente
  const stockMismatch = [];   // existe em ambos, inventário diferente
  const zeroPriceInPhc = [];  // PHC epv1=0 (não vendável) — reportar, não criar
  const matched = [];
  const phcRefs = new Set();

  for (const a of articles) {
    phcRefs.add(a.ref);
    if (!a.sellable) { zeroPriceInPhc.push(a.ref); continue; }
    const s = bySku.get(a.ref);
    if (!s) { toCreate.push({ ref: a.ref, title: a.title, price: a.price, stock: a.stock }); continue; }
    matched.push(a.ref);
    if (cents(s.price) !== cents(a.price)) {
      priceMismatch.push({ ref: a.ref, phc: a.price, shopify: s.price });
    }
    if (s.inventory != null && s.inventory !== a.stock) {
      stockMismatch.push({ ref: a.ref, phc: a.stock, shopify: s.inventory });
    }
  }

  // SKUs na loja sem correspondência no PHC publicável → candidatos a rever (nunca apagar automaticamente).
  const orphanInShopify = [];
  for (const sku of bySku.keys()) if (!phcRefs.has(sku)) orphanInShopify.push(sku);

  return { toCreate, priceMismatch, stockMismatch, zeroPriceInPhc, orphanInShopify, matched };
}

module.exports = { diffAgainstSnapshot, diffAgainstShopify };
