// Testes unitários do middleware. Correr: node --test
const { test } = require('node:test');
const assert = require('node:assert');
const { computePrice, cents } = require('../src/price');
const { diffAgainstShopify } = require('../src/diff');

test('computePrice soma o IVA sobre o líquido (IVA1INCL=0)', () => {
  assert.strictEqual(computePrice(100, 23, 0), 123);
  assert.strictEqual(computePrice(10, 13, 0), 11.3);
  assert.strictEqual(computePrice(50, 6, 0), 53);
});

test('computePrice arredonda o meio-cêntimo PARA CIMA (regra canónica)', () => {
  // 217,50 × 1,23 = 267,525 → 267,53 (não 267,52 por erro de float)
  assert.strictEqual(computePrice(217.5, 23, 0), 267.53);
  // 133,45... caso que antes falhava
  assert.strictEqual(computePrice(108.5, 23, 0), 133.46);
});

test('computePrice com IVA1INCL=1 não volta a somar IVA', () => {
  assert.strictEqual(computePrice(123, 23, 1), 123);
});

test('cents compara preços sem ruído de vírgula flutuante', () => {
  assert.strictEqual(cents(0.1 + 0.2), 30); // 0.30000000000000004 → 30
  assert.strictEqual(cents(267.53), 26753);
});

test('diffAgainstShopify: cria os vendáveis ausentes, ignora preço 0', () => {
  const articles = [
    { ref: 'A1', title: 'X', price: 10, stock: 5, sellable: true },   // existe na loja
    { ref: 'A2', title: 'Y', price: 20, stock: 0, sellable: true },   // ausente → criar
    { ref: 'A3', title: 'Z', price: 0, stock: 1, sellable: false },   // preço 0 → não criar
  ];
  const bySku = new Map([['A1', { price: 10, inventory: 5, status: 'ACTIVE' }]]);
  const d = diffAgainstShopify(articles, bySku);
  assert.deepStrictEqual(d.toCreate.map((x) => x.ref), ['A2']);
  assert.deepStrictEqual(d.zeroPriceInPhc, ['A3']);
  assert.strictEqual(d.priceMismatch.length, 0);
  assert.strictEqual(d.stockMismatch.length, 0);
});

test('diffAgainstShopify: deteta preço e stock divergentes', () => {
  const articles = [{ ref: 'B1', title: 'W', price: 12.5, stock: 3, sellable: true }];
  const bySku = new Map([['B1', { price: 11.99, inventory: 7, status: 'ACTIVE' }]]);
  const d = diffAgainstShopify(articles, bySku);
  assert.strictEqual(d.priceMismatch.length, 1);
  assert.strictEqual(d.stockMismatch.length, 1);
  assert.strictEqual(d.priceMismatch[0].ref, 'B1');
});

test('diffAgainstShopify: SKU na loja sem match no PHC = órfão', () => {
  const articles = [{ ref: 'C1', title: 'Q', price: 5, stock: 1, sellable: true }];
  const bySku = new Map([
    ['C1', { price: 5, inventory: 1, status: 'ACTIVE' }],
    ['ZZ', { price: 9, inventory: 2, status: 'ACTIVE' }], // não existe no PHC
  ]);
  const d = diffAgainstShopify(articles, bySku);
  assert.deepStrictEqual(d.orphanInShopify, ['ZZ']);
});
