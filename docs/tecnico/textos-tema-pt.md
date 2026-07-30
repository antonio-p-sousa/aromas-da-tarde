# Textos do tema em PT — runbook (Various / Maximize)

**Estado (29 jul, madrugada): GRANDE PARTE JÁ APLICADA pelo Claude no editor de Conteúdo do tema.**
Separadores traduzidos e gravados: **Header** (Olá, Bem-vindo a, Categorias, Menu principal) ·
**General** completo (paginação, global/Guardar/Cancelar, pesquisa "Pesquisar...", página de password
inteira, carrinho/descontos/envio-grátis, countdown, breadcrumbs, partilhas sociais, pré-encomenda) ·
**Products** (Adicionar ao carrinho, Esgotado, preços Desde/{{ price }}, IVA incluído, stock,
levantamento, presente) · **Newsletter** (O seu e-mail, Subscrever, Obrigado por subscrever) ·
**Sections/carrinho** (O seu carrinho, Finalizar compra, termos e condições, Inicie sessão).
**Verificado ao vivo:** a página de password da montra já mostra "Entrar com palavra-passe" +
"O seu e-mail" + "Subscrever".

**Falta (menor):** separadores de cauda — Templates, Blogs, Date time, Shipping, Bulk order, Product
comparison, Store selector, Checkout & system, Customer accounts, Accessibility (maioria aria-labels
ou páginas geridas pelo Shopify). Usar a tabela abaixo como referência se aparecer algo em inglês.
**Nota:** "Coming Soon" / "Be the first to know when we launch." na página de password são
**definições da secção** (editar no Personalizar), não strings de idioma.

> **GOTCHA de gravação:** se o clique falhar o botão Salvar, a página pode ficar com uma navegação
> pendente e o Salvar passa a abrir sempre o diálogo "alterações não salvas". Sair da página
> (perde só o bloco corrente), voltar e regravar. Gravar em blocos pequenos.

## Contexto importante

- A **língua principal da loja é inglês** (imutável); os clientes veem **PT** (mercado/domínio PT).
- Onde o tema já tem tradução PT, ela ganha. As strings que aparecem em inglês são as que **faltam** na
  tradução PT → caem para o inglês predefinido. Corrigi-las no **conteúdo predefinido** resolve.
- Editor: **Loja virtual → Temas → (Various) → ⋯ → Editar conteúdo predefinido do tema**
  (URL direto: `/store/cbtddr-fc/themes/193307574598/language`).
- Método por campo: **triplo-clique no campo** (seleciona o texto) → escrever o PT → **Salvar**.
  (Nota: `Ctrl+A` aqui seleciona a página toda, não o campo — usar triplo-clique.)

## ⭐ Caminho rápido recomendado (1 passo, faz tudo)

Em vez de campo-a-campo, usar **tradução automática** do conteúdo do tema:
**Markets → Português (Portugal) → Traduzir**, ou app **Translate & Adapt → Conteúdo predefinido do tema
→ Traduzir automaticamente**. Traduz todas as strings de UI de uma vez, na camada PT (sem mexer no inglês).
> Seguro para UI. **NÃO** correr a tradução automática nos **Produtos** (protege os ~2378 nomes/marcas).
Depois, rever só as poucas que quiseres afinar com a tabela abaixo.

## Tabela EN → PT (colar campo a campo, se fores manual)

### Aba "General"
| Campo (EN) | PT |
|---|---|
| Continue shopping | Continuar a comprar |
| Estimate delivery | Estimativa de entrega |
| Pagination | Paginação |
| Page {{ number }} | Página {{ number }} |
| Previous | Anterior |
| Next | Seguinte |

### Aba "Header"
| Campo (EN) | PT |
|---|---|
| Hello | Olá |
| Welcome to | Bem-vindo a |
| Button category | Categorias |
| Main menu | Menu principal |
| _Logo / Button toggle mobile / Scroll left / Scroll right_ | (são rótulos de acessibilidade, **não visíveis** — opcional: Logótipo / Abrir menu / Deslizar para a esquerda / Deslizar para a direita) |

### Strings de montra mais visíveis (procurar na aba respetiva)
| EN | PT |
|---|---|
| Search / Search our store | Pesquisar / Pesquisar na loja |
| View all | Ver tudo |
| Add to cart | Adicionar ao carrinho |
| Sold out | Esgotado |
| Sale | Promoção |
| From | Desde |
| Quick view | Vista rápida |
| Cart | Carrinho |
| Subtotal | Subtotal |
| Checkout | Finalizar compra |
| Taxes and shipping calculated at checkout | Impostos e envio calculados na finalização |
| Your cart is empty | O seu carrinho está vazio |
| Subscribe | Subscrever |
| Sign up / Newsletter | Subscreva a newsletter |
| Email | E-mail |
| Quantity | Quantidade |
| Sort by | Ordenar por |
| Filter | Filtrar |
| In stock | Em stock |

> A frase de boas-vindas do cabeçalho "Welcome to our store" pode ser uma **definição de secção** (não
> uma string de idioma) — nesse caso edita-se no **Personalizar** (editor ao vivo), não aqui.

## Já feito hoje (28 jul, no Chrome)

- **Páginas legais:** Privacidade (automática) ✓; **Devolução e reembolso** e **Termos de serviço**
  criados a partir do modelo-padrão Shopify (⚠️ rever termos concretos + preencher `[INSERT BUSINESS
  ADDRESS]`/`[INSERT VAT NUMBER]` + traduzir para PT antes de publicar). **Frete** e **Informações de
  contacto** ficaram por preencher (precisam de dados do cliente).
- **Menu de rodapé (footer):** Pesquisar · Política de privacidade · Termos de serviço · Política de
  devolução e reembolso — guardado. Falta acrescentar "Política de frete" e "Contactos" quando existirem.
- **Falta ligar** o menu de rodapé à secção de rodapé do tema Various (no Personalizar) e escolher que
  colunas mostrar — é passo do editor ao vivo.
