# Reunião PHC / Expand Target — 16 jul 2026

**Participantes:** Miguel Portugal (Loop), António (Loop), Vitor (Expand Target — gestor do PHC da Aromas da Tarde), Jorge (cliente, Aromas da Tarde) + Jorge Alves.

## Contexto

A Expand Target gere por completo o PHC CS da Aromas da Tarde (implementação, servidor, base de dados). A integração com o Shopify será feita pela Loop, por acesso direto ao SQL Server (leitura/escrita nas tabelas), com utilizador dedicado criado pelo Vitor. A Expand já tem bases de dados preparadas para integrações deste tipo (feitas por parceiros) e fornece o mapeamento das tabelas.

## Decisões

| Tema | Decisão |
|---|---|
| Arquitetura | Acesso direto ao SQL Server do PHC (servidor da Expand, acesso externo), com utilizador dedicado `aroweb`. Sem API. |
| Âmbito de dados | Artigos, clientes e encomendas — ~15 tabelas no total. |
| Sincronização | **1x por dia, às 22h–23h** (fora de horas), para não degradar o PHC nem forçar upgrade de servidor/licenciamento. Jorge quer explicitamente evitar custos adicionais. |
| Stock | Sem sync em tempo real. Risco de vender sem stock aceite pelo Jorge (raro; resolve com reembolso + aviso ao cliente). Possível filtro futuro: só publicar artigos com N+ unidades. |
| Preços | Preço de venda do PHC + IVA. Sem lógica de preços profissionais — o site é **só consumidor final**. |
| Promoções | Geridas **manualmente** pelo Jorge (no Shopify ou estrutura no PHC mais tarde). |
| Encomendas | Shopify → insert de encomenda (dossiê interno) no PHC. Faturação é **manual** do lado da Aromas da Tarde (requer validação; documento fiscal assinado digitalmente — não pode ser insert direto). |
| Faturas (futuro) | Possível devolução do PDF/Base64 da fatura na introdução do documento — exigiria licença adicional de web de gestão. Fica para depois. |
| Escala | Se o volume crescer muito (ex.: 100 encomendas/dia), revisita-se a arquitetura (servidor dedicado, sync mais frequente). Para já, simplificar e poupar. |
| Custos Shopify | ~29 €/mês + tema — tratado pelo Miguel e Jorge. |

## Ações

- [x] Vitor cria utilizador `aroweb` e envia credenciais (e-mail 16–17 jul) — **falta host/porta do servidor**
- [x] Vitor envia query de exemplo dos artigos (tabela `st`) — ver [sql/artigos.sql](../sql/artigos.sql)
- [ ] António: testar ligação e primeiras consultas (só SELECTs — BD real)
- [ ] Vitor fornece mapeamento das restantes tabelas (clientes, encomendas) à medida que avançamos
- [ ] Campos extra nos artigos (ex.: tipo de vidro da garrafa): Vitor consegue importar via Excel para campos livres do PHC se for preciso
- [ ] Loop: construir front office Shopify em paralelo

## Notas técnicas soltas

- Campos livres já em uso na tabela `st`: `usr1` (Tipo), `usr5` (Categoria), `u_un` (Unidade), `u_newst` (Novo), `u_novi` (Novidade), `u_fest` (Festivo).
- Filtro de publicação web já existente: `inactivo=0 AND vaiwww=1`.
- IVA: taxa via `taxasiva.codigo = st.tabiva`; flag `IVA1INCL` indica se o preço `epv1` já inclui IVA.
- Nas encomendas, a alternativa "integração parcial" (consultar stock por referência no checkout) ficou descartada por agora — sync diário chega.
