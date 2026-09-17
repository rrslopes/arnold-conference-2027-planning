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

A preservação da fotografia manual de 01–08/09 e o recorte automático de 09–10/09 foram uma estratégia intermediária. Após autorização do cliente, ambos foram excluídos e substituídos pela série oficial diária iniciada em 04/09 e pelo consolidado completo.

Conversões brutas, pessoas únicas no período e pessoas únicas acumuladas serão armazenadas separadamente. Os percentuais de interesses, histórico e cidades usam `base_de_calculo` do período, não o acumulado da campanha. Fotografias manuais antigas, sem esse campo, continuam usando o total acumulado como base legada.

O endpoint não fornece sessões nem início de formulário para esta LP. Esses eventos permanecem ausentes na fotografia sincronizada e não serão estimados. `origens[]` representa conversões por canal; `cliques_vindos_da_masterclass` e suas origens serão exibidos como avanço de uma campanha para a outra, sem somá-los novamente aos leads.

O botão fixa o início oficial em 04/09 e permite escolher apenas a data final, limitada ao dia civil atual em Brasília. Cada execução consulta todos os dias do recorte e o consolidado; repetir a mesma data final atualiza os mesmos registros.

### Contrato real validado — 09 a 10/09/2026

Fonte: `https://masterclassconference.savagetgroup.com.br/api/public/metrics-novidades`, com fuso declarado `America/Sao_Paulo` e token Bearer exclusivo do servidor. O endpoint retornou 16 conversões brutas, 16 pessoas únicas no período, 120 conversões acumuladas e 120 pessoas únicas acumuladas. A base dos campos personalizados é 16.

O perfil incremental retornou: Nutrição Esportiva 7; Nutrição Estética 6; Gestão de Negócios 6; Fisioterapia Esportiva 4; Educação Física e Personal Training 3; Bodybuilding 2; Outra área 2. No histórico: 8 estiveram em 2026; 7 participarão pela primeira vez; 1 esteve em outra edição, mas não em 2026. Foram devolvidas 14 cidades no recorte.

O endpoint atribuiu as 16 conversões à origem `sem_origem`. Também registrou 19 cliques vindos das masterclasses: 13 de `instagram_ads`, 3 de `instagram_dm` e 3 sem origem. Esses cliques são avanço entre campanhas e não são somados aos leads. Essa leitura incremental antecedeu a autorização para substituir os dois recortes pela série diária oficial.

### Fonte oficial diária — confirmação do cliente em 11/09/2026

O cliente confirmou que o endpoint atual deve prevalecer sobre a distribuição indicada no primeiro arquivo. As datas já são civis de `America/Sao_Paulo` e não devem ser deslocadas para outro dia por conversão UTC. A distribuição oficial retornada para a importação diária é: 04/09 = 54; 05/09 = 9; 06/09 = 7; 07/09 = 7; 08/09 = 20; 09/09 = 11; 10/09 = 12; 11/09 = 0 no momento da consulta. O consolidado 04–11/09 retorna 120 conversões e 120 pessoas únicas.

O cliente autorizou excluir as fotografias antigas da LP de novidades e substituí-las pela série diária oficial, mantendo cada dia como uma fotografia própria e adicionando uma fotografia consolidada de 04/09 até o dia atual. A série diária e o consolidado devem coexistir; a fotografia consolidada sustenta o perfil vigente e os KPIs, enquanto os dias sustentam a evolução temporal.

## Contrato oficial evolutivo — Masterclasses

O contrato oficial recebido em 11/09/2026 determina que campos desconhecidos devem ser ignorados e que `consumo_das_aulas` e `origens` têm tamanho variável. A plataforma continuará exigindo os blocos e campos efetivamente usados, validando tipos, limites, período solicitado e relações numéricas. Campos extras serão descartados pelo parser, sem chegar ao banco ou à interface.

