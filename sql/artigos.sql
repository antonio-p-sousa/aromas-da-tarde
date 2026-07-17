-- Consulta de exemplo enviada pelo Vitor (Expand Target), 16 jul 2026
-- Tabela de artigos (st) do PHC CS — artigos ativos publicáveis na web
-- BD real: apenas leitura (nolock em todas as consultas, como no exemplo)

select
    ref as 'Refêrência',
    design as 'Designação',
    faminome as Familia,
    epv1 as Preço_Venda,
    IVA1INCL as 'Iva_Incluidono_Pr_Venda',
    isnull((select taxa from taxasiva (nolock) where taxasiva.codigo = st.tabiva), 0) as IVA,
    usr1 as 'Tipo',
    u_un as Unidade,
    codigo as Cod_Barras,
    usr5 as Categoria,
    u_newst as Novo_Artigo,
    u_novi as Artigo_Novidade,
    u_fest as Artigo_Festivo
from st (nolock)
where inactivo = 0 and vaiwww = 1
order by design ASC
