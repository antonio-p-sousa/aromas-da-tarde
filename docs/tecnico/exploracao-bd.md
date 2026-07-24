# Exploração da BD PHC — levantamento inicial (20 jul 2026)

> Apenas leitura. Objetivo: preparar o mapeamento de encomendas/clientes antes do dicionário oficial do Vitor.

## Tabelas relevantes confirmadas

| Tabela | Colunas | Papel (PHC CS standard) |
|---|---|---|
| `st` | 238 | Artigos (já mapeada — ver [sql/artigos.sql](../../sql/artigos.sql)) |
| `cl` | 245 | Clientes — **1 633 registos** |
| `bo` / `bo2` / `bo3` | 211/171/50 | Cabeçalhos de dossiers internos (encomendas) |
| `bi` | 219 | Linhas de dossiers internos |
| `ft` / `ft2` / `fi` | 244/230/234 | Faturas (fora do nosso âmbito — faturação manual) |
| `ts` | 226 | Configuração dos tipos de dossier |
| `sl` / `sa` | 83/26 | Movimentos / saldos de stock |
| `taxasiva` | 12 | Taxas de IVA |

## 🔑 Descoberta principal: dossier "Encomenda Web" já existe

A tabela `ts` define 24 tipos de dossier. O **`ndos=10` — "1.11-Encomenda Web"** tem **362 documentos, o mais recente de 20 jul 2026** — ou seja, já há uma integração web ativa a inserir encomendas no PHC (o portal B2B atual). Consequências:

1. O nosso insert de encomendas Shopify tem **362 exemplos reais e atuais** do formato correto (stamps, numeração, campos obrigatórios).
2. Há que decidir com o Vitor: **reutilizamos o `ndos=10` ou cria-se um novo tipo** (ex.: "Encomenda Shopify") para separar canais B2B/B2C.
3. As encomendas web atuais são de **clientes B2B existentes** (empresas com `no` de cliente atribuído). No B2C teremos de criar clientes novos em `cl` ou usar um cliente genérico "consumidor final" — decidir com o Vitor.

### Estrutura observada — cabeçalho (`bo`), exemplo real

`bostamp` (char 22-25, chave), `ndos`+`nmdos` (tipo), `obrano` (nº sequencial por tipo), `dataobra`, `no`+`estab` (cliente), `nome`, `morada`, `local`, `codpost`, `etotaldeb` (total), `obs`.

### Estrutura observada — linhas (`bi`)

`bistamp` (chave), `bostamp` (FK cabeçalho), `ref`, `design`, `qtt`, `edebito` (preço unit.), `ettdeb` (total linha), `iva` (taxa), `tabiva`, `armazem` (=1 nos exemplos), `lordem` (10000, 20000, … por linha).

## Perguntas para o Vitor (inserção de encomendas)

1. Reutilizar dossier `ndos=10` (Encomenda Web) ou criar tipo novo para o Shopify?
2. Como gerar `bostamp`/`bistamp` corretamente? (formato PHC de 25 chars — confirmar se há regra/rotina, ou se o insert direto com stamp aleatório é aceite como fazem os parceiros atuais)
3. `obrano`: quem atribui a numeração? Insert direto com `max+1` tem risco de colisão — como faz a integração atual?
4. Clientes B2C: criar registo em `cl` por cliente, ou cliente genérico + dados da morada só no `bo`? Que campos de `cl` são obrigatórios?
5. Que campos de `bo2`/`bo3` são obrigatórios para o documento abrir bem no PHC?
6. Há triggers/rotinas a correr no insert (atualização de stock reservado, etc.)?
7. Acesso aos ficheiros de imagem dos artigos (campo `st.imagem` = referência de ficheiro)?

## Stock

`st.stock` existe e está preenchido; `sa`/`sl` detalham por armazém/movimento. Para o sync diário ao Shopify, `st.stock` deve chegar (confirmar com o Vitor se há armazéns a excluir — ex.: entreposto vs. loja, visto que existe dossier "4.10-Entreposto->Aro").
