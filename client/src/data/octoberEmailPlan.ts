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
    id: "email-oct-management",
    date: "13/10",
    audience: "Interesse em Gestão de Academias, não compradores.",
    objective: "Tocar na dor da operação dependente do dono e vender a 8ª edição.",
    materials: "Fala de Américo José da Silva Filho (acervo 2026) em texto; mini-bio de Dudu Netto.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Gestão de Academias",
    destinationUrl: octoberDestinations.management,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Se você ficar doente amanhã, sua academia funciona?\". Pré-cabeçalho: \"O que Américo José da Silva Filho disse sobre isso em 2026.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta ao dono.", example: "\"Se você ficar doente amanhã, sua academia funciona sem você?\"" },
      { step: "Bloco 2", role: "A fala", direction: "Resumir a fala de Américo, identificada como 2026 e como opinião do palestrante.", example: "\"Em 2026, Américo José da Silva Filho lembrou no Congresso de Gestão que, em muitas academias, todo o funcionamento está na cabeça do dono. E completou: só dá para pensar em expandir quando você consegue tirar 15 dias de férias sem ninguém da empresa te procurar.\"" },
      { step: "Bloco 3", role: "O congresso", direction: "Abrir com a frase de ponte e seguir com edição, data e coordenação.", example: "\"Organizar a academia para funcionar sem depender do dono é o tipo de decisão que o congresso discute. A 8ª edição acontece em 23 e 24/04, com coordenação de Dudu Netto, diretor técnico e sócio da Bodytech Company.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Crédito \"Arnold Conference 2026\"", "A fala é opinião do palestrante"],
    fallback: "Sem o Bloco 2, abrir pelo gancho e seguir para o Bloco 3.",
    limits: "Sem números de mercado; sem comparar com a Certificação Internacional em Personal Training – WTTC.",
    sourceLinks: [
      { label: "Íntegra — Américo José da Silva Filho", url: octoberDestinations.americo, note: "Acervo 2026 · fala conferida no YouTube em 36:20–36:51." },
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
    subjectDirection: "Assunto: \"5 continentes. 18 países. Uma certificação.\". Pré-cabeçalho: \"Três situações em que sua carreira pode ir além do bairro.\"",
    steps: [
      { step: "Bloco 1", role: "Situações", direction: "Três situações de carreira internacional.", example: "\"Seu aluno se muda para o exterior e quer continuar com você. Surge uma proposta para trabalhar fora. Você quer que seu método seja reconhecido além do seu bairro.\"" },
      { step: "Bloco 2", role: "Resposta", direction: "Ligar as situações à certificação, pelo nome completo.", example: "\"Para essas situações, existe uma credencial pensada para isso: a Certificação Internacional em Personal Training – WTTC tem chancela WTTC e está presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo.\"" },
      { step: "Bloco 3", role: "Coordenação", direction: "Quem conduz, com data.", example: "\"No Arnold Conference, quem conduz é Cris Parente, eleito Melhor Personal Trainer do Mundo pelo American Council on Exercise e CEO da World Top Trainers Certification. São dois dias, 23 e 24/04, à noite: a Certificação na sexta e o Top of the Rock no sábado, na mesma inscrição.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Nome completo na primeira menção"],
    fallback: "Sem o Bloco 1, abrir pelo Bloco 2, sem a frase de ligação.",
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
    subjectDirection: "Assunto: \"Mudou treino, dieta e recuperação na mesma semana. E agora?\". Pré-cabeçalho: \"O que registrar antes de decidir a próxima mudança.\"",
    steps: [
      { step: "Bloco 1", role: "Cena", direction: "Abrir com a semana em que tudo mudou.", example: "\"Segunda muda o treino. Quarta muda a dieta. Sexta muda a recuperação. Na semana seguinte o atleta responde diferente, e ninguém sabe o que funcionou.\"" },
      { step: "Bloco 2", role: "Lição", direction: "Uma lição prática, sem prescrição.", example: "\"Na preparação, registrar o que mudou, quando e por quê é o primeiro passo para decidir melhor.\"" },
      { step: "Bloco 3", role: "O congresso", direction: "Abrir com a frase de ponte e seguir com data e coordenação.", example: "\"Decidir com contexto, e não por tentativa, é o que o Congresso de Bodybuilding discute. 25/04, com coordenação de Ricardo Pannain.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Revisão de profissional de Educação Física"],
    fallback: "Versão curta com os Blocos 3 e 4, sem a frase de ponte.",
    limits: "Sem fármacos, doses, ciclos, protocolos ou promessa competitiva.",
  },
  {
    id: "email-oct-sports-2",
    date: "20/10",
    audience: "Interesse em Nutrição Esportiva, não compradores. Prioridade para quem abriu ou clicou o e-mail de 08/10.",
    objective: "Segundo contato de Nutrição Esportiva, a sala com mais lugares para preencher.",
    materials: "Fala de Andreia Naves (acervo 2026) em texto; motivos do post de 10/10; temas da programação 2027 de Nutrição Esportiva.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Esportiva",
    destinationUrl: octoberDestinations.sportsNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Pré-treino começa quando?\". Pré-cabeçalho: \"Spoiler: semanas antes da prova.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta e a fala de Andreia Naves, identificada como 2026.", example: "\"Pré-treino começa na refeição de antes da prova? Em 2026, Andreia Naves mostrou que ele começa semanas antes.\"" },
      { step: "Bloco 2", role: "Motivos", direction: "Abrir com a frase de ponte e seguir com três motivos em lista curta, com exemplos concretos.", example: "\"É esse tipo de virada de raciocínio que a sala entrega. Três motivos para estar lá em 2027:\" · \"Dois dias inteiros só de Nutrição Esportiva, 24 e 25/04.\" · \"Coordenação científica de Andréia Naves.\" · \"Temas que chegam ao consultório na segunda-feira: em 2027, glicemia por sensores e prescrição de carboidratos, e avaliação da hidratação com Andréia Naves e Danielli Mello.\"" },
      { step: "Bloco 3", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Crédito \"Arnold Conference 2026\"", "Não repetir o conteúdo do e-mail de 08/10", "Temas de 2027 sem horário nem título integral das palestras"],
    fallback: "Só os Blocos 2 e 3, sem a frase de ponte.",
    limits: "Sem alimento, suplemento, dose ou promessa de performance.",
    sourceLinks: [
      { label: "Íntegra — Andreia Naves", url: octoberDestinations.andreia, note: "Acervo 2026 · fala conferida no YouTube em 15:18–15:28." },
    ],
  },
  {
    id: "email-oct-aesthetic-2",
    date: "21/10",
    audience: "Interesse em Nutrição Estética, não compradores. Prioridade para quem abriu ou clicou o e-mail de 09/10.",
    objective: "Segundo contato de Nutrição Estética com dois temas novos da programação, sem repetir os de 09/10.",
    materials: "Programação Estética 2027; credenciais de Braian Cordeiro e de Ana Paula Pujol (pesquisa da agência).",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Nutrição Estética",
    destinationUrl: octoberDestinations.aestheticNutrition,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"O que o exame de rotina não mostra sobre o metabolismo?\". Pré-cabeçalho: \"Dois temas de Nutrição Estética 2027.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a situação de consultório.", example: "\"Sua paciente come pouco, treina e o corpo não responde como o esperado. O que o exame de rotina não mostra?\"" },
      { step: "Bloco 2", role: "O tema", direction: "Apresentar o primeiro tema confirmado e quem fala.", example: "\"Em 2027, Braian Cordeiro fala do metabolismo invisível e do que a calorimetria indireta revela na estética corporal.\"" },
      { step: "Bloco 3", role: "Mais um tema", direction: "Ligar ao segundo tema e apresentar a palestrante com uma credencial pesquisada pela agência.", example: "\"Na mesma linha, Ana Paula Pujol trata da bioenergética mitocondrial na saúde da mulher: metabolismo, envelhecimento e composição corporal.\" + uma credencial dela." },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Fechar os dois temas numa frase e levar à página.", example: "\"Dois temas que olham para o que não aparece no espelho. 23/04, Nutrição Estética. O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Revisão por nutricionista", "Não repetir os temas do e-mail de 09/10 (GLP-1 e cirurgia plástica, queda capilar, lipedema)"],
    fallback: "Sem a credencial de Ana Paula Pujol, manter o Bloco 3 só com o tema.",
    limits: "Sem nomes comerciais de medicamentos, diagnóstico ou conduta; sem horários ou títulos integrais.",
    agencyResearch: ["Credenciais públicas de Braian Cordeiro e de Ana Paula Pujol, com links."],
  },
  {
    id: "email-oct-sonafe-2",
    date: "22/10",
    audience: "Interesse em SONAFE, não compradores. Prioridade para quem abriu ou clicou o e-mail de 10/10.",
    objective: "Segundo contato do SONAFE com os temas de recuperação da programação, diferentes dos de 10/10.",
    materials: "Programação SONAFE 2027.",
    cta: "Garantir minha vaga",
    destination: "Página oficial do SONAFE",
    destinationUrl: octoberDestinations.sonafe,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Gelo e luz na recuperação: o que as evidências dizem?\". Pré-cabeçalho: \"Dois temas do 3º Simpósio da SONAFE.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com recursos que o leitor vê todo dia.", example: "\"Crioterapia e fotobiomodulação estão em clínicas e academias. Mas o que as evidências atuais dizem sobre elas no esporte?\"" },
      { step: "Bloco 2", role: "Os temas", direction: "Apresentar os dois temas confirmados e quem fala.", example: "\"Em 24/04, o 3º Simpósio de Fisioterapia Esportiva da SONAFE discute crioterapia no esporte, com Anderson José Santana, e fotobiomodulação, com Adriane Vanin.\"" },
      { step: "Bloco 3", role: "Ponte", direction: "Ligar os temas à visão do simpósio e à coordenação.", example: "\"É a fisioterapia que olha para a recuperação e a performance, e não só para a lesão. Coordenação de Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Retomar a demanda de 2026 e levar à página.", example: "\"Em 2026, o simpósio esgotou. O lote 1 de 2027 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Revisão por fisioterapeuta esportivo", "Não repetir os temas do e-mail de 10/10"],
    fallback: "Sem os nomes dos palestrantes, manter só os temas.",
    limits: "Sem protocolo, indicação de técnica, horários, grade completa ou títulos integrais.",
    sourceLinks: [
      { label: "Programação SONAFE 2027", url: octoberDestinations.sonafeProgram, note: "Usar só temas centrais e nomes; sem horários, grade completa ou títulos integrais." },
    ],
  },
  {
    id: "email-oct-management-2",
    date: "23/10",
    audience: "Interesse em Gestão de Academias, não compradores. Prioridade para quem abriu ou clicou o e-mail de 13/10.",
    objective: "Segundo contato de Gestão com uma mudança real de mercado: o aluno que usa GLP-1.",
    materials: "Vídeo da Leal \"GLP-1 vai mudar o negócio das academias\" (tendência de 15/10); temas do congresso citados pela Leal no vídeo de 11/10.",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Gestão de Academias",
    destinationUrl: octoberDestinations.management,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Seu próximo aluno pode chegar usando GLP-1\". Pré-cabeçalho: \"O que muda no negócio da academia.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a mudança no perfil do aluno.", example: "\"Milhões de pessoas estão usando canetas de GLP-1. Quando elas chegam à academia, o objetivo já não é só emagrecer.\"" },
      { step: "Bloco 2", role: "A mudança", direction: "Explicar o que muda para a academia, como leitura de mercado.", example: "\"Quem perde peso precisa preservar músculo, força e saúde. Isso muda o que a academia oferece e como acompanha o aluno.\"" },
      { step: "Bloco 3", role: "Ponte", direction: "Ligar a mudança aos temas do congresso e à coordenação.", example: "\"Adaptar o negócio a um novo consumidor é decisão de gestão. O 8º Congresso de Gestão de Academias, em 23 e 24/04, discute liderança, vendas, experiência do cliente e novos modelos de atuação, com coordenação de Dudu Netto.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Tom de leitura de mercado, sem conduta clínica", "Não repetir o e-mail de 13/10"],
    fallback: "Sem o Bloco 2, seguir do gancho para a ponte.",
    limits: "Sem nomes comerciais de medicamentos, números de mercado sem fonte ou conduta clínica; sem comparar com a Certificação Internacional em Personal Training – WTTC.",
  },
  {
    id: "email-oct-wttc-2",
    date: "26/10",
    audience: "Interesse na Certificação Internacional em Personal Training – WTTC, não compradores. Prioridade para quem abriu ou clicou o e-mail de 14/10.",
    objective: "Segundo contato da Certificação com o tema da longevidade, diferente da carreira internacional de 14/10.",
    materials: "Vídeo da Leal \"Longevidade\" (tendência de 22/10); números validados da WTTC.",
    cta: "Garantir minha vaga",
    destination: "Página oficial da Certificação Internacional em Personal Training – WTTC",
    destinationUrl: octoberDestinations.wttc,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Seu aluno treina para chegar bem aos 80?\". Pré-cabeçalho: \"Longevidade virou objetivo de treino.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com o novo objetivo do aluno.", example: "\"Muitos alunos já não treinam só por estética ou performance. Treinam para continuar fazendo as coisas sozinhos aos 70, 80 anos.\"" },
      { step: "Bloco 2", role: "O que muda", direction: "Explicar o que isso muda para o personal, sem prescrição.", example: "\"Para o personal, isso amplia o público e muda o que ele precisa dominar: força, mobilidade e autonomia ao longo da vida.\"" },
      { step: "Bloco 3", role: "Ponte", direction: "Ligar a ampliação de repertório à certificação, pelo nome completo.", example: "\"Ampliar repertório e reconhecimento é o que propõe a Certificação Internacional em Personal Training – WTTC, presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo. São dois dias, 23 e 24/04, à noite, com o Top of the Rock no sábado, na mesma inscrição. Coordenação de Cris Parente.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Nome completo na primeira menção", "Não repetir o e-mail de 14/10"],
    fallback: "Sem o Bloco 2, seguir do gancho para a ponte.",
    limits: "Sem prescrição de treino; sem promessa de emprego, renda, visto ou equivalência automática.",
  },
  {
    id: "email-oct-bodybuilding-2",
    date: "26/10",
    audience: "Interesse em Bodybuilding, não compradores. Prioridade para quem abriu ou clicou o e-mail de 15/10.",
    objective: "Segundo contato de Bodybuilding com o relato de Ricardo Pannain sobre volume e recuperação.",
    materials: "Reel do Team Pannain sobre organização do treino (o mesmo do post de 19/10).",
    cta: "Garantir minha vaga",
    destination: "Página oficial de Bodybuilding",
    destinationUrl: octoberDestinations.bodybuilding,
    rule: `Um envio. ${suppressions}`,
    subjectDirection: "Assunto: \"Mais exercícios na sessão é mais preparação?\". Pré-cabeçalho: \"O que Ricardo Pannain relata sobre volume e recuperação.\"",
    steps: [
      { step: "Bloco 1", role: "Gancho", direction: "Abrir com a pergunta.", example: "\"Mais exercícios em uma sessão significam uma preparação melhor?\"" },
      { step: "Bloco 2", role: "O relato", direction: "Resumir o relato de Pannain, identificado como relato de experiência.", example: "\"Em um Reel, Ricardo Pannain relata que trabalha com menos volume por sessão, mais intensidade, volume distribuído na semana e recuperação para o treino seguinte.\"" },
      { step: "Bloco 3", role: "Ponte", direction: "Ligar o relato à leitura em contexto e ao congresso.", example: "\"Volume, intensidade, frequência e recuperação precisam ser lidos juntos, no contexto de cada atleta. É essa leitura que o Congresso de Bodybuilding discute em 25/04, com coordenação dele.\"" },
      { step: "Bloco 4", role: "Escassez e ação", direction: "Escassez e botão para a página.", example: "\"O lote 1 é limitado.\" Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Revisão de profissional de Educação Física", "Falas do Reel conferidas no player do Instagram"],
    fallback: "Sem o Bloco 2, seguir do gancho para a ponte, sem citar o Reel.",
    limits: "Sem números de séries, cargas, divisão de treino, fármacos ou promessa competitiva.",
    sourceLinks: [
      { label: "Reel — organização do treino e recuperação", url: octoberDestinations.bodybuildingTraining, note: "Relato de experiência; conferir as falas em 00:00, 00:10 e 00:50 no player do Instagram. Não é prescrição." },
    ],
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
    subjectDirection: "Assunto: \"Ficou alguma dúvida sobre a sua inscrição?\". Pré-cabeçalho: \"Respostas rápidas sobre data, inscrição e certificado.\"",
    steps: [
      { step: "Bloco 1", role: "Abertura", direction: "Abrir pelo congresso que a pessoa está considerando.", example: "\"Vimos que você está considerando o [nome do congresso]. Estas são as dúvidas mais comuns:\"" },
      { step: "Bloco 2", role: "Perguntas e respostas", direction: "4 a 5 perguntas com resposta curta, tiradas do FAQ oficial.", example: `Data e local; o que está incluído na inscrição ("Acesso ao congresso escolhido e aos 3 dias da feira do Arnold Sports Festival." ${fairBenefitPending}); formas de pagamento; certificado; contato de atendimento.` },
      { step: "Bloco 3", role: "Ação", direction: "Ligar as respostas à decisão e levar à página do congresso de interesse, com o link do atendimento.", example: "\"Se ainda faltar alguma resposta, fale com a gente. E, se já está decidido, o lote 1 continua limitado.\" Botão: \"Garantir minha vaga\" + link do atendimento." },
    ],
    checks: ["Contato de atendimento válido para 2027 (atual: congresso@savagetgroup.com.br)", "Benefício da feira com a redação oficial confirmada e igual ao FAQ e às páginas"],
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
      { step: "Bloco 2", role: "Lembrete de valor", direction: "Ligar a escassez ao argumento principal daquele congresso (o mesmo do Bloco 3 de 06/10) e lembrar o acesso à feira em meia frase.", example: `Nutrição Esportiva: "E são dois dias inteiros só de Nutrição Esportiva, com acesso aos 3 dias da feira do Arnold Sports Festival." ${fairBenefitPending}` },
      { step: "Bloco 3", role: "Ação", direction: "Botão para a página do congresso.", example: "Botão: \"Garantir minha vaga\"." },
    ],
    checks: ["Confirmação do cliente registrada", "Supressão de compradores atualizada no dia", "Benefício da feira com a redação oficial confirmada; sem ela, tirar a meia frase da feira"],
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
