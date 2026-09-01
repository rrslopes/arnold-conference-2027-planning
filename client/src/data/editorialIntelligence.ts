export type ProgramSession = {
  time: string;
  speakers: string;
  title: string;
};

export type CongressProgram = {
  id: string;
  congress: string;
  status: "recebida" | "aguardando";
  statusLabel: string;
  date?: string;
  room?: string;
  source: string;
  note: string;
  sessions: ProgramSession[];
};

export const conferencePrograms2027: CongressProgram[] = [
  {
    id: "gestao",
    congress: "Gestão de Academias",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Programação e acervo de 2026 disponíveis como referência editorial",
    note: "Não converter os temas de 2026 em promessa da edição de 2027. Solicitar data, sala, horários, palestrantes, títulos e ementas assim que a grade avançar.",
    sessions: [],
  },
  {
    id: "wttc",
    congress: "Certificação Internacional em Personal Training WTTC",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Conteúdo programático de 2026 disponível como referência",
    note: "A grade de 2027 deverá confirmar módulos, docentes, entregas da certificação e limites da promessa internacional antes de pautas específicas.",
    sessions: [],
  },
  {
    id: "sonafe",
    congress: "SONAFE — Simpósio de Fisioterapia Esportiva",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Programação de 2026 disponível como referência temática",
    note: "Até a confirmação de 2027, usar 2026 apenas para mapear dores de avaliação, reabilitação, recuperação e retorno ao esporte — nunca como grade anunciada.",
    sessions: [],
  },
  {
    id: "nutricao-estetica",
    congress: "Nutrição Estética",
    status: "recebida",
    statusLabel: "Programação 2027 recebida · provisória",
    date: "23 de abril de 2027",
    room: "Sala a confirmar",
    source: "Programação_Conference_Nutrição Estética_2027.xlsx",
    note: "Dez sessões de conteúdo confirmadas no arquivo atual. Descritivos, minibiografias, fotos e redes sociais ainda precisam ser preenchidos.",
    sessions: [
      { time: "9h00", speakers: "Marília Lacerda", title: "Preparação metabólica para cirurgia plástica: reduzindo complicações e potencializando resultados" },
      { time: "9h40", speakers: "Gabriel Ximenes e Pedro Perim", title: "GLP-1 e Cirurgia Plástica: quem deve operar, quando operar e como preservar a massa muscular" },
      { time: "10h20", speakers: "Dr. Leandro Lucerna e Luísa Wolpe", title: "Queda capilar além da ferritina: mitocôndria, inflamação e metabolômica — Ozempic Hair Loss: mito ou realidade?" },
      { time: "11h00", speakers: "Raquel Wolpe e Luísa Wolpe", title: "Lipedema 360°: da bioenergética ao tratamento físico" },
      { time: "11h40", speakers: "Diogo Viana e Rodrigo Granzotti", title: "Impacto do uso de GLP-1 na resposta hormonal do paciente com lipedema" },
      { time: "14h00", speakers: "Suellen Becher, Dr. Vinicius Ortiz e Camila Barijan", title: "Estética e Nutrição Regenerativa: o futuro já começou" },
      { time: "15h20", speakers: "Ana Paula Pujol", title: "Bioenergética Mitocondrial na Saúde da Mulher: implicações para metabolismo, envelhecimento e composição corporal" },
      { time: "16h00", speakers: "Andreia Naves", title: "Sistema Musculoesquelético e Longevidade: mobilidade, força e fáscia na saúde da mulher" },
      { time: "16h40", speakers: "Braian Cordeiro", title: "Metabolismo Invisível: o que a Calorimetria Indireta revela sobre a Estética Corporal" },
      { time: "17h20", speakers: "Faruk Kalil, Vanessa Erthal e Alessandra Pinheiro", title: "Performance Feminina e Estética de Alta Definição" },
    ],
  },
  {
    id: "nutricao-esportiva",
    congress: "Nutrição Esportiva",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Programação e oito íntegras de 2026 disponíveis como referência",
    note: "O acervo sustenta conteúdos sobre endurance, carboidratos, microbiota, antioxidantes, GLP-1 e massa muscular, mas não substitui a confirmação da grade de 2027.",
    sessions: [],
  },
  {
    id: "bodybuilding",
    congress: "Bodybuilding",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Programação de 2026 disponível como referência temática",
    note: "Solicitar a grade de 2027 e matéria-prima dos palestrantes antes de prometer conteúdos sobre preparação, treino, nutrição, recuperação ou competição.",
    sessions: [],
  },
];

