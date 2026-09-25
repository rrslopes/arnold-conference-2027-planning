import type { EmailBriefVersion } from "./emailBriefs";
import { octoberDestinations } from "./octoberSocialPlan";

const conferenceSupportEmail = "mailto:congresso@savagetgroup.com.br";

const suppressions = "Supressões: compradores do congresso deste e-mail, descadastros, contatos sem base legal, e-mails inválidos e quem recebeu outro e-mail de marketing do Arnold no mesmo dia.";

const interestPriority = "Interesse definido pela ordem de prioridade: (1) participou ou comprou o congresso em edições anteriores; (2) marcou o congresso como interesse no cadastro da LP de novidades; (3) assistiu à masterclass ligada ao congresso (Nutrição Estética, Nutrição Esportiva ou Gestão). [CAMPOS DE INTERESSE NO CRM – A CONFIRMAR]: critério que não existir no CRM é ignorado, sem inferência.";

type SourceLink = {
  label: string;
  url: string;
  note: string;
};

type EmailSeed = {
  id: string;
  date: string;
  audience: string;
  objective: string;
  materials: string;
  cta: string;
  destination: string;
  destinationUrl: string;
  rule: string;
  subjectDirection: string;
  steps: Array<{ step: string; role: string; direction: string; example: string }>;
  checks: string[];
  fallback: string;
  limits: string;
  agencyResearch?: string[];
  proofGate?: string;
  sourceLinks?: SourceLink[];
  versions?: EmailBriefVersion[];
};

export const emailOperationalGates = [
  {
    id: "d6",
    moment: "D-6 · antes do envio de 30/09",
    title: "Anúncio da data",
    access: "A agência consulta este gate aqui e no briefing de 30/09. O GO final depende da confirmação do cliente e da operação.",
    evidence: "Ticketeira, data e horário, páginas, checkout em homologação, condições públicas, regra SONAFE, tracking, UTMs e atendimento. A escassez está liberada (\"lote 1 limitado\"); valores e datas de virada de lote continuam proibidos.",
    noGo: "Se algum item crítico não tiver evidência, cancelar o anúncio. Não improvisar nova data, destino ou condição.",
  },
  {
    id: "d2",
    moment: "D-2 · antes do envio de 04/10",
    title: "Lembrete para a base",
    access: "A agência consulta este gate aqui e no briefing de 04/10. O lembrete vai para a base consentida inteira.",
    evidence: "LP de novidades e UTM testadas e supressões aplicadas.",
    noGo: "Se a LP, a UTM ou as supressões falharem no teste, cancelar o envio.",
  },
  {
    id: "d0",
    moment: "D0 · antes do envio de 06/10",
    title: "Inscrições abertas",
    access: "A agência consulta este gate aqui e no briefing de abertura. Somente o responsável operacional pode registrar o GO.",
    evidence: "Compra-teste real em desktop e mobile, confirmação, conciliação, condições idênticas, regras SONAFE, UTM persistente, suporte e supressão de compradores.",
    noGo: "Se a compra não estiver comprovadamente funcional, cancelar o envio e toda afirmação de inscrições abertas.",
  },
  {
    id: "proof",
    moment: "Gate editorial · todos os envios",
    title: "Fonte, autorização e revisão",
    access: "A agência deve anexar as evidências na planilha operacional e seguir o campo Pesquisa e material bruto do briefing.",
    evidence: "Fonte primária, arquivo original, contexto, direitos, autorização e revisão técnica quando houver pessoa, fala, caso, credencial ou conteúdo clínico.",
    noGo: "Sem pacote completo, usar o fallback institucional previsto ou retirar a alegação. Nunca preencher por inferência.",
  },
] as const;

const openingSteps = (audienceLine: string, proof: string): EmailSeed["steps"] => [
  { step: "Bloco 1", role: "Notícia", direction: "Abrir com a notícia, sem introdução.", example: "\"As inscrições estão abertas.\"" },
  { step: "Bloco 2", role: "Para quem e quando", direction: "Público em uma linha, data e coordenação.", example: audienceLine },
  { step: "Bloco 3", role: "Prova", direction: "Um argumento concreto do congresso.", example: proof },
  { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página do congresso.", example: "\"O lote 1 é limitado. Garanta o seu lugar.\" Botão: \"Garanta o seu lugar\"." },
];

const openingVersion = (id: string, congress: string, subject: string, audienceLine: string, proof: string, destinationLabel: string, destinationUrl: string): EmailBriefVersion => ({
  id: `oct-opening-${id}`,
  label: `Versão por interesse · ${congress}`,
  audience: `Contatos cujo interesse mais forte é ${congress}. Cada contato recebe só uma versão.`,
  objective: `Levar quem tem interesse em ${congress} direto à página do congresso no dia da abertura.`,
  subjectDirection: `Assunto: "${subject}". Pré-cabeçalho: "O lote 1 é limitado."`,
  steps: openingSteps(audienceLine, proof),
  cta: "Garanta o seu lugar",
  destinationLabel,
  destinationUrl,
  exclusion: `Um e-mail por contato. Compra confirmada remove o contato dos próximos e-mails comerciais daquele congresso. ${suppressions}`,
});

