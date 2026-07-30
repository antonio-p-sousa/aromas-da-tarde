// Substitui o conteúdo demo (mercearia EN) dos templates do Various por copy
// de garrafeira em pt-PT, via Translations API (a montra serve o locale pt-PT).
// Os blocos continuam no tema (apagar é tarefa de editor); isto muda o que se vê.
// Uso: node tools/traduz-secoes.js            (dry-run)
//      node tools/traduz-secoes.js --write
const { shopify } = require('../src/env');
const T = '193307574598';
const LOCALE = 'pt-PT';
const WRITE = process.argv.includes('--write');
const BATCH = 25;

const RECURSOS = {
  produto: `gid://shopify/OnlineStoreThemeJsonTemplate/product?theme_id=${T}`,
  colecao: `gid://shopify/OnlineStoreThemeJsonTemplate/collection?theme_id=${T}`,
  header: `gid://shopify/OnlineStoreThemeSectionGroup/header-group?theme_id=${T}`,
};

// ---- Traduções por PREFIXO de key (os sufixos ":hash" variam) ----
const PRODUTO = {
  'section.product.json.main.text_XjU4Qf.text':
    '<p><strong>Porquê comprar na Aromas da Tarde:</strong></p><ul><li>Garrafas originais e seladas</li><li>Marcas e distribuidores oficiais</li><li>Embalagem protegida para transporte</li></ul>',
  'section.product.json.main.text_with_icon_RGF9RC.text':
    '<p><strong>Devoluções</strong><br/>Consulte a nossa política de devolução e reembolso no rodapé da loja.</p>',
  'section.product.json.main.text_with_icon_2.text': '<p>Envio para todo o Portugal continental</p>',
  'section.product.json.main.text_with_icon_3.text': '<p>Compra segura e pagamento protegido</p>',
  'section.product.json.main.text_with_icon_4.text': '<p>Beba com moderação. Venda proibida a menores de 18 anos.</p>',
  'section.product.json.main.variant_picker.size_chart_label': 'Tabela de tamanhos',
  'section.product.json.main.variant_picker.associated_option_name': 'Tamanho',
  'section.product.json.main.buy_buttons.preorder_button_label': 'Pré-encomenda',
  'section.product.json.main.buy_buttons.preorder_message': '<p>Este artigo está disponível por pré-encomenda.</p>',
  'section.product.json.main.estimate_delivery_MTTqQU.message':
    '<p>Entrega estimada entre <strong>earliest_delivery_date e latest_delivery_date.</strong></p>',
  'section.product.json.main.estimate_delivery_MTTqQU.tooltip_content':
    'Os prazos podem variar consoante a transportadora e a morada de entrega.',
  'section.product.json.main.collapsible_tab_HXkwRD.heading': 'Informação adicional',
  'section.product.json.main.collapsible_tab_HXkwRD.tab_content':
    '<p>Imagens ilustrativas — a rotulagem e o lote podem variar. Artigos sujeitos à disponibilidade de stock da garrafeira.</p>',
  'section.product.json.main.collapsible_tab_UcxFJt.heading': 'Envios e devoluções',
  'section.product.json.main.collapsible_tab_UcxFJt.tab_content':
    '<p>Enviamos para todo o Portugal continental, em embalagem própria para garrafas. As condições de devolução estão na política de devolução e reembolso, no rodapé da loja.</p>',
  'section.product.json.product_details_Hp67jL.description_bfTdVz.heading': 'Sobre este artigo',
  'section.product.json.product_details_Hp67jL.specifications_WqUq9M.heading': 'Informação do produto',
  'section.product.json.product_details_Hp67jL.specifications_WqUq9M.text':
    '<p>Os detalhes de cada garrafa constam da descrição e do rótulo.</p>',
  'section.product.json.product_details_Hp67jL.specifications_WqUq9M.table_detail':
    '<p>Detalhes disponíveis na descrição do artigo.</p>',
  'section.product.json.product_details_Hp67jL.rich_text_RJXmVj.heading': 'Autenticidade garantida',
  'section.product.json.product_details_Hp67jL.rich_text_RJXmVj.text':
    '<p>Vendemos apenas produtos autênticos, de marcas e distribuidores verificados.</p>',
  'section.product.json.collection_list_KHWkd8.heading': 'Explore por categoria',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_4eM4BD__heading_gqbq4e.heading': 'A nossa garrafeira',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_4eM4BD__text_mqfVKg.text':
    '<p>Uma seleção de destilados e vinhos escolhida a dedo pela Aromas da Tarde.</p>',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_Eeyqa8__heading_EXCNf4.heading': 'Ofertas sem complicações',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_Eeyqa8__text_CzzRRh.text':
    '<p>Uma garrafa é sempre um bom presente — fale connosco para sugestões.</p>',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_hJDkr9__heading_P3TKgc.heading': 'Conservação',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_hJDkr9__text_Etzzz9.text':
    '<p>Conserve as garrafas em local fresco, seco e ao abrigo da luz.</p>',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_9YQwKb__heading_CD68UM.heading': 'Stock real',
  'section.product.json.section_items_list_768Vzp.items-list-static__group_9YQwKb__text_d8Afk3.text':
    '<p>Loja sincronizada com o stock real da nossa garrafeira.</p>',
  'section.product.json.product_components_ETpzHT.heading': 'Prova e conservação',
  'section.product.json.product_components_ETpzHT.text': '<p>Sugestões gerais para aproveitar melhor cada garrafa</p>',
  'section.product.json.product_components_ETpzHT.component_VBXeyq.heading': 'Aroma',
  'section.product.json.product_components_ETpzHT.component_VBXeyq.text': '<p>Sirva à temperatura certa para libertar os aromas.</p>',
  'section.product.json.product_components_ETpzHT.component_Fbhfj3.heading': 'Sabor',
  'section.product.json.product_components_ETpzHT.component_Fbhfj3.text': '<p>Prove primeiro puro; ajuste depois a gosto.</p>',
  'section.product.json.product_components_ETpzHT.component_mp8qwe.heading': 'Copo',
  'section.product.json.product_components_ETpzHT.component_mp8qwe.text': '<p>O copo adequado faz diferença na prova.</p>',
  'section.product.json.product_components_ETpzHT.component_HcHRDR.heading': 'Harmonização',
  'section.product.json.product_components_ETpzHT.component_HcHRDR.text': '<p>Combine com frutos secos, queijos ou chocolate.</p>',
  'section.product.json.product_components_ETpzHT.component_WVBEww.heading': 'Moderação',
  'section.product.json.product_components_ETpzHT.component_WVBEww.text': '<p>Beba com moderação. Venda proibida a menores de 18 anos.</p>',
  'section.product.json.product_recommendations_hcJBTH.heading': 'Também poderá gostar',
  'section.product.json.recently_viewed_Pq7G8H.heading': 'Vistos recentemente',
};

