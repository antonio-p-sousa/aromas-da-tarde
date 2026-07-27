# Montagem da loja — tema Various (Aromas da Tarde)

Guia de setup da loja Shopify **Aromas da Tarde** (`cbtddr-fc`) com o tema
**Various** (preset do *Maximize*, por Omni Themes — $220 USD, pago só ao
publicar). Pensado para o catálogo real: ~2 378 produtos, 25 famílias, preços
com IVA, venda de bebidas alcoólicas.

> Loja protegida por senha (pré-lançamento) — manter assim até ao go-live.

---

## ESTADO ATUAL (25 jul 2026) — hand-off

**✅ Feito**
- 2 378 produtos importados (ativos; `Type`=família; `Vendor`=Aromas da Tarde; stock).
- **10 coleções** (smart, Tipo=família): Whisky, Gin, Rum, Licor, Vodka, Tequila, Cognac, Brandy, Aperitivos/Digestivos, Vinhos = **96% do catálogo** (2 273 produtos). Criadas via Matrixify (plano grátis limitou a 10).
- **Menu principal**: Início + dropdown **Bebidas** com as 10 famílias ligadas às coleções.
- **IVA**: caixa "incluir imposto no preço" ligada → sem dupla taxação.
- **Age-gate (parcial)**: app Blockify instalada + **embed ativado no tema Horizon** ("On").

**⏳ Falta (por ordem de prioridade)**
1. **Criar o pop-up do age-gate** — ⚠️ o embed está on mas **não há pop-up** (lista 0/1) → o gate ainda não bloqueia. Ver runbook em §4. (O customizador da app não é operável por automação — fazer manualmente.)
2. **Nome da loja**: ainda "My Store" → mudar para **"Aromas da Tarde"** em *Configurações → Dados da loja*.
3. **Editor do tema Various**: homepage premium + confirmar mega-menu (§3).
4. **Logótipo + imagens dos produtos** (cliente / parceiro PHC).
5. **15 coleções pequenas** em falta (4% do catálogo) — opcional: manual ou plano pago Matrixify.
6. **Publicar Various ($220) + ligar domínio + remover senha** → go-live.
7. Quando publicar o Various, **reativar o embed do age-gate nesse tema**.

> Nota técnica: a automação do assistente **não consegue operar de forma fiável o admin Shopify** (páginas pesadas congelam os screenshots); o padrão que funciona é **importações Matrixify** (feitas pelo António) + este guia. O age-embed foi ligado numa janela em que o browser respondeu.

---

## 0. Pré-requisitos

- [x] Produtos importados (2 378, ativos, `Type` = família, `Vendor` = Aromas da Tarde).
- [ ] **Coleções (25)** — criar via app **Matrixify**, importando
  `data/colecoes-matrixify-2026-07-25.csv` (regra: Tipo = família). A Whisky já
  existe; o Matrixify reconcilia pela "Title" (não duplica).
- [ ] Comprar/publicar o tema Various ($220) — só no fim, ao publicar.

---

## 1. Coleções

25 coleções automáticas (Tipo = família). Cauda longa (1–7 produtos) — decisão
de merchandising em [colecoes-shopify.md](colecoes-shopify.md). Proposta:
agrupar as pequenas em coleções-mãe (Vinhos & Fortificados; Destilados de fruta;
Outros) para não ter coleções de 1 produto. Sem decisão, ficam 1:1.

**Imagem de coleção:** cada coleção deve ter imagem de capa (uma garrafa
representativa da família) — entra quando houver acesso às imagens do PHC.

---

## 2. Navegação (menu principal) — crítico para catálogo grande

Com ~2 378 produtos, a navegação tem de ser por **mega-menu**. Em
*Conteúdo → Menus → Main menu*:

- **Bebidas** (mega-menu) → uma entrada por família grande: Whisky, Gin, Rum,
  Licor, Vodka, Tequila, Cognac, Brandy, Aperitivos/Digestivos, Aguardentes,
  Bitters, Porto, Champagne, Vinhos.
- **Novidades** → coleção/tag `Novidade`.
- **Festivos** → tag `Festivo` (sazonal; esconder fora de época).
- **Contactos** / **A Casa** (página institucional).

O tema Various tem mega-menu nativo — associar cada coluna a uma coleção.

---

## 3. Editor do tema Various (Loja virtual → Personalizar)

### 3.1 Cabeçalho (Header)
- **Logótipo** da Aromas da Tarde (pendente — pedir ao cliente em SVG/PNG).
- **Barra de pesquisa sempre visível** (essencial com 2 378 produtos; o Various
  tem pesquisa preditiva — ativar).
