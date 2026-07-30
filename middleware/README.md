# Middleware de sincronização PHC → loja (Aromas da Tarde)

Sincroniza o catálogo do **PHC** (artigos, preços, stocks) para a loja **Shopify**.
Fase atual: **esqueleto + ensaio a seco (dry-run) só de leitura**. Ainda **não escreve** na loja.

## Regra de ouro (segurança)

- **BD do PHC = produção do cliente → só `SELECT`.** O módulo `phc.js` recusa qualquer
  query que não seja um SELECT puro (guarda em `assertSelectOnly`).
- **O dry-run não escreve no PHC nem na Shopify.** A única escrita é na **base de dados
  intermédia** (`data/state.sqlite`), que é nossa e serve para detetar alterações.
- Segredos vêm do `.env` da raiz do repo (nunca commitado).

## Arquitetura

```
src/
  env.js         Carrega o .env (PHC + Shopify). Sem segredos no código.
  price.js       Preço final = epv1 × (1 + IVA/100), meio-cêntimo-para-cima em inteiros.
  phc.js         Leitura do PHC (SELECT-only). Query dos publicáveis (inactivo=0, vaiwww=1).
  shopify.js     Leitura da Shopify (Admin GraphQL, token client_credentials, read_products).
  store.js       Base de dados intermédia (node:sqlite): snapshot + hash por artigo.
  diff.js        Comparações: PHC vs snapshot anterior; PHC vs Shopify (ref ↔ sku).
  categories.js  Mapa família → coleção (folds óbvios + lista de ambíguas a decidir).
  dry-run.js     Orquestra tudo e escreve o relatório. NÃO escreve no PHC/loja.
  sync.js        Modo de escrita. Por defeito só calcula o plano; escreve na loja só
                 com EXECUTE=1 CONFIRM=SIM (e nunca no PHC). Barreira MAX_CHANGES.
```

## Modelo de dados PHC → Shopify

| Shopify            | PHC                                             |
|--------------------|-------------------------------------------------|
| sku (chave)        | `ref`                                           |
| title              | `design`                                        |
| price              | `epv1 × (1 + taxa_IVA/100)` (IVA1INCL=0 sempre) |
| inventory_quantity | `stock`                                         |
| product_type       | `faminome`                                      |
| barcode            | `codigo`                                        |
| imagem             | `ifl.bdados` (BLOB) via `ifl.recstamp=st.ststamp` |
| publicável         | `inactivo=0 AND vaiwww=1`                        |

## Imagens (estão na BD!)

As fotos dos artigos estão na tabela **`ifl`**, BLOB em **`bdados`**, ligadas por
**`ifl.recstamp = st.ststamp`** (NÃO por `ref`/`fname`). ~4128 imagens (JPG/PNG, 1 por artigo).

- `npm run extrai-imagens` → exporta todas para ficheiros (`OUTDIR`, nomeados por `ref`).
- `npm run imagens` → **passo integrado do sync**: por cada produto sem imagem real, vai buscar o
  BLOB ao PHC e carrega-o na Shopify, apagando o placeholder. Idempotente/re-executável.
  Usa `phc.fetchImageByRef(ref)` + `shopify.uploadProductImage/deleteProductMedia`.

## Como correr

```bash
cd middleware
npm install          # instala mssql
npm run dry-run      # lê PHC + Shopify, compara, escreve relatório em reports/
npm test             # testes unitários (preço/IVA + diff)
npm run sync         # calcula o plano de escrita; NÃO escreve (falta EXECUTE=1)
```

Variáveis opcionais:
- `NO_SAVE=1` → não grava o snapshot na BDI (útil para experimentar sem armar a deteção).
- `AROMAS_ENV=<caminho>` → aponta para outro `.env`.
- `POLICY=broad` → plano que mostra também esgotados (por defeito `commercial`).

O dry-run produz `reports/dry-run-<timestamp>.md` (+ `.json`) com os números da comparação.

## Próxima fase (quando o António autorizar escrita)

1. Modo `sync` que aplica o plano do dry-run na loja (criar/atualizar preço+stock, despublicar órfãos).
2. Agendamento diário (cron/Task Scheduler ou alojamento — ver `docs/tecnico/proposta-alojamento-middleware.md`).
3. Encomendas loja → PHC (dossier `Encomenda Web`, ndos=10) — **bloqueado** até ao dicionário de campos do parceiro que gere o PHC.
