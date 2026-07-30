# Relatório do ensaio a seco (dry-run) — sincronização PHC → loja

**Data:** 28 jul 2026 · **Modo:** só leitura — **nada foi escrito no PHC nem na Shopify**.
Fonte: `middleware/` (Node.js). PHC lido por SELECT-only; Shopify lido por `read_products`.
A comparação corre em segundos (~5,5 s) para todo o catálogo.

## 1. Catálogo PHC (publicável)

Critério de publicável: `inactivo = 0 AND vaiwww = 1`.

| Métrica | Valor |
|---|---:|
| Artigos publicáveis | **4 151** |
| Vendáveis (`epv1 > 0`) | **4 067** |
| **Visíveis pela política comercial** (em stock, `u_exclu=0`) | **2 368** |
| Excluídos (`u_exclu=1`) | 259 |
| A preço 0 (excluídos do sync ativo) | 84 |
| Com stock (> 0) | 2 554 |
| Sem stock (≤ 0) | 1 513 |
| Unidades de stock somadas | 63 088 |

## 2. Loja Shopify (estado atual)

| Métrica | Valor |
|---|---:|
| Produtos | 2 378 |
| Com SKU (= `ref`) | 2 378 (100%) |
| Variantes sem SKU | 0 |

Todos os produtos da loja têm SKU, por isso a reconciliação `ref ↔ sku` é 1:1 e fiável.

## 3. Reconciliação PHC ↔ Shopify (o que um sync REAL faria)

| Ação | Nº | Nota |
|---|---:|---|
| Já correspondidos (`ref` em ambos) | **2 377** | — |
| **Atualizar preço** | **4** | ver §4 |
| **Atualizar stock** | **76** | deriva normal (stock da loja é um retrato de 25 jul; o PHC mexe todos os dias) |
| A rever: SKU na loja sem match no PHC | **1** | `WK.0772` — ver §4 |
| A preço 0 no PHC (não criar) | 84 | — |

**Criar / despublicar depende da POLÍTICA de visibilidade** (é a decisão comercial-chave):

| Política | Criar | Despublicar |
|---|---:|---:|
| **Comercial** (só em stock + não-excluído) — a regra do import de 25 jul | **2** | **11** |
| **Larga** (mostrar tudo o que é vendável, incluindo esgotados) | **1 690** | — |

> **Leitura importante:** a loja tem hoje **2 378** produtos ≈ os **2 368** visíveis pela política
> comercial. **Já estão em paridade.** Sob a regra acordada, um sync diário só acrescentaria ~2 produtos
> que voltaram a ter stock e ocultaria ~11 que esgotaram/foram excluídos — pura deriva do dia.
> O "criar 1 690" **só existe** se o Jorge decidir mostrar os esgotados como "esgotado". Nenhuma ação foi executada.

## 4. Achados do ensaio (o valor de correr a seco primeiro)

**Preços — o dry-run apanhou um bug de arredondamento antes de qualquer escrita.**
Na 1ª passagem apareceram **6** divergências de preço. Quatro eram diferenças de **1 cêntimo**
no limite do meio-cêntimo (ex.: 267,52 vs 267,53), causadas por erro de vírgula flutuante ao
arredondar. Corrigiu-se o cálculo para **meio-cêntimo-para-cima em aritmética de inteiros**
(`price.js`), a regra canónica correta. Ficaram **4** divergências:
- **2 reais** de catálogo (o preço mudou mesmo no PHC desde o import): `RH.0041` (PHC 21,87 € vs loja 19,51 €), `RH.0180` (PHC 30,69 € vs loja 33,14 €).
- **2 de fronteira** de ±1 cêntimo (`WK.1687`, `WK.1721`), onde o import inicial arredondou ao contrário. Na primeira sincronização real a loja converge para a regra canónica e desaparecem.

**Órfão na loja — caso de despublicar, não apagar.** `WK.0772` (Woodford Reserve Holiday Edition)
existe no PHC mas com `vaiwww = 0` (marcado "não vai para web"). A regra do sync é
**despublicar** (passar a rascunho/oculto) — **nunca apagar** — quando um artigo deixa de ser
publicável. Este é o exemplo real que valida essa regra.

**Stock — deriva esperada, não erro.** As 76 divergências de stock são pequenas (± unidades) e
resultam de o inventário da loja ser um retrato do dia do import; o PHC atualiza continuamente.
É precisamente o que a sincronização diária resolve.

## 5. Deteção de alterações (base de dados intermédia)

O middleware guarda um snapshot do PHC em `data/state.sqlite` (BDI nossa, não a BD do cliente).
Prova de funcionamento:
- **1ª corrida:** 4 151 artigos registados no snapshot.
- **2ª corrida (sem alterações no PHC):** `criados 0 · preço 0 · stock 0 · nome 0 · removidos 0`.

Ou seja, a partir da 2ª execução o sync só toca no **delta** (o que mudou desde ontem), em vez de
reprocessar o catálogo inteiro — barato e seguro.

## 6. Conclusão

A mecânica de sincronização **catálogo/preços/stocks está construída e validada a seco**. O que falta
para ligar a escrita é uma **decisão** (autorizar o modo `sync` + escolher a política de visibilidade) e
**alojamento** para correr diariamente (ver `proposta-alojamento-middleware.md`).

Um primeiro sync real, **pela política comercial já em vigor**, seria pequeno: ~2 a criar, ~11 a despublicar,
4 preços corrigidos, 76 stocks alinhados — a loja já está em paridade. Só se o cliente optar por **mostrar
esgotados** é que o sync criaria ~1 690 produtos de uma vez.
