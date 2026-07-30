// Mapa família (PHC faminome) → coleção Shopify.
// Regra base: product_type de cada produto = faminome, portanto as coleções
// automáticas (smart, por Tipo) apanham TUDO sem intervenção manual. Este mapa
// só decide em que PÁGINA de coleção-mãe a cauda longa aparece, para não haver
// coleções de 1 produto. Nenhuma escrita na loja acontece aqui — é config.

// As 11 coleções que já existem na loja (Matrixify, 25 jul).
const COLLECTIONS = [
  'Whisky', 'Gin', 'Rum', 'Vodka', 'Licor', 'Tequila',
  'Apert./Degestivos', 'Cognac', 'Brandy', 'Vinhos', 'Porto',
];

// Famílias com coleção própria (1:1) + folds ÓBVIOS da cauda longa.
const FAMILY_TO_COLLECTION = {
  // 1:1 com coleção existente
  'WHISKY': 'Whisky',
  'GIN': 'Gin',
  'RUM': 'Rum',
  'VODKA': 'Vodka',
  'LICOR': 'Licor',
  'TEQUILA': 'Tequila',
  'APERT./DEGESTIVOS': 'Apert./Degestivos',
  'COGNAC': 'Cognac',
  'VINHOS': 'Vinhos',
  'BRANDY': 'Brandy',
  'PORTO': 'Porto',
  // folds óbvios → Vinhos (vinhos e fortificados)
  'CHAMPAGNE': 'Vinhos',
  'ESPUMANTE (MOUSSEUX)': 'Vinhos',
  'XÉRE´S': 'Vinhos',
  'MOSCATEL': 'Vinhos',
  'VINHO DA MADEIRA': 'Vinhos',
  // folds óbvios → aguardentes vínicas/de fruta
  'AGUARDENTES': 'Brandy',
  'CALVADOS': 'Brandy',
  'ARMAGNAC': 'Cognac',
  // fold óbvio → aperitivos/amargos
  'BITTERS': 'Apert./Degestivos',
};

// Famílias sem lar óbvio — DECISÃO DE MERCHANDISING (cliente/parceiro PHC).
// Enquanto não houver decisão, ficam só com product_type = faminome (não entram
// em nenhuma coleção-mãe automaticamente).
const AMBIGUOUS = [
  { family: 'AA - CONJUNTOS', count: 35, note: 'packs/presentes — cruza categorias', options: ['Nova coleção "Presentes & Conjuntos"', 'Deixar fora de coleções'] },
  { family: 'PISCO', count: 15, note: 'aguardente de uva sul-americana', options: ['Brandy (aguardente de uva)', 'Nova coleção "Outros destilados"'] },
  { family: 'ABSINTO', count: 14, note: 'destilado de anis de alta graduação', options: ['Licor', 'Nova coleção "Outros destilados"'] },
  { family: 'SOTOL', count: 6, note: 'destilado mexicano de agave/dasylirion', options: ['Tequila (agaves)', 'Nova coleção "Outros destilados"'] },
  { family: 'AGUA TONICA', count: 2, note: 'mixer sem álcool', options: ['Nova coleção "Mixers/Sem álcool"', 'Excluir de coleções de bebidas'] },
  { family: 'CERVEJA', count: 1, note: 'não há coleção de cerveja', options: ['Nova coleção "Cerveja"', 'Excluir'] },
  { family: 'ALIMENTAR', count: 1, note: 'não é bebida', options: ['Excluir das coleções de bebidas'] },
];

// Devolve a coleção-mãe de uma família, ou null se ficar por decidir.
function collectionForFamily(faminome) {
  const key = (faminome || '').trim().toUpperCase();
  return FAMILY_TO_COLLECTION[key] || null;
}

module.exports = { COLLECTIONS, FAMILY_TO_COLLECTION, AMBIGUOUS, collectionForFamily };
