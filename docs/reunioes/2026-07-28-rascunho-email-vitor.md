# Rascunho de email ao Vitor (parceiro que gere o PHC)

> **RASCUNHO para o António rever e enviar.** Objetivo: destravar a fase 2 (encomendas
> loja → PHC) e o acesso às imagens. Não colar credenciais no email.

**Assunto:** Aromas da Tarde — loja online: catálogo sincronizado + dúvidas para as encomendas

---

Olá Vitor,

Ponto de situação da loja online da Aromas da Tarde e um conjunto de dúvidas para avançarmos com
a parte das encomendas.

**Onde estamos:** o catálogo já está a sincronizar bem a partir do PHC. Montámos do nosso lado um
mecanismo que lê os artigos publicáveis (com `inactivo = 0` e `vaiwww = 1`), calcula os preços com
IVA e compara com a loja — tudo em **leitura apenas**, sem escrever nada na vossa base de dados.
Correu um ensaio completo e o catálogo da loja está praticamente alinhado com o PHC.

Para fecharmos a integração falta a parte das **encomendas da loja a entrarem no PHC**. Como já
existe o dossier *Encomenda Web* (`ndos = 10`) em uso, preferíamos seguir o mesmo mecanismo que a
integração atual usa, em vez de inventar. Para isso precisávamos que nos confirmasse:

**Encomendas (o mais importante):**
1. Reutilizamos o dossier `ndos = 10` (Encomenda Web) ou cria-se um tipo novo para o Shopify (para separar B2B/B2C)?
2. Como se geram os `bostamp`/`bistamp` corretamente (formato de 25 caracteres do PHC)? Há uma rotina/regra, ou o insert direto com stamp próprio é aceite, como faz a integração atual?
3. `obrano` (número sequencial do documento): quem atribui a numeração? Um insert direto com `máx+1` tem risco de colisão — como resolve a integração atual?
4. Clientes B2C: cria-se um registo em `cl` por cliente, ou usa-se um cliente genérico com a morada só no documento? Que campos de `cl` são obrigatórios?
5. Que campos de `bo2`/`bo3` são obrigatórios para o documento abrir corretamente no PHC?
6. Há *triggers* ou rotinas que corram no insert (reserva de stock, etc.) de que devamos ter em conta?

**Imagens:**
7. Como acedemos aos ficheiros de imagem dos artigos? O campo `st.imagem` parece guardar uma referência/nome de ficheiro — precisávamos do caminho/pasta (ou de um export) para as publicar na loja.

**Uma confirmação rápida:** para escondermos artigos do site, estamos a usar o campo `u_exclu`
(quando está a 1, o artigo não vai para a loja). É este o campo certo, ou há outro "quadradinho"
na ficha do artigo que devemos respeitar?

Quando puder, agradeço. Se for mais fácil, marcamos 20–30 min para passarmos isto.

Obrigado,
António
Loop Future

---

**Notas internas (não enviar):**
- Perguntas alinhadas com `docs/tecnico/exploracao-bd.md`. As respostas às 1–6 destravam a fase 2
  (escrita de encomendas no PHC) — hoje o único bloqueador real dessa metade da integração.
- A política de esgotados (mostrar/não mostrar) é decisão do Jorge, não do Vitor — tratar à parte.
- Antes do primeiro insert real: ambiente de teste + validar stamps/numeração/triggers. Nunca
  escrever direto na produção sem isso.
