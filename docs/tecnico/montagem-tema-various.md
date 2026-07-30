# Montagem da loja — tema Various (Aromas da Tarde)

Guia de setup da loja Shopify **Aromas da Tarde** (`cbtddr-fc`) com o tema
**Various** (preset do *Maximize*, por Omni Themes — $220 USD, pago só ao
publicar). Pensado para o catálogo real: ~2 378 produtos, 25 famílias, preços
com IVA, venda de bebidas alcoólicas.

> Loja protegida por senha (pré-lançamento) — manter assim até ao go-live.

---

## ESTADO ATUAL (27 jul 2026) — hand-off

**✅ Feito**
- 2 378 produtos importados (ativos; `Type`=família; `Vendor`=Aromas da Tarde; stock).
- **11 coleções** (smart, Tipo=família): Whisky (977), Gin (371), Rum (261), Licor (194), Vodka (172), Tequila (142), Apert./Degestivos (49), Cognac (44), Brandy (34), Vinhos (29), Porto (20) = **~97% do catálogo**. Criadas via Matrixify (plano grátis limitou a ~10-11).
- **Menu principal**: Início + dropdown **Bebidas** com as famílias ligadas às coleções.
- **IVA**: caixa "incluir imposto no preço" ligada → sem dupla taxação.
- **Nome da loja**: "Aromas da Tarde" (feito).
- **Age-gate**: app Blockify instalada, embed ativado + **pop-up 18+ criado e ativo** (feito).
- **Tema Various**: instalado (em avaliação/trial).
- **Homepage — hero (27 jul)**: apagados os **4 slides de mercearia** ("Super Groceries", "Fruits & Vegetables", "Power up every morning", "Nutrition for Growing Families"); resta **1 slide PT** ("Os grandes [destilados] do mundo"). Gravado.
- **Homepage — barra de anúncio (27 jul)**: os 4 anúncios traduzidos para PT e sem £/promos falsas: "As grandes marcas de whisky, gin, rum e vinhos" · "Beba com moderação · Venda proibida a menores de 18 anos" (substituiu o contador) · "Envio para todo o Portugal continental" · "Compra segura e pagamento protegido". Botão "More" removido. Gravado.
- **Cabeçalho — menu de topo (27 jul)**: apagados os **7 blocos demo** (Combo & Deals, Bundle save, Shop by Category, Fruit & Vegetables, Meat & Fish, Presets, Templates); a definição "Menu principal" ligada ao **Main menu** → o topo mostra agora **Início · Bebidas ▾**. Gravado.
- **Menu lateral/drawer (27 jul)**: a definição "Menu lateral" ligada ao **Main menu**; título desktop e mobile = "Menu" (era "Drawer menu"); apagados os **9 blocos de mercearia** (Bakery…Baby). Resta 1 bloco "Menu lateral" vazio (inofensivo, não renderiza). Gravado.
- **Homepage — "Coleções em destaque" (27 jul)**: título "Hot Deals"→**"Explore por categoria"**, botão "View All"→**"Ver tudo"**, e os 3 blocos de coleção repontados para **Whisky · Gin · Rum** (coleções reais). A secção mostra agora produtos reais com preços (ex.: Yamazaki 12 Yrs €271,71). Gravado. *(Ainda tem um contador "Gone in 24 Hours" — desativar nas definições da secção; não feito.)*
- **Etiquetas/badges de produto (27 jul)**: apagados os **4 badges falsos** ("2 for $41", "Highly rated", "Best Buy", "Deal") que apareciam em todos os produtos; mantidos "Etiqueta de promoção" e "Etiqueta de esgotado" (legítimos). Gravado.
- **Homepage — "Lista de coleções" / "As nossas categorias" (27 jul)**: título "Shop Categories"→**"As nossas categorias"**, botão "All Collections"→**"Ver todas"**, e apagados os 12 blocos de coleção demo → a secção mostra agora **todas as 11 coleções reais** com contagens (Whisky 977, Gin 371, Rum 261, Licor 194, Vodka 172, Tequila 142, Apert./Deg 49, Cognac 44, Brandy 34, Vinhos 29, Porto 20 + Home page). Gravado.
- **Homepage — limpeza do corpo (27 jul)**: apagadas **~10 secções demo de mercearia**: Promoção com rolagem (carrossel vazio), Image with text (Kitchen Essentials), Collection-group (9 for $18/Half Price), Product showcase (dairy combo/Non-GMO), Grade de promoção x2 (Earn Cashback / Save 35% All Groceries), Lista de coleções 2ª (Shop By Dietary Need), Coleções promocionais (Fresh Picks/Premium Meat), Colunas de texto com ícones (selos em inglês — não traduzíveis por automação), Collection list-group (Shop conveniently in supermarket), Image with text 2ª (Healthy Living/organic), Conjunto de produtos destacados (Fresh Ingredients), Stats counter (More than groceries/+84), Popular Companies (Handcrafted cookie…). **Corpo final: Hero → As nossas categorias → Explore por categoria → Space.** Gravado.
- **Rodapé (27 jul)**: "This is everything you need in your pantry"→**"Aromas da Tarde"** (campo "Store name" limpo → mostra o nome da loja); newsletter "Join our newsletter"→**"Subscreva a nossa newsletter"** + subtítulo inglês limpo; **contactos FALSOS removidos** (telefone +84 Vietname, morada NY, support@example.com — limpo o bloco "Texto personalizado" para o cliente meter os reais); apagadas as **3 colunas de menu vazias** (Company/Popular Categories/Help and support — sem links). Rodapé final: newsletter PT + (contacto a preencher) + "Aromas da Tarde" + sub-rodapé (ícones de pagamento + © Aromas da Tarde). Gravado.
  - **Truque técnico descoberto**: campos **rich-text** podem ser **LIMPOS** com segurança (`Ctrl+A` + tecla `Delete`) — só *escrever letras* é que dispara o bug dos atalhos. Assim removeram-se os textos demo em inglês do rodapé **e a legenda inglesa do hero** ("Fresh ingredients loved by thousands of families").
