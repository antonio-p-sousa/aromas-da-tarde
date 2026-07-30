// Extrai as imagens dos artigos publicáveis do PHC (tabela `ifl`, BLOB em `bdados`)
// para ficheiros no disco, nomeados pela referência do artigo. SÓ-LEITURA no PHC.
//
// Ligação (confirmada pelo parceiro PHC): ifl.recstamp = st.ststamp.
// O `fname` de ifl NÃO serve como chave (tem sufixos inconsistentes " - 1").
//
// Uso:  LIMIT=0 OUTDIR=./imagens node tools/extrai-imagens.js   (0 = todas; >0 = amostra)
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const { phc } = require('../src/env');

const LIMIT = parseInt(process.env.LIMIT || '0', 10);
const OUTDIR = process.env.OUTDIR || path.join(__dirname, '..', 'imagens');

const safe = (s) => (s || '').replace(/[^A-Za-z0-9._-]/g, '_');
function magic(buf) {
  if (!buf || buf.length < 4) return 'vazio';
  const h = buf.subarray(0, 4).toString('hex').toUpperCase();
  if (h.startsWith('FFD8FF')) return 'ok';       // JPEG
  if (h.startsWith('89504E47')) return 'ok';     // PNG
  return 'suspeito';
}

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const p = await sql.connect(phc);
  const top = LIMIT > 0 ? `top ${LIMIT}` : '';
  const query = `
    select ${top}
      ltrim(rtrim((select ref from st (nolock) where st.ststamp=ifl.recstamp))) as ref,
      lower(ltrim(rtrim(fext))) as fext,
      bdados
    from ifl (nolock)
    where isnull((select inactivo from st (nolock) where st.ststamp=ifl.recstamp),0)=0
      and isnull((select vaiwww  from st (nolock) where st.ststamp=ifl.recstamp),0)=1
      and datalength(bdados)>0
    order by ref`;

  console.log(`A extrair ${LIMIT === 0 ? 'TODAS' : LIMIT} imagens → ${OUTDIR}`);
  const r = await p.request().query(query);
  const seen = new Map();
  let ok = 0, bad = 0, bytes = 0;
  for (const row of r.recordset) {
    const ref = safe(row.ref) || 'SEM_REF';
    const n = (seen.get(ref) || 0) + 1; seen.set(ref, n);
    const name = n === 1 ? `${ref}.${row.fext}` : `${ref}-${n}.${row.fext}`;
    if (magic(row.bdados) === 'ok') ok++; else bad++;
    bytes += row.bdados ? row.bdados.length : 0;
    fs.writeFileSync(path.join(OUTDIR, name), row.bdados);
  }
  console.log(`Escritas ${r.recordset.length} | válidas ${ok} | suspeitas ${bad} | ${(bytes / 1048576).toFixed(1)} MB`);
  await p.close();
}

main().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