const openingVersions: EmailBriefVersion[] = [
  openingVersion("sports", "Nutrição Esportiva", "Inscrições abertas: Congresso de Nutrição Esportiva 2027", "\"Para nutricionistas que atendem atletas e praticantes. 24 e 25/04, coordenação de Andréia Naves.\"", "\"Dois dias inteiros só de Nutrição Esportiva.\"", "Página oficial de Nutrição Esportiva", octoberDestinations.sportsNutrition),
  openingVersion("aesthetic", "Nutrição Estética", "Inscrições abertas: Congresso de Nutrição Estética 2027", "\"Para quem atua com estética, emagrecimento e composição corporal. 23/04, coordenação de Luisa Wolpe.\"", "\"Entre os temas confirmados: GLP-1 e cirurgia plástica, queda capilar e lipedema.\"", "Página oficial de Nutrição Estética", octoberDestinations.aestheticNutrition),
  openingVersion("sonafe", "3º Simpósio de Fisioterapia Esportiva da SONAFE", "Inscrições abertas: 3º Simpósio de Fisioterapia Esportiva da SONAFE", "\"Para fisioterapeutas do esporte. 24/04, coordenação de Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo.\"", "\"Em 2026, o simpósio esgotou.\"", "Página oficial do SONAFE", octoberDestinations.sonafe),
  openingVersion("management", "8º Congresso de Gestão de Academias", "Inscrições abertas: 8º Congresso de Gestão de Academias", "\"Para gestores, diretores e donos de academia. 23 e 24/04, coordenação de Dudu Netto.\"", "\"A 8ª edição do encontro de quem decide o futuro das academias.\"", "Página oficial de Gestão de Academias", octoberDestinations.management),
  openingVersion("wttc", "Certificação Internacional em Personal Training – WTTC", "Inscrições abertas: Certificação Internacional em Personal Training – WTTC", "\"Para personal trainers que querem ampliar a atuação para fora do Brasil. 24/04, coordenação de Cris Parente.\"", "\"Chancela WTTC: uma certificação presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo.\"", "Página oficial da Certificação Internacional em Personal Training – WTTC", octoberDestinations.wttc),
  openingVersion("bodybuilding", "Bodybuilding", "Inscrições abertas: Bodybuilding 2027", "\"Para quem vive a preparação de atletas. 25/04, coordenação de Ricardo Pannain.\"", "\"Treino, dieta e recuperação discutidos por quem prepara atletas.\"", "Página oficial de Bodybuilding", octoberDestinations.bodybuilding),
  {
    id: "oct-opening-general",
    label: "Versão por interesse · Geral (sem interesse identificado)",
    audience: "Contatos sem interesse identificado por nenhum dos três critérios. Cada contato recebe só uma versão.",
    objective: "Apresentar os seis congressos no dia da abertura, cada um com seu próprio botão.",
    subjectDirection: "Assunto: \"Inscrições abertas para o Arnold Conference 2027\". Pré-cabeçalho: \"O lote 1 é limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Notícia", direction: "Abrir com a notícia, sem introdução.", example: "\"As inscrições estão abertas.\"" },
      { step: "Bloco 2", role: "Para quem e quando", direction: "Os seis congressos, cada um com uma linha de público e seu próprio botão, na ordem oficial e sem comparação.", example: "\"Nutrição Esportiva · 24 e 25/04 · para nutricionistas que atendem atletas e praticantes.\" + botão, e assim por diante até Bodybuilding." },
      { step: "Bloco 3", role: "Prova", direction: "Reforçar a escassez em uma linha.", example: "\"O lote 1 é limitado.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Botão principal para o hub; os botões do Bloco 2 levam às páginas individuais.", example: "\"Garanta o seu lugar.\" Botão: \"Garanta o seu lugar\"." },
    ],
    cta: "Garanta o seu lugar",
    destinationLabel: "Hub oficial do Arnold Conference",
    destinationUrl: octoberDestinations.conferenceHub,
    exclusion: `Um e-mail por contato. Compra confirmada remove o contato dos próximos e-mails comerciais daquele congresso. ${suppressions}`,
  },
];

