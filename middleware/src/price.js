// Cálculo do preço final Shopify a partir do PHC.
// Mapeamento: epv1 é o preço líquido; IVA1INCL=0 em todo o catálogo →
// preço final = epv1 × (1 + iva/100), arredondado a 2 casas.
// Se algum dia surgir IVA1INCL=1, o epv1 já inclui IVA → não somar.
function computePrice(epv1, iva, iva1incl = 0) {
  const net = Number(epv1) || 0;
  const netCents = Math.round(net * 100);
  if (iva1incl === 1) return netCents / 100;
  // Meio-cêntimo-para-cima robusto: trabalhar em inteiros evita o erro de vírgula
  // flutuante que fazia 267,525 arredondar para 267,52 em vez de 267,53.
  const rate = Number(iva) || 0; // percentagem (ex.: 23)
  const grossCents = Math.round((netCents * (100 + rate)) / 100);
  return grossCents / 100;
}

function round2(x) {
  return Math.round((Number(x) + Number.EPSILON) * 100) / 100;
}

// Comparação robusta de preços em cêntimos (evita ruído de vírgula flutuante).
function cents(x) {
  return Math.round((Number(x) || 0) * 100);
}

module.exports = { computePrice, round2, cents };
