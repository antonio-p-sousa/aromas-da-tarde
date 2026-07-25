# Importação de produtos no Shopify — Aromas da Tarde

Gerador: [`scripts/build-shopify-import.py`](../../scripts/build-shopify-import.py)
Saída: `data/shopify-import-aromas-2026-07-24.csv` (gitignored — dados do cliente)

Ficheiro no **formato de importação de produtos do Shopify**, pronto a carregar
em *Produtos → Importar*. Construído a partir do catálogo do PHC.

## Resultado (base: snapshot de 20 jul)

| | Artigos |
|---|---|
| Web no PHC | 4 152 |
| Excluídos — preço a zero | 84 |
| Excluídos — esgotados (stock ≤ 0) | 1 529 |
| **Incluídos na importação** | **2 539** |

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

1. **Campo de seleção de artigos:** o filtro usa `vaiwww=1`. A reunião de 23 jul
   indicou "o quadradinho na ficha de artigo" — **confirmar com o parceiro que
   gere o PHC** qual o campo exato; pode não ser o `vaiwww`. Se for outro,
   ajustar o filtro e regenerar.
2. **Imagens:** coluna `Image Src` vazia — a aguardar o acesso aos ficheiros de
   imagem (o PHC guarda-os como referência de ficheiro, não URL). Entram numa
   segunda passagem.
3. **Frescura:** este CSV baseia-se no snapshot de 20 jul. **Regenerar** (correr
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
