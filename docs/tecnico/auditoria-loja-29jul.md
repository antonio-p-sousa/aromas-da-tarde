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

## ✅ P2 — Strings EN traduzidas (30 jul, via Translations API) — FEITO

App re-autorizada pelo António (versão `placeholder-loop-4`, scopes translations/locales).
**124 traduções pt-PT registadas e VERIFICADAS na montra:**
- `tools/traduz-tema.js` (20): Ordenar por:/Filtrar/977 produtos/Todas as categorias/
  Resultados da pesquisa/calculadora de envio do carrinho completa.
- `tools/traduz-secoes.js` (104): **todo o conteúdo demo dos templates de produto e coleção
  substituído por copy de garrafeira** — Key Features do peixe→"Porquê comprar na Aromas da Tarde",
  Los Angeles→"Envio para todo o Portugal continental", Affirm→"Compra segura", 365 days→política
  de devoluções, Authencity→"Autenticidade garantida", Shop By Dietary Need→"Explore por categoria",
  FAQ do leite/café→FAQ reais de garrafeira (18+, embalagem, devoluções, entrega), acordeões PT,
  "Também poderá gostar"/"Vistos recentemente", Read more→Ler mais (todos).

**Descobertas técnicas:** o editor "Conteúdo do tema" vive num iframe cross-origin
(`online-store-web.shopifyapps.com`) — cliques sintéticos não são fiáveis, NÃO usar. A Translations
API não lista temas trial em `translatableResources`, mas **`translatableResourcesByIds` aceita o
gid do Various diretamente** (locale content + json templates + section groups). A montra serve o
locale pt-PT (primário=en); o Various traz 4034/4393 strings pt-PT de fábrica.

## 🔴 P1 restante — só editor (settings, não strings; lista CURTA)

1. Botão **"+ Add"** → "Adicionar" (setting do bloco buy buttons/cartões; default do schema, não traduzível por API)
2. Placeholder pesquisa **"What are you searching for?"** → "O que procura?" (setting do header)
3. Secção "Explore por categoria" no template de produto: escolher as ~10 coleções reais (mostra "Example collection") — ou apagar a secção
4. Cartões "A nossa garrafeira/Ofertas/Conservação/Stock real" (template produto): imagens placeholder — pôr fotos ou apagar secção
5. Secção "Prova e conservação" (ex-Nutritious): textos já PT mas as imagens são ingredientes de mercearia — apagar se incomodar

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