Os slugs das aulas deixam de ser limitados aos três valores atuais para permitir novas aulas futuras. Slugs duplicados continuam inválidos. O mapeamento usa somente os três slugs conhecidos pela plataforma; aulas novas ficam ignoradas até existir uma decisão de produto sobre sua apresentação. Se uma aula conhecida não vier no recorte, suas métricas serão gravadas como ausentes (`null`), nunca como zero. Assim, ausência de dados não é confundida com ausência de consumo.

`conversao_sessao_lead` pode ser nula quando não houver sessões e, quando informada, deve permanecer entre 0 e 1. A plataforma continua recalculando as taxas exibidas a partir dos volumes brutos. As datas de `periodo` permanecem datas civis de Brasília; `atualizado_em` continua sendo tratado como timestamp absoluto e exibido em `America/Sao_Paulo`.

### Implementação e validação do contrato oficial

O parser passou a descartar campos desconhecidos nos objetos principal e aninhados, sem transportá-los ao banco. As listas de aulas e origens aceitam tamanho variável. Slugs novos são aceitos e ignorados pelo mapeamento até existir suporte explícito na interface; slugs duplicados continuam bloqueados. Quando uma das três aulas atualmente exibidas não vier no recorte, seus indicadores ficam como “sem dado”, em vez de zero.

A sincronização real de 01 a 11/09 foi concluída no mesmo registro e manteve três linhas no histórico. O fechamento atualizado registrou 515 sessões, 210 inscrições brutas no período, 212 acumuladas e 197 pessoas únicas. Aulas, origens e avanço foram atualizados conforme o endpoint oficial; a LP das masterclasses permaneceu isolada da LP de novidades.

Validação final: TypeScript sem erros, **206 testes aprovados** em 41 arquivos, build concluído, banco e idempotência conferidos, revisão desktop/mobile e nenhum erro atual em servidor, console ou rede após 00h20.

### Diagnóstico exato da rejeição posterior

A tentativa interrompida recebeu `consumo_das_aulas[nutricao-estetica].espectadores = 15` e `consumo_das_aulas[nutricao-estetica].inicios = 14`. O único bloqueio acionado foi a regra local “espectadores não podem ultrapassar inícios”. Essa relação não existe no contrato oficial e os dois campos representam eventos independentes; portanto, a regra foi removida. Nenhum outro campo ou valor foi rejeitado naquela resposta.

Campos novos, inclusive com valor `null`, continuam ignorados sem chegar ao banco. `conversao_sessao_lead = null` permanece aceito conforme o contrato. Listas de aulas e origens continuam variáveis. Permanecem bloqueados: tipos inválidos nos campos usados, números negativos ou fora dos limites, slugs duplicados, conclusões acima dos inícios, pessoas únicas acima das inscrições brutas e período diferente do solicitado.

Quando houver uma rejeição legítima, a plataforma passa a mostrar no próprio painel o caminho, o valor recebido e o motivo, por exemplo: `consumo_das_aulas[nutricao-estetica].conclusoes = 39 — Conclusões não podem ultrapassar inícios`. A mensagem declara que nenhuma fotografia foi alterada; os valores são limitados e não incluem credenciais ou dados pessoais.

A ressincronização real de 01–11/09 foi concluída no mesmo registro, mantendo três fotografias de masterclasses e nove fotografias da LP de novidades. Nenhum registro foi excluído. O fechamento vigente registra 517 sessões, 210 inscrições brutas no período, 212 acumuladas e 197 pessoas únicas.

Validação final: TypeScript sem erros, **208 testes aprovados** em 41 arquivos, build concluído, banco e isolamento conferidos, revisão desktop/mobile e nenhum erro atual em servidor, console ou rede após 00h50.

### Implementação final — série oficial

As duas fotografias antigas, IDs `60001` e `1170003`, foram excluídas somente após autorização explícita. A sincronização oficial criou oito registros diários, de 04 a 11/09, e um consolidado de 04 a 11/09. A distribuição validada pelo endpoint foi 54, 9, 7, 7, 20, 11, 12 e 0 conversões; a soma diária e o consolidado coincidem em 120 conversões e 120 pessoas únicas.

