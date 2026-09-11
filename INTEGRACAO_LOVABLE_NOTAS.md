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

## LP de novidades — regra de conciliação

O endpoint `/api/public/metrics-novidades` foi validado com a credencial atual. A resposta mantém a LP de novidades como fonte própria, usa `America/Sao_Paulo` e entrega somente totais agregados. O recorte 01–10/09 retorna 120 conversões e 120 pessoas únicas; o recorte incremental 09–10/09 retorna 16 conversões, 16 pessoas únicas e acumulado de 120.

A fotografia manual de 01–08/09, com 104 leads, deve permanecer intacta. A primeira sincronização será feita para 09–10/09, criando uma nova fotografia com acumulado de 120 e incremento de 16. Ressincronizar 09–10/09 atualizará esse mesmo registro por `sourceKey + periodStartAt + periodEndAt`, sem inserir outra linha.

Conversões brutas, pessoas únicas no período e pessoas únicas acumuladas serão armazenadas separadamente. Os percentuais de interesses, histórico e cidades usam `base_de_calculo` do período, não o acumulado da campanha. Fotografias manuais antigas, sem esse campo, continuam usando o total acumulado como base legada.

O endpoint não fornece sessões nem início de formulário para esta LP. Esses eventos permanecem ausentes na fotografia sincronizada e não serão estimados. `origens[]` representa conversões por canal; `cliques_vindos_da_masterclass` e suas origens serão exibidos como avanço de uma campanha para a outra, sem somá-los novamente aos leads.

O botão deve sugerir como início o dia seguinte ao fechamento mais recente e como fim o dia civil atual em Brasília. A interface deve alertar contra períodos sobrepostos, mas preservar a possibilidade de ressincronizar exatamente o mesmo intervalo para correção do fornecedor.

### Contrato real validado — 09 a 10/09/2026

Fonte: `https://masterclassconference.savagetgroup.com.br/api/public/metrics-novidades`, com fuso declarado `America/Sao_Paulo` e token Bearer exclusivo do servidor. O endpoint retornou 16 conversões brutas, 16 pessoas únicas no período, 120 conversões acumuladas e 120 pessoas únicas acumuladas. A base dos campos personalizados é 16.

O perfil incremental retornou: Nutrição Esportiva 7; Nutrição Estética 6; Gestão de Negócios 6; Fisioterapia Esportiva 4; Educação Física e Personal Training 3; Bodybuilding 2; Outra área 2. No histórico: 8 estiveram em 2026; 7 participarão pela primeira vez; 1 esteve em outra edição, mas não em 2026. Foram devolvidas 14 cidades no recorte.

O endpoint atribuiu as 16 conversões à origem `sem_origem`. Também registrou 19 cliques vindos das masterclasses: 13 de `instagram_ads`, 3 de `instagram_dm` e 3 sem origem. Esses cliques são avanço entre campanhas e não são somados aos leads. A ressincronização real do mesmo período atualizou a mesma fotografia, mantendo duas linhas no histórico: 01–08/09 manual e 09–10/09 Lovable.
