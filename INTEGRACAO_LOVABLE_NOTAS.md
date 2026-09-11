# Notas de viabilidade — integração da LP de masterclasses

- Landing page pública verificada: `https://masterclassconference.savagetgroup.com.br/`.
- O formulário coleta nome, e-mail, telefone/WhatsApp, áreas de interesse e consentimentos separados para e-mail e WhatsApp.
- O painel administrativo já consolida as métricas usadas manualmente na Central de Landing Pages da plataforma de planejamento.
- A página pública, por si só, não informa qual banco ou endpoint abastece o painel administrativo.
- A sessão possui conectores Supabase disponíveis, porém desativados; ainda não foi confirmado que o projeto Lovable usa Supabase nem que esses conectores apontam para o banco correto.
- A integração recomendada deve transferir somente métricas agregadas por período, não dados pessoais dos leads, salvo necessidade e autorização específicas.
- Opções a avaliar: leitura direta segura do banco/API; envio de fotografia agregada por webhook; importação de CSV como alternativa leve.

## Evidências técnicas adicionais

O bundle público carrega o cliente Supabase e referencia o projeto `kcnitnjqowfzofmbzbaz.supabase.co`. A rota `/admin` redireciona para `/auth`, confirmando que os dados do painel administrativo ficam protegidos por autenticação. A aplicação carrega módulos separados para administração, autenticação, masterclasses e chamadas de servidor, além de uma rota própria de analytics. Portanto, a sincronização automática é tecnicamente viável, mas deve usar uma credencial exclusivamente de servidor, uma função de agregação ou um webhook assinado; não se deve reutilizar a sessão administrativa nem expor credencial privilegiada no navegador.

## Integração implantada — contrato v2

A plataforma consulta `https://masterclassconference.savagetgroup.com.br/api/public/metrics` somente pelo servidor, com token Bearer armazenado na variável `LOVABLE_MASTERCLASS_METRICS_TOKEN`. O navegador recebe apenas o estado configurado e o resultado agregado da sincronização; o token não faz parte do bundle nem das respostas do tRPC.

O usuário escolhe início e fim do período e aciona **Sincronizar agora**. O retorno é validado de forma estrita quanto à origem, ao período solicitado, às três aulas esperadas, aos tipos numéricos e à ausência de campos inesperados. A plataforma recalcula a conversão sessão → lead e não persiste a taxa pronta enviada pelo fornecedor.

O mapeamento importa sessões, inícios de formulário, página de obrigado, leads, inícios, conclusões, espectadores e percentual médio das três aulas, cliques de avanço e origens agregadas. `instagram_dm` alimenta também os indicadores internos de sessões e conversões com origem DM.

A chave única `sourceKey + periodStartAt + periodEndAt` garante idempotência. Repetir a sincronização do mesmo período atualiza a fotografia existente; não cria uma nova linha. Fotografias manuais anteriores continuam disponíveis e editáveis. Os acessos à página de obrigado são eventos repetíveis, por isso a interface os apresenta como **índice acessos/leads**, que pode superar 100%.

O contrato e a credencial foram validados contra o endpoint real. Uma fotografia de 01/09/2026 a 11/09/2026 foi criada e posteriormente atualizada pelo mesmo fluxo, mantendo duas linhas totais no histórico: uma manual e uma sincronizada.

## Contrato de fuso — Brasília

As datas `periodo.inicio` e `periodo.fim` são **datas civis da operação**, no formato `AAAA-MM-DD`, e devem seguir `America/Sao_Paulo` independentemente do fuso do servidor ou do navegador. Para persistência, continuam representadas por um timestamp neutro ao meio-dia UTC, evitando mudança de dia durante ordenação e formatação.

O campo `atualizado_em` é um **timestamp absoluto ISO em UTC**. Ele deve ser armazenado como epoch sem aplicar deslocamento manual e exibido explicitamente em `America/Sao_Paulo`. Assim, `2026-09-11T02:43:04.681Z` corresponde corretamente a 10/09/2026 às 23:43 em Brasília; converter o valor novamente no servidor produziria dupla conversão.

O limite máximo dos campos de período e a validação do servidor também devem usar a data civil atual de Brasília. Às 23h40 de 10/09 em Brasília, o dia 11/09 permanece indisponível, ainda que o servidor já esteja em 11/09 UTC.

## Pessoas únicas versus inscrições

O endpoint real manteve o contrato v2 e acrescentou, dentro de `trafego_e_captacao`, os campos `pessoas_unicas_no_periodo` e `total_acumulado_pessoas_unicas`. Para 01 a 10/09/2026, ambos retornaram 157, enquanto `novos_leads_no_periodo` retornou 166 e `total_acumulado_de_leads` retornou 168.

Na plataforma, `newLeads` e `totalLeads` permanecem como **eventos brutos de inscrição** para preservar o histórico. Os novos campos serão persistidos separadamente como `uniquePeopleInPeriod` e `totalUniquePeople`, ambos opcionais para manter fotografias anteriores compatíveis.

Na leitura operacional, pessoas únicas é a métrica comparável à RD Station. A interface deve mostrar os dois conceitos lado a lado e rotular explicitamente inscrições brutas; o painel consolidado não deve substituir silenciosamente um valor pelo outro. A taxa por pessoas únicas será calculada como `pessoas únicas no período ÷ sessões`, enquanto a taxa de inscrição bruta continuará disponível separadamente.

### Implementação e validação — 11/09/2026

O endpoint manteve a estrutura v2 e adicionou os dois campos dentro de `trafego_e_captacao`; o exemplo simplificado do prompt não substituiu o contrato completo. A tabela recebeu colunas opcionais para manter fotografias antigas compatíveis. A ressincronização de 01 a 10/09 atualizou a fotografia existente, preservou duas linhas no histórico e gravou 157 pessoas únicas no período e no acumulado, ao lado de 166 inscrições brutas no período e 168 acumuladas.

A Central de Landing Pages, a leitura da isca e os KPIs agora mostram os dois conceitos separadamente. O resumo de Landing Pages usa pessoas únicas das masterclasses quando disponíveis e declara que não existe deduplicação entre LPs. A validação final passou em TypeScript, 193 testes, build, banco, logs e revisão responsiva.