const emailSeeds: EmailSeed[] = [
  {
    id: "email-oct-announcement",
    date: "30/09",
    audience: "Base consentida inteira: participantes de edições anteriores, leads das masterclasses e leads da LP de novidades. Aplicar supressões.",
    objective: "Fazer a base registrar a data de 06/10 e entrar na lista, com a escassez do lote 1 como motivo.",
    materials: "KV do Arnold Conference 2027; nomes oficiais dos seis congressos; LP de novidades com UTM.",
    cta: "Quero ser avisado",
    destination: "Landing page geral de novidades",
    destinationUrl: octoberDestinations.news,
    rule: `Um envio. Pode ir para quem já está cadastrado. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"06/10: abrem as inscrições do Arnold Conference 2027\" · B: \"O lote 1 é limitado. As inscrições abrem dia 06/10\". Pré-cabeçalho: \"Quem está na lista recebe o aviso primeiro.\"",
    steps: [
      { step: "Bloco 1", role: "Data", direction: "Abrir com a data na primeira dobra.", example: "\"No dia 06/10 abrem as inscrições para os seis congressos do Arnold Conference 2027.\"" },
      { step: "Bloco 2", role: "O que abre", direction: "Os seis nomes em lista, na ordem oficial, sem descrição comparativa.", example: "Nutrição Esportiva, Nutrição Estética, 3º Simpósio de Fisioterapia Esportiva da SONAFE, 8º Congresso de Gestão de Academias, Certificação Internacional em Personal Training – WTTC, Bodybuilding." },
      { step: "Bloco 3", role: "Escassez", direction: "Explicar por que entrar na lista agora.", example: "\"O lote 1 tem o menor valor da edição e é limitado. Quem entra primeiro garante esse valor.\"" },
      { step: "Bloco 4", role: "Ação", direction: "Levar à LP de novidades com um botão.", example: "\"Entre na lista e receba o aviso no momento da abertura. Se você já se cadastrou, não precisa repetir.\" Botão: \"Quero ser avisado\"." },
    ],
    checks: ["Data de abertura confirmada", "Nomes oficiais", "LP e UTM testadas", "Supressões aplicadas", "Sem valores e sem datas de virada"],
    fallback: "Se a data de 06/10 não estiver confirmada no gate D-6, cancelar o envio.",
    limits: "Não afirmar vendas abertas; sem valores; sem comparação entre congressos.",
    proofGate: "Gate D-6.",
  },
  {
    id: "email-oct-reminder",
    date: "04/10",
    audience: "Base consentida inteira. Aplicar supressões.",
    objective: "Reforçar a abertura em dois dias e trazer para a lista quem ainda não entrou.",
    materials: "LP de novidades com UTM.",
    cta: "Entrar na lista",
    destination: "Landing page geral de novidades",
    destinationUrl: octoberDestinations.news,
    rule: `Um envio. Não enviar e-mail em 05/10 (a véspera fica com Stories e WhatsApp). ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"Faltam 2 dias para o lote 1\" · B: \"Dia 06/10 abre. Você já está na lista?\". Pré-cabeçalho: \"O lote 1 é limitado e o aviso sai primeiro para a lista.\"",
    steps: [
      { step: "Bloco 1", role: "Contagem", direction: "Abrir com a contagem e a data.", example: "\"Faltam 2 dias. As inscrições do Arnold Conference 2027 abrem em 06/10.\"" },
      { step: "Bloco 2", role: "Um congresso por linha", direction: "Uma linha de público por congresso, sem comparação.", example: "\"Nutrição Esportiva: para quem atende atletas e praticantes.\" · \"Nutrição Estética: para quem atua com estética e composição corporal.\" · \"SONAFE: para fisioterapeutas do esporte.\" · \"Gestão de Academias: para quem lidera academias.\" · \"Certificação Internacional em Personal Training – WTTC: para personal trainers com ambição internacional.\" · \"Bodybuilding: para quem vive a preparação de atletas.\"" },
      { step: "Bloco 3", role: "Escassez", direction: "Escassez em uma linha.", example: "\"O lote 1 é limitado.\"" },
      { step: "Bloco 4", role: "Ação", direction: "Levar à LP de novidades com um botão.", example: "Botão: \"Entrar na lista\"." },
    ],
    checks: ["LP e UTM testadas", "Supressões aplicadas"],
    fallback: "Se o gate D-6 tiver caído, cancelar.",
    limits: "Sem valores, sem datas de virada, sem programação além dos temas liberados.",
    proofGate: "Gate D-2 (versão simplificada).",
  },
  {
    id: "email-oct-opening",
    date: "06/10",
    audience: `Base consentida inteira, dividida pela segmentação por interesse em 7 versões (uma por congresso e uma geral). Cada contato recebe só uma versão. ${interestPriority} Aplicar supressões.`,
    objective: "Converter no dia da abertura, levando cada contato direto à página do seu congresso.",
    materials: "Páginas oficiais com checkout funcionando; UTMs por versão; compra-teste aprovada no gate D0.",
    cta: "Garanta o seu lugar",
    destination: "Página do congresso de interesse; hub para a versão Geral",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: `Horário de envio: logo após a abertura · [HORÁRIO DE ABERTURA – A CONFIRMAR]. Um e-mail por contato. Compra confirmada remove o contato dos próximos e-mails comerciais daquele congresso. ${suppressions}`,
    subjectDirection: "Assunto por versão (ver cada versão). Pré-cabeçalho de todas: \"O lote 1 é limitado.\"",
    steps: openingSteps("Público em uma linha, data e coordenação (ver cada versão).", "Um argumento concreto por congresso (ver cada versão)."),
    checks: ["Gate D0 aprovado", "Compra-teste real em desktop e mobile", "UTM por versão", "Nome completo da certificação", "Datas conferidas nas páginas oficiais"],
    fallback: "Se a segmentação não estiver pronta, enviar só a versão Geral para toda a base. Se o gate D0 falhar, cancelar.",
    limits: "Sem valores e sem datas de virada; nenhuma versão compara congressos.",
    proofGate: "Gate D0.",
    versions: openingVersions,
  },
  {
    id: "email-oct-sports",
    date: "08/10",
    audience: "Interesse em Nutrição Esportiva, não compradores.",
    objective: "Mostrar o nível da sala com uma pergunta de consultório e vender o congresso.",
    materials: "Fala de Ivan Lucas (acervo 2026) em texto; mini-bio de Andréia Naves.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Esportiva",
    destinationUrl: octoberDestinations.sportsNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"‘Massa magra caiu’ quer dizer que ele perdeu músculo?\" · B: \"Dois dias só de Nutrição Esportiva\". Pré-cabeçalho: \"A pergunta que a sala de Nutrição Esportiva faz antes de concluir.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta de consultório.", example: "\"O laudo diz que a massa magra caiu. Seu paciente perdeu músculo?\"" },
      { step: "Bloco 2", role: "Resposta curta", direction: "Responder com a fala de Ivan Lucas, identificada como 2026.", example: "\"Em 2026, Ivan Lucas mostrou na sala de Nutrição Esportiva que massa magra, massa livre de gordura e massa muscular são medidas diferentes, e que o método de avaliação muda a leitura.\"" },
      { step: "Bloco 3", role: "O congresso", direction: "Data, formato e coordenação.", example: "\"Em 2027 são dois dias inteiros, 24 e 25/04, com coordenação científica de Andréia Naves, diplomada pelo The Institute for Functional Medicine (EUA) e autora de livros de Nutrição Clínica e Esportiva Funcional.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Crédito \"Arnold Conference 2026\" para Ivan Lucas", "Sem sugerir que Ivan Lucas estará em 2027"],
    fallback: "Sem o gancho de Ivan, abrir direto pelo Bloco 3.",
    limits: "Sem medicamentos, números de estudo ou promessa de resultado.",
    sourceLinks: [
      { label: "Íntegra — Ivan Lucas", url: octoberDestinations.ivan, note: "Acervo 2026 · fala conferida em 17:36–18:13." },
    ],
  },
  {
    id: "email-oct-aesthetic",
    date: "09/10",
    audience: "Interesse em Nutrição Estética, não compradores.",
    objective: "Vender pelos temas confirmados de 2027.",
    materials: "Programação Estética 2027; mini-bio de Luisa Wolpe; fotos dos palestrantes.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Estética",
    destinationUrl: octoberDestinations.aestheticNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"GLP-1, queda capilar e lipedema: Nutrição Estética 2027\" · B: \"Os temas que chegam ao seu consultório em 2027\". Pré-cabeçalho: \"Programação confirmada. Lote 1 limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Abertura", direction: "Anunciar a programação confirmada.", example: "\"A programação de Nutrição Estética 2027 está confirmada. Três temas para você conhecer:\"" },
      { step: "Bloco 2", role: "Três temas", direction: "Três temas em versão editorial curta, com os palestrantes e uma foto por tema.", example: "\"GLP-1 e cirurgia plástica: quem deve operar, quando e como preservar massa muscular\" (Gabriel Ximenes e Pedro Perim) · \"Queda capilar além da ferritina\" (Dr. Leandro Lucerna e Luisa Wolpe) · \"Lipedema: da bioenergética ao tratamento\" (Raquel Wolpe e Luisa Wolpe)." },
      { step: "Bloco 3", role: "Coordenação e data", direction: "Data e coordenação.", example: "\"23/04, coordenação de Luisa Wolpe, especialista em Nutrição Clínica e mestre em Medicina Interna pela UFPR.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"A sala tem lugares limitados e o lote 1 também.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Grafia dos nomes", "Títulos em versão editorial curta"],
    fallback: "Sem fotos, usar só os nomes.",
    limits: "Sem horários, grade completa ou títulos integrais; sem nomes comerciais de medicamentos.",
  },
  {
    id: "email-oct-sonafe",
    date: "10/10",
    audience: "Interesse em SONAFE, não compradores.",
    objective: "Urgência pela demanda de 2026 e atualidade pelos temas de 2027.",
    materials: "2 ou 3 prints de 2026 pedindo vagas (borrados); programação SONAFE 2027.",
    cta: "Garantir minha vaga",
    destination: "Página oficial do SONAFE",
    destinationUrl: octoberDestinations.sonafe,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"Em 2026 esgotou. A 3ª edição do SONAFE está aberta\" · B: \"Quem deixou para depois ficou sem vaga\". Pré-cabeçalho: \"Lote 1 limitado para o 3º Simpósio.\"",
    steps: [
      { step: "Bloco 1", role: "Prova", direction: "Mostrar a demanda de 2026 com prints borrados.", example: "\"Em 2026, o Simpósio de Fisioterapia Esportiva da SONAFE esgotou. Recebemos mensagens assim:\" + 2 ou 3 prints borrados." },
      { step: "Bloco 2", role: "2027", direction: "Data e temas centrais da 3ª edição.", example: "\"A 3ª edição acontece em 24/04 e traz um bloco inteiro dedicado ao futebol feminino, além de concussão no esporte, esporte paralímpico e uma mesa sobre o retorno ao esporte.\"" },
      { step: "Bloco 3", role: "Coordenação", direction: "Nomes da coordenação.", example: "Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo." },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado. Não deixe para depois.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Prints borrados (nome, foto e @)", "Sem marcas da FIFA"],
    fallback: "Sem os prints, manter só a frase \"Em 2026, o simpósio esgotou\" e seguir para o Bloco 2. · [PASTA DE PRINTS SONAFE – A RECEBER]",
    limits: "Sem horários, grade completa ou títulos integrais; sem número de vagas de 2027.",
    sourceLinks: [
      { label: "Programação SONAFE 2027", url: octoberDestinations.sonafeProgram, note: "Usar só temas centrais e nomes; sem horários, grade completa ou títulos integrais." },
    ],
  },
  {
    id: "email-oct-management",
    date: "13/10",
    audience: "Interesse em Gestão de Academias, não compradores.",
    objective: "Tocar na dor da operação dependente do dono e vender a 8ª edição.",
    materials: "Fala de Américo José da Silva Filho (acervo 2026) em texto; mini-bio de Dudu Netto.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Gestão de Academias",
    destinationUrl: octoberDestinations.management,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"Se você ficar doente amanhã, sua academia funciona?\" · B: \"8ª edição do Congresso de Gestão de Academias\". Pré-cabeçalho: \"23 e 24/04. Lote 1 limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta ao dono.", example: "\"Se você ficar doente amanhã, sua academia funciona sem você?\"" },
      { step: "Bloco 2", role: "A fala", direction: "Resumir a fala de Américo, identificada como 2026 e como opinião do palestrante.", example: "\"Em 2026, Américo José da Silva Filho lembrou no Congresso de Gestão que, em muitas academias, todo o funcionamento está na cabeça do dono. E completou: só dá para pensar em expandir quando você consegue tirar 15 dias de férias sem ninguém da empresa te procurar.\"" },
      { step: "Bloco 3", role: "O congresso", direction: "Edição, data e coordenação.", example: "\"A 8ª edição acontece em 23 e 24/04, com coordenação de Dudu Netto, diretor técnico e sócio da Bodytech Company.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Crédito \"Arnold Conference 2026\"", "A fala é opinião do palestrante"],
    fallback: "Sem o Bloco 2, abrir pelo gancho e seguir para o Bloco 3.",
    limits: "Sem números de mercado; sem comparar com a Certificação Internacional em Personal Training – WTTC.",
    sourceLinks: [
      { label: "Íntegra — Américo José da Silva Filho", url: octoberDestinations.americo, note: "Acervo 2026 · fala conferida em 36:20–36:51." },
    ],
  },
  {
    id: "email-oct-wttc",
    date: "14/10",
    audience: "Interesse na Certificação Internacional em Personal Training – WTTC, não compradores.",
    objective: "Despertar a ambição de carreira internacional.",
    materials: "Mini-bio de Cris Parente; números validados da WTTC (5 continentes, 18 países e mais de 35 mil treinadores no mundo).",
    cta: "Garantir minha vaga",
    destination: "Página oficial da Certificação Internacional em Personal Training – WTTC",
    destinationUrl: octoberDestinations.wttc,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"5 continentes. 18 países. Uma certificação.\" · B: \"Até onde sua carreira de personal pode ir?\". Pré-cabeçalho: \"Certificação Internacional em Personal Training – WTTC. Lote 1 limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Situações", direction: "Três situações de carreira internacional.", example: "\"Seu aluno se muda para o exterior e quer continuar com você. Surge uma proposta para trabalhar fora. Você quer que seu método seja reconhecido além do seu bairro.\"" },
      { step: "Bloco 2", role: "Resposta", direction: "Apresentar a certificação pelo nome completo.", example: "\"A Certificação Internacional em Personal Training – WTTC tem chancela WTTC e está presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo.\"" },
      { step: "Bloco 3", role: "Coordenação", direction: "Data e coordenação.", example: "\"24/04, coordenação de Cris Parente, eleito Melhor Personal Trainer do Mundo pelo American Council on Exercise e CEO da World Top Trainers Certification.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Nome completo na primeira menção"],
    fallback: "Sem o Bloco 1, abrir pelo Bloco 2.",
    limits: "Sem promessa de emprego, renda, visto ou equivalência automática.",
    sourceLinks: [
      { label: "Página oficial da certificação", url: octoberDestinations.wttc, note: "Conferir a página antes do disparo. Números validados: 5 continentes, 18 países e mais de 35 mil treinadores no mundo." },
      { label: "Perfil de referência — Cris Parente", url: octoberDestinations.crisSocial, note: "Ajuda a localizar materiais; não substitui fontes primárias das credenciais." },
    ],
  },
  {
    id: "email-oct-bodybuilding",
    date: "15/10",
    audience: "Interesse em Bodybuilding, não compradores.",
    objective: "Mostrar por que a preparação exige decisões integradas.",
    materials: "Conteúdo do post de 09/10.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Bodybuilding",
    destinationUrl: octoberDestinations.bodybuilding,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"Mudou treino, dieta e recuperação na mesma semana. E agora?\" · B: \"Inscrições abertas: Bodybuilding 2027\". Pré-cabeçalho: \"25/04. Lote 1 limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Cena", direction: "Abrir com a semana em que tudo mudou.", example: "\"Segunda muda o treino. Quarta muda a dieta. Sexta muda a recuperação. Na semana seguinte o atleta responde diferente, e ninguém sabe o que funcionou.\"" },
      { step: "Bloco 2", role: "Lição", direction: "Uma lição prática, sem prescrição.", example: "\"Na preparação, registrar o que mudou, quando e por quê é o primeiro passo para decidir melhor.\"" },
      { step: "Bloco 3", role: "O congresso", direction: "Data e coordenação.", example: "\"25/04, coordenação de Ricardo Pannain.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Revisão de profissional de Educação Física"],
    fallback: "Versão curta com os Blocos 3 e 4.",
    limits: "Sem fármacos, doses, ciclos, protocolos ou promessa competitiva.",
  },
  {
    id: "email-oct-sports-2",
    date: "20/10",
    audience: "Interesse em Nutrição Esportiva, não compradores. Prioridade para quem abriu ou clicou o e-mail de 08/10.",
    objective: "Segundo contato de Nutrição Esportiva, a sala com mais lugares para preencher.",
    materials: "Fala de Andreia Naves (acervo 2026) em texto; motivos do post de 10/10.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Esportiva",
    destinationUrl: octoberDestinations.sportsNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"Pré-treino começa quando?\" · B: \"5 motivos para estar em Nutrição Esportiva 2027\". Pré-cabeçalho: \"Spoiler: semanas antes da prova.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta e a fala de Andreia Naves, identificada como 2026.", example: "\"Pré-treino começa na refeição de antes da prova? Em 2026, Andreia Naves mostrou que ele começa semanas antes.\"" },
      { step: "Bloco 2", role: "Motivos", direction: "Três motivos em lista curta.", example: "Dois dias inteiros só de Nutrição Esportiva; coordenação de Andréia Naves; temas que chegam ao consultório." },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Crédito \"Arnold Conference 2026\"", "Não repetir o conteúdo do e-mail de 08/10"],
    fallback: "Só os Blocos 2 e 3.",
    limits: "Sem alimento, suplemento, dose ou promessa de performance.",
    sourceLinks: [
      { label: "Íntegra — Andreia Naves", url: octoberDestinations.andreia, note: "Acervo 2026 · fala conferida em 15:18.9–15:27.6." },
    ],
  },
  {
    id: "email-oct-aesthetic-2",
    date: "23/10",
    audience: "Interesse em Nutrição Estética, não compradores. Prioridade para quem abriu ou clicou o e-mail de 09/10.",
    objective: "Segundo contato com um tema de alto interesse e uma palestrante de autoridade.",
    materials: "Programação Estética 2027; credenciais do Dr. Leandro Lucerna e de Ana Paula Pujol (pesquisa da agência).",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Estética",
    destinationUrl: octoberDestinations.aestheticNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"Queda de cabelo com ferritina normal?\" · B: \"A investigação não para na ferritina\". Pré-cabeçalho: \"Um dos temas de Nutrição Estética 2027.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a situação de consultório.", example: "\"Sua paciente reclama de queda de cabelo, mas a ferritina está normal. E agora?\"" },
      { step: "Bloco 2", role: "O tema", direction: "Apresentar o tema confirmado e quem fala.", example: "\"Em 2027, Dr. Leandro Lucerna e Luisa Wolpe falam de queda capilar além da ferritina, incluindo a queda em quem usa canetas de GLP-1.\"" },
      { step: "Bloco 3", role: "Mais um nome", direction: "Mais uma palestrante da programação, com uma credencial pesquisada pela agência.", example: "\"Na mesma programação, Ana Paula Pujol fala de bioenergética mitocondrial na saúde da mulher.\" + uma credencial dela." },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Revisão por nutricionista", "Não repetir o e-mail de 09/10"],
    fallback: "Sem o Bloco 3.",
    limits: "Sem nomes comerciais de medicamentos, diagnóstico ou conduta.",
    agencyResearch: ["Credenciais públicas do Dr. Leandro Lucerna e de Ana Paula Pujol, com links."],
  },
  {
    id: "email-oct-consideration",
    date: "27/10",
    audience: "Alta intenção sem compra: visitou a página de um congresso duas vezes ou mais, ou iniciou o checkout, desde 06/10. [EVENTOS DE NAVEGAÇÃO NO CRM – A CONFIRMAR]",
    objective: "Tirar as dúvidas que travam a compra.",
    materials: "FAQ oficial; canais de atendimento.",
    cta: "Garantir minha vaga",
    destination: "Página do congresso de interesse do contato",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Teste A/B · A: \"Ficou alguma dúvida sobre a sua inscrição?\" · B: \"Tudo o que você precisa saber antes de se inscrever\". Pré-cabeçalho: \"E o lote 1 continua limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Abertura", direction: "Abrir pelo congresso que a pessoa está considerando.", example: "\"Vimos que você está considerando o [nome do congresso]. Estas são as dúvidas mais comuns:\"" },
      { step: "Bloco 2", role: "Perguntas e respostas", direction: "4 a 5 perguntas com resposta curta, tiradas do FAQ oficial.", example: "Data e local; o que está incluído na inscrição; formas de pagamento; certificado; contato de atendimento." },
      { step: "Bloco 3", role: "Ação", direction: "Botão para a página do congresso de interesse e link do atendimento.", example: "Botão: \"Garantir minha vaga\" + link do atendimento." },
    ],
    checks: ["Contato de atendimento válido para 2027 (atual: congresso@savagetgroup.com.br)"],
    fallback: "Se não houver eventos de navegação, enviar para quem clicou em qualquer e-mail de outubro e não comprou.",
    limits: "Sem valores e sem datas de virada no corpo do e-mail.",
    agencyResearch: ["Respostas só a partir do FAQ oficial e das páginas; resposta sem fonte sai do e-mail."],
    sourceLinks: [
      { label: "Abrir página institucional e FAQ", url: octoberDestinations.conferenceHub, note: "Revisar o conteúdo antes do disparo; a página pode estar em transição." },
      { label: "Contato atualmente publicado", url: conferenceSupportEmail, note: "Confirmar que o endereço segue responsável pela edição de 2027." },
    ],
  },
  {
    id: "email-oct-scarcity",
    date: "29/10",
    audience: `Todos os não compradores da base consentida, segmentados por interesse (mesmas segmentações de 06/10). ${interestPriority}`,
    objective: "Reforço de escassez no fim do primeiro mês de vendas.",
    materials: "Status do lote 1 por congresso, confirmado pelo cliente.",
    cta: "Garantir minha vaga",
    destination: "Página do congresso de interesse; versão Geral no hub",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: `Só enviar após o cliente confirmar que o lote 1 segue disponível. "Últimos lugares" só com confirmação explícita por congresso. ${suppressions}`,
    subjectDirection: "Assunto: \"O lote 1 não espera\" · versão por congresso: \"[Congresso]: o lote 1 é limitado\". Pré-cabeçalho: \"Garanta o menor valor da edição.\"",
    steps: [
      { step: "Bloco 1", role: "Escassez", direction: "Escassez com o nome do congresso.", example: "\"O lote 1 do [congresso] é limitado e é o menor valor desta edição.\"" },
      { step: "Bloco 2", role: "Lembrete de valor", direction: "Uma linha com o argumento principal daquele congresso (o mesmo do Bloco 3 de 06/10).", example: "Nutrição Esportiva: \"Dois dias inteiros só de Nutrição Esportiva.\"" },
      { step: "Bloco 3", role: "Ação", direction: "Botão para a página do congresso.", example: "Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Confirmação do cliente registrada", "Supressão de compradores atualizada no dia"],
    fallback: "Se não houver confirmação, cancelar o envio.",
    limits: "Sem valores e sem datas de virada.",
  },
  {
    id: "email-oct-abandon",
    date: "Desde 06/10",
    audience: "Quem iniciou o checkout e não concluiu. [EVENTO DE CHECKOUT ABANDONADO NA TICKETEIRA/CRM – A CONFIRMAR]",
    objective: "Recuperar a compra interrompida.",
    materials: "Evento de checkout abandonado; link de retomada do checkout; contato de atendimento.",
    cta: "Concluir minha inscrição",
    destination: "Link de retomada do checkout ou página do congresso",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: "Automação com dois disparos: 1h depois do abandono e 24h depois, se não houver compra. Para imediatamente se houver compra. Não enviar mais de dois e-mails de recuperação por pessoa.",
    subjectDirection: "Assunto 1h: \"Sua inscrição ficou pela metade\" · Assunto 24h: \"Seu lugar no lote 1 ainda pode ser garantido\".",
    steps: [
      { step: "Bloco 1", role: "Retomada", direction: "Lembrar a inscrição iniciada.", example: "\"Você começou sua inscrição no [congresso] e não concluiu.\"" },
      { step: "Bloco 2", role: "Ajuda", direction: "Oferecer ajuda se algo deu errado.", example: "\"Se algo deu errado no pagamento, fale com a gente: [contato de atendimento].\"" },
      { step: "Bloco 3", role: "Escassez e ação (só no disparo de 24h)", direction: "Escassez e botão para retomar a inscrição.", example: "\"O lote 1 é limitado.\" Botão: \"Concluir minha inscrição\"." },
    ],
    checks: ["Evento de abandono disponível", "Link de retomada testado", "Parada automática com compra"],
    fallback: "Se a ticketeira não expõe o evento de abandono, a automação não é criada; o público entra no e-mail de 27/10.",
    limits: "Sem valores; não enviar mais de dois e-mails de recuperação por pessoa.",
  },
];

