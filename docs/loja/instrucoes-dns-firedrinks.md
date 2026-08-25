# Ligar o domínio firedrinks (dominios.pt) à loja Shopify

_Para o Miguel — 2 partes: uma no dominios.pt, outra no admin Shopify. ~10 min + propagação._

## Parte 1 — No painel do dominios.pt (gestão de DNS do domínio)

Criar/alterar estes 2 registos DNS:

| Tipo | Nome/Host | Valor | TTL |
|---|---|---|---|
| **A** | `@` (raiz do domínio) | `23.227.38.65` | 3600 (ou default) |
| **CNAME** | `www` | `shops.myshopify.com` | 3600 (ou default) |

Notas:
- Se já existir um registo A na raiz (`@`) a apontar para outro IP, substituir pelo da tabela.
- Se existir "parking" ou redirecionamento ativo do registrar, desativar.
- Não mexer nos registos MX (e-mail) se existirem.

## Parte 2 — No admin Shopify (qualquer um de nós pode fazer)

1. `Configurações → Domínios → Ligar domínio existente`
2. Escrever o domínio (ex.: `firedrinks.pt`) → **Seguinte** → **Verificar ligação**
3. Depois de verificado: marcar como **domínio principal** e ativar o redirecionamento
   (www e raiz devem apontar ambos para a loja)
4. O certificado SSL emite automaticamente (pode demorar até ~48 h; normalmente minutos)

## Verificação

- `https://<dominio>` abre a loja com cadeado (SSL)
- ⚠️ Enquanto o tema Various não for comprado/publicado, o domínio mostra o tema
  publicado atual — por isso o ideal é ligar o domínio no dia da compra do tema,
  ou de imediato mas manter a página de password ativa até ao go-live.

Dúvidas: o painel do dominios.pt chama aos registos "Zona DNS" ou "Gestão DNS";
se só houver a opção "alterar nameservers", não usar — basta editar a zona.