- **Contador "Gone in 24 Hours" (27 jul)**: desativado na secção "Explore por categoria" (definições → Contador regressivo → "Habilitar contador regressivo" OFF). Gravado.
- **Placeholder de produto p/ vídeo do cliente (28 jul)**: gerado um placeholder de marca (`scratchpad/placeholder-produto.png` — ícone de câmara + "Fotografia do produto · a aguardar imagem · AROMAS DA TARDE", via `sharp`) e **aplicado como imagem a TODOS os produtos sem foto** via Admin API. Objetivo: vídeo para pressionar o cliente a enviar as fotos reais.
  - **Como se fez o acesso à API** (Shopify "Primavera '26" já não tem o token de custom app clássico): criada app privada **"Placeholder Loop"** no **Dev Dashboard** (escopos `read/write_products, read/write_files`), lançada versão, **instalada na loja** (via `/admin/oauth/authorize`), e token obtido pelo grant **`client_credentials`** (`POST /admin/oauth/access_token`, token ~24h). Credenciais no `.env`: `SHOPIFY_APP_CLIENT_ID` / `SHOPIFY_APP_CLIENT_SECRET`.
  - Script: `scratchpad/apply-placeholder.js` (staged upload → `fileCreate` → CDN url → `productCreateMedia` por produto, idempotente: salta produtos que já têm imagem). Reutilizável.
  - **Referência p/ o vídeo**: screenshots dos concorrentes Garrafeira Soares (grelha Whisky) e Garrafeira Nacional (grelha com fotos em fundo branco) — tirados só como comparação, **não** carregados na loja (evitar direitos de autor de concorrentes).
  - ⚠️ **Quando chegarem as fotos reais**: substituir os placeholders. A app "Placeholder Loop" pode ser **desinstalada** depois se não for precisa.
- **Idioma da loja → Português (27 jul)**: em *Configurações → Idiomas* adicionado **Português (Portugal)**, instalada a app oficial **Shopify Translate & Adapt**, o idioma **publicado** e **definido como padrão do domínio** (cbtddr-fc.myshopify.com → PT na raiz, EN em /en) e atribuído ao **mercado Portugal**. Verificado no preview: menus (Início/Bebidas), "Produtos", **age-gate** e **banner de cookies** aparecem em **PT**; nomes de produtos mantidos no original (não traduzidos — correto).
  - ⚠️ **Idioma primário da loja = Inglês** e é **imutável** (fixado na criação) — por isso adicionou-se PT como idioma publicado + padrão do domínio (é o método suportado).
  - **Ficou "Sem traduções" de conteúdo** (não se correu tradução automática de propósito, para **não estragar os ~2378 nomes de produtos/marcas**). Alguns textos específicos do tema ("View all", "Welcome to our store", placeholder da pesquisa) podem ficar em inglês se o locale pt-PT do tema não os cobrir → afinar com a app **Translate & Adapt** por categoria (traduzir "Tema", **nunca** "Produtos").
  - ⚠️ **O preview mostrou o tema HORIZON** (tema publicado atual): o **Various está em avaliação/trial**, logo todas as edições de homepage/rodapé acima só ficam live quando o **Various for publicado ($220)**.

