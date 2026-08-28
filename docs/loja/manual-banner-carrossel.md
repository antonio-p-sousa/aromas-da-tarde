# Manual — Gerir os banners do carrossel (página inicial)

_Para o Jorge — como trocar as imagens e textos do topo do site, sem precisar de ninguém. ~5 min por banner._

## O que é

O topo da página inicial é um **carrossel** (slideshow): roda automaticamente entre
banners de 5 em 5 segundos, com setas e paginação. Cada banner tem:

- uma **imagem de fundo** (e opcionalmente uma versão para telemóvel)
- **subtítulo**, **título** e **texto**
- até 2 **botões** com link (ex.: para uma categoria ou produto)

Neste momento tem 2 banners: "Os grandes destilados" e um exemplo de
**promoção com 2 produtos lado a lado** (Whisky & Gin em destaque).

## Como editar

1. Admin Shopify → **Loja virtual** → **Temas** → no tema *Various*, botão **Personalizar**
2. Na coluna esquerda, em **Modelo**, abrir **Slideshow de destaque**
3. Cada item "Slideshow – …" é um banner. Clicar num para editar:
   - **Imagem** → *Selecionar* (biblioteca) ou *Adicionar arquivos* (upload novo)
   - **Subtítulo / Título / Texto** — escrever diretamente
   - **Rótulo do primeiro botão** + **Link do primeiro botão** — texto e destino do botão
     (escrever `/collections/whisky` p. ex. e escolher a sugestão que aparece)
4. **Salvar** (canto superior direito) — fica logo visível na loja

## Adicionar / remover / reordenar banners

- **Adicionar**: em *Slideshow de destaque* → **⊕ Adicionar Slideshow** → preencher como acima
- **Remover**: clicar no banner → menu **⋯** no topo do painel direito → **Remover**
- **Reordenar**: arrastar os itens na coluna esquerda (o 1.º é o que abre primeiro)

## Dicas para as imagens

- Tamanho ideal: **1920×800 px** (horizontal). Até 2000 px de largura está ótimo.
- Para **promover 2 produtos num só banner**: criar uma imagem única com as duas
  fotos lado a lado (como o exemplo "Whisky & Gin em destaque") — qualquer programa
  de imagem serve; fundo escuro + fotos dos produtos em painéis claros resulta bem.
- Evitar texto escrito na própria imagem — usar os campos de título/texto do tema
  (ficam legíveis em qualquer ecrã e são traduzíveis).
- Se o banner ficar escuro demais, reduzir a **Opacidade da sobreposição da imagem**
  nas definições do banner (0 = sem escurecimento).

## Definições do carrossel (secção inteira)

Clicando em **Slideshow de destaque** (o cabeçalho, não um banner):

- **Reproduzir automaticamente a cada** — segundos entre banners (0 desliga a rotação)
- **Mostrar setas de navegação** / **Paginação** — controlos visíveis
- **Altura da linha (desktop/mobile)** — altura do carrossel

## Dúvidas frequentes

- *A imagem não aparece?* Confirmar que o banner tem imagem selecionada (sem imagem,
  o tema mostra um fundo de cor).
- *Quero um banner só temporário (ex. promoção de Natal)?* Criar o banner e, no fim
  da campanha, usar **⋯ → Ocultar** (fica guardado para reutilizar) em vez de Remover.