export const audienceAttractionAxes = [
  {
    id: "glp-cirurgia",
    title: "GLP-1, cirurgia plástica e preservação de massa muscular",
    tension: "O emagrecimento medicamentoso muda o momento da cirurgia, a preparação metabólica e a proteção da massa muscular.",
    audience: "Nutricionistas clínicos e estéticos, profissionais ligados à cirurgia plástica e equipes que acompanham pacientes em uso de GLP-1.",
    sessions: "Preparação metabólica; GLP-1 e cirurgia plástica; calorimetria indireta.",
  },
  {
    id: "lipedema",
    title: "Lipedema além do olhar exclusivamente estético",
    tension: "A dor central é diferenciar, avaliar e integrar metabolismo, bioenergética, hormônios e tratamento físico.",
    audience: "Nutricionistas, profissionais habilitados em estética e equipes multidisciplinares que atendem mulheres com suspeita ou diagnóstico de lipedema.",
    sessions: "Lipedema 360°; GLP-1 e resposta hormonal no lipedema.",
  },
  {
    id: "saude-mulher",
    title: "Saúde da mulher, longevidade e composição corporal",
    tension: "Metabolismo, força, mobilidade, fáscia, envelhecimento e estética precisam ser tratados como uma jornada integrada.",
    audience: "Nutricionistas e profissionais de saúde que trabalham com mulheres adultas, envelhecimento saudável, força e composição corporal.",
    sessions: "Bioenergética mitocondrial; sistema musculoesquelético e longevidade; performance feminina.",
  },
  {
    id: "cabelo-pele",
    title: "Queda capilar, pele e sinais que exigem investigação",
    tension: "Ferritina isolada e protocolos genéricos não explicam toda queda capilar nem todas as respostas da pele.",
    audience: "Profissionais de nutrição estética, saúde capilar, pele e acompanhamento de pacientes em emagrecimento.",
    sessions: "Queda capilar, mitocôndria, inflamação e metabolômica; nutrição regenerativa.",
  },
  {
    id: "regenerativa",
    title: "Nutrição regenerativa e avaliação individualizada",
    tension: "O público procura critérios para decidir melhor, não mais um protocolo universal vendido como solução.",
    audience: "Nutricionistas e profissionais habilitados que desejam atualizar avaliação, raciocínio clínico e integração de condutas.",
    sessions: "Estética e nutrição regenerativa; bioenergética; calorimetria indireta.",
  },
  {
    id: "performance-feminina",
    title: "Performance feminina e estética de alta definição",
    tension: "Definição corporal não pode ser reduzida a dieta, treino ou aparência sem considerar força, massa muscular, recuperação e saúde.",
    audience: "Nutricionistas esportivos e estéticos, treinadores e profissionais que acompanham mulheres em performance e composição corporal.",
    sessions: "Sistema musculoesquelético; calorimetria indireta; performance feminina e estética de alta definição.",
  },
];

export const speakerContentRequests = [
  { stage: "Base editorial", item: "Ementa em 5 a 8 linhas e três aprendizados centrais", purpose: "Transformar o título em pauta sem inventar o conteúdo técnico." },
  { stage: "Dor do público", item: "Três perguntas frequentes, erros ou decisões difíceis que a palestra enfrenta", purpose: "Criar ganchos de campanha conectados à prática profissional." },
  { stage: "Prova técnica", item: "Referências, dados, slides e limites das alegações", purpose: "Evitar recomendações universais, simplificações e promessas clínicas indevidas." },
  { stage: "Ativos", item: "Minibiografia, foto, cargo, redes sociais e forma correta de crédito", purpose: "Produzir cards, páginas e marcações sem retrabalho de aprovação." },
  { stage: "Vídeo curto", item: "Resposta vertical de 30 a 60 segundos a uma pergunta previamente definida", purpose: "Gerar conteúdo original de 2027 sem depender apenas do acervo anterior." },
  { stage: "Reaproveitamento", item: "Uma frase-chave, um caso sem identificação e um ponto que não deve ser retirado de contexto", purpose: "Orientar Reels, carrosséis e e-mails com segurança editorial." },
  { stage: "Governança", item: "Responsável pela aprovação, prazo e autorização de uso", purpose: "Fechar o fluxo entre palestrante, coordenação, agência e cliente." },
];

