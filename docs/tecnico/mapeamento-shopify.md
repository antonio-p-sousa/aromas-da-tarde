# Mapeamento artigo PHC → produto Shopify

> Draft de 20 jul 2026, baseado nos dados reais (4 152 artigos web). Rever com Miguel/Jorge antes do primeiro sync.

## Campos

| Shopify (produto) | Origem PHC (`st`) | Notas |
|---|---|---|
| `title` | `design` | Está em MAIÚSCULAS no PHC — decidir se convertemos para Title Case no middleware |
| `handle` | slug de `design` | Gerado; estável por `ref` |
| `vendor` | — | Marca não existe como campo próprio; avaliar extração ou deixar "Aromas da Tarde" |
| `product_type` | `faminome` (família) | 27 famílias (RUM, TEQUILA, WHISKY, …) |
| `tags` | `usr5` (Categoria) + flags | `usr5` tem categoria+país (ex.: "TEQUILA MEXICO"); `u_newst`→`novo`, `u_novi`→`novidade`, `u_fest`→`festivo` |
| `collections` | `faminome` e/ou `usr5` | Collections automáticas por tag/tipo |
| `variants[0].sku` | `ref` | Chave de sincronização (única no PHC) |
| `variants[0].barcode` | `codigo` | 720 artigos sem código de barras — campo fica vazio |
| `variants[0].price` | `epv1 × (1 + taxa/100)` | **`IVA1INCL=0` em todos** → somar sempre IVA. Taxa via `taxasiva.codigo = st.tabiva`. Arredondar a 2 casas; validar se Jorge quer preços "bonitos" (.90/.95) |
| `variants[0].inventory_quantity` | `stock` | Sync diário; política de esgotados por decidir (1 611 artigos com stock ≤ 0) |
| `variants[0].inventory_policy` | — | `deny` (não vender abaixo de 0) — alinhado com decisão da reunião |
| `variants[0].taxable` | — | `false` no Shopify se o preço enviado já incluir IVA (evitar dupla taxação) — **confirmar configuração fiscal da loja com Miguel** |
| `images` | `st.imagem` (referência de ficheiro) | 99,6% têm imagem; **bloqueado** até Vitor indicar acesso aos ficheiros |
| `status` | `inactivo=0 AND vaiwww=1` | Artigo que deixe de cumprir → `draft`/`archived` no Shopify (não apagar) |
| metafield `phc.unidade` | `u_un` | "GR" (garrafa) etc. |
| metafield `phc.tipo` | `usr1` | Irregular (muitos vazios) — usar só como complemento |

## Regras de filtragem no sync (proposta)

1. Excluir `epv1 = 0` (84 artigos) — reportar lista ao Jorge para corrigir no PHC.
2. Incluir artigos sem stock mas como não compráveis (`inventory_policy: deny`) — **à espera da decisão do Jorge** (mostrar "esgotado" vs. esconder).
3. Chave de reconciliação: `ref` ↔ `sku`. Nunca apagar produtos no Shopify por ausência no PHC sem confirmação (proteção contra queries falhadas).

## Direção Shopify → PHC (encomendas)

Ver [exploracao-bd.md](exploracao-bd.md) — dossier "Encomenda Web" (`ndos=10`) já existe com 362 exemplos reais; perguntas de inserção listadas lá. **Nenhum insert antes do OK do Vitor.**
