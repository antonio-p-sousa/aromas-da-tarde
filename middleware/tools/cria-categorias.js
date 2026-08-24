// Cria/ajusta as coleções conforme a lista do cliente (24 ago).
// Smart collections por product type (REST, published). Idempotente.
const { shopify } = require('../src/env');

// título → product type PHC (null = tipo previsto, ainda sem produtos)
const NOVAS = {
  'Absinto': 'ABSINTO',
  'Acessórios': 'ACESSÓRIOS',
  'Aguardentes': 'AGUARDENTES',
  'Armagnac': 'ARMAGNAC',
  'Bitters': 'BITTERS',
  'Caixas': 'CAIXAS',
  'Calvados': 'CALVADOS',
  'Champagne': 'CHAMPAGNE',
  'Conjuntos': 'AA - CONJUNTOS',
  'Espumantes': 'ESPUMANTE (MOUSSEUX)',
  'Gourmet': 'ALIMENTAR',
  'Moscatel': 'MOSCATEL',
  'Pisco': 'PISCO',
  'Sotol': 'SOTOL',
  'Vermute': 'VERMUTE',
  'Xérez': 'XÉRE´S',
};

(async () => {
  const r = await fetch(`https://${shopify.shop}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: shopify.clientId, client_secret: shopify.clientSecret, grant_type: 'client_credentials' }),
  });
  const tok = (await r.json()).access_token;
  const rest = async (metodo, caminho, corpo) => {
    const res = await fetch(`https://${shopify.shop}/admin/api/2025-07/${caminho}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': tok },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const d = await res.json();
    if (!res.ok) throw new Error(`${caminho}: ${res.status} ${JSON.stringify(d).slice(0, 200)}`);
    return d;
  };

  // existentes (para idempotência)
  const ex = await rest('GET', 'smart_collections.json?limit=250&fields=id,title,rules');
  const porTitulo = new Map(ex.smart_collections.map((c) => [c.title.toLowerCase(), c]));

  for (const [titulo, tipo] of Object.entries(NOVAS)) {
    if (porTitulo.has(titulo.toLowerCase())) { console.log(`= ${titulo} (já existe)`); continue; }
    const d = await rest('POST', 'smart_collections.json', {
      smart_collection: {
        title: titulo, published: true,
        rules: [{ column: 'type', relation: 'equals', condition: tipo }],
      },
    });
    console.log(`+ ${titulo} [type=${tipo}] → id ${d.smart_collection.id}`);
  }

  // renomear Apert./Degestivos → Aperitivos/Digestivos
  const apert = porTitulo.get('apert./degestivos');
  if (apert) {
    await rest('PUT', `smart_collections/${apert.id}.json`, { smart_collection: { id: apert.id, title: 'Aperitivos/Digestivos' } });
    console.log('~ Apert./Degestivos → Aperitivos/Digestivos');
  }

  // Vinhos: incluir VINHO DA MADEIRA (rules type=VINHOS OR type=VINHO DA MADEIRA, disjuntivo)
  const vinhos = porTitulo.get('vinhos');
  if (vinhos && !vinhos.rules.some((r2) => r2.condition === 'VINHO DA MADEIRA')) {
    await rest('PUT', `smart_collections/${vinhos.id}.json`, {
      smart_collection: {
        id: vinhos.id, disjunctive: true,
        rules: [
          { column: 'type', relation: 'equals', condition: 'VINHOS' },
          { column: 'type', relation: 'equals', condition: 'VINHO DA MADEIRA' },
        ],
      },
    });
    console.log('~ Vinhos: + VINHO DA MADEIRA');
  }
  console.log('\nOK.');
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
