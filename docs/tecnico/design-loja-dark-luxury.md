# Design da loja — dark-luxury (alvo = demo enviada ao cliente)

**Estado 29 jul:** feito por API o que era possível; o resto precisa de 1 login do António (ver §3).

## 1. Já aplicado ✅

- **Fotos reais em 2365/2378 produtos** (extraídas do PHC `ifl`, upload 29 jul, 0 erros).
- **Capas reais nas 12 coleções** (best-seller de cada: Zacapa Royal→Rum, Taylors 20→Porto, …) —
  "As nossas categorias" e listas de coleção deixam de estar sem imagem.
- **Hero dark-luxury composto e na biblioteca da loja** (Conteúdo → Arquivos →
  `hero-aromas-dark.jpg`; cópia no repo em `design/hero-aromas-dark.jpg`).
  Gerador reproduzível: `middleware/tools/gen-hero.js` (flood-fill remove fundo branco das fotos
  PHC preservando rótulos; garrafas: Tanqueray, Zacapa 23, Hendrick's Lunar, Grey Goose, Diplomático).
- Strings de UI do tema em PT (ver `textos-tema-pt.md`).

## 2. Bloqueios descobertos (importante)

- **Tema Various (pago, em trial): a Shopify BLOQUEIA o acesso API aos ficheiros** de temas não
  comprados (GraphQL `theme.files` → Access denied; REST Asset → 401). Testado e confirmado
  (o Horizon, gratuito, dá acesso normal). ⇒ **cores/hero por API só depois de comprar o tema ($220)**.
- **Editor visual (Personalizar):** o deep-link abriu com a conta errada (expandtarget) e a sessão
  da conta Jorge (aromasdatarde) expirou no Chrome → pede password. **Claude não faz logins.**

## 3. Estado do editor (29 jul, ~2h) — PARCIAL via Personalizar

O login voltou (obrigado!) e o Personalizar **renderizou** no Chrome real. Conseguido e **GRAVADO**:
- ✅ **Slide do hero com `hero-aromas-dark.jpg`** (adeus ícone partido). Nota: em desktop o crop
  450px corta parte das garrafas e o título sobrepõe — resolve-se com os passos da §4.
- Também na biblioteca: `hero-aromas-wide.jpg` (2560×600, rácio certo p/ desktop) e
  `hero-aromas-mobile.jpg` (900×1100) — já carregados, é só selecionar.

**Limite encontrado:** no editor sob automação, painéis/inputs/Salvar funcionam, mas **modais e
menus de contexto não abrem** (media picker, engrenagem das configurações do tema) — o renderer
congela ciclicamente. ⇒ Os 4 passos que faltam são manuais (5–10 min, receita abaixo) OU comprar
o tema desbloqueia tudo por API.

### 💡 DESCOBERTA: o Various tem MODO ESCURO nativo
Em Configurações do tema → **Modo do tema**: já está ativo com switch sol/lua no site; o *default*
é Claro. **1 clique em "Modo padrão: Escuro" + Salvar** põe o site inteiro dark por defeito — o
caminho mais rápido para o look da demo. Afinações finas no acordeão **"Cores (Tema Escuro)"**.
(Atalho para abrir as Configurações do tema: `.../editor?context=theme` — a engrenagem por clique
não abre sob automação, o deep-link sim.)

### Os passos que faltam (por ordem de impacto)
1. **Modo padrão → Escuro** (Modo do tema, 1 clique) e/ou afinar "Cores (Tema Escuro)" c/ a paleta da §4.
2. **Slide hero**: Imagem → Alterar → `hero-aromas-wide.jpg`; Imagem para celular → `hero-aromas-mobile.jpg`.
3. **Tipografia**: títulos Playfair Display, corpo Assistant.
4. **Altura da linha (desktop)** do Slideshow: 450px → 600px (opcional, dá mais presença ao hero).

> Automação (2ª ronda): acordeões e deep-links funcionam; **controlos pequenos (segmented
> Claro/Escuro), media pickers e dropdowns são imunes aos eventos sintéticos** (~20 tentativas,
> rato+teclado). Estes passos são mesmo para mão humana — ou tema comprado → API.

## 4. Receita de design (aplicar no Personalizar do Various)

Paleta da demo (`demo/loja.html`): fundo `#16110b` · painel `#251d13` · linhas `#3a2f1f` ·
texto `#f3ead9` (dim `#b8a98d`) · dourado `#c9a227` (soft `#e6c96a`) · vinho `#b3563e`.

1. **Configurações do tema → Cores** (esquema principal):
   - Fundo: `#16110b` · Texto: `#f3ead9`
   - Botões/acento: fundo `#c9a227`, texto `#16110b` (hover `#e6c96a`)
   - Cartões/painéis: `#251d13` · Bordas/linhas: `#3a2f1f`
   - Badges: promo `#b3563e`, esgotado cinza
2. **Tipografia**: Títulos **Playfair Display** (biblioteca Shopify; alternativa Cormorant
   Garamond); corpo **Assistant** ou Inter. Títulos com peso 600.
3. **Hero (slideshow, slide 1)**: Imagem → Biblioteca → `hero-aromas-dark.jpg`;
   texto alinhado à ESQUERDA (a imagem tem as garrafas à direita);
   título "Os grandes destilados do mundo" (manter), subtítulo "Garrafeira online",
   botão "Explorar a loja" (estilo primário dourado). Overlay/darken do slide: 0–10%.
4. **Secções homepage**: manter "Explore por categoria" e "As nossas categorias"
   (já com fotos reais); newsletter herda o dark. Apagar qualquer secção demo restante.
5. **Rodapé**: ligar o menu "Footer menu" (já tem Pesquisar + 3 políticas).

## 5. Alternativa que desbloqueia tudo por API

**Comprar o Various ($220)** — decisão do cliente/billing. Depois `middleware/tools/tema.js`
(MODE=dump/put com backup automático) aplica tudo por API, reproduzível e versionado.
