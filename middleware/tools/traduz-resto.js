// Passe final de traduções pt-PT do Various: contas de cliente, pesquisa,
// contacto, meses, acessibilidade, secções auxiliares e templates restantes.
// Uso: node tools/traduz-resto.js [--write]
const { shopify } = require('../src/env');
const T = '193307574598';
const LOCALE = 'pt-PT';
const WRITE = process.argv.includes('--write');
const BATCH = 25;

const LC = {
  // — carrinho/re-order/mapa/vídeo —
  'sections.re-order.message_success': 'O seu carrinho está vazio.',
  'sections.re-order.clear_cart': 'Esvaziar carrinho',
  'sections.map.button_label': 'Obter direções',
  'sections.map.title': 'Mapa',
  'sections.video.load_video': 'Carregar vídeo',
  'sections.faq.collapse_button': 'Fechar',
  // — blog em destaque —
  'sections.featured_blog.view_all': 'Ver todos os artigos',
  'sections.featured_blog.onboarding_title': 'Artigo do blogue',
  'sections.featured_blog.onboarding_date': 'a 17 de julho de 2022',
  'sections.featured_blog.on_date': 'a',
  'sections.featured_blog.by_author': 'por',
  'sections.featured_blog.read_now': 'Ler agora',
  'sections.featured_blog.show_more': 'Mostrar mais',
  'sections.featured_blog.show_less': 'Mostrar menos',
  // — listas de coleções —
  'sections.collection_list.collection_title': 'Coleção',
  'sections.collection_list.items': 'artigos',
  'sections.collection_list.item': 'artigo',
  'sections.collection_list.view_collection': 'Ver coleção',
  'sections.collection_template.empty': 'Nenhum produto encontrado',
  'sections.collection_template.title': 'Coleção',
  'sections.collection_template.no_product_collection': 'Não há produtos nesta coleção',
  'sections.collection_template.use_fewer_filters_html': 'Use menos filtros ou <a class="{{ class }}" href="{{ link }}" data-no-instant>remova todos</a>',
  'sections.featured_collection.product_title': 'Produto de exemplo',
  'onboarding.product_title': 'Produto de exemplo',
  'onboarding.collection_title': 'Nome da coleção',
  // — countdowns/promos —
  'sections.promotion_banner.banner_link': 'Ligação do banner',
  'sections.promotion_banner.days': 'Dias',
  'sections.promotion_banner.hours': 'Horas',
  'sections.promotion_banner.mins': 'Minutos',
  'sections.promotion_banner.secs': 'Segundos',
  'sections.times.days': 'Dias',
  'sections.times.hours': 'H',
  'sections.times.minutes': 'Min',
  'sections.times.seconds': 'Seg',
  'sections.promo-code-list.expired': 'Expirado',
  'sections.promo-code-list.coming_soon': 'Brevemente',
  'sections.promo-code-list.error_message': 'Adicione artigos ao carrinho para aplicar o código de desconto.',
  'sections.promo-code-list.apply': 'Aplicar',
  'sections.promo-code-list.applied': 'Aplicado',
  'sections.promo-code-list.valid': 'Válido',
  'sections.promo-code-list.from': 'de',
  'sections.promo-code-list.until': 'até',
  // — pesquisa —
  'templates.search.blog': 'Blogue',
  'templates.search.clear_all': 'Limpar tudo',
  'templates.search.no_results': 'Sem resultados para “{{ terms }}”. Verifique a ortografia ou use outra palavra.',
  'templates.search.blog_post': 'Artigo do blogue',
  'templates.search.results_with_count.one': '{{ count }} resultado',
  'templates.search.results_with_count.other': '{{ count }} resultados',
  'templates.search.results_with_count_and_term.one': '{{ count }} resultado para “{{ terms }}”',
  'templates.search.results_with_count_and_term.other': '{{ count }} resultados para “{{ terms }}”',
  'templates.search.search_for': 'Pesquisar por “{{ terms }}”',
  'templates.search.collections': 'Coleções',
  'templates.search.pages': 'Páginas',
  'templates.search.articles': 'Artigos',
  'templates.search.view_all': 'Ver tudo',
  'templates.search.suggestions': 'Sugestões',
  // — contacto/404 —
  'templates.contact.form.phone': 'Telefone',
  'templates.contact.form.message': 'Mensagem',
  'templates.contact.form.send': 'Enviar',
  'templates.contact.form.post_success': 'Obrigado pelo contacto. Responderemos o mais depressa possível.',
  'templates.contact.form.error_heading': 'Corrija o seguinte:',
  'templates.contact.form.error_login': 'E-mail ou palavra-passe incorretos.',
  'templates.404.title': 'Página não encontrada',
  // — cliente: geral/login/registo —
  'customer.name': 'Nome',
  'customer.email': 'E-mail',
  'customer.message': 'Mensagem',
  'customer.phone': 'Telefone',
  'customer.send': 'Enviar',
  'customer.log_out': 'Terminar sessão',
  'customer.log_in': 'Iniciar sessão',
  'customer.create_account': 'Criar conta',
  'customer.my_account': 'A minha conta',
  'customer.my_address': 'As minhas moradas',
  'customer.enter_text': 'Escreva o texto',
  'customer.login_page.cancel': 'Cancelar',
  'customer.login_page.create_account': 'Criar conta',
  'customer.login_page.email': 'E-mail',
  'customer.login_page.forgot_password': 'Esqueceu-se da palavra-passe?',
  'customer.login_page.guest_continue': 'Continuar',
  'customer.login_page.guest_title': 'Continuar como convidado',
  'customer.login_page.password': 'Palavra-passe',
  'customer.login_page.title': 'Iniciar sessão',
  'customer.login_page.sign_in': 'Iniciar sessão',
  'customer.login_page.submit': 'Submeter',
  'customer.recover_password.title': 'Repor a palavra-passe',
  'customer.recover_password.subtext': 'Enviamos-lhe um e-mail para repor a palavra-passe',
  'customer.recover_password.success': 'Enviámos-lhe um e-mail com uma ligação para atualizar a palavra-passe.',
  'customer.reset_password.title': 'Repor a palavra-passe da conta',
  'customer.reset_password.subtext': 'Introduza uma nova palavra-passe',
  'customer.reset_password.password': 'Palavra-passe',
  'customer.reset_password.password_confirm': 'Confirmar palavra-passe',
  'customer.reset_password.submit': 'Repor palavra-passe',
  'customer.register.title': 'Criar conta',
  'customer.register.first_name': 'Nome próprio',
  'customer.register.last_name': 'Apelido',
  'customer.register.email': 'E-mail',
  'customer.register.password': 'Palavra-passe',
  'customer.register.submit': 'Criar',
  'customer.activate_account.title': 'Ativar conta',
  'customer.activate_account.subtext': 'Crie a sua palavra-passe para ativar a conta.',
  'customer.activate_account.password': 'Palavra-passe',
  'customer.activate_account.password_confirm': 'Confirmar palavra-passe',
  'customer.activate_account.submit': 'Ativar conta',
  'customer.activate_account.cancel': 'Recusar convite',
  // — cliente: conta/encomendas/moradas —
  'customer.account.title': 'Conta',
  'customer.account.details': 'Detalhes da conta',
  'customer.account.view_addresses': 'Ver moradas',
  'customer.account.return': 'Voltar aos detalhes da conta',
  'customer.orders.title': 'Histórico de encomendas',
  'customer.orders.order_number': 'Encomenda',
  'customer.orders.order_number_link': 'Encomenda número {{ number }}',
  'customer.orders.date': 'Data',
  'customer.orders.payment_status': 'Estado do pagamento',
  'customer.orders.fulfillment_status': 'Estado do envio',
  'customer.orders.total': 'Total',
  'customer.orders.none': 'Ainda não fez nenhuma encomenda.',
  'customer.orders.reorder': 'Encomendar de novo',
  'customer.orders.view_all_orders': 'Ver todas as encomendas',
  'customer.orders.view_order': 'Ver encomenda',
  'customer.addresses.title': 'Moradas',
  'customer.addresses.default': 'Morada predefinida',
  'customer.addresses.add_new': 'Adicionar nova morada',
  'customer.addresses.edit_address': 'Editar morada',
  'customer.addresses.return_to_account': 'Voltar à conta',
  'customer.addresses.first_name': 'Nome próprio',
  'customer.addresses.last_name': 'Apelido',
  'customer.addresses.company': 'Empresa',
  'customer.addresses.address1': 'Morada 1',
  'customer.addresses.address2': 'Morada 2',
  'customer.addresses.city': 'Cidade',
  'customer.addresses.phone': 'Telefone',
  'customer.addresses.set_default': 'Definir como morada predefinida',
  'customer.addresses.add': 'Adicionar morada',
  'customer.addresses.update': 'Atualizar morada',
  'customer.addresses.cancel': 'Cancelar',
  'customer.addresses.edit': 'Editar morada',
  'customer.addresses.delete': 'Eliminar morada',
  'customer.addresses.delete_confirm': 'Tem a certeza de que quer eliminar esta morada?',
  'customer.order.title': 'Encomenda {{ name }}',
  'customer.order.date_html': 'Efetuada a {{ date }}',
  'customer.order.cancelled_html': 'Encomenda cancelada a {{ date }}',
  'customer.order.cancelled_reason': 'Motivo: {{ reason }}',
  'customer.order.billing_address': 'Morada de faturação',
  'customer.order.payment_status': 'Estado do pagamento',
  'customer.order.shipping_address': 'Morada de envio',
  'customer.order.fulfillment_status': 'Estado do envio',
  'customer.order.discount': 'Desconto',
  'customer.order.shipping': 'Envio',
  'customer.order.tax': 'IVA',
  'customer.order.product': 'Produto',
  'customer.order.sku': 'SKU',
  'customer.order.price': 'Preço',
  'customer.order.quantity': 'Quantidade',
  'customer.order.total': 'Total',
  'customer.order.fulfilled_at_html': 'Enviada a {{ date }}',
  'customer.order.track_shipment': 'Seguir envio',
  'customer.order.subtotal': 'Subtotal',
  'customer.order.total_duties': 'Taxas alfandegárias',
  // — gift cards —
  'gift_cards.issued.title': 'Aqui está o seu cartão-oferta de {{ value }} para {{ shop }}!',
  'gift_cards.issued.subtext': 'O seu cartão-oferta',
  'gift_cards.issued.gift_card_code': 'Código do cartão-oferta',
  'gift_cards.issued.shop_link': 'Continuar a comprar',
  'gift_cards.issued.remaining_html': 'Saldo restante: {{ balance }}',
  'gift_cards.issued.add_to_apple_wallet': 'Adicionar à Apple Wallet',
  'gift_cards.issued.qr_image_alt': 'Código QR — digitalize para usar o cartão-oferta',
  'gift_cards.issued.copy_code': 'Copiar código',
  'gift_cards.issued.expired': 'Expirado',
  'gift_cards.issued.copy_code_success': 'Código copiado',
  'gift_cards.issued.print_gift_card': 'Imprimir',
  // — acessibilidade —
  'accessibility.close': 'Fechar',
  'accessibility.back': 'Voltar',
  'accessibility.skip_to_text': 'Ir para o conteúdo',
  'accessibility.skip_to_product_info': 'Ir para a informação do produto',
  'accessibility.refresh_page': 'Escolher uma seleção atualiza a página inteira.',
  'accessibility.loading': 'A carregar',
  'accessibility.link_messages.new_window': 'Abre numa nova janela.',
  'accessibility.link_messages.external': 'Abre um site externo.',
  'accessibility.email': 'E-mail',
  'accessibility.phone_number': 'Telefone',
  'accessibility.star_reviews_info': '{{ rating_value }} de {{ rating_max }} estrelas',
  'accessibility.unit_price_separator': 'por',
  'accessibility.next_button': 'Seguinte',
  'accessibility.prev_button': 'Anterior',
  'accessibility.image_link': 'Ligação de imagem',
  'accessibility.plus': 'Mais',
  'accessibility.minus': 'Menos',
  'accessibility.remove': 'Remover',
  'accessibility.open': 'Abrir',
  'accessibility.default_alt': 'Imagem',
  'product_labels_and_badges.preview_label': 'Pré-visualização dos selos',
  // — produto: destinatário de oferta (restantes EN) —
  'products.product.recipient.name_label': 'Nome do destinatário (opcional)',
  'products.product.recipient.name': 'Nome',
  'products.product.recipient.message_label': 'Mensagem (opcional)',
  'products.product.recipient.message': 'Mensagem',
  'products.product.recipient.max_characters': 'Máximo de {{ max_chars }} caracteres',
  'products.product.recipient.send_on': 'AAAA-MM-DD',
  'products.product.recipient.send_on_label': 'Enviar em (opcional)',
  'products.product.recipient.message_send_on': 'A data de envio tem de ser nos próximos 90 dias',
  'products.product.recipient.message_email_invalid': 'O e-mail é inválido',
  'products.product.recipient.message_email_required': 'O e-mail é obrigatório',
  // — facetas/filtros —
  'products.facets.match_all': 'Corresponder a todos',
  'products.facets.filters_selected.one': '{{ count }} selecionado',
  'products.facets.filters_selected.other': '{{ count }} selecionados',
  'products.facets.max_price': 'O preço mais alto é {{ price }}',
  'products.facets.reset': 'Repor',
  'products.facets.button_quick_view': 'Vista rápida',
  'products.facets.gift_wrapping_label': 'Embrulhar para oferta',
  'products.facets.back_in_stock_alert': 'Avisem-me quando este produto voltar a estar disponível.',
  'products.facets.file_upload': 'Arraste o ficheiro para aqui, ou Procurar',
  'products.facets.file_upload_info': 'Tamanho máximo do ficheiro: 5 MB',
  'products.facets.msg_error_max_file': 'O ficheiro é demasiado grande (máx. 5 MB).',
  'products.facets.choose_here': 'Selecionar opção',
  'products.facets.file': 'FICHEIRO',
  'products.facets.product_card.quick_view_button': 'Vista rápida',
  'products.facets.apply': 'Aplicar',
  'products.modal.label': 'Galeria de imagens',
  // — meses —
  'date_time.month.January': 'janeiro',
  'date_time.month.February': 'fevereiro',
  'date_time.month.March': 'março',
  'date_time.month.April': 'abril',
  'date_time.month.May': 'maio',
  'date_time.month.June': 'junho',
  'date_time.month.July': 'julho',
  'date_time.month.August': 'agosto',
  'date_time.month.September': 'setembro',
  'date_time.month.October': 'outubro',
  'date_time.month.November': 'novembro',
  'date_time.month.December': 'dezembro',
  // — envio —
  'shipping.no_rates': 'Não enviamos para este destino.',
  'shipping.single_rate': 'Há uma tarifa de envio para este destino:',
  'shipping.multiple_rates': 'Há várias tarifas de envio para este destino:',
  // — blogue —
  'blogs.recent_posts': 'Artigos recentes',
  'blogs.show': 'Mostrar',
  'blogs.per_page': 'por página',
  'blogs.all_articles': 'Todos os artigos',
  'blogs.article.blog': 'Blogue',
  'blogs.article.read_more_title': 'Ler mais: {{ title }}',
  'blogs.article.comments.one': '{{ count }} comentário',
  'blogs.article.comments.other': '{{ count }} comentários',
  'blogs.article.moderated': 'Os comentários precisam de ser aprovados antes de serem publicados.',
  'blogs.article.comment_form_title': 'Deixe um comentário',
  'blogs.article.name': 'Nome',
  'blogs.article.email': 'E-mail',
  'blogs.article.message': 'Comentário',
  'blogs.article.post': 'Publicar comentário',
  'blogs.article.back_to_blog': 'Voltar ao blogue',
  'blogs.article.share': 'Partilhar este artigo',
  'blogs.article.success': 'O seu comentário foi publicado. Obrigado!',
  'blogs.article.success_moderated': 'O seu comentário foi enviado. Será publicado após aprovação, pois o blogue é moderado.',
  'blogs.article.send_comment': 'Enviar',
  'blogs.article.side_bar': 'Barra lateral',
  // — encomenda em massa —
  'bulk_order.search_placeholder': 'Pesquisar por nome do produto, variante ou SKU...',
  'bulk_order.popup_title': 'Selecionar produtos',
  'bulk_order.add_product': 'Adicionar produto',
  'bulk_order.add_to_cart': 'Adicionar ao carrinho',
  'bulk_order.remove_all': 'Remover tudo',
  'bulk_order.no_results': 'Nenhum produto encontrado para “{{ terms }}”. Verifique a ortografia ou use outra palavra.',
  'bulk_order.empty_description': 'Encomende em quantidade com nome do produto, variante, SKU e visibilidade de stock.',
  'bulk_order.column_product': 'Produto',
  'bulk_order.column_price': 'Preço',
  'bulk_order.column_quantity': 'Quantidade',
  'bulk_order.column_total': 'Total',
  'bulk_order.stock.in_stock': 'Em stock',
  'bulk_order.stock.sold_out': 'Esgotado',
  'bulk_order.stock.only_n_left': 'Só restam {{ count }}',
  'bulk_order.errors.out_of_stock_item': 'Remova os artigos esgotados antes de adicionar ao carrinho.',
  'bulk_order.errors.add_to_cart_failed': 'Ocorreu um erro. Tente novamente.',
  'bulk_order.searching': 'A pesquisar...',
  'bulk_order.results_found': '{{ count }} produtos encontrados',
  'bulk_order.quantity_label': 'Quantidade',
  'bulk_order.remove_item': 'Remover artigo',
  // — comparador/seletor de loja —
  'product_comparison.view_details': 'Ver detalhes completos',
  'product_comparison.clear_all': 'Limpar tudo',
  'product_comparison.heading_drawer': 'Comparar produtos',
  'product_comparison.button_drawer': 'Comparar',
  'product_comparison.tooltip_added_to_compare': 'Adicionado à comparação',
  'product_comparison.tooltip_limit_products': 'Limite de count_product produtos atingido',
  'product_comparison.tooltip_limit_products_drawer': 'Só pode comparar até count_product produtos',
  'store_selector.available': 'Disponível para levantamento em ',
  'store_selector.out_of_stock': 'Esgotado em ',
  'store_selector.choose_your_location': 'Escolha a sua localização',
  'store_selector.set_as_my_store': 'Definir como a minha loja',
  'store_selector.location_name': 'Nome da loja',
  'store_selector.default_label': 'Localizador de lojas',
};

