# Proposta de alojamento do middleware de sincronização

**Objetivo:** correr a sincronização PHC → loja **uma vez por dia** (e, mais tarde, receber
encomendas da loja → PHC). O trabalho é minúsculo: o catálogo inteiro compara-se em **~5,5 s**.
Este documento apresenta opções e custos para o António **decidir** onde aloja.

## O que o alojamento precisa de ter

1. **Node.js ≥ 22** (usamos o SQLite nativo).
2. **Acesso de saída ao PHC** (`213.63.232.121:8880`) — já é alcançável pela internet (é assim que
   ligamos hoje), portanto qualquer opção com internet serve, sem VPN.
3. **Acesso de saída à Shopify Admin API** (HTTPS).
4. **Um agendador** (cron / Task Scheduler / scheduled workflow).
5. **Persistência** para a base de dados intermédia (`state.sqlite`) — para a deteção de alterações.
   Nas opções sem disco persistente, guarda-se o snapshot num artefacto/armazenamento externo,
   ou dispensa-se (o full-compare custa 5 s na mesma).

> Nota de segurança: a app Shopify custom é **gratuita** (sem upcharge de API). O único segredo a
> guardar é o `.env` (credenciais PHC + client_id/secret da app).

## Opções e custos

| Opção | Custo/mês | Prós | Contras |
|---|---:|---|---|
| **A. VPS pequeno** (Hetzner CX22, DigitalOcean, Contabo) | **~4–6 €** | disco persistente (BDI fica no sítio); um só lugar para gerir; pronto para o webhook de encomendas da fase 2; controlo total | pagamento mensal; uma máquina para manter |
| **B. GitHub Actions agendado** (cron diário) | **~0 €** | grátis para um job diário de 1 min; sem servidor para manter; segredos geridos pelo GitHub | filesystem efémero → BDI tem de ser externalizada (artefacto) ou dispensada; menos natural para o webhook de encomendas |
| **C. On-premise** (PC sempre-ligado do cliente ou o próprio servidor PHC, via Task Scheduler) | **0 €** | grátis; acesso ao PHC é local (não expõe nada); dados não saem da casa | depende da máquina estar ligada; gestão remota menos cómoda |
| **D. Conector SaaS** (ex.: Matrixify pago com importação agendada) | **~20–50 €** | sem código nosso a manter | perde-se o controlo da lógica de preço/IVA; ainda assim precisaria de origem de dados nossa |

## Recomendação

**Opção A — VPS pequeno (~5 €/mês)** como escolha principal para uma integração de produção:
- a base de dados intermédia fica em disco (deteção de alterações fiável, sem gambiarras);
- é o mesmo sítio onde, na fase 2, assenta o **webhook de encomendas** (loja → PHC), evitando montar
  infraestrutura duas vezes;
- custo anual ~60 €, previsível.

**Opção B — GitHub Actions (0 €)** é a alternativa válida enquanto a integração for só de **leitura/escrita
de catálogo** (sem encomendas): um workflow com `schedule: cron` corre o `sync` diário sem servidor. Basta
externalizar o snapshot (guardá-lo como artefacto entre corridas) ou aceitar full-compare diário.

**Opção C — On-premise (0 €)** é a mais indicada se o cliente tiver um PC/servidor sempre ligado: é
gratuita e o PHC nem precisa de estar exposto à internet.

## Operação (qualquer opção)

- **Segredos:** `.env` no servidor (nunca no git). Nas opções B/C, secrets do GitHub / variáveis de ambiente.
- **Falhas:** enviar email de alerta se uma corrida falhar (Shopify em baixa, PHC inacessível). Trivial de
  acrescentar ao `dry-run.js`/`sync.js`.
- **Janela:** correr de madrugada (ex.: 04h00) para o catálogo do dia estar alinhado antes das visitas.
- **Custódia:** enquanto for a Loop a gerir, a Loop aloja (A ou B). Se passar para o cliente, C é o natural.

## Decisão pendente do António

1. **Onde aloja** (A / B / C).
2. **Autorizar o modo de escrita** (`sync`) — hoje só corre o dry-run (não escreve).
3. **Política de visibilidade** — só em-stock+não-excluído (loja já em paridade: ~2 criar / ~11 despublicar/dia)
   ou mostrar também esgotados (~1 690 a criar de uma vez). Ver `dry-run-relatorio.md` §3.
