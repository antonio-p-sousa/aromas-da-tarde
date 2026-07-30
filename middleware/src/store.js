// Base de dados intermédia (BDI). É NOSSA — não é a BD do cliente.
// Guarda o último snapshot conhecido do PHC para detetar alterações entre execuções.
// Usa o SQLite nativo do Node (node:sqlite, Node >=22). Escrever aqui é seguro.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const crypto = require('crypto');

function open(dbPath = path.join(__dirname, '..', 'data', 'state.sqlite')) {
  const fs = require('fs');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      ref        TEXT PRIMARY KEY,
      title      TEXT,
      product_type TEXT,
      price      REAL,
      stock      INTEGER,
      sellable   INTEGER,
      hash       TEXT,
      seen_at    TEXT
    );
    CREATE TABLE IF NOT EXISTS runs (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      kind       TEXT,
      started_at TEXT,
      summary    TEXT
    );
  `);
  return db;
}

// Hash estável do estado relevante de um artigo (deteta mudanças de nome/preço/stock/tipo).
function hashArticle(a) {
  const key = [a.ref, a.title, a.productType, a.price, a.stock, a.sellable ? 1 : 0].join('|');
  return crypto.createHash('sha1').update(key).digest('hex').slice(0, 16);
}

// Lê o snapshot anterior como Map ref -> row.
function loadSnapshot(db) {
  const rows = db.prepare('SELECT * FROM articles').all();
  const m = new Map();
  for (const r of rows) m.set(r.ref, r);
  return m;
}

// Grava o snapshot atual (upsert). Usado APÓS o dry-run para fixar o novo estado conhecido.
function saveSnapshot(db, articles, seenAt) {
  const up = db.prepare(`
    INSERT INTO articles (ref,title,product_type,price,stock,sellable,hash,seen_at)
    VALUES (?,?,?,?,?,?,?,?)
    ON CONFLICT(ref) DO UPDATE SET
      title=excluded.title, product_type=excluded.product_type, price=excluded.price,
      stock=excluded.stock, sellable=excluded.sellable, hash=excluded.hash, seen_at=excluded.seen_at
  `);
  const tx = db.prepare('BEGIN'); tx.run();
  try {
    for (const a of articles) {
      up.run(a.ref, a.title, a.productType, a.price, a.stock, a.sellable ? 1 : 0, hashArticle(a), seenAt);
    }
    db.prepare('COMMIT').run();
  } catch (e) {
    db.prepare('ROLLBACK').run();
    throw e;
  }
}

function recordRun(db, kind, summary, startedAt) {
  db.prepare('INSERT INTO runs (kind,started_at,summary) VALUES (?,?,?)')
    .run(kind, startedAt, JSON.stringify(summary));
}

module.exports = { open, hashArticle, loadSnapshot, saveSnapshot, recordRun };
