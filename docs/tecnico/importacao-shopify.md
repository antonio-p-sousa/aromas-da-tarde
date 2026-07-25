# Importação de produtos no Shopify — Aromas da Tarde

Gerador: [`scripts/build-shopify-import.py`](../../scripts/build-shopify-import.py)
(aceita `SRC` e `OUT` por argumento; por defeito usa o catálogo de 25 jul)
Saída atual: `data/shopify-import-aromas-2026-07-25.csv` (gitignored — dados do cliente)

Ficheiro no **formato de importação de produtos do Shopify**, pronto a carregar
em *Produtos → Importar*. Construído a partir do catálogo do PHC.

## Resultado (base: snapshot de 25 jul)

| | Artigos |
|---|---|
| Web no PHC (`vaiwww=1 AND u_exclu=0`) | 3 891 |
| Excluídos — preço a zero | 82 |
| Excluídos — esgotados (stock ≤ 0) | 1 431 |
| **Incluídos na importação** | **2 378** |

## Regras aplicadas (reunião 16 + 23 jul)

- **Preço** = preço de venda + IVA (`Preco_ComIVA`).
- **Esgotados não aparecem** → excluídos (decisão comercial, revisível: para os
  mostrar como "esgotado" basta não os excluir e manter `inventory_policy=deny`).
- **Preço a zero** (obsoletos de migração) → excluídos.
- `Type` = família; `Tags` = categoria + Novo/Novidade/Festivo.
- `Variant SKU` = referência PHC (chave de sincronização).
- `Variant Inventory Policy` = `deny` (não vende abaixo de zero).
- `Vendor` = "Aromas da Tarde" (o PHC não tem campo de marca próprio).

## ⚠️ A confirmar antes da importação real

1. **Campo de seleção de artigos** — investigado no PHC (25 jul):
   - `vaiwww=1` → 4 152 artigos (flag "vai para a web").
   - `marcada` → **0 registos** (não é usado; descartado como candidato).
   - `u_exclu=1` ("excluir") → 262 artigos; 261 deles dentro do conjunto web.
   - **Filtro adotado: `vaiwww=1 AND u_exclu=0` = 3 891.** Respeitar o `u_exclu`
     é o lado seguro (não publicar o que está marcado para excluir).
   - **A confirmar com o parceiro do PHC:** que este par de campos corresponde
     mesmo ao "quadradinho" da ficha de artigo referido na reunião de 23 jul.
2. **Imagens:** coluna `Image Src` vazia — a aguardar o acesso aos ficheiros de
   imagem (o PHC guarda-os como referência de ficheiro, não URL). Entram numa
   segunda passagem.
3. **Frescura:** este CSV baseia-se no snapshot de 25 jul. **Regenerar** (correr
   o script sobre uma exportação atual do PHC) imediatamente antes da importação,
   para apanhar preços/stock atuais.
4. **IVA na loja:** `Variant Taxable=TRUE` e o preço já inclui IVA — a loja tem
   de estar configurada para **preços com imposto incluído**, para não haver
   dupla taxação.

## Como regenerar

1. Exportar o catálogo atual do PHC para `data/catalogo-artigos-<data>.csv`
   (mesma query de [`sql/artigos.sql`](../../sql/artigos.sql), via
   [`scripts/Invoke-PhcQuery.ps1`](../../scripts/Invoke-PhcQuery.ps1)).
2. Apontar o `SRC` do script para esse ficheiro e correr `py scripts/build-shopify-import.py`.
