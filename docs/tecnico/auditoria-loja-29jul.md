# Auditoria da loja Various — 29-30 jul (pós-vídeo)

Varrimento COMPLETO: homepage ✓ · coleção Whisky ✓ · página de produto ✓ · carrinho ✓ · pesquisa ✓ · 404 ✓.
Homepage está LIMPA (hero, categorias, explore, newsletter, rodapé — zero demo).
**O lixo demo está concentrado no TEMPLATE DE PRODUTO** (foi aí que se viu o "Shop By Dietary Need").

## 30 jul — carrinho / pesquisa / 404

- **Carrinho**: design dark ok, fotos reais, tudo PT excepto "Estimate shipping" (string de idioma).
- **Pesquisa** (/search?q=whisky): resultados e paginação PT; heading "Search results" em EN (×2).
- **Header** (todas as páginas): "All categories" e "What are you searching for?" em EN.
- **404**: impecável — dark, "404" + "Continuar a comprar", zero demo.

## 🔴 P1 — Demo content no template de produto (REMOVER no editor)

Abrir: Personalizar → dropdown do template (topo) → **Produtos → Default product**
(ou abrir um produto na montra e clicar nos blocos no preview).

| # | O quê | Onde | Ação |
|---|---|---|---|
| 1 | "Key Features: Skinless, boneless fillet / Lean protein…" (PEIXE) | bloco na coluna direita da info do produto | Apagar bloco |
| 2 | "Free & easy returns / Return this item by mail…" | ícone+texto na coluna direita | Apagar bloco (ou editar p/ PT real) |
| 3 | "Delivered to Los Angeles, CA : Apr 14th–23rd" | idem | Apagar bloco |
| 4 | "As low as $142/month, Affirm financing" | idem | Apagar bloco |
| 5 | "Estimated delivery between August 03…" (EN) | linha verde sob os botões | String de idioma (Claude trata) ou desativar |
| 6 | Acordeões "Additional Information" e "Shipping and Returns" | sob os botões | Apagar OU traduzir título+conteúdo real |
| 7 | Tabela "About this item" (Brand: Example Co., Model Pro, customized grams) | secção sob a galeria | Apagar secção/blocos |
| 8 | "Authencity Guaranteed" (typo do tema!) + texto EN | cartão sob a tabela | Editar p/ "Autenticidade garantida" + texto PT, ou apagar |
| 9 | **Secção "Shop By Dietary Need"** (ícones de peixe, Example collection ×10) | secção abaixo | **Apagar secção** |
| 10 | Secção 4 cartões "Video with text / Gifting Made Simple / Enjoy Right Away / Cooked Daily" | abaixo | Apagar secção |
| 11 | Secção "Nutritious and Delicious / Organic ingredients…" | abaixo | Apagar secção |

Depois: **Salvar**. (Manter: galeria, título/SKU/preço, quantidade+Add, sticky bar, related products se existir.)

## 🟡 P2 — Strings EN por traduzir (Claude — via Translations API)

Alvo (mapa completo em `scratchpad/mw/traduz-tema.js`):
- "Sort by:" → "Ordenar por:" · "{{count}} products" → "produtos" · "Filter" → "Filtrar" (coleção)
- "+ Add" → "+ Adicionar" (cartões de produto)
- "Estimated delivery between X and Y" → "Entrega estimada entre X e Y" (produto)
- "Estimate shipping" → "Estimar envio" + calculadora de envio (carrinho)
- "Search results" → "Resultados da pesquisa" (pesquisa)
- "All categories" → "Todas as categorias" · "What are you searching for?" → "O que procura?" (header)

**Estado 30 jul**: a UI "Conteúdo do tema" ficou não-automatizável (vive num iframe cross-origin
`online-store-web.shopifyapps.com`; cliques sintéticos não são entregues de forma fiável — foi isto
que fez os cliques de 29-30 jul falharem aleatoriamente). Caminho novo: **Translations API**.
Lançada versão `placeholder-loop-4` da app com scopes `read/write_translations` + `read_locales`.
**Falta 1 clique do António**: re-autorizar a app →
`https://admin.shopify.com/store/cbtddr-fc/oauth/install?client_id=ffe1d672cb6a73acba9128ef6459f797`
Depois: `node traduz-tema.js` (dry-run) e `node traduz-tema.js --write`.
(Se a API não cobrir o locale primário, plano B: co-pilot de 5 min com o runbook textos-tema-pt.md.)

## 🟡 P3 — Retoques visuais (editor, 1 clique cada)

- "Home page · 1 item" aparece em "As nossas categorias" (secção Lista de coleções → remover a coleção Home page da seleção)
- Barra de anúncio verde-garrafa (se preferires ink #16110B: secção Barra de anúncio → cores)
- Tipografia títulos → Playfair Display (Configurações do tema → Tipografia) — dá o ar da demo
- Estrelas "(0)" nos cartões/produto: se a app de reviews não for para usar já, desativar exibição de rating (Cartões de produto nas Configurações do tema)

## ✅ Verificado OK

Hero (2 modos), categorias c/ capas reais, fotos nos produtos, badges stock PT, breadcrumbs PT,
"IVA incluído", SKU/Código de barras PT, "Pague com PayPal"/"Mais opções de pagamento" PT,
"Partilhar:" PT, newsletter PT, rodapé PT c/ seletor "português (Portugal)".

## ⚠️ Nota operacional

- "Shop By Dietary Need" NÃO está na homepage — só no template de produto. O tema publicado (Horizon)
  continua cheio de demo mas o cliente nunca o vê se partilharmos SEMPRE o link do preview ("Copy link").
- Editor sob automação: cliques em swatches/blocos/modais não pegam — execução manual é mais rápida.
