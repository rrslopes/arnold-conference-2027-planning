# CLAUDE.md · Planejamento de marketing Arnold Conference 2027

Plataforma de planejamento de marketing do Arnold Conference 2027 (cliente: Savaget Group), operada pela agência Extrema Visibilidade. O conteúdo estratégico (calendário, briefings, e-mails) vive nos arquivos de dados deste repositório. A hospedagem e a publicação são feitas pela Manus, que sincroniza com a branch `main` deste repositório nos dois sentidos.

## Fluxo de trabalho (obrigatório)

1. Antes de qualquer edição: `git pull` na `main`.
2. Nunca editar ao mesmo tempo que a Manus. Se o último commit for da Manus há poucos minutos, perguntar ao Raphael se ela terminou.
3. Editar apenas o que foi pedido. Não mexer em `server/_core`, integrações, banco (drizzle) ou layout sem pedido explícito.
4. Validar sempre: `pnpm check`, `pnpm test`, `pnpm build`. Os testes de conteúdo (`server/*.content.test.ts` e demais testes que não dependem de credenciais) precisam passar. Localmente, falham por falta de credenciais os testes de `planning.integration`, `lovableNews.persistence`, `lovableMasterclass.persistence` e `lovableNewsMetrics`; isso é esperado. Qualquer falha fora desses quatro arquivos bloqueia o push. Se uma regra editorial mudou, atualizar o teste de conteúdo correspondente e explicar no commit.
5. Commit em português, descrevendo o que foi substituído, criado e removido. Depois do push, avisar o Raphael para fazer o pull manual na Manus (ícone do GitHub) e publicar.

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
- Não há depoimentos de participantes de 2026.
- Conteúdo de cases de atletas: educativo e sem link de venda (risco jurídico).
- Autoridade de palestrantes: a agência pesquisa o material bruto; nós indicamos o caminho. Fato sem fonte não entra.
- Sem nomes comerciais de medicamentos e sem marcas de competições (FIFA) nas artes.
- Stories: no máximo 1 ou 2 enquetes por dia, com Story de contexto antes. Menos de 10 respostas = sinal direcional.
- Acervo 2026 sempre identificado como 2026; não sugerir que o palestrante estará em 2027 sem confirmação.
- Números da Certificação Internacional em Personal Training – WTTC (validados no roteiro da Leal): "presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo". Não usar mais "35 países".

## Vídeos da Leal e collabs

- Leal é a CEO do Arnold South America e do Arnold Conference, e é a porta-voz do evento. Os vídeos dela são gravados e editados pela equipe do cliente (Iris: pautas e roteiros; Dodge: foto e filmagem). A agência do Conference não edita esses vídeos: define data, capa, legenda, CTA e Stories de apoio.
- Os vídeos entram em collab entre o perfil do Arnold e o do Conference. Todo card com vídeo da Leal mostra a pendência "[LINK DO VÍDEO – A RECEBER DA EQUIPE DO CLIENTE]" até o link chegar.
- Vídeos de tendência: toda quinta, publicados pelo Arnold. Quando o tema tem relação com o Conference, o Conference entra na collab; a agência aceita a collab e faz os Stories de ponte para um congresso. ID do card: data DDMM + letra (ex.: 1008a), porque o servidor só aceita 4 dígitos e uma letra de a a c.
- Vídeos de congresso: a data é definida pelo planejamento do Conference.
- Datas comemorativas: usar a arte ou o vídeo do Arnold em collab ou criar peça própria; a decisão é do Raphael.
- Posts de palestrante confirmado: sempre em collab com o palestrante, com dia e horário combinados antes (os primeiros 20 minutos determinam o engajamento).
- Aprovações do cliente: Adriana (Dri), diretora de marketing.
- Backlog de posts sem data para os próximos meses: `referencias/backlog-novembro.md` (fora do Git).

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
- Bruno Zylber: a transcrição validada usa um áudio que começa 14:36 depois do vídeo do YouTube. Minutagem YouTube = transcrição + 14:36.
- Minutagens conferidas em 24/09: Ivan Lucas 17:36–18:13; Olívia Fernandes 52:47–53:08; Alessandra Feltre 43:52–44:14 (pílula 45:15–45:22); Américo 36:20–36:51 (pílula 14:17–14:37); Andreia Naves 15:18.9–15:27.6.

## Links principais

- LP de novidades: https://oferta.savagetgroup.com.br/conference-2027
- LP masterclasses: https://masterclassconference.savagetgroup.com.br/
- Hub: https://arnold.savagetgroup.com.br/conference/
- Páginas dos congressos: ver `octoberDestinations` em `octoberSocialPlan.ts`.
