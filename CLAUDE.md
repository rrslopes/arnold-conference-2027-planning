# CLAUDE.md · Planejamento de marketing Arnold Conference 2027

Plataforma de planejamento de marketing do Arnold Conference 2027 (cliente: Savaget Group), operada pela agência Extrema Visibilidade. O conteúdo estratégico (calendário, briefings, e-mails) vive nos arquivos de dados deste repositório. A hospedagem e a publicação são feitas pela Manus, que sincroniza com a branch `main` deste repositório nos dois sentidos.

## Fluxo de trabalho (obrigatório)

1. Antes de qualquer edição: `git pull` na `main`.
2. Nunca editar ao mesmo tempo que a Manus. Se o último commit for da Manus há poucos minutos, perguntar ao Raphael se ela terminou.
3. Editar apenas o que foi pedido. Não mexer em `server/_core`, integrações, banco (drizzle) ou layout sem pedido explícito.
4. Validar sempre: `pnpm check`, `pnpm test`, `pnpm build`. Os testes de conteúdo (`server/*.content.test.ts` e demais testes que não dependem de credenciais) precisam passar. Localmente, falham por falta de credenciais os testes de `planning.integration`, `lovableNews.persistence`, `lovableMasterclass.persistence` e `lovableNewsMetrics`; isso é esperado. Qualquer falha fora desses quatro arquivos bloqueia o push. Se uma regra editorial mudou, atualizar o teste de conteúdo correspondente e explicar no commit.
5. Commit em português, descrevendo o que foi substituído, criado e removido. Depois do push, passar ao Raphael o prompt enxuto abaixo para colar na Manus. Quando ela terminar, conferir a versão publicada lendo o site (https://planejamentoconference.savagetgroup.com.br), sem pedir verificações à Manus. Se a mudança tocar servidor, banco ou integrações, o prompt volta a pedir `pnpm test`.

   > Publique a versão atual da branch main do GitHub (rrslopes/arnold-conference-2027-planning), sem editar nenhum arquivo.
   > 1. git pull --ff-only na main. Se houver conflito ou alteração local, pare e me avise.
   > 2. pnpm build. Se falhar, pare e me mostre o erro.
   > 3. Salve o checkpoint e publique.
   > Responda só com o hash do commit publicado. Não faça outras verificações.

## Trabalho em dois computadores (escritório e casa)

- Ao começar: `git pull` na `main`. Ao terminar: commit e `git push`, mesmo que o trabalho continue no dia seguinte.
- Nunca editar em dois lugares ao mesmo tempo: os dois PCs e a Manus. Antes de editar, conferir com `git fetch` e `git status` que não há commit novo nem alteração pendente.
- A pasta `referencias/` fica no OneDrive, em `Projetos-referencias\arnold-conference`. Em cada PC, o repositório tem uma junção de diretório (`mklink /J`) chamada `referencias` apontando para essa pasta. Marcar a pasta do OneDrive como "Sempre manter neste dispositivo".
- Preparar um PC novo (Windows):
  - Instalar Git, Node.js LTS e pnpm 10.4.1 (`npm install -g pnpm@10.4.1`).
  - Clonar o repositório e, dentro dele: `git config core.autocrlf false` e `git config core.eol lf`. Sem isso, o Git converte as quebras de linha e testes de conteúdo falham.
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
| 8º Congresso de Gestão de Academias (2 dias) | 23–24/04 | 279 | 247 | Dudu Netto |
| Certificação Internacional em Personal Training – WTTC | 24/04 | 279 | 190 | Cris Parente |
| Bodybuilding | 25/04 | 279 | 192 | Ricardo Pannain |

Vendas abrem em 06/10/2026. Meta: lotação máxima de todas as salas. Todos os congressos precisam ser vendidos; ter esgotado em 2026 não garante 2027. Hierarquia de apresentação: pilar de nutrição primeiro, depois os demais, sem dedicar uma semana a cada congresso.

## Regras editoriais (vindas do cliente e dos aprendizados)

- Nunca comparar congressos nem colocar um "versus" o outro. Cada público é único.
- Sempre "Certificação Internacional em Personal Training – WTTC" na primeira menção. Nunca só "WTTC".
- SONAFE é a 3ª edição.
- Escassez: usar "lote 1 limitado". Proibido publicar datas de virada de lote e valores.
- Briefings diretos, didáticos e com exemplo. O cliente reprova instrução abstrata.
- Não repetir pautas dentro do mês nem entre meses. Checar o calendário existente antes de propor.
- Programações de Nutrição Estética e SONAFE 2027 são definitivas: temas centrais e nomes podem ser usados; horários, grade completa e títulos integrais não.
- Programação de Nutrição Esportiva 2027 recebida em 25/09 (planilha do cliente, em `editorialIntelligence.ts`), ainda com espaços "Em breve". Até o Raphael confirmar que é definitiva, os temas não entram em posts e e-mails.
- Não há depoimentos de participantes de 2026.
- Conteúdo de cases de atletas: educativo e sem link de venda (risco jurídico).
- Autoridade de palestrantes: a agência pesquisa o material bruto; nós indicamos o caminho. Fato sem fonte não entra.
- Sem nomes comerciais de medicamentos e sem marcas de competições (FIFA) nas artes.
- Stories: no máximo 1 ou 2 enquetes por dia, com Story de contexto antes. Menos de 10 respostas = sinal direcional.
- Acervo 2026 sempre identificado como 2026; não sugerir que o palestrante estará em 2027 sem confirmação.
- Números da Certificação Internacional em Personal Training – WTTC (validados no roteiro da Leal): "presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo". Não usar mais "35 países".
- Posts de autoridade (palestrante ou coordenador): nada de "5 coisas sobre…"; cada post tem título próprio, puxado pelo que a pessoa traz ao congresso, e no máximo um em formato de lista. Espaçar as datas (nunca em dias seguidos), para não criar a expectativa de uma série com todos os palestrantes.
- Título que promete algo que a pessoa disse (ex.: "O que Dudu Netto aprendeu sobre gestão…") exige fala pública com fonte; sem fonte, usar a alternativa segura do card.
- Quando o áudio da Leal disser que um congresso "nasce" e ele já existir (SONAFE, Gestão de Academias, Bodybuilding), a legenda não apresenta como estreia e deixa clara a edição.
- Números de mercado sem fonte não entram em peças produzidas pela agência do Conference. Vídeos da Leal publicados em collab seguem a aprovação do cliente.

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
- Nutrição vem na frente também nos segundos contatos. Nenhum congresso fica mais de cerca de 12 dias sem e-mail durante as vendas.
- Sem teste A/B por enquanto: um assunto por e-mail. Pré-cabeçalhos diferentes entre si.
- Todo briefing tem frase de ponte entre o gancho e o congresso, com exemplo de texto em cada bloco.
- Não repetir temas entre e-mails. Temas de congresso só da programação confirmada, usando os mais quentes com criatividade.
- Promessa da lista (pré-abertura): "quem está na lista recebe as informações do lançamento e tem a oportunidade de concluir a inscrição com a condição especial do lote 1". Quem já está na lista é orientado a ficar de olho na caixa de entrada em 06/10.
- Os checklists de liberação usam linguagem direta, sem siglas como GO, NO-GO ou D-6: momento, o que precisa estar pronto, quem confere e quem libera, e o que acontece se faltar algo.

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
- Minutagens conferidas na transcrição do YouTube em 25/09 (todas sem deslocamento em relação às transcrições do Drive): Ivan Lucas 17:32–18:13 (pílula 17:50–18:04); Olívia Fernandes 52:46–53:05; Alessandra Feltre 43:52–44:14 (pílula 45:15–45:26); Américo 36:20–36:51 (pílula 14:17–14:37); Andreia Naves 15:18–15:28; Bruno Zylber 04:33–05:29 (pílula 04:44–04:59).
- Reels do Instagram (Ricardo Pannain) não têm transcrição consultável: a agência confere as falas no player antes da edição.
- Cards movidos de data mudam de ID (novo ID = nova data em DDMM). Antes de trocar o conteúdo de um card mantendo o ID, conferir no site publicado (consulta `planning.getState`) se há status, legenda ou arte salvos para aquele ID; se houver, usar um ID novo com letra e retirar o antigo.

## Links principais

- LP de novidades: https://oferta.savagetgroup.com.br/conference-2027
- LP masterclasses: https://masterclassconference.savagetgroup.com.br/
- Hub: https://arnold.savagetgroup.com.br/conference/
- Páginas dos congressos: ver `octoberDestinations` em `octoberSocialPlan.ts`.

## Pendências em aberto (atualizado em 28/09/2026)

- Programação de Nutrição Esportiva: confirmar se é definitiva. Na planilha, conferir a data do domingo (diz 26/04; o certo é 25/04) e o Instagram de Paulo Mendes ("paulomendesmutri").
- Datas dos vídeos de tendência da Leal: 5 vídeos em edição para 4 quintas livres em outubro; confirmar com Iris ou Dri.
- Links dos vídeos da Leal, que vêm da equipe do cliente.
- Horário de abertura das vendas em 06/10.
- CRM: campos de interesse, eventos de navegação e evento de checkout abandonado.
- Pasta de prints do SONAFE de 2026.
- Contato de atendimento válido para 2027 (hoje, congresso@savagetgroup.com.br).
- Status do lote 1 antes do e-mail e dos Stories de 29 e 30/10.
- Com Adriana ou Karla: número de participantes de Gestão de Academias em 2026 e um tema ou nome confirmado de Bodybuilding 2027 (provas do e-mail de 06/10).
- Allp Fit (25/10): aprovação da Adriana e da marca.
- Migração do @arnold_congressos (0930a): condução com Adriana e a agência de operação.
- Collabs com palestrantes (1016, 1021, 1027, 1029): autorização e horário.
- Card 1029 (Cris Parente): a ideia estratégica ainda cita o formato "5 coisas"; o título e a capa já seguem a regra nova.
- Backlog de novembro: conferir no YouTube a minutagem do Marcelo Stefani (08:56–09:18) antes de usar.
- Técnicas, sem pedido ainda:
  - o servidor só aceita salvar status e prévia de e-mails com ID `email-base-` ou `email-nurture-` (`server/routers/planning.ts`); os e-mails de outubro (`email-oct-`) não conseguem ser salvos;
  - a tabela de lançamento (`octoberPlan.ts`) ainda usa "D-6" e "GO/NO-GO";
  - `todo.md` e `VALIDACAO_CONTINGENCIA.md` ainda citam "35 países" (registros históricos);
  - os arquivos do Drive linkados nos cards estão com "qualquer pessoa com o link pode editar"; considerar trocar para leitor.