- Mega-menu ligado ao Main menu (ponto 2).
- Ícones: conta, carrinho.

### 3.2 Homepage (secções, por ordem)
1. **Hero** — imagem premium + claim (ex.: "Os grandes destilados do mundo").
   Evitar o demo "Premium Foods" do Various (é de mercearia).
2. **Coleções em destaque** — grelha com as famílias principais (Whisky, Gin,
   Rum, Tequila, Vodka, Licor).
3. **Novidades** — produtos com tag `Novidade`.
4. **Mais vendidos** — coleção best-selling (o Various tem secção própria).
5. **Destaque editorial** — banner de marca/história (opcional).
6. **Confiança** — envio, pagamento seguro, apoio.

### 3.3 Página de produto
- Galeria (imagens pendentes do PHC).
- Preço **com IVA** já incluído (ver ponto 5).
- Stock/disponibilidade; botão comprar.
- Metacampos úteis: família, categoria/país (do PHC) — mostrar como specs.

### 3.4 Rodapé
- Menu de políticas (privacidade, envios, devoluções, termos).
- Aviso legal de venda de álcool a maiores de 18.
- Contactos + redes.

### 3.5 Estilo (cores/tipografia)
- Direção **premium/escura** (combina com espirituosas), não o look colorido de
  mercearia do preset. Paleta sóbria + dourado; tipografia serifada nos títulos.

---

## 4. Verificação de idade (obrigatório — álcool)

App escolhida: **Blockify Age Verification** (instalada; embed já ativado no tema).
**Falta criar o pop-up** (sem ele o gate não bloqueia). Na app → *Store
verification* → **Create pop-up** (plano grátis: 1 pop-up):

- **Nome interno:** `Aromas 18+`  ·  **Idade mínima:** `18`
- **Título:** `Bem-vindo à Aromas da Tarde`
- **Mensagem:** `Este site vende bebidas alcoólicas. Para entrar, confirme que tem 18 anos ou mais.`
- **Botão confirmar:** `Tenho 18 anos ou mais`
- **Botão recusar:** `Sou menor de 18`
- **Mensagem ao recusar:** `Lamentamos, mas tem de ter 18 anos ou mais para aceder a este site.`
- **Comportamento:** bloquear página inteira + memorizar a confirmação
- **Estilo:** fundo escuro/sóbrio  ·  **Save/Activate** (fica 1/1) → testar em *Test the Popup*.

---

## 5. Definições (Configurações)

- **Moeda:** EUR. **Idioma:** PT (mercado Portugal).
- **Impostos:** ⚠️ os preços importados **já incluem IVA** → configurar a loja
  para *"todos os preços incluem imposto"*, senão o IVA é somado outra vez no
  checkout (dupla taxação). Confirmar taxa PT (23% padrão; alguns artigos podem
  ter taxa distinta — validar).
- **Envios:** zonas e portes (a definir com o cliente).
- **Pagamentos:** Shopify Payments — dados da empresa (NIF, IBAN, representante),
  cartão + Multibanco; ver [entregaveis/Requisitos-Loja-Online-2026-07-24](../entregaveis/Requisitos-Loja-Online-2026-07-24.docx).
  Nota: álcool pode exigir verificação adicional do processador.
- **Domínio:** ligar o domínio (registos DNS) — ver o mesmo documento de requisitos.

---

## 6. Sincronização contínua (pós-arranque)

A carga inicial foi por CSV. O objetivo é **sync diário** do PHC (preços, stock,
novos artigos) — ver [plano-integracao.md](plano-integracao.md) e
[importacao-shopify.md](importacao-shopify.md). Enquanto o middleware não existe,
re-importar o CSV atualizado manualmente.

---

## 7. Checklist pré-go-live

- [ ] 25 coleções criadas (Matrixify) + imagens de capa
- [ ] Menu/mega-menu ligado às coleções
- [ ] Homepage montada (hero premium, destaques, novidades, mais vendidos)
- [ ] Logótipo + identidade aplicados
- [ ] Imagens dos produtos carregadas (acesso PHC)
- [ ] Age gate ativo
- [ ] Impostos: preços com IVA incluído (sem dupla taxação)
- [ ] Pagamentos ativos (Shopify Payments)
- [ ] Domínio ligado + SSL
- [ ] Políticas e aviso legal de álcool no rodapé
- [ ] Tema Various **comprado** ($220) e **publicado**
- [ ] Remover proteção por senha (abrir a loja)
- [ ] Limpeza: apagar a 2.ª loja "My Store" duplicada; remover trial Various da KULTU
