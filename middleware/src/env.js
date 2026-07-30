// Carrega o .env da raiz do repo Aromas da Tarde. Nunca commitar segredos.
const fs = require('fs');
const path = require('path');

const DEFAULT_ENV = 'C:/Users/aport/OneDrive - theloop.pt/Desktop/Mental Palace/Trabalho/Projetos/Aromas da Tarde/aromas-da-tarde/.env';

function loadEnv(p = process.env.AROMAS_ENV || DEFAULT_ENV) {
  const o = {};
  if (!fs.existsSync(p)) throw new Error('.env não encontrado: ' + p);
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*([^#\r\n]*)/);
    if (m) o[m[1]] = m[2].trim();
  }
  return o;
}

const env = loadEnv();

module.exports = {
  env,
  phc: {
    server: env.PHC_DB_HOST,
    port: parseInt(env.PHC_DB_PORT || '1433', 10),
    database: env.PHC_DB_NAME,
    user: env.PHC_DB_USER,
    password: env.PHC_DB_PASSWORD,
    options: { encrypt: false, trustServerCertificate: true },
    connectionTimeout: 20000,
    requestTimeout: 120000,
  },
  shopify: {
    shop: (env.SHOPIFY_SHOP || 'cbtddr-fc.myshopify.com'),
    clientId: env.SHOPIFY_APP_CLIENT_ID,
    clientSecret: env.SHOPIFY_APP_CLIENT_SECRET,
    apiVersion: env.SHOPIFY_API_VERSION || '2025-07',
  },
};
