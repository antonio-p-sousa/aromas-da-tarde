// Camada de leitura do PHC (SQL Server). REGRA ABSOLUTA: só SELECTs.
// A BD é de produção do cliente. Nada de INSERT/UPDATE/DELETE/DDL.
const sql = require('mssql');
const { phc } = require('./env');
const { computePrice } = require('./price');

// Guarda de segurança: recusa qualquer query que não seja um SELECT puro.
function assertSelectOnly(q) {
  const clean = q.replace(/--[^\n]*/g, '').trim().toLowerCase();
  if (!/^select\b/.test(clean)) {
    throw new Error('phc.js: apenas SELECT é permitido (BD de produção). Query bloqueada.');
  }
  if (/\b(insert|update|delete|merge|drop|alter|create|truncate|exec|execute|grant|revoke)\b/.test(clean)) {
    throw new Error('phc.js: palavra-chave de escrita detetada. Query bloqueada.');
  }
}

// Query dos artigos publicáveis. Baseada na query do parceiro que gere o PHC,
// acrescentando o stock e a taxa de IVA resolvida (para calcular o preço final).
const ARTIGOS_SQL = `
select
  ref,
  design,
  faminome,
  epv1,
  IVA1INCL,
  tabiva,
  isnull((select taxa from taxasiva (nolock) where taxasiva.codigo = st.tabiva), 0) as iva,
  usr1,
  u_un,
  codigo as cod_barras,
  usr5,
  u_newst,
  u_novi,
  u_fest,
  u_exclu,
  stock
from st (nolock)
where inactivo = 0 and vaiwww = 1
order by ref`;

let pool = null;
async function getPool() {
  if (!pool) pool = await sql.connect(phc);
  return pool;
}

async function query(q) {
  assertSelectOnly(q);
  const p = await getPool();
  const r = await p.request().query(q);
  return r.recordset;
}

// Devolve os artigos publicáveis já normalizados para o modelo do middleware.
async function fetchArticles() {
  const rows = await query(ARTIGOS_SQL);
  return rows.map(normalizeArticle);
}

function normalizeArticle(r) {
  const iva = Number(r.iva) || 0;
  const epv1 = Number(r.epv1) || 0;
  // IVA1INCL=0 em todo o catálogo → epv1 é líquido, somamos sempre o IVA.
  const price = computePrice(epv1, iva, Number(r.IVA1INCL) || 0);
  const stock = r.stock == null ? 0 : Math.trunc(Number(r.stock));
  return {
    ref: String(r.ref).trim(),
    title: (r.design || '').trim(),
    productType: (r.faminome || '').trim(),
    epv1,
    iva,
    price,          // preço final c/ IVA, 2 casas
    stock,          // inventário (unidades inteiras)
    barcode: (r.cod_barras || '').toString().trim(),
    tabiva: r.tabiva,
    flags: {
      novidade: !!Number(r.u_novi),
      novoStock: !!Number(r.u_newst),
      festa: !!Number(r.u_fest),
    },
    excluded: !!Number(r.u_exclu), // u_exclu=1 → excluído do site (decisão comercial)
    sellable: epv1 > 0, // artigos a preço 0 não são vendáveis (excluídos do sync ativo)
    // "visível" = política comercial acordada (25 jul): vendável, não-excluído e com stock.
    visible: epv1 > 0 && !Number(r.u_exclu) && stock > 0,
  };
}

// Imagem de um artigo (BLOB) a partir do PHC. Liga por ststamp: st.ref → st.ststamp → ifl.recstamp.
// SÓ-LEITURA. Devolve { ext, buffer } ou null.
const IMG_SQL = `
  select top 1 lower(ltrim(rtrim(fext))) as fext, bdados
  from ifl (nolock)
  where recstamp = (select top 1 ststamp from st (nolock) where ltrim(rtrim(ref)) = ltrim(rtrim(@ref)))
    and datalength(bdados) > 0`;

async function fetchImageByRef(ref) {
  assertSelectOnly(IMG_SQL);
  const p = await getPool();
  const r = await p.request().input('ref', ref).query(IMG_SQL);
  if (!r.recordset.length) return null;
  return { ext: r.recordset[0].fext, buffer: r.recordset[0].bdados };
}

async function close() {
  if (pool) { await pool.close(); pool = null; }
}

module.exports = { fetchArticles, fetchImageByRef, query, close, ARTIGOS_SQL, assertSelectOnly };