// Templates JSON (match por prefixo de key, sem o :hash)
const INDEX = {
  'section.index.json.hero_slideshow_horizontal_k9znhC.image_overlay_slide_Bz7erM.image_subheading_1': 'Subtítulo',
  'section.index.json.hero_slideshow_horizontal_k9znhC.image_overlay_slide_Bz7erM.image_heading_1': 'Título',
  'section.index.json.hero_slideshow_horizontal_k9znhC.image_overlay_slide_Bz7erM.image_subheading_2': 'Subtítulo',
  'section.index.json.hero_slideshow_horizontal_k9znhC.image_overlay_slide_Bz7erM.image_heading_2': 'Título',
  'section.index.json.featured_collections_TMddjB.countdown_text': 'Por tempo limitado',
};
const LIST_COLLECTIONS = {
  'section.list-collections.json.main.title': 'Coleções',
};
const PASSWORD = {
  'section.password.json.main.heading_3xt4ax.heading': 'Brevemente',
  'section.password.json.main.paragraph_TqWVK8.text': '<p>A nova loja online da Aromas da Tarde está quase pronta.</p>',
};
const PAGE = {
  'section.page.json.text_columns_with_icons_3K6Udx.column_kyjTbM.title': 'Envio seguro',
  'section.page.json.text_columns_with_icons_3K6Udx.column_kyjTbM.text': '<p>Embalagem própria para o transporte de garrafas</p>',
  'section.page.json.text_columns_with_icons_3K6Udx.column_AVMUAM.title': 'Produtos autênticos',
  'section.page.json.text_columns_with_icons_3K6Udx.column_AVMUAM.text': '<p>Marcas e distribuidores oficiais</p>',
  'section.page.json.text_columns_with_icons_3K6Udx.column_FMPrnn.title': 'Compra segura',
  'section.page.json.text_columns_with_icons_3K6Udx.column_FMPrnn.text': '<p>Pagamento protegido e apoio ao cliente</p>',
  'section.page.json.text_columns_with_icons_3K6Udx.column_fih8h7.title': 'Venda responsável',
  'section.page.json.text_columns_with_icons_3K6Udx.column_fih8h7.text': '<p>Venda proibida a menores de 18 anos</p>',
};
const CONTACT = {
  'section.page.contact.json.hero_slideshow_horizontal_PMALbL.image_overlay_slide_gmpdiT.heading': 'Como podemos ajudar?',
  'section.page.contact.json.hero_slideshow_horizontal_PMALbL.image_overlay_slide_gmpdiT.text': '<p>Fale connosco — envie-nos um e-mail ou use o formulário abaixo.</p>',
  'section.page.contact.json.hero_slideshow_horizontal_PMALbL.image_overlay_slide_gmpdiT.image_subheading_1': 'Subtítulo',
  'section.page.contact.json.hero_slideshow_horizontal_PMALbL.image_overlay_slide_gmpdiT.image_heading_1': 'Título',
  'section.page.contact.json.hero_slideshow_horizontal_PMALbL.image_overlay_slide_gmpdiT.image_subheading_2': 'Subtítulo',
  'section.page.contact.json.hero_slideshow_horizontal_PMALbL.image_overlay_slide_gmpdiT.image_heading_2': 'Título',
  'section.page.contact.json.rich_text_jKy6VD.heading_gK3BFk.heading': 'Aromas da Tarde',
  'section.page.contact.json.rich_text_jKy6VD.text_wmgX3m.text': '<p>Dúvidas ou pedidos? Preencha o formulário e entraremos em contacto.</p>',
  'section.page.contact.json.rich_text_jKy6VD.text_wmgX3m.read_more_label': 'Ler mais',
  'section.page.contact.json.rich_text_jKy6VD.text_wmgX3m.see_less_label': 'Ver menos',
  'section.page.contact.json.rich_text_jKy6VD.button_FaezkP.button_label': 'Contactar',
  'section.page.contact.json.rich_text_jKy6VD.caption_hJUER4.caption': 'Fale connosco',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_Nd6X4f.title': 'Seguir encomenda',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_Nd6X4f.text': '<p>Acompanhe o progresso da sua entrega</p>',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_HwHBGz.title': 'Perguntas frequentes',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_HwHBGz.text': '<p>A maioria das dúvidas tem resposta aqui</p>',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_C4bbwT.title': 'A nossa garrafeira',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_C4bbwT.text': '<p>Conheça a Aromas da Tarde</p>',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_aQ7WtU.title': 'Apoio ao cliente',
  'section.page.contact.json.text_columns_with_icons_Jqqxad.column_aQ7WtU.text': '<p>Coloque-nos a sua questão</p>',
  'section.page.contact.json.contact_form_Cn9bjT.heading': 'Fale connosco',
  'section.page.contact.json.contact_form_Cn9bjT.button_label': 'Enviar',
  'section.page.contact.json.contact_form_Cn9bjT.success_message': 'Obrigado pelo contacto. Responderemos o mais depressa possível.',
  'section.page.contact.json.contact_form_Cn9bjT.contact_heading': 'Informações de contacto',
  'section.page.contact.json.contact_form_Cn9bjT.name_VWeDpC.heading': 'Nome',
  'section.page.contact.json.contact_form_Cn9bjT.email_j6GVwH.heading': 'E-mail',
  'section.page.contact.json.contact_form_Cn9bjT.phone_PjRHBy.heading': 'Telefone',
  'section.page.contact.json.contact_form_Cn9bjT.message_tiGUJT.heading': 'Mensagem',
};
const BLOG = {
  'section.blog.json.main.button_read_more_label': 'Ler artigo',
  'section.blog.json.promotional_collections_hryCL4.subheading': 'Destaques',
  'section.blog.json.promotional_collections_hryCL4.heading': 'Coleções em destaque',
  'section.blog.json.promotional_collections_hryCL4.collection_WWhntr.heading': 'Coleção em destaque',
  'section.blog.json.promotional_collections_hryCL4.collection_WWhntr.text': '<p>Descubra</p>',
  'section.blog.json.promotional_collections_hryCL4.collection_WWhntr.countdown_text': 'Por tempo limitado',
  'section.blog.json.promotional_collections_hryCL4.collection_9h8PyV.heading': 'Coleção em destaque',
  'section.blog.json.promotional_collections_hryCL4.collection_9h8PyV.text': '<p>Descubra</p>',
  'section.blog.json.promotional_collections_hryCL4.collection_9h8PyV.countdown_text': 'Por tempo limitado',
  'section.blog.json.promotional_collections_hryCL4.collection_9XVPWy.heading': 'Coleção em destaque',
  'section.blog.json.promotional_collections_hryCL4.collection_9XVPWy.text': '<p>Descubra</p>',
  'section.blog.json.promotional_collections_hryCL4.collection_9XVPWy.countdown_text': 'Por tempo limitado',
};
const ARTICLE = {
  'section.article.json.side_bar_VTqCi9.table_of_content_VxFwkL.table_of_contents_title': 'Índice',
  'section.article.json.side_bar_VTqCi9.highlight_text_7gWkq3.title': 'Nota',
  'section.article.json.side_bar_VTqCi9.highlight_text_7gWkq3.text': '<p>Mais informações sobre este artigo</p>',
  'section.article.json.side_bar_VTqCi9.promotion_banner_UjW8Tj.heading': 'Destaque',
  'section.article.json.side_bar_VTqCi9.promotion_banner_UjW8Tj.content': '<p>As grandes marcas de whisky, gin, rum e vinhos.</p>',
  'section.article.json.side_bar_VTqCi9.product_aiJYfw.heading': 'Produtos neste artigo',
  'section.article.json.side_bar_VTqCi9.blog_tag_h74FdP.heading_tag': 'Etiquetas',
};

