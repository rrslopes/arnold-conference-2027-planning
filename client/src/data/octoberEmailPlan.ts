import type { EmailBriefVersion } from "./emailBriefs";
import { octoberDestinations } from "./octoberSocialPlan";

const conferenceSupportEmail = "mailto:congresso@savagetgroup.com.br";

const suppressions = "Supressões: compradores do congresso deste e-mail, descadastros, contatos sem base legal, e-mails inválidos e quem recebeu outro e-mail de marketing do Arnold no mesmo dia.";

const interestPriority = "Interesse definido pela ordem de prioridade: (1) participou ou comprou o congresso em edições anteriores; (2) marcou o congresso como interesse no cadastro da LP de novidades; (3) assistiu à masterclass ligada ao congresso (Nutrição Estética, Nutrição Esportiva ou Gestão). [CAMPOS DE INTERESSE NO CRM – A CONFIRMAR]: critério que não existir no CRM é ignorado, sem inferência.";

const fairBenefitPending = "[REDAÇÃO OFICIAL DO BENEFÍCIO – CONFIRMAR COM ADRIANA OU KARLA]";

const listPromise = "Quem está na lista recebe as informações do lançamento e tem a oportunidade de concluir a inscrição com a condição especial do lote 1.";

type SourceLink = {
  label: string;
  url: string;
  note: string;
};

type EmailSeed = {
  id: string;
  date: string;
  /** Mesmo título do post relacionado, quando houver par. */
  title?: string;
  /** "dd/mm · título do post" ou "E-mail sem post relacionado". */
  relatedPost: string;
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
    moment: "Antes do e-mail de 30/09 · 6 dias antes da abertura",
    title: "Checklist do anúncio da data",
    access: "A agência confere os itens aqui e no briefing de 30/09. Quem libera o envio é o cliente, junto com a operação.",
    evidence: "Data e horário de abertura confirmados; ticketeira e páginas dos congressos prontas; checkout em teste; condições comerciais públicas definidas; regra do SONAFE definida; rastreamento e links com UTM testados; atendimento pronto. Pode usar \"lote 1 limitado\"; valores e datas de virada de lote continuam proibidos.",
    noGo: "Se algum desses itens não estiver confirmado, o anúncio não sai. Não inventar outra data, outro destino ou outra condição.",
  },
  {
    id: "d2",
    moment: "Antes do e-mail de 04/10 · 2 dias antes da abertura",
    title: "Checklist do lembrete",
    access: "A agência confere os itens aqui e no briefing de 04/10. O lembrete vai para a base consentida inteira.",
    evidence: "LP de novidades e links com UTM testados, e supressões aplicadas.",
    noGo: "Se a LP, os links ou as supressões falharem no teste, o lembrete não sai.",
  },
  {
    id: "d0",
    moment: "Antes do e-mail de 06/10 · dia da abertura",
    title: "Checklist da abertura",
    access: "A agência confere os itens aqui e no briefing de 06/10. Só o responsável da operação pode liberar o envio.",
    evidence: "Compra-teste real em desktop e mobile, do pagamento à confirmação; conciliação da venda; condições iguais no site e no checkout; regra do SONAFE aplicada; UTM mantida até a compra; atendimento pronto; compradores retirados das próximas listas.",
    noGo: "Se a compra não funcionar de ponta a ponta, o e-mail não sai e nenhum canal diz que as inscrições estão abertas.",
  },
  {
    id: "proof",
    moment: "Todos os e-mails",
    title: "Checklist de fontes e autorizações",
    access: "A agência anexa as comprovações na planilha operacional, seguindo o campo \"Pesquisa e material bruto\" de cada briefing.",
    evidence: "Fonte original, contexto, direito de uso, autorização e revisão técnica sempre que o e-mail citar pessoa, fala, caso, credencial ou conteúdo clínico.",
    noGo: "Sem essas comprovações, usar a alternativa segura do briefing ou retirar a informação. Nunca completar por dedução.",
  },
] as const;

const openingSteps = (audienceLine: string, proof: string): EmailSeed["steps"] => [
  { step: "Bloco 1", role: "Notícia", direction: "Abrir com a notícia, sem introdução.", example: "\"As inscrições estão abertas.\"" },
  { step: "Bloco 2", role: "Para quem e quando", direction: "Público em uma linha, data e coordenação.", example: audienceLine },
  { step: "Bloco 3", role: "Prova", direction: "Um argumento concreto do congresso, apresentado como o motivo para garantir o lugar agora.", example: proof },
  { step: "Bloco 4", role: "Escassez e ação", direction: "Ligar a prova à escassez e levar à página do congresso.", example: `"Quer estar nessa sala em 2027? A inscrição também dá acesso aos 3 dias da feira do Arnold Sports Festival. O lote 1 é limitado. Garanta o seu lugar." ${fairBenefitPending} Sem a redação confirmada ou sem o benefício nas páginas, tirar a frase da feira. Botão: "Garanta o seu lugar".` },
];

const openingVersion = (id: string, congress: string, subject: string, audienceLine: string, proof: string, destinationLabel: string, destinationUrl: string): EmailBriefVersion => ({
  id: `oct-opening-${id}`,
  label: `Versão por interesse · ${congress}`,
  audience: `Contatos cujo interesse mais forte é ${congress}. Cada contato recebe só uma versão.`,
  objective: `Levar quem tem interesse em ${congress} direto à página do congresso no dia da abertura.`,
  subjectDirection: `Assunto: "${subject}". Pré-cabeçalho: "As inscrições abriram agora. O lote 1 é limitado."`,
  steps: openingSteps(audienceLine, proof),
  cta: "Garanta o seu lugar",
  destinationLabel,
  destinationUrl,
  exclusion: `Um e-mail por contato. Compra confirmada remove o contato dos próximos e-mails comerciais daquele congresso. ${suppressions}`,
});