Os dias usam `syncSource = lovable-api-daily`; o consolidado usa `syncSource = lovable-api-rollup`. A identidade idempotente continua baseada em origem, início e fim. O seletor do perfil e os KPIs priorizam o consolidado, enquanto o histórico identifica cada linha como **DIA OFICIAL** ou **CONSOLIDADO**. Uma segunda sincronização confirmou 0 criações e 9 atualizações, mantendo exatamente nove registros. Datas civis não sofrem conversão para UTC; apenas a persistência usa meio-dia UTC neutro.

### Diagnóstico de 12/09 e recuperação da série oficial

O único campo rejeitado pela resposta de 137 conversões e 133 pessoas únicas foi `campos_personalizados.historico_no_arnold`. O valor era uma lista com 13 itens; a plataforma impunha localmente `max(10)`. O contrato oficial define essa lista como variável e não estabelece esse limite, portanto a restrição foi removida. Campos, tipos e relações previstos pelo contrato continuam validados. Erros legítimos passam a expor caminho, valor resumido e motivo, sem credenciais ou dados pessoais.

A série oficial foi atualizada com as dez respostas agregadas obtidas durante o diagnóstico: nove dias de 04 a 12/09 e um consolidado de 04 a 12/09. O consolidado vigente registra 137 conversões, 133 pessoas únicas e base de perfil 137. Nenhuma fotografia foi excluída; o banco contém nove dias, dois consolidados históricos e três fotografias de masterclasses. Uma segunda aplicação confirmou 0 criações e 10 atualizações.

Para reduzir falhas externas, a sincronização agora reutiliza dias oficiais já persistidos, consulta apenas datas ausentes ou os três dias mais recentes e sempre atualiza o consolidado. Se o total consolidado divergir da soma armazenada, a própria operação revisa todos os dias antes de gravar. Falhas transitórias têm retry controlado; respostas inválidas não são repetidas. Os testes que dependem de rede externa são opt-in por `RUN_EXTERNAL_INTEGRATION_TESTS=true`.

Validação final: TypeScript sem erros, **212 testes aprovados** e 2 testes externos ignorados em 41 arquivos, build concluído, banco e idempotência conferidos, revisão desktop/mobile e nenhum erro atual de interface após 01h37. O ambiente local perdeu conectividade externa durante a última tentativa pelo botão; por isso, a atualização usou exclusivamente as respostas oficiais já baixadas e validadas pelo mesmo parser.

## LP de novidades — contrato de indicadores da RD Station

Em 17/09/2026, o endpoint passou a declarar explicitamente que a LP de novidades está hospedada na RD Station e que o projeto Lovable recebe somente as conversões por webhook. Por isso, sessões, sessões por origem, inícios e abandonos de formulário e as duas taxas que dependem de sessões são `null` por natureza. Esses valores não representam erro nem dado pendente: a interface deve exibi-los como **Não medido nesta LP**, acompanhados do motivo fornecido em `metricas_indisponiveis`.

O campo `captacao.conversoes_origem_dm` passa a ser a fonte oficial do indicador agregado de **WhatsApp + Instagram DM**. Ele não deve ser reconstruído somente pela linha `instagram_dm` do ranking. O array `origens` inclui todas as origens previstas, inclusive quando o valor é zero, e `sessoes` permanece `null` em cada item.

O parser aceita campos adicionais e listas variáveis, preserva os `null` contratuais, mantém fuso `America/Sao_Paulo` e upsert idempotente por período. A justificativa do endpoint é persistida junto à fotografia para que a Central de Landing Pages e o Pilar 4 distingam indisponibilidade estrutural de uma simples espera por atualização. Para medir tráfego e início de formulário no futuro, será necessária instrumentação própria de GTM/GA4 na página da RD Station.
