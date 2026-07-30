# Mapa família (PHC) → coleção (Shopify) + cauda longa

Base: 27 famílias (`faminome`) no catálogo publicável (4 151 artigos). A loja tem **11 coleções**.
Codificado em `middleware/src/categories.js`.

> **Princípio:** cada produto leva `product_type = faminome`, portanto coleções **automáticas por Tipo**
> apanham tudo. Este mapa só decide em que **coleção-mãe** a cauda longa aparece, para não haver
> coleções de 1 produto.

## 1:1 com coleção existente (11 famílias, ~96%)

| Família | Artigos | Coleção |
|---|---:|---|
| WHISKY | 1 462 | Whisky |
| GIN | 675 | Gin |
| RUM | 593 | Rum |
| VODKA | 345 | Vodka |
| LICOR | 305 | Licor |
| TEQUILA | 285 | Tequila |
| APERT./DEGESTIVOS | 75 | Apert./Degestivos |
| COGNAC | 70 | Cognac |
| VINHOS | 66 | Vinhos |
| BRANDY | 45 | Brandy |
| PORTO | 31 | Porto |

## Folds ÓBVIOS da cauda (9 famílias, ~2,3%)

| Família | Artigos | Coleção-mãe | Razão |
|---|---:|---|---|
| BITTERS | 40 | Apert./Degestivos | amargos são aperitivos |
| AGUARDENTES | 38 | Brandy | aguardente vínica ≈ brandy |
| CHAMPAGNE | 24 | Vinhos | vinho espumante |
| ESPUMANTE (MOUSSEUX) | 10 | Vinhos | vinho espumante |
| XÉRÊS | 5 | Vinhos | vinho fortificado (sherry) |
| MOSCATEL | 3 | Vinhos | vinho fortificado |
| CALVADOS | 2 | Brandy | aguardente de maçã |
| ARMAGNAC | 2 | Cognac | aguardente vínica |
| VINHO DA MADEIRA | 1 | Vinhos | vinho fortificado |

> Alternativa de merchandising: em vez de meter Champagne+Espumante (34) em Vinhos, criar uma coleção
> **"Espumantes"**. É a única troca não trivial; deixo em Vinhos por defeito.

## Ambíguas — DECISÃO do António / parceiro PHC (7 famílias, ~1,8%)

Sem lar óbvio. Enquanto não houver decisão, ficam só com `product_type` (não entram em coleção-mãe).

| Família | Artigos | O que é | Opções |
|---|---:|---|---|
| AA - CONJUNTOS | 35 | packs/presentes (cruza categorias) | coleção "Presentes & Conjuntos" · deixar fora |
| PISCO | 15 | aguardente de uva sul-americana | Brandy · nova "Outros destilados" |
| ABSINTO | 14 | destilado de anis alta graduação | Licor · nova "Outros destilados" |
| SOTOL | 6 | destilado mexicano de agave | Tequila (agaves) · nova "Outros destilados" |
| AGUA TONICA | 2 | mixer sem álcool | nova "Mixers/Sem álcool" · excluir |
| CERVEJA | 1 | cerveja | nova "Cerveja" · excluir |
| ALIMENTAR | 1 | não é bebida | excluir das coleções de bebidas |

**Sugestão simples (1 decisão só):** criar uma coleção **"Outros destilados"** que junta PISCO+ABSINTO+SOTOL
(35 artigos), meter AA-CONJUNTOS numa **"Presentes & Conjuntos"**, e deixar ÁGUA TÓNICA/CERVEJA/ALIMENTAR (4
artigos) fora de coleções. Isto fecha 100% do catálogo sem coleções de 1 produto. Fica à espera do "sim".
