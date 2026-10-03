# CLAUDE.md · Planejamento de marketing Arnold Conference 2027

Plataforma de planejamento de marketing do Arnold Conference 2027 (cliente: Savaget Group), operada pela agência Extrema Visibilidade. O conteúdo estratégico (calendário, briefings, e-mails) vive nos arquivos de dados deste repositório. A hospedagem e a publicação são feitas pela Manus, que sincroniza com a branch `main` deste repositório nos dois sentidos.

A plataforma não é usada para controle operacional de status. Ela serve para direcionamento e briefing; a área de indicadores recebe o link do e-mail disparado para relatório. Não priorizar funcionalidades de status sem pedido.

## Fluxo de trabalho (obrigatório)

1. Antes de qualquer edição: `git pull` na `main`.
2. Nunca editar ao mesmo tempo que a Manus. Se o último commit for da Manus há poucos minutos, perguntar ao Raphael se ela terminou.
3. Editar apenas o que foi pedido. Não mexer em `server/_core`, integrações, banco (drizzle) ou layout sem pedido explícito.
4. Validar sempre: `pnpm check`, `pnpm test`, `pnpm build`. Os testes de conteúdo (`server/*.content.test.ts` e demais testes que não dependem de credenciais) precisam passar. Localmente, falham por falta de credenciais os testes de `planning.integration`, `lovableNews.persistence`, `lovableMasterclass.persistence` e `lovableNewsMetrics`; isso é esperado. Qualquer falha fora desses quatro arquivos bloqueia o push. Se uma regra editorial mudou, atualizar o teste de conteúdo correspondente e explicar no commit.
5. Commit em português, descrevendo o que foi substituído, criado e removido. Depois do push, passar ao Raphael o prompt abaixo para colar na Manus, em modo Lite (rotina oficial, ver "Publicação na Manus"). Quando ela terminar, conferir a versão publicada lendo o site (https://planejamentoconference.savagetgroup.com.br), sem pedir verificações à Manus. Se a mudança tocar servidor, banco ou integrações, usar o modo padrão e o prompt com `pnpm test`.

   > Faça git pull da main do GitHub, rode só pnpm build, salve o checkpoint e publique. Não rode testes nem verificação de tipos: já foi tudo validado antes do push. Responda só com o hash publicado.

### Publicação na Manus

- Rotina oficial (desde 29/09/2026): modo Lite + o prompt único do passo 5 (pull, só build, checkpoint e publicação, sem testes nem verificação de tipos). Depois, conferir o site.
- O botão "Pedir ao Manus para sincronizar" (painel GitHub, menu "..." → GitHub) deixa de ser usado: ele aciona o agente, mas não cria checkpoint, e o botão "Publicar" só habilita depois de um checkpoint.
- Nunca usar o modo Max.
- Mudança no servidor, no banco ou em integrações: modo padrão e prompt com `pnpm test`, pedindo resposta curta: "Se falhar algum teste fora de planning.integration, lovableNews.persistence, lovableMasterclass.persistence e lovableNewsMetrics, pare e me mostre só os nomes dos testes que falharam."
- Mudança só em CLAUDE.md ou arquivos internos: não publicar; vai junto na próxima publicação.
- Juntar as mudanças do dia e publicar uma vez só.
- Alerta de "prompt injection" durante a publicação: falso positivo conhecido, que vem do texto de instruções da ferramenta interna de checkpoint da Manus (aconteceu na publicação de `ab37b3b`). Se acontecer de novo, pedir à Manus que diga a origem do alerta e seguir se não for arquivo do repositório.
- Histórico de consumo de créditos:
  1. Primeira publicação: cerca de 3.000 créditos (2.982 no histórico do dia; prompt curto em modo Max, com `pnpm test`; o valor pode somar mais de uma tarefa).
  2. `acba409` (29/09): 820 créditos, sendo 177 do botão de sincronização (modo Max) e cerca de 640 do chat, porque sem checkpoint o "Publicar" não habilitava e a Manus rodou testes e build por conta própria.
  3. `ab37b3b` (29/09, noite): 29 créditos, em modo Lite com o prompt único.
  4. `7229c3e` (01/10, noite): 60 créditos, em modo Lite com o prompt único (etapa 3 da grade; a Manus refez o pull com `cd` explícito porque o ambiente rejeitou o diretório automático).
  5. `6c95391` (02/10): 42 créditos, em modo Lite com o prompt único (link do relatório mLabs por mês).

## Trabalho em dois computadores (escritório e casa)

- Ao começar: `git pull` na `main`. Ao terminar: commit e `git push`, mesmo que o trabalho continue no dia seguinte.
- Nunca editar em dois lugares ao mesmo tempo: os dois PCs e a Manus. Antes de editar, conferir com `git fetch` e `git status` que não há commit novo nem alteração pendente.
- Convenção de pastas: código em `D:\Projetos\<cliente>\<projeto>` (fora do OneDrive) e referências em `OneDrive\Projetos-referencias\<cliente>\<projeto>`. Nomes em minúsculas, com hífen, sem espaço e sem acento.
- Este projeto: código em `D:\Projetos\savaget\arnold-conference-2027-planning`; referências em `OneDrive\Projetos-referencias\savaget\arnold-conference-2027`.
- A pasta `referencias/` fica no OneDrive, em `Projetos-referencias\savaget\arnold-conference-2027`. Em cada PC, o repositório tem uma junção de diretório (`mklink /J`) chamada `referencias` apontando para essa pasta. Marcar a pasta do OneDrive como "Sempre manter neste dispositivo".
- Preparar um PC novo (Windows):
  - Instalar Git, Node.js LTS e pnpm 10.4.1 (`npm install -g pnpm@10.4.1`).
  - Clonar o repositório em `D:\Projetos\savaget\arnold-conference-2027-planning` e, dentro dele: `git config core.autocrlf false` e `git config core.eol lf`. Sem isso, o Git converte as quebras de linha e testes de conteúdo falham.
  - Criar a junção no Prompt de Comando (cmd), dentro do repositório: `mklink /J referencias "<pasta do OneDrive>\Projetos-referencias\savaget\arnold-conference-2027"`.
  - `git config user.name "Raphael · Extrema Visibilidade"` e `git config user.email "raphael@extremavisibilidade.com.br"`.
  - `pnpm install`.
  - Pré-visualização local só do front (sem banco): `npx vite --port 5173`.
- Mudança grande (várias pautas, e-mails ou regras): mostrar o resumo ao Raphael e esperar o OK antes do push. Ajuste pontual pedido por ele pode subir direto.

## Onde está o conteúdo

- `client/src/data/octoberSocialPlan.ts` · calendário de posts de 28/09 a 31/10 (`octoberCalendarBase`, formato JSON com chaves entre aspas) e `octoberDestinations`.
- `client/src/data/octoberEmailPlan.ts` e `emailBriefs.ts` · e-mail marketing.
- `client/src/data/planData.ts` · estratégia, públicos, iscas, calendário de setembro.
- `server/*.content.test.ts` · testes que travam regras editoriais.

### Estrutura de um card de post
`id` (DDMM), `date`, `phase`, `channel`, `title` (título/capa do post), `origin`, `originUrl`, `originLinkLabel`, `materialLinks`, `idea`, `productionBrief { format, purpose, units[{unit, role, content, source?, sourceUrl?}], note }`, `storyCards[{card, format, prompt, answers?, note?}]`, `agencyResearch { owner, request, deliverables, validation, fallback }`, `fallback`, `cta`, `destination`, `destinationUrl`, `congresses`.
Todo card precisa de: título do post, ideia estratégica, briefing tela a tela ou segundo a segundo, alternativa segura, material de referência, minutagem (quando houver corte), CTA e destino.

## Os seis congressos (23 a 25/04/2027)

| Congresso | Data | Capacidade 2027 | Inscritos 2026 | Coordenação |
|---|---|---|---|---|
| Nutrição Esportiva (2 dias) | 24–25/04 | 450 | 214 | Andréia Naves |
| Nutrição Estética | 23/04 | 162 | 101 | Luisa Wolpe |
| 3º Simpósio de Fisioterapia Esportiva da SONAFE | 24/04 | 279 | 249 (esgotou) | Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo |
| 8º Congresso de Gestão de Academias (2 dias) | 23–24/04 | 279 | 247 | Dudu Netto (na planilha: Eduardo Netto) |
| Certificação Internacional em Personal Training – WTTC + Top of the Rock (2 dias, à noite) | 23–24/04 | 279 | 190 | Cris Parente (formal: Prof. Cristiano Parente) |
| Bodybuilding | 25/04 | 279 | 192 | Ricardo Pannain |

Vendas abrem em 06/10/2026. Meta: lotação máxima de todas as salas. Todos os congressos precisam ser vendidos; ter esgotado em 2026 não garante 2027. Hierarquia de apresentação: pilar de nutrição primeiro, depois os demais, sem dedicar uma semana a cada congresso.

## Regras editoriais (vindas do cliente e dos aprendizados)

- Nunca comparar congressos nem colocar um "versus" o outro. Cada público é único.
- Sempre "Certificação Internacional em Personal Training – WTTC" na primeira menção. Nunca só "WTTC".
- SONAFE é a 3ª edição (confirmado pelo cliente em 29/09; a planilha de programação de 01/10 já diz "3º").
- Fabricio Rapello (SONAFE) se escreve com dois L, confirmado pelo Instagram @fabriciorapello, pelo currículo acadêmico e por publicações científicas.
- Escassez: usar "lote 1 limitado". Proibido publicar datas de virada de lote e valores.
- Briefings diretos, didáticos e com exemplo. O cliente reprova instrução abstrata.
- Não repetir pautas dentro do mês nem entre meses. Checar o calendário existente antes de propor.
- O cliente autorizou divulgar temas e nomes de qualquer congresso assim que houver programação, mesmo que ainda não seja definitiva. Divulgar só temas e nomes que estão na planilha mais recente de cada congresso. Não chamar de "completa" ou "definitiva", exceto quando o próprio cliente declarar a programação 100% pronta (hoje: SONAFE, planilha de 01/10). Se a programação mudar, revisar os cards e e-mails que citam o que mudou.
- Continua proibido publicar horários, itens "Em breve", grade completa e títulos integrais das palestras.
- Preço: nenhum post fala de preço, em nenhum congresso (inclusive Bodybuilding): nada de valores nem de "quanto custa". A comunicação é lote 1 limitado, escassez e autoridade; quem acessa o site descobre o valor. Dizer que o lote 1 tem o menor valor (ex.: "quem entra primeiro garante o menor valor") é argumento de escassez, não preço, e pode ser usado.
- Divergência entre planilhas do cliente (nome, formação, credencial): vale a planilha de programação mais recente. Ex.: Luisa Wolpe é "pós-graduada em Nutrição Clínica e mestre em Ciências da Saúde pela UFPR" (programação de Estética da noite de 29/09), e não "mestre em Medicina Interna" (planilha de coordenadores).
- Não há depoimentos de participantes de 2026.
- Conteúdo de cases de atletas: educativo e sem link de venda (risco jurídico).
- Autoridade de palestrantes: a agência pesquisa o material bruto; nós indicamos o caminho. Fato sem fonte não entra.
- Sem nomes comerciais de medicamentos e sem marcas de competições (FIFA) nas artes. Por isso, o corte "Mounjaro virou um sinônimo de status" (Podcast Quinn · Nutrição Esportiva, Rodolfo Peres e Pedro Perim) não pode ser usado.
- Stories: no máximo 1 ou 2 enquetes por dia, com Story de contexto antes. Menos de 10 respostas = sinal direcional.
- Acervo 2026 sempre identificado como 2026; não sugerir que o palestrante estará em 2027 sem confirmação.
- Números da Certificação Internacional em Personal Training – WTTC (validados no roteiro da Leal): "presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo". Não usar mais "35 países".
- Posts de autoridade (palestrante ou coordenador): nada de "5 coisas sobre…"; cada post tem título próprio, puxado pelo que a pessoa traz ao congresso, e no máximo um em formato de lista. Espaçar as datas (nunca em dias seguidos), para não criar a expectativa de uma série com todos os palestrantes.
- Título que promete algo que a pessoa disse (ex.: "O que Dudu Netto aprendeu sobre gestão…") exige fala pública com fonte; sem fonte, usar a alternativa segura do card.
- Quando o áudio da Leal disser que um congresso "nasce" e ele já existir (SONAFE, Gestão de Academias, Bodybuilding), a legenda não apresenta como estreia e deixa clara a edição.
- Números de mercado sem fonte não entram em peças produzidas pela agência do Conference. Vídeos da Leal publicados em collab seguem a aprovação do cliente.

## Regras do pacote-mestre de outubro (desde 01/10/2026)

Fonte: `referencias/briefings/pacote-mestre-outubro-2026-10-01.md` (feedback de Karla, Adriana e Patrícia e decisões do Raphael).

- Capacidade das agências (a partir de 10/10): no máximo 2 artes novas (carrossel ou estático) por semana no feed do Conference, nunca em dias seguidos; nenhuma arte nova no fim de semana (exceção já decidida: a chamada de programação de 10/10); sempre que possível, vídeo no lugar de arte, porque quem edita vídeo não é quem desenha; vídeos que entram no cronograma são editados a tempo pela equipe do cliente; em espaços de respiro, indicar a preferência de material com alternativas (ex.: "pílula X ou Y").
- Automação "Comente PROGRAMAÇÃO": em todas as peças, "Comente PROGRAMAÇÃO e receba a programação do seu congresso no direct". Só o card do SONAFE (20/10) usa "programação completa". A palavra PROGRAMAÇÃO está no painel "Palavras-chave e destinos" da plataforma (`keywords` em `planData.ts`), com a configuração pendente.
- Funil equilibrado: artes novas vão para as peças que mais pesam na decisão (programação e autoridade com nomes de 2027), que são meio de funil. A venda direta fica nos Stories e nas legendas. Cada card leva a marcação de funil: topo, meio ou fundo.
- Ritmo da Leal: segunda, Leal sobre o Arnold (os vídeos de pilar do Conference estão nessa fila); quinta, Leal tendência. No máximo 2 vídeos da Leal por semana no feed do Conference, com constância, sem aparecer e sumir. Não colar a Leal no feed do Arnold.
- Equilíbrio entre congressos: pilar de nutrição à frente, mas cada congresso aparece no feed pelo menos a cada 7 a 10 dias. Nunca duas programações em dias seguidos.
- E-mails com par: o card do e-mail na plataforma usa o mesmo título do post relacionado e ganha o campo "Post relacionado" (data e título). E-mail sem par recebe a marcação "E-mail sem post relacionado". Assunto e pré-cabeçalho continuam otimizados para abertura, sem repetir o título do post.
- Certificação: são dois dias na mesma inscrição, ambos à noite: sexta 23/04 (Certificação Internacional em Personal Training – WTTC) e sábado 24/04 (Top of the Rock). Pode-se dizer "à noite", sem horário. As peças da Certificação levam os logos de chancela do WTTC e do Top of the Rock (pasta: https://drive.google.com/drive/folders/1Rsuw_eSkvvn6JV2nkOiJUbMO4EgxU7Ru). Coordenação: "Cris Parente" no conteúdo social; "Prof. Cristiano Parente" em apresentação formal. Números: seguir o roteiro da Leal ("5 continentes, 18 países e mais de 35 mil treinadores") até o time validar; o Reel do Cris de 02/09 (já publicado, confirmado pelo Raphael no Instagram) fala em "mais de 21 países".
- Gestão de Academias: o coordenador aparece na planilha como Eduardo Netto; é o Dudu Netto. Ele também palestra no Top of the Rock.
- Bodybuilding: não há programação 2027. A comunicação é por autoridade (Ricardo Pannain, cortes do Podcast Quinn e vídeo da Leal).
- Fora do escopo do Conference (só contexto): Instagram pessoal da Leal; patrocinadores do Arnold (um por dia no feed do Arnold); vídeos em IA para a cota Diamond (a imagem do Arnold Schwarzenegger exige autorização formal); CIMED.
- O calendário de 28/09 a 09/10 espelha o cronograma do cliente (aba Conference, lido em 01/10). Cada card desse período começa com "Registro do cronograma do cliente". A grade de 10 a 31/10 foi montada em 01/10 (etapa 3, `referencias/briefings/etapa3-grade-10-31-outubro.md`) e é validada pelo cliente e pelas agências na plataforma publicada. Cada card de 10 a 31/10 tem a marcação de funil (campo `funnel`: Topo, Meio, Fundo ou Meio/Fundo); os cards de 28/09 a 09/10 ainda não têm. Os carrosséis de programação (14, 16, 20, 27 e 29/10) trazem as opções A e B até o cliente escolher.

## Páginas dos congressos

- A Patrícia confirmou que a programação 2027 será publicada nas páginas dos congressos na terça-feira, 06/10. Reconferir as páginas em 07/10, antes da chamada de 10/10. Em 01/10, a página de Nutrição Esportiva mostrava Rodolfo Peres como coordenador (o correto é Andréia Naves) e a do SONAFE ainda usava o endereço "2-simposio".

## Benefício da inscrição: feira do Arnold Sports Festival (desde 29/09/2026)

- Quem garantir a inscrição em qualquer um dos congressos ganha acesso aos 3 dias da feira do Arnold Sports Festival. Confirmado em 29/09: vale para os seis congressos e para todos os lotes. Só a redação oficial continua pendente.
- A inclusão do benefício nas páginas dos congressos é com a Patrícia, que atualiza o site (não com a Karla).
- Uso só nas peças de venda, uma vez em cada: carrossel de abertura (1006, tela 8), uma peça por congresso (1008 Nutrição Estética, 1014 tela 8 Nutrição Esportiva, 1016 Certificação, 1019 Gestão, 1020 SONAFE, 1030 Bodybuilding) e os e-mails de abertura (06/10, todas as versões), "O que está incluído na sua inscrição" (30/10) e checkout abandonado (disparo de 24h).
- Nunca antes de 06/10, em conteúdo educativo, vídeos de tendência, segundos e-mails temáticos, Stories de link ou de escassez. Sem valor do ingresso da feira.
- Toda peça com o benefício leva "[REDAÇÃO OFICIAL DO BENEFÍCIO – CONFIRMAR COM ADRIANA OU KARLA]" e a instrução de tirar a linha se a redação não estiver confirmada ou se o benefício não estiver nas páginas dos congressos. O teste `octoberPlan.content.test.ts` trava essas regras.

## Referências para peças futuras

- SONAFE, bloco de futebol feminino (peças de autoridade): Fabricio Rapello é especialista em Fisioterapia Esportiva pela SONAFE, doutor em Fisioterapia pela UFSCar, foi fisioterapeuta do Santos FC (categorias de base e futebol feminino) e é coautor, com Bruno Baroni, de um estudo sobre atletas do futebol feminino. Antes de usar, a agência levanta os links das fontes (currículo acadêmico e publicação).

## Vídeos da Leal e collabs

- Leal é a CEO do Arnold South America e do Arnold Conference, e é a porta-voz do evento. Os vídeos dela são gravados e editados pela equipe do cliente (Iris: pautas e roteiros; Dodge: foto e filmagem). A agência do Conference não edita esses vídeos: define data, capa, legenda, CTA e Stories de apoio.
- Os vídeos entram em collab entre o perfil do Arnold e o do Conference. Todo card com vídeo da Leal mostra a pendência "[LINK DO VÍDEO – A RECEBER DA EQUIPE DO CLIENTE]" até o link chegar.
- Vídeos de tendência: toda quinta, publicados pelo Arnold. Quando o tema tem relação com o Conference, o Conference entra na collab; a agência aceita a collab e faz os Stories de ponte para um congresso. ID do card: data DDMM + letra (ex.: 1008a), porque o servidor só aceita 4 dígitos e uma letra de a a c.
- Vídeos de congresso: a data é definida pelo planejamento do Conference.
- Datas comemorativas: usar a arte ou o vídeo do Arnold em collab ou criar peça própria; a decisão é do Raphael.
- Posts de palestrante confirmado: sempre em collab com o palestrante, com dia e horário combinados antes (os primeiros 20 minutos determinam o engajamento).
- Aprovações do cliente: Adriana (Dri), diretora de marketing.
- Backlog de posts sem data para os próximos meses: `referencias/backlog-novembro.md` (fora do Git).
- A capa dos vídeos da Leal usa o "HOOK PARA CAPA" do roteiro, sem reescrever. Não existe campo próprio para hook: ele entra na unidade "Capa" do briefing.
- Roteiros e hooks: documento Crono Arnold e Conference, aba Conference > Pautas mês (https://docs.google.com/document/d/1GOBjD9OyMVQtkaxoPrx0Iy8ja0w-4P6QCeDjcfTcALg).
- Aprovações e informações do cliente: Adriana (Dri) ou Karla.

## E-mail marketing

- Um contato recebe no máximo um e-mail de marketing do Arnold por dia. Nos envios segmentados, vale o interesse mais forte, nesta ordem: participou ou comprou antes > marcou interesse na LP de novidades > assistiu à masterclass do congresso. Sem interesse identificado: versão Geral, com o hub.
- No máximo cerca de 2 e-mails de campanha por semana, cada um casado com o post do mesmo dia, priorizando programação, novidade e urgência. A cada 7 a 10 dias, um e-mail geral para toda a base, para que quem não tem interesse identificado (ou tem interesse em congressos sem e-mail próprio no período) não fique sem contato. Motivo (01/10): cada e-mail é um HTML próprio e a produção pesa para a agência.
- De 11 a 31/10 (desde 01/10): 13/10 programação no ar (geral) · 14/10 programação de Nutrição Esportiva · 16/10 Certificação + Top of the Rock · 23/10 Faltam 6 meses (geral) · 27/10 programação de Gestão · 29/10 programação de Nutrição Estética · 30/10 "O que está incluído na sua inscrição" (geral, exceto compradores), mais a automação de checkout abandonado. Nenhum dia tem dois e-mails de campanha. Os segundos contatos de cada congresso, Bodybuilding, dúvidas e escassez de 29/10 foram para o backlog de novembro.
- Sem teste A/B por enquanto: um assunto por e-mail. Pré-cabeçalhos diferentes entre si.
- Todo briefing tem frase de ponte entre o gancho e o congresso, com exemplo de texto em cada bloco.
- Não repetir temas entre e-mails. Temas de congresso só da programação confirmada, usando os mais quentes com criatividade.
- Promessa da lista (pré-abertura): "quem está na lista recebe as informações do lançamento e tem a oportunidade de concluir a inscrição com a condição especial do lote 1". Quem já está na lista é orientado a ficar de olho na caixa de entrada em 06/10.
- Os checklists de liberação usam linguagem direta, sem siglas como GO, NO-GO ou D-6: momento, o que precisa estar pronto, quem confere e quem libera, e o que acontece se faltar algo.
- E-mails com par, na plataforma: em `octoberEmailPlan.ts`, cada e-mail tem `relatedPost` ("dd/mm · título do post" ou "E-mail sem post relacionado") e, quando há par, `title` igual ao título do post. O teste `octoberPlan.content.test.ts` confere que título e data batem com o calendário.
- Todo prefixo novo de ID de e-mail (ex.: email-nov-) precisa ser incluído na validação de emailItemId em server/routers/planning.ts, com teste, senão a plataforma não salva status nem prévia.

## Resultados do Instagram (Indicadores > Instagram)

- Os números ficam no banco da plataforma, não no Git: são gravados pelo formulário "Salvar resultados" (ou pela mesma chamada `planning.saveSocialResults`, que exige os 8 meses; reenviar os demais meses como estão). Não precisa de push nem da Manus.
- Rotina: Raphael gera o relatório da mLabs do mês e manda o link + o print de mensagens da Meta. Ler o relatório (os dados por publicação estão nos widgets da página), calcular as medianas (arredondar ao inteiro), mostrar a tabela campo a campo e só gravar com o OK dele. Mês em curso: "Resultado parcial"; mês encerrado: período completo, sem parcial.
- Cada mês tem o seu link de relatório em `MLABS_REPORT_URLS` (`shared/socialMetrics.ts`); mês sem link mostra "ainda não disponível". Incluir o link novo exige push e publicação.
- Limitações da mLabs: salvos de Reels vêm zerados; Stories só têm detalhe do Top 20; cliques no link e toques em figurinhas não vêm. Publicação do último dia do mês pode aparecer no relatório do mês seguinte: contar pela data de publicação. O relatório de um mês recém-aberto pode mostrar blocos do mês anterior até a mLabs processar os dados.
- Setembro/2026 fechado em 02/10 (inclui o carrossel orgânico de 30/09, que será impulsionado depois). Outubro/2026 ainda vazio, sem link.

## Documentos vivos (ler antes de propor pautas)

- Aprendizados Operacionais: https://docs.google.com/document/d/1EqPdgFPf82fKZ_c0Bpoq5_VzCJx2Xi7V0i2lV-k6Ghs
- Ideias e novas necessidades: https://docs.google.com/document/d/1MrPtLo-YpPpGB5xBznqg22qHr1Yv4sx9CfJPJizneRw
- Cronograma operacional (aba Conference): https://docs.google.com/spreadsheets/d/1DMCN0wrKaRXISkKH5nmp7_gH82Vmiqc9eOjBsJPzTtc/edit?gid=1417271836
Se não houver acesso ao Google Drive nesta sessão, pedir ao Raphael a versão exportada em `referencias/`. Confirmar com ele que os dois documentos vivos foram lidos.

## Transcrições e minutagens

- Pasta no Drive: https://drive.google.com/drive/folders/1r24CMj5HB-FnKciFHLsm9mQCJ4iaXGDL (links do YouTube + transcrições por congresso).
- Cópia local recomendada em `referencias/transcricoes/` (pasta fora do Git, ver `.gitignore`).
- Minutagens vêm de transcrição automática: indicar início e fim de frase e tolerância de ±2s.
- Por enquanto, não usar pílulas prontas do Drive. Todo corte sai da íntegra, com minutagem do YouTube, frase de início e fim e link do vídeo.
- Bruno Zylber: o vídeo do YouTube (https://youtu.be/8hnvXCzfd3U, 54:38) já é a versão editada, igual ao áudio da transcrição validada. Minutagem do YouTube = minutagem da transcrição, sem somar nada. A diferença de 14:36 citada no parecer vale só para o vídeo original bruto (1:09:15), não para o YouTube. Conferido na transcrição do YouTube em 25/09.
- Antes de publicar qualquer minutagem, conferir a frase no próprio vídeo do YouTube (a transcrição do YouTube mostra o tempo de cada trecho). A transcrição do Drive serve para achar a fala; a minutagem final é a do YouTube.
- Todo corte enviado à agência leva a minutagem do YouTube com a frase de início e a frase de fim. Trecho não confirmado no YouTube não vai para a agência.
- Minutagens conferidas na transcrição do YouTube em 25/09 (todas sem deslocamento em relação às transcrições do Drive): Ivan Lucas 17:32–18:13 (pílula 17:50–18:04); Olívia Fernandes 52:46–53:05; Alessandra Feltre 43:52–44:14 (pílula 45:15–45:26); Américo 36:20–36:51 (pílula 14:17–14:37); Andreia Naves 15:18–15:28; Bruno Zylber 04:33–05:29 (pílula 04:44–04:59).
- Conferida na transcrição do YouTube em 01/10: Bruno Zylber 13:31–13:41 (alternativa segura do card de microbiota), de "esportiva, dieta do atleta" a "tudo isso altera a microbiota"; começar depois de "Rodrigo, aí vai doer, né?".
- Reels do Instagram (Ricardo Pannain) não têm transcrição consultável: a agência confere as falas no player antes da edição.
- Cards movidos de data mudam de ID (novo ID = nova data em DDMM). Antes de trocar o conteúdo de um card mantendo o ID, conferir no site publicado (consulta `planning.getState`) se há status, legenda ou arte salvos para aquele ID; se houver, usar um ID novo com letra e retirar o antigo.

## Links principais

- LP de novidades: https://oferta.savagetgroup.com.br/conference-2027
- LP masterclasses: https://masterclassconference.savagetgroup.com.br/
- Hub: https://arnold.savagetgroup.com.br/conference/
- Páginas dos congressos: ver `octoberDestinations` em `octoberSocialPlan.ts`.

## Pendências em aberto (atualizado em 01/10/2026)

- Aguardando o cliente (pacote-mestre de 01/10, parte 8):
  - validação da grade de 10 a 31/10 e escolha da opção de programação (A, carrossel com todos os palestrantes; B, destaque com 2 ou 3 nomes + automação "Comente PROGRAMAÇÃO");
  - Faltam 6 meses (23/10): collab com o Arnold ou só Conference;
  - número de países da Certificação: o roteiro da Leal diz 18; o Reel do Cris de 02/09 diz "mais de 21". Seguimos com 18 até o time validar;
  - mini-bio da Katherine Ferro (SONAFE), aguardando aprovação dela. Até lá, só nome e tema;
  - quem configura a automação "Comente PROGRAMAÇÃO" no Instagram;
  - cortes do vídeo IA da Leal para anúncios (15 e 30 segundos, vertical e quadrado);
  - collab com o Cris Parente para 31/10 (upgrade opcional, via Patrícia).

- Benefício da feira do Arnold Sports Festival (já confirmado para os seis congressos e todos os lotes): importante confirmar com Adriana ou Karla a redação oficial para garantir perfeito alinhamento comercial da promessa e da oferta.
- Benefício da feira nas páginas dos congressos: alinhar com a Patrícia, que atualiza o site.
- Nutrição Estética: pedir ao cliente que corrija "Lucerna" para "Lucena" na coluna de nomes da planilha (mini-CV e Instagram @drleandrolucena confirmam "Lucena", já usado na plataforma).
- Programação de Nutrição Esportiva: na planilha de 01/10, a data do domingo ainda diz 26/04 (o certo é 25/04) e o Instagram de Paulo Mendes ainda é "paulomendesmutri". Faltam 5 nomes; Marcos Paulo Reis saiu da mesa de corrida.
- SONAFE: Katherine Ferro foi liberada na planilha de 01/10 (só nome e tema até ela aprovar a mini-bio).
- Vídeo de tendência da Leal de 08/10: título "O fitness cresceu. Mas o maior mercado ainda está fora da academia" (roteiro "Academia Luxo"). No cronograma, o título aparece como "Mais o maior mercado": conferir a grafia na capa antes da publicação.
- Datas dos vídeos de tendência da Leal: 5 vídeos em edição para 4 quintas livres em outubro; confirmar com Iris ou Dri.
- Links dos vídeos da Leal, que vêm da equipe do cliente.
- Horário de abertura das vendas em 06/10.
- CRM: campos de interesse, eventos de navegação e evento de checkout abandonado.
- Pasta de prints do SONAFE de 2026.
- Contato de atendimento válido para 2027 (hoje, congresso@savagetgroup.com.br).
- Status do lote 1 antes do e-mail e dos Stories de 30/10.
- Com Adriana ou Karla: número de participantes de Gestão de Academias em 2026 e um tema ou nome confirmado de Bodybuilding 2027 (provas do e-mail de 06/10).
- Allp Fit (card 1031a, sem data): contrato ainda não assinado; quando liberado, substitui uma pílula de fim de semana. Aprovação da Adriana e da marca.
- Migração do @arnold_congressos (card 1001a, no cronograma para 01/10): a desativação do perfil antigo segue com Adriana e a agência de operação.
- Collabs com palestrantes: autorização e horário na opção A dos carrosséis de programação (1014, 1016, 1020, 1027 e 1029) e no vídeo dos coordenadores do SONAFE (1013).
- Backlog de novembro: conferir no YouTube a minutagem do Marcelo Stefani (08:56–09:18) antes de usar.
- Técnicas, sem pedido ainda:
  - a tabela de lançamento (`octoberPlan.ts`) ainda usa "D-6" e "GO/NO-GO";
  - `todo.md` e `VALIDACAO_CONTINGENCIA.md` ainda citam "35 países" (registros históricos);
  - os arquivos do Drive linkados nos cards estão com "qualquer pessoa com o link pode editar"; considerar trocar para leitor.
