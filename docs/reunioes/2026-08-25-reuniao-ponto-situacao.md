# Reunião 25 ago 2026 — Ponto de situação (Aromas da Tarde/FIREDRINKS + KULTU)

Participantes: António, Miguel (Loop), Jorge + JR (cliente).
A parte KULTU está resumida no fim; detalhe segue no projeto respetivo.

## Decisões FIREDRINKS

| Tema | Decisão |
|---|---|
| Domínio | **Sempre foi firedrinks** (comprado no dominios.pt). Loop envia instruções de DNS ao Miguel. |
| Shopify Payments | **Cliente preenche** (Miguel, "ainda hoje") — Loop NÃO mexe em dados sensíveis (regra formalizada pelo António na reunião, aplica-se aos dois projetos). Caminho mostrado: Configurações → Pagamentos → Concluir configuração. |
| Categorias (grelha) | Tirar as **imagens** dos cartões — só o nome. Layout **8 colunas × 3 linhas** (24 categorias). Ordenação: idealmente alfabética. |
| Hero/banner | Transformar em **carrossel gerível pelo Jorge** (2-4 imagens ou vídeo; explorar 2 imagens lado a lado a rodar). Servirá para **promoções** (imagens clicáveis → produto). Loop cria **manual passo-a-passo** para o Jorge trocar os banners. |
| Promoções (mecânica) | Preço fica INTACTO no PHC; o desconto faz-se **no Shopify** (% sobre o produto, ex.: -10%); aparece no carrinho/fatura com desconto. Gestão das promos = Jorge. Menu "Promoções" e/ou promos no banner — a afinar. |
| Menu inferior (Início/Bebidas) | Considerado redundante; hipóteses: retirar, ou substituir por Promoções/categorias principais. Sem decisão fechada. |
| Página de coleção | Filtros/ordenação atuais aceites. Pedido "X por página (12/24/50)" — **tema não suporta** (comunicado). |
| Portes | **Por peso** confirmado; garrafa média ≈ **1,4 kg** (arredondam para cima). Configurar zonas PT/Europa. |
| Localização da loja | Configurar a morada real (aparecia default). Rua dos Pregos 92, Z.I. Poupa II, Santo Tirso. |
| Notas legais/18+ | Confirmado que se aplicam (aviso de idade já ativo). Políticas: Loop redige, cliente aprova. |
| Voucher/faturação | Cliente junta faturas+comprovativos com o Daniel para submissão à AT **até sexta**; Loop (Miguel P.) envia comprovativos; report até fim do mês. |

## Tarefas Loop (Claude) — por ordem

1. Grelha de categorias: 8 colunas + esconder imagens (CSS da secção) + ordem alfabética se o tema deixar
2. Localização da loja com a morada real
3. Hero: ativar carrossel (multi-slides) + testar slide de 2 imagens + manual do banner p/ Jorge
4. Portes por peso: definir peso 1,4 kg/garrafa nos produtos (API) + zonas e tarifas PT/Europa (tabela de 24 ago) no admin
5. Instruções DNS (dominios.pt → Shopify) p/ Miguel
6. Proposta de mecânica de Promoções (descontos Shopify + coleção/banner)
7. Enviar campos necessários do Shopify Payments ao Miguel (feito na reunião, caminho mostrado)

## Notas KULTU (resumo; seguir no projeto Expand/KULTU)

- Menu: artista como foco → depois produto; "lenda" mantém (fim do menu); **"edição limitada" desaparece** (era redundante — tudo é edição limitada); site mais compacto
- Página artista: reconfigurar (vídeo volta ao início; texto + imagens sem repetições, layout como a secção inicial)
- Coleção: retirar fotos com embalagem errada (Miguel identifica); nº de produtos indiferente
- Barra do topo: **não mudar de cor no scroll**; se possível manter a barra visível durante a navegação
- Menu hambúrguer: experimentar sem "menu" (mais clean), à direita; termos em baixo
- Formulário "notificações da edição" por configurar; avisos legais/18+ aplicam-se também
- Termos/políticas: Loop envia sugestões, cliente aprova
- Pagamentos: Miguel configura (dados sensíveis = cliente)
- Miguel revê tudo na **quinta-feira** (indisponível amanhã)