**⏳ Falta (por ordem de prioridade)**
1. **Homepage — legenda do hero em inglês**: o slide PT ainda tem a linha "Fresh ingredients loved by thousands of families" no campo **Texto** (rich-text). ⚠️ *Este campo rich-text não é editável de forma fiável por automação* (o foco escapa e os toques viram atalhos do admin) → **editar manualmente** no editor: selecionar o slide → campo "Texto" → apagar e escrever PT.
2. **Textos de sistema em inglês** (placeholder da pesquisa "What are you searching for?", "All categories") — são strings de **idioma/locale** do tema, não do editor de secções → editar em *Loja virtual → Temas → … → Editar idiomas* (traduções). Automação não testada aqui.
3. **Idioma → PT: FEITO** (ver Feito). Sobre os textos de UI residuais em inglês ("View all", "Welcome to our store", placeholder da pesquisa) — **investigado na Translate & Adapt (27 jul)**:
   - A Translate & Adapt **não tem categoria "Tema"** para estas strings; ela gere **conteúdo** (Produtos, Coleções, Páginas, Políticas, Menu, Banner de cookies, Metacampos). Os "Metadados da loja" ali são **metacampos** (config do Blockify age-gate, já em PT).
   - O **"Traduzir automaticamente" é tudo-ou-nada** → traduziria também os **Produtos** (mangaria os ~2378 nomes/marcas: "Woodford Reserve", "Yamazaki"…). **Não corri** — decisão deliberada.
   - As strings de UI puras ("View all", pesquisa, "Add to cart") são **locale do tema** (ficheiro `pt.json` de cada tema), não conteúdo. **Solução**: (a) o **Various**, ao ser publicado, traz o seu próprio `pt.json` e traduz a maioria automaticamente; (b) o que sobrar afina-se no editor do tema Various via **"Localizar"** por secção (ou *Editar idiomas* do Various) — **nunca no Horizon** (que não vai ser o tema final). Fazer **depois de publicar o Various**.
   - Se algum dia quiserem traduzir descrições de produtos para PT, fazer **por categoria** na Translate & Adapt (Produtos), revendo os nomes de marca — nunca o "Traduzir automaticamente" global.
4. **Rodapé** — limpo (ver Feito). Falta só, quando houver dados/páginas:
   - **Contacto real**: meter telefone/morada/email/horário da Aromas da Tarde no bloco "Texto personalizado" (está vazio, à espera dos dados do cliente).
   - **Menus de rodapé** (opcional): criar em *Conteúdo → Menus* colunas com páginas legais (Política de Privacidade, Envios, Devoluções, Termos, Sobre) e voltar a adicionar blocos "Menu" ao rodapé. Precisa das páginas criadas primeiro.
4. **Logótipo + imagens dos produtos** (cliente / parceiro PHC).
5. **Coleções pequenas** restantes (~3% do catálogo) — opcional: manual ou plano pago Matrixify.
6. **Publicar Various ($220) + ligar domínio + remover senha** → go-live.
7. Quando publicar o Various, **reativar o embed do age-gate nesse tema**.

> Dica reutilizável: várias secções do tema (Cabeçalho, Menu lateral, e provavelmente as secções de coleções) têm um **seletor de menu/coleção**. Em vez de reconstruir blocos demo, **repontar o seletor** para o nosso Main menu / coleções reais e apagar os blocos demo pelo ícone de lixo (com hover). Foi assim que se limpou o topo e o drawer.

> Nota técnica (automação Shopify, atualizada 27 jul):
> - **Funciona:** apagar blocos/slides via ícone de lixo (com hover primeiro); editar **campos de texto simples** (Subtítulo, Título, Texto de anúncio, rótulos de botão) com o método clicar → focar → `Ctrl+A` → escrever.
> - **Não funciona:** campos **rich-text** (o foco escapa → toques viram atalhos → navega para "Criar desconto"/"Usuários"); iframes de apps; e o **Edge adormece o separador** se não estiver ativo (manter a tab do editor em foco).
> - O `browser_batch` executou no separador errado (Coleções) — usar chamadas individuais com `tabId` explícito.

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
