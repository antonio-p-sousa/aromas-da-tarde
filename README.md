# Aromas da Tarde — Integração PHC CS ↔ Shopify

Integração entre o ERP PHC CS da Aromas da Tarde (gerido pela Expand Target) e a nova loja Shopify de venda a consumidor final, desenvolvida pela Loop Future.

## ⚠️ Nomenclatura — ler primeiro

Três nomes parecidos, três coisas diferentes:

| Nome | O que é |
|---|---|
| **Aromas da Tarde** | O cliente (distribuidor de bebidas) e **este projeto**: loja B2C + integração PHC (~4 150 artigos) |
| **Expand Target** | A **empresa do Vitor** — software house que gere o PHC da Aromas da Tarde. Parceiro técnico, não é projeto |
| **Expand / KULTU** | **Outro projeto Loop** (repo `expand`): loja monoproduto kultu.pt das garrafas-caveira de absinto |

O cliente diz "Expand Target" para tudo — em reuniões e e-mails, confirmar sempre a que loja se referem antes de agir.

## Estrutura do repositório

```
docs/
├── entregaveis/   → DOCX atuais para cliente/parceiro (sem nomes pessoais)
├── tecnico/       → documentação técnica interna (markdown)
├── reunioes/      → atas e plano inicial
└── arquivo/       → versões substituídas (mantidas para histórico)
sql/               → consultas SQL de referência (leitura do PHC)
scripts/           → utilitários (ligação SQL, só SELECT)
demo/              → pré-visualização navegável da loja (dados reais, gitignored)
data/              → exports do catálogo (gitignored — dados do cliente)
```

### Atalhos

- **Entregáveis atuais:** [Ponto de situação](docs/entregaveis/Ponto-Situacao-Loja-Online-2026-07-24.docx) · [Requisitos para avançar](docs/entregaveis/Requisitos-Loja-Online-2026-07-24.docx)
- **Plano de integração:** [docs/tecnico/plano-integracao.md](docs/tecnico/plano-integracao.md)
- **Mapeamento PHC → Shopify:** [docs/tecnico/mapeamento-shopify.md](docs/tecnico/mapeamento-shopify.md)
- **Exploração da base de dados:** [docs/tecnico/exploracao-bd.md](docs/tecnico/exploracao-bd.md)
- **Reunião de arranque (16 jul 2026):** [docs/reunioes/2026-07-16-reuniao-phc.md](docs/reunioes/2026-07-16-reuniao-phc.md)
- **Consultas SQL de referência:** [sql/](sql/)

## Setup

1. Copiar `.env.example` para `.env` e preencher as credenciais do SQL Server (fornecidas pelo Vitor / Expand Target).
2. **A base de dados é a de produção** — apenas consultas de leitura até indicação em contrário.

## Contactos

- **Vitor (Expand Target)** — gestão do PHC, acessos SQL, mapeamento de tabelas
- **Miguel Portugal (Loop)** — gestão de projeto
- **Jorge (Aromas da Tarde)** — cliente; faturação e promoções manuais do lado dele
