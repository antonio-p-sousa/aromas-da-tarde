# Plano de Integração PHC CS ↔ Shopify — Aromas da Tarde

> Estado: **arranque** (17 jul 2026). Decisões base fixadas na [reunião de 16 jul](reuniao-2026-07-16-phc-expand.md).

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
- **Artigos**: `st` com `inactivo=0 AND vaiwww=1` — ver [sql/artigos.sql](../sql/artigos.sql). Criar/atualizar produtos no Shopify.
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

## Bloqueadores / pendentes

1. **Host/IP + porta do SQL Server** — não veio no e-mail do Vitor. Sem isto não há teste de ligação.
2. Mapeamento das tabelas de clientes e encomendas (Vitor fornece).
3. Decisão de stack do middleware (proposta: Node/TypeScript + `mssql`, job agendado; alinhar com o resto dos projetos Loop).
4. Loja Shopify: criação/acessos (Miguel + Jorge tratam do plano ~29 €/mês e tema).

## Próximos passos

1. Pedir host/porta ao Vitor → testar ligação com `aroweb`.
2. Correr a query de artigos, avaliar dimensão e qualidade dos dados (categorias, imagens, códigos de barras).
3. Definir mapeamento artigo PHC → produto Shopify (incl. campos livres `usr1`, `usr5`, `u_*`).
4. Esqueleto do middleware + primeiro sync de artigos em dry-run.