export const nutritionAesthetic2026Priorities = [
  {
    priority: "Uso imediato",
    tone: "ready",
    title: "Luisa Wolpe e Suellen Becher — Diferenças entre Celulite e Lipedema",
    transcript: "Transcrição validada disponível",
    bridge: "Ponte direta com Lipedema 360° e apoio ao debate sobre GLP-1 no lipedema.",
    nextUse: "Já pode orientar carrossel comparativo, e-mail temático e seleção de corte; o Reel ainda exige conferência no vídeo original.",
  },
  {
    priority: "Transcrever primeiro",
    tone: "high",
    title: "Alessandra Feltre — GLP-1 e o Novo Rosto do Emagrecimento em Mulheres 40+",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Ponte direta com GLP-1, cirurgia plástica, lipedema, saúde da mulher e preservação de massa muscular.",
    nextUse: "Maior prioridade para descobrir falas, critérios e perguntas que aqueçam três sessões de 2027.",
  },
  {
    priority: "Transcrever primeiro",
    tone: "high",
    title: "Alessandra Pinheiro — Glúteo: Dieta e Treino para Hipertrofia e Definição",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Ponte direta com performance feminina, estética de alta definição, força e composição corporal.",
    nextUse: "Prioridade alta para pautas de atração; validar se a aula entrega critérios aplicáveis sem promessa estética universal.",
  },
  {
    priority: "Uso imediato",
    tone: "ready",
    title: "Ana Paula Pujol — Estratégias Nutricionais para Emagrecimento",
    transcript: "Transcrição consolidada disponível",
    bridge: "Base complementar para metabolismo, platô, bioenergética, calorimetria e composição corporal.",
    nextUse: "Pode orientar pautas agora, desde que a conexão com 2027 seja apresentada como continuidade temática e não como repetição de palestra.",
  },
  {
    priority: "Segunda onda",
    tone: "medium",
    title: "Raquel Wolpe e Camila Barijan — Como Melhorar a Pele de Atletas?",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Conteúdo complementar para nutrição regenerativa, pele, performance e estética de alta definição.",
    nextUse: "Transcrever depois dos dois temas prioritários para procurar pontes específicas com a presença de Camila em 2027.",
  },
  {
    priority: "Segunda onda",
    tone: "medium",
    title: "Olívia Fernandes e Adam Abbas — Acne em Usuários de Hormônios Anabolizantes",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Complemento para performance, estética de alta definição e limites de atuação multidisciplinar.",
    nextUse: "Útil como pauta especializada, mas não é eixo central da programação recebida de 2027.",
  },
  {
    priority: "Banco editorial",
    tone: "low",
    title: "Mika Yamaguchi — Mudanças Climáticas, Saúde Sistêmica e Pele",
    transcript: "Transcrição validada disponível",
    bridge: "Autoridade complementar para pele, ambiente e visão sistêmica; baixa aderência aos maiores gatilhos comerciais de 2027.",
    nextUse: "Aproveitar quando a pauta pedir diferenciação ou contexto; não precisa ocupar a frente da próxima campanha.",
  },
  {
    priority: "Banco editorial",
    tone: "low",
    title: "Fabricio Assini — Influência da Saúde Mental na Estética",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Tema transversal de comportamento e adesão, mas sem correspondência direta com os títulos confirmados de 2027.",
    nextUse: "Transcrever depois das ondas prioritárias, caso a equipe queira uma pauta de humanização ou adesão.",
  },
];