const COLECAO = {
  'section.collection.json.product-grid.promotion_block_gNqNQ3.heading': 'Destaque',
  'section.collection.json.product-grid.promotion_block_gNqNQ3.button_label': 'Comprar agora',
  'section.collection.json.product-grid.promotion_block_9YRhPb.heading': 'Destaque',
  'section.collection.json.product-grid.promotion_block_9YRhPb.content':
    '<p>As grandes marcas de whisky, gin, rum e vinhos, com envio para todo o Portugal continental.</p>',
  'section.collection.json.related_collection_eVkWxw.heading': 'Coleções relacionadas',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_hFCdN4__heading_L44TmB.heading':
    'As grandes marcas, [entregues em sua casa]',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_hFCdN4__text_NkFMWn.text':
    '<p>Envio para todo o Portugal continental.</p>',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_FCFgcU__group_9BrqCz__group_h7xaKh__heading_qaepic.heading':
    'Qualidade a preços justos',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_FCFgcU__group_9BrqCz__group_h7xaKh__text_HQ9YcN.text':
    '<p>Das destilarias mais conhecidas às pérolas difíceis de encontrar.</p>',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_FCFgcU__group_MJjRjA__group_YihPYH__heading_QeeVdG.heading':
    'Compra segura',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_FCFgcU__group_MJjRjA__group_YihPYH__text_qEJE67.text':
    '<p>Pagamento protegido e apoio ao cliente.</p>',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_FCFgcU__group_QKpif6__group_YNywKX__heading_kNTaCq.heading':
    'Garrafeira de confiança',
  'section.collection.json.section_items_list_B7XpwY.items-list-static__group_dQUhU6__group_YAd8z8__group_FCFgcU__group_QKpif6__group_YNywKX__text_D3kxWU.text':
    '<p>Marcas premiadas de todo o mundo.</p>',
  'section.collection.json.faq_yhKA8i.heading': 'Perguntas frequentes',
  'section.collection.json.faq_yhKA8i.additional_information':
    '<p>Tem outra dúvida? Fale connosco através da página de contactos.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_hAVWDN.heading': 'Os produtos são originais?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_hAVWDN.row_content':
    '<p>Sim. Trabalhamos apenas com marcas e distribuidores oficiais.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_ykMaaj.heading': 'Enviam para todo o país?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_ykMaaj.row_content':
    '<p>Enviamos para todo o Portugal continental. Para as ilhas, contacte-nos antes de encomendar.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_9CXcQT.heading': 'Como são embaladas as garrafas?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_9CXcQT.row_content':
    '<p>Cada garrafa segue em embalagem protegida, própria para o transporte de vidro.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_4nmij8.heading': 'É preciso ter mais de 18 anos?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_4nmij8.row_content':
    '<p>Sim. A venda de bebidas alcoólicas é proibida a menores de 18 anos.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_yCJxTL.heading': 'Quanto tempo demora a entrega?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_yCJxTL.row_content':
    '<p>O prazo estimado é apresentado no checkout e pode variar consoante a transportadora.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_PpEHTR.heading': 'Que métodos de pagamento aceitam?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_PpEHTR.row_content':
    '<p>Os métodos de pagamento disponíveis são apresentados no checkout, num ambiente seguro.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_dDVKzR.heading': 'Posso devolver um artigo?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_dDVKzR.row_content':
    '<p>Sim, nos termos da política de devolução e reembolso disponível no rodapé da loja.</p>',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_AVGrAT.heading': 'Como acompanho a minha encomenda?',
  'section.collection.json.faq_yhKA8i.frequently_asked_question_AVGrAT.row_content':
    '<p>Receberá um e-mail de confirmação com os detalhes do envio da sua encomenda.</p>',
};

