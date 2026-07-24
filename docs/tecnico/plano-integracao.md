# Plano de Integração PHC CS ↔ Shopify — Aromas da Tarde

> Estado: **ligação validada** (20 jul 2026). Decisões base fixadas na [reunião de 16 jul](../reunioes/2026-07-16-reuniao-phc.md).

## Arquitetura

```
Shopify (loja consumidor final)
   ▲ │
   │ ▼  Admin API (GraphQL)
Middleware Loop (sync job, 1x/dia ~22h)
   ▲ │
   │ ▼  SQL direto (user aroweb, ~15 tabelas)
SQL Server PHC CS (servidor Expand Target, acesso externo)
```

- Sem API do PHC: leitura e escrita direta nas tabelas, com mapeamento fornecido pelo Vitor.
- Sync **diário, fora de horas** (22h–23h) para não pesar no servidor partilhado da Expand.

## Fluxos

### 1. PHC → Shopify (diário)
- **Artigos**: `st` com `inactivo=0 AND vaiwww=1` — ver [sql/artigos.sql](../../sql/artigos.sql). Criar/atualizar produtos no Shopify.
- **Preços**: `epv1` + IVA (`taxasiva` via `st.tabiva`; atenção ao flag `IVA1INCL`). Só preço consumidor final.
- **Stock**: quantidade disponível → inventory levels no Shopify. Aceite o risco de desfasamento intra-dia.
- **Imagens**: existem no PHC; confirmar formato/acesso com o Vitor.

### 2. Shopify → PHC (diário ou por webhook, a decidir)
- **Encomendas**: order paga no Shopify → insert de dossiê interno de encomenda no PHC (+ cliente se novo).
- **Faturação**: manual pela Aromas da Tarde. Nunca inserimos documentos fiscais.

### Fora de âmbito (por agora)
- Sync de stock em tempo real / consulta ao checkout
- Promoções automáticas (Jorge faz manualmente)
- Devolução da fatura PDF/Base64 (exigiria licença web de gestão)

## Regras de segurança

- BD **real de produção** — até luz verde do Vitor, **apenas SELECTs**, sempre com `(nolock)`.
- Credenciais só em `.env` (gitignored). A password veio por e-mail em claro → pedir rotação quando a integração estabilizar.
- Inserts de encomendas: só depois de validados em conjunto com o Vitor, idealmente primeiro num ambiente/tabela de teste que ele indique.

## Estado da ligação (20 jul 2026)

- ✅ Ligação validada: `213.63.232.121,8880` → `M2A3SRV01\SQLPHC`, SQL Server 2019 **Express** (limite 10 GB/BD — relevante se a Expand falar em upgrades). Host/porta no `.env`.
- Consultas via [scripts/Invoke-PhcQuery.ps1](../../scripts/Invoke-PhcQuery.ps1) (só aceita SELECTs; lê o `.env`).

### Raio-X dos artigos web (`inactivo=0 AND vaiwww=1`)

| Métrica | Valor |
|---|---|
| Artigos publicáveis na web | **4 152** (de 6 097 no total; 6 082 ativos) |
| Famílias distintas | 27 |
| Preço a zero (`epv1=0`) | 84 — filtrar do sync ou corrigir no PHC |
| Sem código de barras | 720 |
| Sem stock (`stock<=0`) | 1 611 (~39%) — confirmar com Jorge se publicamos esgotados |
| `IVA1INCL` | 0 em todos → preço é sempre **sem IVA**, somar sempre a taxa |
| Com imagem | 4 134 (99,6%) — campo `imagem` é referência de ficheiro (ex.: `LC.0401`), **perguntar ao Vitor como aceder aos ficheiros** |

## Pendentes

1. Acesso aos ficheiros de imagem (pasta partilhada? HTTP? — perguntar ao Vitor).
2. Mapeamento das tabelas de clientes e encomendas (Vitor fornece).
3. Decisão de stack do middleware (proposta: Node/TypeScript + `mssql`, job agendado; alinhar com o resto dos projetos Loop).
4. Loja Shopify: criação/acessos (Miguel + Jorge tratam do plano ~29 €/mês e tema).
5. Regras de negócio com o Jorge: publicar ou não artigos sem stock; o que fazer aos 84 artigos com preço a zero.

## Próximos passos

1. Definir mapeamento artigo PHC → produto Shopify (incl. campos livres `usr1`, `usr5`, `u_*`; família/categoria → collections).
2. Esqueleto do middleware + primeiro sync de artigos em dry-run.
3. E-mail ao Vitor: acesso às imagens + dicionário das tabelas de encomendas/clientes.