const PLANOS = [
  { nome: 'locale-content', id: `gid://shopify/OnlineStoreThemeLocaleContent/${T}`, porKey: LC, exato: true },
  { nome: 'index', id: `gid://shopify/OnlineStoreThemeJsonTemplate/index?theme_id=${T}`, porKey: INDEX },
  { nome: 'list-collections', id: `gid://shopify/OnlineStoreThemeJsonTemplate/list-collections?theme_id=${T}`, porKey: LIST_COLLECTIONS },
  { nome: 'password', id: `gid://shopify/OnlineStoreThemeJsonTemplate/password?theme_id=${T}`, porKey: PASSWORD },
  { nome: 'page', id: `gid://shopify/OnlineStoreThemeJsonTemplate/page?theme_id=${T}`, porKey: PAGE },
  { nome: 'page.contact', id: `gid://shopify/OnlineStoreThemeJsonTemplate/page.contact?theme_id=${T}`, porKey: CONTACT },
  { nome: 'blog', id: `gid://shopify/OnlineStoreThemeJsonTemplate/blog?theme_id=${T}`, porKey: BLOG },
  { nome: 'article', id: `gid://shopify/OnlineStoreThemeJsonTemplate/article?theme_id=${T}`, porKey: ARTICLE },
];

(async () => {
  const r = await fetch(`https://${shopify.shop}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: shopify.clientId, client_secret: shopify.clientSecret, grant_type: 'client_credentials' }),
  });
  const tok = (await r.json()).access_token;
  const gql = async (query, variables) => {
    const g = await fetch(`https://${shopify.shop}/admin/api/2025-07/graphql.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': tok },
      body: JSON.stringify({ query, variables }),
    });
    const d = await g.json();
    if (d.errors) throw new Error(JSON.stringify(d.errors));
    return d.data;
  };

  let totalOk = 0, totalAlvos = 0;
  for (const plano of PLANOS) {
    const d = await gql(
      `query($ids:[ID!]!){ translatableResourcesByIds(resourceIds:$ids, first:1){
          nodes{ resourceId translatableContent{ key value digest }
            translations(locale:"${LOCALE}"){ key value } } } }`,
      { ids: [plano.id] },
    );
    const node = d.translatableResourcesByIds.nodes[0];
    if (!node) { console.log(`${plano.nome}: recurso não encontrado!`); continue; }
    const ja = new Map(node.translations.map((t) => [t.key, t.value]));

    const alvos = [];
    for (const c of node.translatableContent) {
      const base = plano.exato ? c.key : c.key.replace(/:[a-z0-9]+$/i, '');
      const pt = plano.porKey[base];
      if (pt === undefined || ja.get(c.key) === pt) continue;
      alvos.push({ key: c.key, pt, digest: c.digest });
    }
    totalAlvos += alvos.length;
    console.log(`${plano.nome}: ${alvos.length} a registar`);
    if (!WRITE) continue;

    for (let i = 0; i < alvos.length; i += BATCH) {
      const lote = alvos.slice(i, i + BATCH);
      const res = await gql(
        `mutation($id:ID!,$tr:[TranslationInput!]!){ translationsRegister(resourceId:$id, translations:$tr){
            userErrors{ field message } translations{ key } } }`,
        { id: plano.id, tr: lote.map((a) => ({ key: a.key, value: a.pt, locale: LOCALE, translatableContentDigest: a.digest })) },
      );
      const ue = res.translationsRegister.userErrors;
      if (ue.length) console.log('  ✗ erros:', JSON.stringify(ue));
      totalOk += res.translationsRegister.translations.length;
    }
  }
  console.log(WRITE ? `\nTOTAL registadas: ${totalOk}/${totalAlvos}` : `\nDry-run: ${totalAlvos} alvos. Correr com --write.`);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