export const octoberEmailBase = emailSeeds.map(({ destinationUrl: _destinationUrl, subjectDirection: _subjectDirection, steps: _steps, checks: _checks, fallback: _fallback, limits: _limits, agencyResearch: _agencyResearch, proofGate: _proofGate, sourceLinks: _sourceLinks, versions: _versions, ...item }) => item);

const isAutomation = (seed: EmailSeed) => seed.date.startsWith("Desde ");

export const octoberEmailBriefs = Object.fromEntries(
  emailSeeds.map(seed => [seed.id, {
    label: isAutomation(seed) ? `Briefing detalhado · automação ativa ${seed.date.toLowerCase()}` : `Briefing detalhado · envio de ${seed.date}`,
    decision: seed.objective,
    rationale: seed.versions
      ? `Este envio tem ${seed.versions.length} versões, uma por segmento de interesse. Cada contato recebe só a versão do seu interesse mais forte, com um CTA principal para a página do congresso; quem não tem interesse identificado recebe a versão Geral.`
      : isAutomation(seed)
        ? `Esta é uma automação, não um disparo com data. O conteúdo é autossuficiente e usa um CTA principal para ${seed.destination.toLowerCase()}.`
        : `Este é um único envio para a audiência elegível. O conteúdo é autossuficiente e usa um CTA principal para ${seed.destination.toLowerCase()}. Não criar versões paralelas para o mesmo segmento.`,
    versions: seed.versions ?? [{
      id: seed.id.replace("email-oct-", "oct-"),
      label: "Versão única · campanha segmentada",
      audience: seed.audience,
      objective: seed.objective,
      subjectDirection: seed.subjectDirection,
      steps: seed.steps,
      cta: seed.cta,
      destinationLabel: seed.destination,
      destinationUrl: seed.destinationUrl,
      exclusion: seed.rule,
    }],
    routing: seed.versions
      ? [
        { condition: "Contato com interesse identificado", action: "Enviar a versão do congresso de maior prioridade: participação ou compra anterior, depois interesse marcado na LP, depois masterclass assistida.", reason: "Um contato, um e-mail por dia." },
        { condition: "Contato sem interesse identificado", action: "Enviar a versão Geral, com o hub e um botão por congresso.", reason: "O hub fica só para quem não tem interesse identificado." },
        { condition: "Compra confirmada, opt-out, falta de consentimento ou outro e-mail do Arnold no mesmo dia", action: "Suprimir o envio.", reason: "Evita insistência, duplicação e comunicação fora do estágio real." },
        { condition: "Segmentação, página, compra-teste ou gate pendente", action: "Aplicar o fallback ou cancelar o slot.", reason: "A cadência não justifica informação incompleta." },
      ]
      : [
        { condition: "Contato atende aos critérios de elegibilidade e frequência", action: "Enviar esta única campanha.", reason: "A mensagem foi desenhada para o estágio e o produto identificados." },
        { condition: "Compra confirmada, opt-out, falta de consentimento ou mensagem equivalente recente", action: "Suprimir o envio.", reason: "Evita insistência, duplicação e comunicação fora do estágio real." },
        { condition: "Material, prova, página, revisão ou gate necessário está pendente", action: "Aplicar o fallback ou cancelar o slot.", reason: "A cadência não justifica informação incompleta ou autoridade inventada." },
      ],
    productionChecks: [seed.versions ? `Produzir as ${seed.versions.length} versões do e-mail, uma por segmento.` : "Produzir uma única versão do e-mail.", ...seed.checks],
    fallback: seed.fallback,
    limits: seed.limits,
    agencyResearch: seed.agencyResearch,
    proofGate: seed.proofGate,
    sourceLinks: seed.sourceLinks,
  }])
);
