# Integração PHC CS ↔ Shopify — Plano técnico inicial (16 jul 2026)

> **HISTÓRICO** — primeiro plano, escrito logo após a reunião de 16/07, quando este workstream ainda vivia no repo `expand` (migrado para aqui a 20/07/2026). As decisões D1-D11 continuam válidas como registo da reunião; o plano operacional atualizado é o [plano-integracao.md](../tecnico/plano-integracao.md), e as perguntas Q1-Q10 foram entretanto refinadas nas 7 perguntas de [exploracao-bd.md](../tecnico/exploracao-bd.md) e formalizadas no docx de pedido à Expand Target.
>
> Fonte: reunião com Vitor (Expand Target, agente PHC), Miguel Portugal e Jorge(s), 16/07/2026. Lead técnico da integração: António.

## Decisões da reunião (16/07/2026)

| # | Decisão | Racional |
|---|---|---|
| D1 | Integração por **acesso direto ao SQL Server** do PHC CS, com utilizador dedicado (leitura/escrita) | Vitor não desenvolve integração; fornece acessos + dicionário de dados. É a via que ele já usa com outros parceiros |
| D2 | **BD intermédia (staging)** do lado Loop entre PHC e Shopify | Dados limpos, diff/controlo de alterações, desacoplamento |
| D3 | Sincronização **1x/dia, ~22h-23h** (artigos, preços, stock) | Evitar carga no servidor partilhado (4-5 clientes) e custos de upgrade; decisão explícita do Jorge ("não quero aumentar custos") |
| D4 | **Sem tempo real** por agora; reavaliar se o volume de vendas crescer | Idem |
| D5 | Risco de oversell **aceite pelo cliente**: se vender sem stock, avisa o cliente e reembolsa | Stock normalmente tem várias unidades por artigo; registado em reunião |
| D6 | Preço = **PVP do PHC + IVA**, sem lógica adicional | Simplificação pedida pelo Jorge |
| D7 | **Promoções geridas manualmente** pelo cliente (por agora) | — |
| D8 | Encomendas Shopify → **dossier interno no PHC**; **faturação manual** (documento fiscal exige assinatura digital — não se insere fatura por SQL) | Processo standard do Vitor |
| D9 | Fase posterior: retorno do **PDF/base64 da fatura** para o portal — requer licença adicional "Web de Gestão" PHC | Custo extra; só se justificar |
| D10 | ~15 tabelas envolvidas (artigos, clientes, encomendas); campos extra (ex.: tipo de vidro) criam-se no PHC e importam-se via Excel pelo Vitor | — |
| D11 | Servidor PHC alojado no Vitor, acessível externamente (modo B2B), com mecanismos de segurança | — |

## Arquitetura

```
PHC CS (SQL Server, servidor do Vitor, acesso externo)
        │  leitura: artigos, preços, stock, clientes (job 22h)
        │  escrita: encomendas (dossier interno)
        ▼
Middleware Loop — "BD intermédia"
  staging DB + jobs agendados + logs + alertas
        │  Admin API (GraphQL) — upsert produtos/preços/stock
        │  Webhooks (orders/create, HMAC verificado) — receção de encomendas
        ▼
Shopify (loja B2C Aromas da Tarde)
```

### Fluxos

- **F1 — Catálogo/preços/stock (diário, 22h):** ler artigos do PHC → staging → diff contra último snapshot → upsert no Shopify só do que mudou (preço = PVP+IVA; stock disponível; imagens vindas do PHC). Relatório de execução por email.
- **F2 — Encomendas (Shopify → PHC):** webhook `orders/create` → staging → inserção no dossier interno do PHC. **Mecanismo de inserção a validar com o Vitor** (tabelas diretas com stamps vs. procedimento) — ver perguntas Q2.
- **F3 — Faturação:** manual no PHC pela equipa do cliente. Cliente recebe email "encomenda recebida, fatura segue" (fluxo aceite em reunião).
- **F4 — Oversell:** aceite (D5). Opção futura barata se doer: consulta pontual de stock à referência no checkout ("integração parcial" mencionada pelo Vitor).

### Stack proposta (a confirmar internamente)

- Serviço pequeno (Node ou Python) com jobs agendados; staging em SQL leve; ligação ao SQL Server via TLS
- Shopify: Admin API GraphQL + webhooks com verificação HMAC; app custom privada da loja
- Logs estruturados + alerta por email/Slack quando um sync falha
- Hosting: VPS/Azure da Loop (decidir); IP fixo para allowlist no servidor do Vitor

## Perguntas para o Vitor (antes de escrever código)

1. **Dicionário de dados** das ~15 tabelas (nomes exatos, chaves, relações) — começando pela de artigos, como combinado.
2. **Inserção de encomendas:** diretamente nas tabelas do dossier (BO/BO2/BI?) com geração de stamps/numeração? Há triggers ou regras internas? Existe procedimento armazenado ou tabela de interface recomendada? Como evitar colisões de numeração com encomendas criadas no PHC?
3. **Ambiente de teste:** existe cópia/BD de teste onde possamos validar escrita sem tocar em produção? Se não, snapshot para dev?
4. **Segurança do acesso:** allowlist por IP (enviamos os nossos), TLS na ligação, utilizador com permissões mínimas (SELECT nas tabelas de leitura; INSERT apenas onde necessário). Auditoria ativa?
5. **Preços:** qual o campo do PVP consumidor final (o PHC tem vários níveis de preço — profissional vs. final)? IVA por artigo vem de onde (taxa/tabela)?
6. **Stock:** que campo usar — stock físico ou disponível (reservas)? Há múltiplos armazéns? Qual conta para a loja?
7. **Imagens:** onde estão guardadas (BLOB na BD? pasta no servidor?) e como as extraímos.
8. **Categorização:** que campos existem para construir a árvore de navegação da loja (famílias, tipos) — e o processo para os campos novos via Excel (D10).
9. **Janela de sync:** 22h confirmado? Duração máxima aceitável? Contacto/alerta se algo falhar do lado do servidor.
10. **Encomendas de teste:** como as marcamos/anulamos no PHC para não sujar a operação?

## Riscos específicos desta via

| Risco | Mitigação |
|---|---|
| Escrita direta em tabelas PHC sem conhecer regras internas (stamps, triggers, numeração) pode corromper dossiers | Não escrever nada antes das respostas Q2/Q3; idealmente inserir via procedimento fornecido pelo Vitor; testar em BD de teste |
| SQL Server exposto à internet | Allowlist de IP + TLS + utilizador de permissões mínimas (Q4) |
| Alterações de schema em updates do PHC partem o sync | Diff/validação de schema no arranque de cada job; alerta em vez de falha silenciosa |
| Sync 1x/dia → oversell | Aceite pelo cliente (D5, registado); reavaliar com volume |
| Servidor partilhado com 4-5 clientes → janelas de indisponibilidade | Job idempotente com retry; relatório diário |

## Estado

- [x] Reunião de arranque com Vitor (16/07) — decisões registadas acima
- [ ] Email ao Vitor com o email do António + IPs para allowlist (a enviar)
- [ ] Receber credenciais SQL + dicionário da tabela de artigos
- [ ] Primeiras consultas exploratórias (dimensão e qualidade dos dados)
- [ ] Validar Q1-Q10 e desenhar o modelo staging
- [ ] Decidir hosting do middleware