const openingVersions: EmailBriefVersion[] = [
  openingVersion("sports", "Nutrição Esportiva", "Inscrições abertas: Congresso de Nutrição Esportiva 2027", "\"Para nutricionistas que atendem atletas e praticantes. 24 e 25/04, coordenação de Andréia Naves.\"", "\"Dois dias inteiros só de Nutrição Esportiva.\"", "Página oficial de Nutrição Esportiva", octoberDestinations.sportsNutrition),
  openingVersion("aesthetic", "Nutrição Estética", "Inscrições abertas: Congresso de Nutrição Estética 2027", "\"Para quem atua com estética, emagrecimento e composição corporal. 23/04, coordenação de Luisa Wolpe.\"", "\"A programação de 2027 já está confirmada.\" (Os temas ficam para o e-mail de 09/10.)", "Página oficial de Nutrição Estética", octoberDestinations.aestheticNutrition),
  openingVersion("sonafe", "3º Simpósio de Fisioterapia Esportiva da SONAFE", "Inscrições abertas: 3º Simpósio de Fisioterapia Esportiva da SONAFE", "\"Para fisioterapeutas do esporte. 24/04, coordenação de Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo.\"", "\"Em 2026, o simpósio esgotou.\"", "Página oficial do SONAFE", octoberDestinations.sonafe),
  openingVersion("management", "8º Congresso de Gestão de Academias", "Inscrições abertas: 8º Congresso de Gestão de Academias", "\"Para gestores, diretores e donos de academia. 23 e 24/04, coordenação de Dudu Netto.\"", "\"Em 2026, mais de 240 gestores e donos de academia participaram do congresso.\" [NÚMERO DE PARTICIPANTES DE 2026 – CONFIRMAR COM ADRIANA OU KARLA]. Sem confirmação: \"A 8ª edição do encontro de quem decide o futuro das academias.\"", "Página oficial de Gestão de Academias", octoberDestinations.management),
  openingVersion("wttc", "Certificação Internacional em Personal Training – WTTC", "Inscrições abertas: Certificação Internacional em Personal Training – WTTC", "\"Para personal trainers que querem ampliar a atuação para fora do Brasil. 23 e 24/04, à noite: a Certificação na sexta e o Top of the Rock no sábado, na mesma inscrição. Coordenação de Cris Parente.\"", "\"Chancela WTTC: uma certificação presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo.\"", "Página oficial da Certificação Internacional em Personal Training – WTTC", octoberDestinations.wttc),
  openingVersion("bodybuilding", "Bodybuilding", "Inscrições abertas: Bodybuilding 2027", "\"Para quem vive a preparação de atletas. 25/04, coordenação de Ricardo Pannain.\"", "Um tema ou nome confirmado da programação de Bodybuilding 2027, em uma linha. [TEMA OU NOME CONFIRMADO – LOCALIZAR COM ADRIANA OU KARLA]. Sem confirmação: \"Treino, dieta e recuperação discutidos por quem prepara atletas.\"", "Página oficial de Bodybuilding", octoberDestinations.bodybuilding),
  {
    id: "oct-opening-general",
    label: "Versão por interesse · Geral (sem interesse identificado)",
    audience: "Contatos sem interesse identificado por nenhum dos três critérios. Cada contato recebe só uma versão.",
    objective: "Apresentar os seis congressos no dia da abertura, cada um com seu próprio botão.",
    subjectDirection: "Assunto: \"Inscrições abertas para o Arnold Conference 2027\". Pré-cabeçalho: \"As inscrições abriram agora. O lote 1 é limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Notícia", direction: "Abrir com a notícia, sem introdução.", example: "\"As inscrições estão abertas.\"" },
      { step: "Bloco 2", role: "Para quem e quando", direction: "Os seis congressos, cada um com uma linha de público e seu próprio botão, na ordem oficial e sem comparação. Abrir a lista com uma frase de ligação.", example: "\"Escolha a sala da sua área:\" + \"Nutrição Esportiva · 24 e 25/04 · para nutricionistas que atendem atletas e praticantes\" + botão, e assim por diante até Bodybuilding." },
      { step: "Bloco 3", role: "Prova", direction: "Um fato real de demanda, em uma linha.", example: "\"Em 2026, o Simpósio de Fisioterapia Esportiva da SONAFE esgotou.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Ligar a prova à escassez. Botão principal para o hub; os botões do Bloco 2 levam às páginas individuais.", example: `"Neste ano, o lote 1 também é limitado, e qualquer inscrição dá acesso aos 3 dias da feira do Arnold Sports Festival. Garanta o seu lugar." ${fairBenefitPending} Sem a redação confirmada ou sem o benefício nas páginas, tirar a frase da feira. Botão: "Garanta o seu lugar".` },
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
    title: "06/10: abrem as inscrições do Arnold Conference 2027",
    relatedPost: "30/09 · 06/10: abrem as inscrições do Arnold Conference 2027",
    audience: "Base consentida inteira: participantes de edições anteriores, leads das masterclasses e leads da LP de novidades. Aplicar supressões.",
    objective: "Fazer a base registrar a data de 06/10 e entrar na lista, com a escassez do lote 1 como motivo.",
    materials: "KV do Arnold Conference 2027; nomes oficiais dos seis congressos; LP de novidades com UTM.",
    cta: "Quero ser avisado",
    destination: "Landing page geral de novidades",
    destinationUrl: octoberDestinations.news,
    rule: `Um envio. Pode ir para quem já está cadastrado. ${suppressions}`,
    subjectDirection: "Assunto: \"06/10: abrem as inscrições do Arnold Conference 2027\". Pré-cabeçalho: \"Quem está na lista recebe as informações do lançamento.\"",
    steps: [
      { step: "Bloco 1", role: "Data", direction: "Abrir com a data na primeira dobra.", example: "\"No dia 06/10 abrem as inscrições para os seis congressos do Arnold Conference 2027.\"" },
      { step: "Bloco 2", role: "O que abre", direction: "Os seis nomes em lista, na ordem oficial, sem descrição comparativa, fechando com uma frase que leva à escassez.", example: "Nutrição Esportiva, Nutrição Estética, 3º Simpósio de Fisioterapia Esportiva da SONAFE, 8º Congresso de Gestão de Academias, Certificação Internacional em Personal Training – WTTC, Bodybuilding. Depois da lista: \"E cada sala abre com o lote 1.\"" },
      { step: "Bloco 3", role: "Escassez", direction: "Explicar por que agir antes da abertura.", example: "\"O lote 1 tem o menor valor da edição e é limitado. Quem entra primeiro garante esse valor.\"" },
      { step: "Bloco 4", role: "Ação", direction: "Dizer o que a lista garante e orientar quem já está nela.", example: `"${listPromise} Já está na lista? No dia 06/10, fique de olho na sua caixa de entrada (e confira também as abas Promoções e Spam)." Botão: "Quero ser avisado".` },
    ],
    checks: ["Data de abertura confirmada", "Nomes oficiais", "LP e UTM testadas", "Supressões aplicadas", "Sem valores e sem datas de virada"],
    fallback: "Se a data de 06/10 não estiver confirmada no checklist do anúncio da data, cancelar o envio.",
    limits: "Não afirmar vendas abertas; sem valores; sem comparação entre congressos.",
    proofGate: "Liberação: checklist do anúncio da data (antes do e-mail de 30/09).",
  },
  {
    id: "email-oct-reminder",
    date: "04/10",
    title: "Faltam 2 dias",
    relatedPost: "04/10 · Faltam 2 dias",
    audience: "Base consentida inteira. Aplicar supressões.",
    objective: "Reforçar a abertura em dois dias e trazer para a lista quem ainda não entrou.",
    materials: "LP de novidades com UTM.",
    cta: "Entrar na lista",
    destination: "Landing page geral de novidades",
    destinationUrl: octoberDestinations.news,
    rule: `Um envio. Não enviar e-mail em 05/10 (a véspera fica com Stories e WhatsApp). ${suppressions}`,
    subjectDirection: "Assunto: \"Faltam 2 dias para o lote 1\". Pré-cabeçalho: \"Seis perguntas que você enfrenta no trabalho.\"",
    steps: [
      { step: "Bloco 1", role: "Contagem", direction: "Abrir com a contagem e a data.", example: "\"Faltam 2 dias. As inscrições do Arnold Conference 2027 abrem em 06/10.\"" },
      { step: "Bloco 2", role: "Uma pergunta por congresso", direction: "Apresentar cada congresso pela pergunta real que ele ajuda a responder. Abrir com a frase de ligação e fechar com a frase de retorno; uma linha por congresso, na ordem oficial, sem comparação. As perguntas não repetem os temas dos e-mails seguintes.", example: "Abertura: \"Cada congresso de 2027 parte de uma pergunta que você enfrenta no trabalho:\" · Nutrição Esportiva: \"O que o intestino do atleta tem a ver com a preparação?\" · Nutrição Estética: \"Nutrição regenerativa: o que já mudou no consultório de estética?\" · SONAFE: \"Controle de carga: quando aumentar e quando reduzir?\" · Gestão de Academias: \"Sua academia cresce com equipamento ou com gestão?\" · Certificação Internacional em Personal Training – WTTC: \"Até onde sua carreira de personal pode ir?\" · Bodybuilding: \"Muita gente vê o palco. Quem entende tudo que constrói um atleta?\" Fechamento: \"É para perguntas assim que existem as salas do Arnold Conference.\" (Só os temas de Nutrição Estética e SONAFE estão confirmados na programação de 2027; as demais perguntas não podem ser apresentadas como temas de 2027.)" },
      { step: "Bloco 3", role: "Escassez", direction: "Transformar a demanda de 2026 em motivo para não deixar para depois.", example: "\"E não dá para deixar para depois: em 2026, o Simpósio de Fisioterapia Esportiva da SONAFE esgotou. O lote 1 de 2027 é limitado.\"" },
      { step: "Bloco 4", role: "Ação", direction: "Dizer o que a lista garante e orientar quem já está nela.", example: `"${listPromise} Já está na lista? No dia 06/10, fique de olho na sua caixa de entrada." Botão: "Entrar na lista".` },
    ],
    checks: ["LP e UTM testadas", "Supressões aplicadas", "Frase \"em 2026, o SONAFE esgotou\" confirmada"],
    fallback: "Se o checklist do anúncio da data tiver deixado de valer (data ou condições mudaram), cancelar.",
    limits: "Sem valores, sem datas de virada, sem programação além dos temas liberados.",
    proofGate: "Liberação: checklist do lembrete (antes do e-mail de 04/10).",
  },
  {
    id: "email-oct-opening",
    date: "06/10",
    title: "Inscrições abertas. Lote 1 limitado.",
    relatedPost: "06/10 · Inscrições abertas. Lote 1 limitado.",
    audience: `Base consentida inteira, dividida pela segmentação por interesse em 7 versões (uma por congresso e uma geral). Cada contato recebe só uma versão. ${interestPriority} Aplicar supressões.`,
    objective: "Converter no dia da abertura, levando cada contato direto à página do seu congresso.",
    materials: "Páginas oficiais com checkout funcionando; UTMs por versão; compra-teste aprovada no checklist da abertura.",
    cta: "Garanta o seu lugar",
    destination: "Página do congresso de interesse; hub para a versão Geral",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: `Horário de envio: logo após a abertura · [HORÁRIO DE ABERTURA – A CONFIRMAR]. Um e-mail por contato. Compra confirmada remove o contato dos próximos e-mails comerciais daquele congresso. ${suppressions}`,
    subjectDirection: "Assunto por versão (ver cada versão). Pré-cabeçalho de todas: \"As inscrições abriram agora. O lote 1 é limitado.\"",
    steps: openingSteps("Público em uma linha, data e coordenação (ver cada versão).", "Um argumento concreto por congresso (ver cada versão)."),
    checks: ["Checklist da abertura aprovado", "Benefício da feira com a redação oficial confirmada por Adriana ou Karla e publicado nas páginas dos congressos", "Compra-teste real em desktop e mobile", "UTM por versão", "Nome completo da certificação", "Datas conferidas nas páginas oficiais"],
    fallback: "Se a segmentação não estiver pronta, enviar só a versão Geral para toda a base. Se o checklist da abertura não for aprovado, cancelar.",
    limits: "Sem valores e sem datas de virada; nenhuma versão compara congressos.",
    agencyResearch: [
      "Tentar localizar com Adriana ou Karla o número de participantes do Congresso de Gestão de Academias em 2026 (e se ele pode ser divulgado) e um tema ou nome já confirmado da programação de Bodybuilding 2027. São as provas mais fortes dessas duas versões; sem confirmação, usar a frase alternativa indicada em cada uma.",
    ],
    proofGate: "Liberação: checklist da abertura (antes do e-mail de 06/10).",
    versions: openingVersions,
  },
  {
    id: "email-oct-sports",
    date: "08/10",
    title: "\"Massa magra caiu\" não quer dizer \"perdeu músculo\"",
    relatedPost: "02/10 · \"Massa magra caiu\" não quer dizer \"perdeu músculo\"",
    audience: "Interesse em Nutrição Esportiva, não compradores.",
    objective: "Mostrar o nível da sala com uma pergunta de consultório e vender o congresso.",
    materials: "Fala de Ivan Lucas (acervo 2026) em texto; mini-bio de Andréia Naves; tema de doping e nutrição da programação 2027 de Nutrição Esportiva.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Esportiva",
    destinationUrl: octoberDestinations.sportsNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"‘Massa magra caiu’ quer dizer que ele perdeu músculo?\". Pré-cabeçalho: \"A pergunta que a sala de Nutrição Esportiva faz antes de concluir.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta de consultório.", example: "\"O laudo diz que a massa magra caiu. Seu paciente perdeu músculo?\"" },
      { step: "Bloco 2", role: "Resposta curta", direction: "Responder com a fala de Ivan Lucas, identificada como 2026, e fechar com a ponte para 2027.", example: "\"Não necessariamente. Em 2026, Ivan Lucas mostrou na sala de Nutrição Esportiva que massa magra, massa livre de gordura e massa muscular são medidas diferentes, e que o método de avaliação muda a leitura. Em 2027, ele volta à sala para falar de GLP-1 e performance esportiva.\"" },
      { step: "Bloco 3", role: "O congresso", direction: "Abrir com a frase de ponte e seguir com data, formato, coordenação e um tema da programação 2027.", example: "\"É esse nível de pergunta que a sala faz antes de concluir. Em 2027 são dois dias inteiros, 24 e 25/04, com coordenação científica de Andréia Naves, diplomada pelo The Institute for Functional Medicine (EUA) e autora de livros de Nutrição Clínica e Esportiva Funcional. Um dos temas já anunciados: doping e nutrição, com o passaporte biológico do atleta de elite.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Crédito \"Arnold Conference 2026\" para Ivan Lucas", "Ivan Lucas está na programação 2027 (Dr. Ivan Lucas Picone, mesa de GLP-1 e performance, conferido pelo mini-CV em 29/09): citar o tema sem horário nem título integral", "Tema de doping sem horário nem título integral da mesa"],
    fallback: "Sem o gancho de Ivan, abrir direto pelo Bloco 3, sem a frase de ponte.",
    limits: "Sem medicamentos, números de estudo ou promessa de resultado.",
    sourceLinks: [
      { label: "Íntegra — Ivan Lucas", url: octoberDestinations.ivan, note: "Acervo 2026 · fala conferida no YouTube em 17:32–18:13." },
    ],
  },
  {
    id: "email-oct-aesthetic",
    date: "09/10",
    title: "Inscrições abertas: Congresso de Nutrição Estética 2027",
    relatedPost: "08/10 · Inscrições abertas: Congresso de Nutrição Estética 2027",
    audience: "Interesse em Nutrição Estética, não compradores.",
    objective: "Vender pelos temas confirmados de 2027.",
    materials: "Programação Estética 2027; mini-bio de Luisa Wolpe; fotos dos palestrantes.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Estética",
    destinationUrl: octoberDestinations.aestheticNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"GLP-1, queda capilar e lipedema: Nutrição Estética 2027\". Pré-cabeçalho: \"Três temas de Nutrição Estética 2027.\"",
    steps: [
      { step: "Bloco 1", role: "Abertura", direction: "Anunciar a programação confirmada.", example: "\"A programação de Nutrição Estética 2027 está confirmada. Três temas para você conhecer:\"" },
      { step: "Bloco 2", role: "Três temas", direction: "Três temas em versão editorial curta, com os palestrantes e uma foto por tema.", example: "\"GLP-1 e cirurgia plástica: quem deve operar, quando e como preservar massa muscular\" (Gabriel Ximenes e Pedro Perim) · \"Queda capilar além da ferritina\" (Dr. Leandro Lucena e Luisa Wolpe) · \"Lipedema: da bioenergética ao tratamento\" (Raquel Wolpe e Luisa Wolpe)." },
      { step: "Bloco 3", role: "Coordenação e data", direction: "Abrir com a frase de ponte e seguir com data e coordenação.", example: "\"São temas que já chegam ao consultório, discutidos por quem pesquisa e atende. Em 23/04, com coordenação de Luisa Wolpe, pós-graduada em Nutrição Clínica e mestre em Ciências da Saúde pela UFPR.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"A sala tem lugares limitados e o lote 1 também.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Grafia dos nomes", "Títulos em versão editorial curta"],
    fallback: "Sem fotos, usar só os nomes.",
    limits: "Sem horários, grade completa ou títulos integrais; sem nomes comerciais de medicamentos. Estes três temas não se repetem no e-mail de 21/10.",
  },
  {
    id: "email-oct-sonafe",
    date: "10/10",
    relatedPost: "E-mail sem post relacionado",
    audience: "Interesse em SONAFE, não compradores.",
    objective: "Urgência pela demanda de 2026 e atualidade pelos temas de 2027.",
    materials: "2 ou 3 prints de 2026 pedindo vagas (borrados); programação SONAFE 2027.",
    cta: "Garantir minha vaga",
    destination: "Página oficial do SONAFE",
    destinationUrl: octoberDestinations.sonafe,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Em 2026 esgotou. A 3ª edição do SONAFE está aberta\". Pré-cabeçalho: \"Futebol feminino, concussão e retorno ao esporte em 24/04.\"",
    steps: [
      { step: "Bloco 1", role: "Prova", direction: "Mostrar a demanda de 2026 com prints borrados.", example: "\"Em 2026, o Simpósio de Fisioterapia Esportiva da SONAFE esgotou. Recebemos mensagens assim:\" + 2 ou 3 prints borrados." },
      { step: "Bloco 2", role: "2027", direction: "Abrir com a frase de ponte e seguir com data e temas centrais da 3ª edição.", example: "\"Em 2027, a 3ª edição chega com ainda mais motivos para garantir o lugar cedo: em 24/04, um bloco inteiro dedicado ao futebol feminino, além de concussão no esporte, esporte paralímpico e uma mesa sobre o retorno ao esporte.\"" },
      { step: "Bloco 3", role: "Coordenação", direction: "Quem conduz.", example: "\"Quem conduz: Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Retomar a prova do Bloco 1 e levar à página.", example: "\"Quem deixou para depois em 2026 ficou sem vaga. O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Prints borrados (nome, foto e @)", "Sem marcas da FIFA"],
    fallback: "Sem os prints, manter só a frase \"Em 2026, o simpósio esgotou\" e seguir para o Bloco 2. · [PASTA DE PRINTS SONAFE – A RECEBER]",
    limits: "Sem horários, grade completa ou títulos integrais; sem número de vagas de 2027.",
    sourceLinks: [
      { label: "Programação SONAFE 2027", url: octoberDestinations.sonafeProgram, note: "Usar só temas centrais e nomes; sem horários, grade completa ou títulos integrais." },
    ],
  },
  {
    id: "email-oct-program-launch",
    date: "13/10",
    title: "A programação dos congressos do Arnold Conference 2027 está no ar.",
    relatedPost: "10/10 · A programação dos congressos do Arnold Conference 2027 está no ar.",
    audience: "Base consentida inteira (e-mail geral da semana). Aplicar supressões.",
    objective: "Avisar que a programação 2027 está nas páginas dos congressos, com um bloco curto por congresso e o link de cada página.",
    materials: "Páginas dos seis congressos com UTM; temas e nomes das planilhas mais recentes.",
    cta: "Ver a programação do meu congresso",
    destination: "Páginas oficiais dos seis congressos (um link por bloco)",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: `Um envio. [SÓ ENVIAR SE A PÁGINA DO CONGRESSO ESTIVER COM A PROGRAMAÇÃO 2027 – RECONFERIR EM 07/10] ${suppressions}`,
    subjectDirection: "Assunto: \"A programação 2027 está no ar\". Pré-cabeçalho: \"Seis congressos, uma página para cada um.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a notícia.", example: "\"A programação dos congressos do Arnold Conference 2027 está no ar. Escolha o seu e veja quem vai estar lá.\"" },
      { step: "Bloco 2", role: "Um bloco por congresso", direction: "Abrir com a frase de ponte e seguir com um bloco curto por congresso, na ordem oficial, cada um com 1 tema ou nome e o link da página. Sem horários, sem itens \"Em breve\", sem títulos integrais e sem comparação.", example: "Ponte: \"Um destaque de cada sala:\" · Nutrição Esportiva: \"GLP-1 e performance esportiva, com o Dr. Ivan Lucas Picone.\" · Nutrição Estética: \"Queda capilar além da ferritina, com o Dr. Leandro Lucena e Luisa Wolpe.\" · 3º Simpósio de Fisioterapia Esportiva da SONAFE: \"Programação completa, com um bloco dedicado ao futebol feminino.\" · 8º Congresso de Gestão de Academias: \"Wellness além da academia, com Edgard Corona e Felipe Bragança.\" · Certificação Internacional em Personal Training – WTTC + Top of the Rock: \"Dois dias numa inscrição, com o Prof. Cristiano Parente.\" · Bodybuilding: \"Coordenação de Ricardo Pannain.\" Cada bloco com o botão \"Ver a programação\"." },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Fechar com o lote 1.", example: "\"O lote 1 é limitado.\" Botão principal: \"Ver a programação do meu congresso\"." },
    ],
    checks: ["Páginas dos congressos com a programação 2027 (reconferir em 07/10)","Nome completo da Certificação","Só o SONAFE usa \"programação completa\"","Um link por congresso, com UTM"],
    fallback: "Se alguma página não estiver com a programação, o bloco daquele congresso aponta para o hub, sem citar temas.",
    limits: "Sem horários, itens \"Em breve\", títulos integrais, valores ou nomes comerciais de medicamentos.",
  },
  {
    id: "email-oct-sports-program",
    date: "14/10",
    title: "Programação 2027: Congresso de Nutrição Esportiva",
    relatedPost: "14/10 · Programação 2027: Congresso de Nutrição Esportiva",
    audience: "Interesse em Nutrição Esportiva, não compradores.",
    objective: "Vender Nutrição Esportiva pela programação 2027, a sala com a maior meta de vendas.",
    materials: "Carrossel de 14/10; planilha de programação de 01/10; mini-bio de Andréia Naves.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Esportiva",
    destinationUrl: octoberDestinations.sportsNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Programação 2027 de Nutrição Esportiva\". Pré-cabeçalho: \"Dois dias, da corrida ao futebol.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com o formato e a coordenação.", example: "\"Dois dias inteiros só de Nutrição Esportiva, 24 e 25 de abril, com coordenação científica de Andréia Naves.\"" },
      { step: "Bloco 2", role: "Destaques", direction: "Abrir com a frase de ponte e seguir com três temas, cada um com os nomes.", example: "\"Temas que chegam ao consultório na segunda-feira:\" · \"GLP-1 e performance esportiva, com o Dr. Ivan Lucas Picone, Ricardo Sodré e Fernanda Serpa Carvalho.\" · \"Tecnologia e biomarcadores no campo, com Helvio Affonso (COB), Rodrigo Lobo e Roberta Carbonari.\" · \"A atuação do nutricionista no futebol, com Guilherme Rosa, Amanda Brant, Camila Mazetto e Marcela Mosconi.\"" },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"Comente PROGRAMAÇÃO no nosso Instagram ou veja tudo na página. O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Não chamar de \"completa\" (faltam 5 nomes)","Sem itens \"Em breve\" e sem horários"],
    fallback: "Sem o Bloco 2, seguir do gancho para a escassez.",
    limits: "Sem nomes comerciais de medicamentos, títulos integrais, valores ou promessa de performance.",
  },
  {
    id: "email-oct-wttc-program",
    date: "16/10",
    title: "Certificação Internacional em Personal Training – WTTC + Top of the Rock: dois dias numa inscrição",
    relatedPost: "16/10 · Certificação Internacional em Personal Training – WTTC + Top of the Rock: dois dias numa inscrição",
    audience: "Interesse na Certificação Internacional em Personal Training – WTTC, não compradores.",
    objective: "Mostrar que a inscrição vale por dois dias à noite: a Certificação na sexta e o Top of the Rock no sábado.",
    materials: "Carrossel de 16/10; planilha de 01/10; logos de chancela; mini-bio de Cris Parente.",
    cta: "Garantir minha vaga",
    destination: "Página oficial da Certificação Internacional em Personal Training – WTTC",
    destinationUrl: octoberDestinations.wttc,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Dois dias numa inscrição\". Pré-cabeçalho: \"Sexta e sábado, à noite, com Cris Parente.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com os dois dias.", example: "\"Uma inscrição, dois dias: sexta, 23/04, a Certificação Internacional em Personal Training – WTTC; sábado, 24/04, o Top of the Rock. Os dois à noite.\"" },
      { step: "Bloco 2", role: "Os dois dias", direction: "Abrir com a frase de ponte e seguir com o que acontece em cada noite.", example: "\"Na sexta, o módulo WTTC de Coaching e Psicologia aplicados ao Personal Training, com o Prof. Cristiano Parente. No sábado, o Top of the Rock, o principal congresso especializado em Personal Training da América Latina, com Eduardo Netto, Julio Serrão, Mário Charro, Mário Pozzi, Luiz Carnevalli e Cristiano Parente.\" + \"Chancela WTTC: uma certificação presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo.\"" },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Nome completo na primeira menção","Números conforme o roteiro da Leal","\"À noite\", sem horário"],
    fallback: "Sem a lista de palestrantes, manter os dois dias e a chancela.",
    limits: "Sem promessa de emprego, renda, visto ou equivalência automática; sem valores; sem comparar com Gestão de Academias.",
  },
  {
    id: "email-oct-six-months",
    date: "23/10",
    title: "Faltam 6 meses para o Arnold Conference 2027",
    relatedPost: "23/10 · Faltam 6 meses para o Arnold Conference 2027",
    audience: "Base consentida inteira, exceto compradores de qualquer congresso. Aplicar supressões.",
    objective: "Contagem regressiva: faltam 6 meses para o Arnold Conference 2027 e o lote 1 é limitado.",
    materials: "Arte do post de 23/10; páginas dos seis congressos com UTM.",
    cta: "Escolher meu congresso",
    destination: "Hub oficial do Arnold Conference",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: `Um envio, no mesmo dia do post de contagem regressiva. E-mail geral da semana (toda a base). ${suppressions}`,
    subjectDirection: "Assunto: \"Faltam 6 meses para o Arnold Conference 2027\". Pré-cabeçalho: \"23 a 25 de abril de 2027. O lote 1 é limitado.\"",
    steps: [
      { step: "Bloco 1", role: "Contagem", direction: "Abrir com a contagem e a data do evento.", example: "\"Faltam 6 meses. Em 23 de abril de 2027, as salas do Arnold Conference abrem as portas.\"" },
      { step: "Bloco 2", role: "Os seis congressos", direction: "Abrir com a frase de ponte e listar os seis congressos na ordem oficial, uma linha por congresso, cada um com seu botão, sem comparação.", example: "Ponte: \"Seis meses passam rápido. Escolha a sala que conversa com o seu trabalho:\" · Nutrição Esportiva, 24 e 25/04 · Nutrição Estética, 23/04 · 3º Simpósio de Fisioterapia Esportiva da SONAFE, 24/04 · 8º Congresso de Gestão de Academias, 23 e 24/04 · Certificação Internacional em Personal Training – WTTC + Top of the Rock, 23 e 24/04, à noite · Bodybuilding, 25/04." },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez do lote 1 e botão para o hub.", example: "\"O lote 1 é limitado. Quem entra primeiro garante o menor valor.\" Botão: \"Escolher meu congresso\"." },
    ],
    checks: ["Data e local conferidos nas páginas oficiais", "Nome completo da Certificação", "Sem valores e sem datas de virada de lote", "Enviado depois do post das 7h"],
    fallback: "Sem o Bloco 2, seguir da contagem direto para a escassez e o botão.",
    limits: "Sem valores, sem datas de virada de lote e sem programação além dos temas liberados.",
  },
  {
    id: "email-oct-management-program",
    date: "27/10",
    title: "Programação 2027: 8º Congresso de Gestão de Academias",
    relatedPost: "27/10 · Programação 2027: 8º Congresso de Gestão de Academias",
    audience: "Interesse em Gestão de Academias, não compradores.",
    objective: "Vender Gestão de Academias pelos nomes de peso da programação 2027.",
    materials: "Carrossel de 27/10; planilha de 30/09.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Gestão de Academias",
    destinationUrl: octoberDestinations.management,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Programação 2027 de Gestão de Academias\". Pré-cabeçalho: \"Smart Fit, Integralmédica e Fofão no mesmo palco.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com os nomes de peso.", example: "\"Edgard Corona, CEO da Smart Fit, e Felipe Bragança, CEO da Integralmédica, discutem o wellness além da academia.\"" },
      { step: "Bloco 2", role: "Destaques", direction: "Abrir com a frase de ponte e seguir com mais dois destaques e a coordenação.", example: "\"E não para aí:\" · \"Liderança e resultados em equipe, com Fofão.\" · \"Mulheres liderando o mercado fitness, com Paula Baldini, Mônica Marques, Carol Borba e Lilia Lemos.\" · \"Coordenação científica de Eduardo Netto (Dudu Netto), 23 e 24/04.\"" },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Histórico de Fofão só com fonte confirmada pela agência","Sem itens \"Em breve\""],
    fallback: "Sem o Bloco 2, seguir do gancho para a escassez.",
    limits: "Sem números de mercado sem fonte, valores ou títulos integrais; sem comparar com a Certificação Internacional em Personal Training – WTTC.",
  },
  {
    id: "email-oct-aesthetic-program",
    date: "29/10",
    title: "Programação 2027: Congresso de Nutrição Estética",
    relatedPost: "29/10 · Programação 2027: Congresso de Nutrição Estética",
    audience: "Interesse em Nutrição Estética, não compradores.",
    objective: "Vender Nutrição Estética pelos temas mais procurados da programação 2027.",
    materials: "Carrossel de 29/10; planilha da noite de 29/09; mini-bio de Luisa Wolpe.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Estética",
    destinationUrl: octoberDestinations.aestheticNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Programação 2027 de Nutrição Estética\". Pré-cabeçalho: \"Queda capilar, GLP-1 e lipedema em 23/04.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta de consultório.", example: "\"Queda de cabelo com ferritina normal? Em 23/04, o Dr. Leandro Lucena e Luisa Wolpe falam da investigação que vai além da ferritina.\"" },
      { step: "Bloco 2", role: "Destaques", direction: "Abrir com a frase de ponte e seguir com mais dois temas e a coordenação.", example: "\"E mais:\" · \"GLP-1 e cirurgia plástica, com Gabriel Ximenes e Pedro Perim.\" · \"Lipedema, da bioenergética ao tratamento, com Raquel Wolpe e Luisa Wolpe.\" · \"Coordenação de Luisa Wolpe, pós-graduada em Nutrição Clínica e mestre em Ciências da Saúde pela UFPR.\"" },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Escrever \"canetas de GLP-1\", nunca nome comercial","Sem títulos integrais"],
    fallback: "Sem o Bloco 2, seguir do gancho para a escassez.",
    limits: "Sem nomes comerciais de medicamentos, conduta, diagnóstico ou valores.",
  },
  {
    id: "email-oct-included",
    date: "30/10",
    title: "O que está incluído na sua inscrição",
    relatedPost: "30/10 · Stories de escassez do card \"Muita gente vê o palco. Pouca gente entende tudo que constrói um atleta.\"",
    audience: "Toda a base, exceto compradores (e-mail geral da semana). Aplicar supressões.",
    objective: "Mostrar tudo o que a inscrição inclui: o congresso, o acesso aos 3 dias da feira do Arnold Sports Festival e o lote 1 limitado.",
    materials: "Páginas dos congressos com UTM; redação oficial do benefício da feira.",
    cta: "Escolher meu congresso",
    destination: "Hub oficial do Arnold Conference",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: `Um envio. [DEPENDE DA REDAÇÃO OFICIAL DO BENEFÍCIO DA FEIRA; SE NÃO HOUVER, O FOCO PASSA A SER 'TUDO O QUE VOCÊ VIVE NO ARNOLD CONFERENCE 2027', COM OS PILARES, OS CONGRESSOS E O LOTE 1] Status do lote 1 confirmado antes do envio. ${suppressions}`,
    subjectDirection: "Assunto: \"O que está incluído na sua inscrição\". Pré-cabeçalho: \"Congresso, feira e o lote 1.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta.", example: "\"Você sabe tudo o que está incluído na inscrição do Arnold Conference 2027?\"" },
      { step: "Bloco 2", role: "O que está incluído", direction: "Abrir com a frase de ponte e listar o que a inscrição inclui. [DEPENDE DA REDAÇÃO OFICIAL DO BENEFÍCIO DA FEIRA; SE NÃO HOUVER, O FOCO PASSA A SER 'TUDO O QUE VOCÊ VIVE NO ARNOLD CONFERENCE 2027', COM OS PILARES, OS CONGRESSOS E O LOTE 1]", example: "\"Ao garantir a sua vaga, você tem:\" · \"O congresso que você escolher, entre os seis do Arnold Conference 2027.\" · \"Acesso aos 3 dias da feira do Arnold Sports Festival.\" [REDAÇÃO OFICIAL DO BENEFÍCIO – CONFIRMAR COM ADRIANA OU KARLA] · Se a redação não estiver confirmada, a linha da feira sai e o e-mail passa a ser \"Tudo o que você vive no Arnold Conference 2027\", com os três pilares (Nutrição, Fitness e Fisioterapia) e os seis congressos." },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez e botão para o hub.", example: "\"O lote 1 é limitado. Quem entra primeiro garante o menor valor.\" Botão: \"Escolher meu congresso\"." },
    ],
    checks: ["Redação oficial do benefício confirmada com Adriana ou Karla","Benefício publicado nas páginas dos congressos","Status do lote 1 confirmado com o cliente"],
    fallback: "Sem a redação do benefício: \"Tudo o que você vive no Arnold Conference 2027\", com os pilares, os congressos e o lote 1.",
    limits: "Sem valores, sem valor do ingresso da feira e sem datas de virada de lote.",
  },
  {
    id: "email-oct-abandon",
    date: "Desde 06/10",
    relatedPost: "E-mail sem post relacionado",
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
      { step: "Bloco 3", role: "Escassez e ação (só no disparo de 24h)", direction: "Escassez e botão para retomar a inscrição.", example: `"Lembrando: sua inscrição também dá acesso aos 3 dias da feira do Arnold Sports Festival. O lote 1 é limitado." ${fairBenefitPending} Botão: "Concluir minha inscrição".` },
    ],
    checks: ["Evento de abandono disponível", "Benefício da feira com a redação oficial confirmada; sem ela, tirar a frase da feira do disparo de 24h", "Link de retomada testado", "Parada automática com compra"],
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
        { condition: "Segmentação, página, compra-teste ou checklist de liberação pendente", action: "Usar a alternativa segura ou cancelar o envio.", reason: "A cadência não justifica informação incompleta." },
      ]
      : [
        { condition: "Contato atende aos critérios de elegibilidade e frequência", action: "Enviar esta única campanha.", reason: "A mensagem foi desenhada para o estágio e o produto identificados." },
        { condition: "Compra confirmada, opt-out, falta de consentimento ou mensagem equivalente recente", action: "Suprimir o envio.", reason: "Evita insistência, duplicação e comunicação fora do estágio real." },
        { condition: "Material, prova, página, revisão ou checklist de liberação pendente", action: "Usar a alternativa segura ou cancelar o envio.", reason: "A cadência não justifica informação incompleta ou autoridade inventada." },
      ],
    productionChecks: [seed.versions ? `Produzir as ${seed.versions.length} versões do e-mail, uma por segmento.` : "Produzir uma única versão do e-mail.", ...seed.checks],
    fallback: seed.fallback,
    limits: seed.limits,
    agencyResearch: seed.agencyResearch,
    proofGate: seed.proofGate,
    sourceLinks: seed.sourceLinks,
  }])
);
