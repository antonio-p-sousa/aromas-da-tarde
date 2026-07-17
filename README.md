# Aromas da Tarde — Integração PHC CS ↔ Shopify

Integração entre o ERP PHC CS da Aromas da Tarde (gerido pela Expand Target) e a nova loja Shopify de venda a consumidor final, desenvolvida pela Loop Future.

- **Plano de integração:** [docs/plano-integracao.md](docs/plano-integracao.md)
- **Decisões da reunião de arranque (16 jul 2026):** [docs/reuniao-2026-07-16-phc-expand.md](docs/reuniao-2026-07-16-phc-expand.md)
- **Consultas SQL de referência:** [sql/](sql/)

## Setup

1. Copiar `.env.example` para `.env` e preencher as credenciais do SQL Server (fornecidas pelo Vitor / Expand Target).
2. **A base de dados é a de produção** — apenas consultas de leitura até indicação em contrário.

## Contactos

- **Vitor (Expand Target)** — gestão do PHC, acessos SQL, mapeamento de tabelas
- **Miguel Portugal (Loop)** — gestão de projeto
- **Jorge (Aromas da Tarde)** — cliente; faturação e promoções manuais do lado dele
