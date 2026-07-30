// Compõe o banner hero dark-luxury com garrafas reais (fundo branco removido por flood-fill).
// Paleta da demo enviada ao cliente: ink #16110b, panel #2b2113, cream #f3ead9, gold #c9a227.
const fs = require('fs');
const path = require('path');
const sharp = require(path.join(__dirname, '..', 'node_modules', 'sharp'));

const IMGDIR = path.join(__dirname, 'imagens-phc');
const W = 1800, H = 1000;

// Remove o fundo branco CONECTADO ÀS BORDAS (flood-fill) — preserva rótulos claros.
async function cutout(file, targetH) {
  const img = sharp(file).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const TH = 238; // tolerância de "branco"
  const isWhite = (i) => data[i] >= TH && data[i + 1] >= TH && data[i + 2] >= TH;
  const visited = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) { stack.push(x, 0, x, h - 1); }
  for (let y = 0; y < h; y++) { stack.push(0, y, w - 1, y); }
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (visited[p]) continue;
    visited[p] = 1;
    const i = p * 4;
    if (!isWhite(i)) continue;
    data[i + 3] = 0; // transparente
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  // bounding box do conteúdo opaco
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > 0) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  const pad = 4;
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const cut = sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .resize({ height: targetH, fit: 'inside' });
  return cut.png().toBuffer();
}

function findFile(ref) {
  for (const ext of ['.png', '.jpg', '.jpeg']) {
    const f = path.join(IMGDIR, ref + ext);
    if (fs.existsSync(f)) return f;
  }
  throw new Error('sem imagem para ' + ref);
}

(async () => {
  // Garrafas (ref, altura, x-centro) — só fotos SEM caixa; cores alternadas
  const bottles = [
    { ref: 'GI.0019', h: 545, cx: 905 },   // Tanqueray (verde)
    { ref: 'RH.0116', h: 585, cx: 1090 },  // Zacapa 23 (âmbar)
    { ref: 'GI.0422', h: 655, cx: 1280 },  // Hendrick's Lunar (escura, centro)
    { ref: 'VD.0008', h: 600, cx: 1470 },  // Grey Goose (clara)
    { ref: 'RH.0106', h: 530, cx: 1630 },  // Diplomático (escura)
  ];
  const BASE = 870; // linha de "chão"

  // Fundo: gradiente da demo + vinheta + glow dourado + linha de chão subtil
  const bgSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g" cx="20%" cy="-10%" r="95%">
        <stop offset="0%" stop-color="#2b2113"/>
        <stop offset="60%" stop-color="#16110b"/>
        <stop offset="100%" stop-color="#120d08"/>
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#c9a227" stop-opacity="0.28"/>
        <stop offset="60%" stop-color="#c9a227" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#c9a227" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <ellipse cx="1260" cy="600" rx="720" ry="420" fill="url(#glow)"/>
    <rect x="0" y="${BASE - 10}" width="${W}" height="${H - BASE + 10}" fill="url(#floor)"/>
    <line x1="60" y1="${BASE + 40}" x2="${W - 60}" y2="${BASE + 40}" stroke="#c9a227" stroke-opacity="0.25" stroke-width="1"/>
  </svg>`;

  const layers = [];
  // sombras primeiro
  for (const b of bottles) {
    const shadow = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${b.cx}" cy="${BASE + 12}" rx="${Math.round(b.h * 0.16)}" ry="18" fill="#000" fill-opacity="0.55"/>
    </svg>`;
    layers.push({ input: Buffer.from(shadow), top: 0, left: 0 });
  }
  // garrafas
  for (const b of bottles) {
    const buf = await cutout(findFile(b.ref), b.h);
    const meta = await sharp(buf).metadata();
    layers.push({ input: buf, top: BASE - meta.height, left: Math.round(b.cx - meta.width / 2) });
    console.log(`ok ${b.ref}  ${meta.width}x${meta.height}`);
  }

  await sharp(Buffer.from(bgSvg)).png()
    .composite(layers)
    .jpeg({ quality: 88 })
    .toFile(path.join(__dirname, 'hero-aromas.jpg'));
  console.log('HERO: hero-aromas.jpg', W + 'x' + H);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