const HEADER = {
  'section.sections/header-group.json.drawer_menu_XTcfKK.drawer_menu_p6Gt4b.view_all_title': 'Ver tudo',
  'section.sections/header-group.json.drawer_menu_XTcfKK.drawer_menu_p6Gt4b.button_label_1': 'Comprar agora',
  'section.sections/header-group.json.drawer_menu_XTcfKK.drawer_menu_p6Gt4b.button_label_2': 'Comprar agora',
};

// Por VALOR (apanha todos os Read more/See less espalhados)
const POR_VALOR = new Map([
  ['read more', 'Ler mais'],
  ['see less', 'Ver menos'],
  ['shop now', 'Comprar agora'],
]);

const PLANOS = [
  { nome: 'produto', id: RECURSOS.produto, porKey: PRODUTO },
  { nome: 'colecao', id: RECURSOS.colecao, porKey: COLECAO },
  { nome: 'header', id: RECURSOS.header, porKey: HEADER },
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
    const semMatch = new Set(Object.keys(plano.porKey));
    for (const c of node.translatableContent) {
      const base = c.key.replace(/:[a-z0-9]+$/i, '');
      let pt = plano.porKey[base];
      if (pt === undefined) pt = POR_VALOR.get(String(c.value).trim().toLowerCase());
      else semMatch.delete(base);
      if (pt === undefined || ja.get(c.key) === pt) continue;
      alvos.push({ key: c.key, en: String(c.value).slice(0, 50), pt, digest: c.digest });
    }

    console.log(`\n== ${plano.nome}: ${alvos.length} traduções a registar`);
    for (const a of alvos) console.log(`  · ${a.key.slice(0, 90)}\n      "${a.en.replace(/\s+/g, ' ')}" → "${a.pt.slice(0, 60)}"`);
    for (const k of semMatch) console.log(`  ⚠ sem correspondência no tema: ${k}`);
    if (!WRITE) continue;

    let ok = 0;
    for (let i = 0; i < alvos.length; i += BATCH) {
      const lote = alvos.slice(i, i + BATCH);
      const res = await gql(
        `mutation($id:ID!,$tr:[TranslationInput!]!){ translationsRegister(resourceId:$id, translations:$tr){
            userErrors{ field message } translations{ key } } }`,
        { id: plano.id, tr: lote.map((a) => ({ key: a.key, value: a.pt, locale: LOCALE, translatableContentDigest: a.digest })) },
      );
      const ue = res.translationsRegister.userErrors;
      if (ue.length) console.log('  ✗ erros:', JSON.stringify(ue));
      ok += res.translationsRegister.translations.length;
    }
    console.log(`  → registadas ${ok}/${alvos.length}`);
  }
  if (!WRITE) console.log('\nDry-run. Correr com --write para registar.');
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
