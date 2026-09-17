export type ProgramSession = {
  time: string;
  speakers: string;
  title: string;
  materialStatus?: string;
  speakerAssets?: Array<{
    name: string;
    photo?: string;
    social?: Array<{ label: string; url: string }>;
    note?: string;
  }>;
};

export type CongressProgram = {
  id: string;
  congress: string;
  status: "recebida" | "aguardando";
  statusLabel: string;
  date?: string;
  room?: string;
  source: string;
  sourceUrl?: string;
  assetSourceUrl?: string;
  note: string;
  sessions: ProgramSession[];
};

export type ConferenceCoordinator = {
  congressId: string;
  name: string;
  bio?: string;
  photo: string;
  social: Array<{ label: string; url: string }>;
  bioSource?: string;
};

export const confirmedProgramPublicationPolicy = {
  congresses: ["Nutrição Estética", "SONAFE — Simpósio de Fisioterapia Esportiva"],
  status: "Programações definitivas · divulgação temática autorizada",
  allowed:
    "Os temas centrais podem ser usados em posts e e-mails quando melhorarem a jornada, o storytelling ou o avanço do público.",
  reserved:
    "Preservar para um lançamento próprio da programação: grade completa, sequência, horários, títulos integrais das sessões, composição completa de palestrantes e materiais ainda pendentes.",
  criterion:
    "Disponibilidade não cria obrigação editorial. Usar somente quando o tema tiver função clara na campanha e não substituir uma pauta mais forte.",
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
    congress: "Certificação Internacional em Personal Training – WTTC",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Conteúdo programático de 2026 disponível como referência",
    note: "A validade internacional é um diferencial central já confirmado: a certificação amplia a possibilidade de atuação profissional também fora do Brasil. A grade de 2027 ainda deverá confirmar módulos, docentes, entregas e os requisitos operacionais dessa mobilidade antes de pautas específicas.",
    sessions: [],
  },
  {
    id: "sonafe",
    congress: "SONAFE — Simpósio de Fisioterapia Esportiva",
    status: "recebida",
    statusLabel: "Programação 2027 definitiva · temas liberados",
    date: "24 de abril de 2027",
    room: "Sala a confirmar",
    source: "Programação_Simposio_Sonafe_2027.xls · Google Sheets do projeto",
    sourceUrl: "https://docs.google.com/spreadsheets/d/1P6EooZAA6mVkYVMC-hVUfbBvGfxxCx-8/edit?gid=656380718#gid=656380718",
    note: "Doze sessões definitivas, incluindo nove palestras em dupla e uma mesa-redonda. Os temas centrais podem ser divulgados seletivamente, sem revelar a grade completa. A planilha identifica o encontro como 2º Simpósio, enquanto o arquivo de coordenadores usa 3º Simpósio; confirmar a numeração oficial antes de publicar peças externas.",
    sessions: [
      { time: "9h00", speakers: "Anderson José Santana", title: "Crioterapia no Esporte: novas perspectivas e caminhos" },
      { time: "9h30", speakers: "Adriane Vanin", title: "Fotobiomodulação no Esporte: a luz no fim do túnel — evidências atuais" },
      { time: "10h00", speakers: "Leonardo Luiz Barretti Secchi e Priscila Alvarenga", title: "Ativação Muscular e Especificidade na Fisioterapia Esportiva. Por que não?" },
      { time: "10h30", speakers: "Paulo Ricardo e Mari Vido", title: "Controle de Carga nos MMSS: quando fazer o download ou upload?" },
      { time: "11h00", speakers: "Marcos Antonio e Cristiane Alcântara", title: "Esporte Paralímpicos: onde estamos após 10 anos do Rio 2016? O que falta mais?" },
      { time: "14h00", speakers: "João Barboza e Larissa Pechincha", title: "Avaliação Funcional do Sistema Músculo-esquelética da mulher atleta de futebol" },
      { time: "14h30", speakers: "Giovana Steiner e Rafael Ferrer", title: "Lesões nas crianças atletas de futebol" },
      { time: "15h00", speakers: "Bruno Baroni e Katherine Ferro", title: "Lesões de Isquiotibiais no Futebol Feminino: considerações na avaliação e reabilitação da mulher atleta" },
      { time: "15h30", speakers: "Fabricio Rapelo e Jessica Fernandes", title: "Fatores intrínseco e extrínsecos aplicado ao futebol de campo: o que a ciência sempre disse?" },
      { time: "16h00", speakers: "Gegê e Klever Shinji", title: "Mobilização Miofascial: raciocínio clínico além da tensegridade aplicada ao quadril" },
      { time: "16h30", speakers: "André Fujita e Bárbara Pocceschi", title: "Concussão no Esporte: onde estamos batendo a cabeça?" },
      { time: "17h00–18h30", speakers: "Mari Vido, Bárbara Pocceschi, Jessica Fernandes, Giovana Steiner, Gegê, Priscila Alvarenga, Katherine Ferro e João Barboza · Moderação: Bruno Baroni", title: "Mesa-redonda — Profissão Fisioterapeuta: da lesão ao Return to Play" },
    ],
  },
  {
    id: "nutricao-estetica",
    congress: "Nutrição Estética",
    status: "recebida",
    statusLabel: "Programação 2027 definitiva · temas liberados",
    date: "23 de abril de 2027",
    room: "Sala a confirmar",
    source: "Programação_Conference_NutriçãoEstética_2027.xlsx · versão atualizada recebida em 11/09/2026",
    assetSourceUrl: "https://drive.google.com/drive/folders/1cbpsKRniKhToysrglTtyyCpQwPeHffcs?usp=drive_link",
    note: "As dez sessões são definitivas e seus temas centrais podem ser divulgados seletivamente, sem revelar a grade completa. A atualização acrescenta ementas e materiais individuais para seis sessões. A pasta principal contém nove pastas de palestrantes; oito fotos foram associadas com segurança. O arquivo da pasta Diogo Viana está nomeado “Diogo Pinto” e permanece bloqueado até confirmação. Outros oito palestrantes ainda não possuem foto nessa pasta.",
    sessions: [
      {
        time: "9h00",
        speakers: "Marília Lacerda",
        title: "Preparação metabólica para cirurgia plástica: reduzindo complicações e potencializando resultados",
        materialStatus: "Ementa, mini-CV, foto e Instagram recebidos.",
        speakerAssets: [{ name: "Marília Lacerda", photo: "/manus-storage/marilia-lacerda_ac73c731.webp", social: [{ label: "@marilialacerda_", url: "https://www.instagram.com/marilialacerda_/" }] }],
      },
      {
        time: "9h40",
        speakers: "Gabriel Ximenes e Pedro Perim",
        title: "GLP-1 e Cirurgia Plástica: quem deve operar, quando operar e como preservar a massa muscular",
        materialStatus: "Ementa e materiais de Gabriel recebidos; Pedro ainda sem materiais individuais.",
        speakerAssets: [
          { name: "Gabriel Ximenes", photo: "/manus-storage/gabriel-ximenes_6f58f713.webp", social: [{ label: "@gabrieelximenes", url: "https://www.instagram.com/gabrieelximenes/" }] },
          { name: "Pedro Perim", note: "Foto e materiais pendentes" },
        ],
      },
      {
        time: "10h20",
        speakers: "Dr. Leandro Lucerna e Luísa Wolpe",
        title: "Queda capilar além da ferritina: mitocôndria, inflamação e metabolômica — Ozempic Hair Loss: mito ou realidade?",
        materialStatus: "Sem novos materiais individuais nesta versão.",
        speakerAssets: [
          { name: "Dr. Leandro Lucerna", note: "Foto e materiais pendentes" },
          { name: "Luísa Wolpe", note: "Foto não incluída na pasta de palestrantes" },
        ],
      },
      {
        time: "11h00",
        speakers: "Raquel Wolpe e Luísa Wolpe",
        title: "Lipedema 360°: da bioenergética ao tratamento físico",
        materialStatus: "Sem novos materiais individuais nesta versão.",
        speakerAssets: [
          { name: "Raquel Wolpe", note: "Foto e materiais pendentes" },
          { name: "Luísa Wolpe", note: "Foto não incluída na pasta de palestrantes" },
        ],
      },
      {
        time: "11h40",
        speakers: "Diogo Viana e Rodrigo Granzotti",
        title: "Impacto do uso de GLP-1 na resposta hormonal do paciente com lipedema",
        materialStatus: "Ementa, mini-CV e Instagram de Diogo recebidos; Rodrigo ainda sem materiais individuais.",
        speakerAssets: [
          { name: "Diogo Viana", social: [{ label: "@dr.diogoviana", url: "https://www.instagram.com/dr.diogoviana/" }], note: "Foto bloqueada: arquivo da pasta está nomeado “Diogo Pinto”" },
          { name: "Rodrigo Granzotti", note: "Foto e materiais pendentes" },
        ],
      },
      {
        time: "14h00",
        speakers: "Suellen Becher, Dr. Vinicius Ortiz e Camila Barijan",
        title: "Estética e Nutrição Regenerativa: o futuro já começou",
        materialStatus: "Ementas e materiais de Suellen e Vinicius recebidos; Camila ainda sem materiais individuais.",
        speakerAssets: [
          { name: "Suellen Becher", photo: "/manus-storage/suellen-becher_4aba7087.webp", social: [{ label: "@suellenbecher", url: "https://www.instagram.com/suellenbecher/" }] },
          { name: "Dr. Vinicius Ortiz", photo: "/manus-storage/vinicius-ortiz_7859b087.webp", social: [{ label: "@drviniciusortiz", url: "https://www.instagram.com/drviniciusortiz/" }] },
          { name: "Camila Barijan", note: "Foto e materiais pendentes" },
        ],
      },
      {
        time: "15h20",
        speakers: "Ana Paula Pujol",
        title: "Bioenergética Mitocondrial na Saúde da Mulher: implicações para metabolismo, envelhecimento e composição corporal",
        materialStatus: "Ementa, mini-CV, foto e Instagram recebidos.",
        speakerAssets: [{ name: "Ana Paula Pujol", photo: "/manus-storage/ana-paula-pujol_c9649a60.webp", social: [{ label: "@anapaulapujol", url: "https://www.instagram.com/anapaulapujol/" }] }],
      },
      {
        time: "16h00",
        speakers: "Andreia Naves",
        title: "Sistema Musculoesquelético e Longevidade: mobilidade, força e fáscia na saúde da mulher",
        materialStatus: "Sem novos materiais individuais nesta versão.",
        speakerAssets: [{ name: "Andreia Naves", note: "Foto não incluída na pasta de palestrantes" }],
      },
      {
        time: "16h40",
        speakers: "Braian Cordeiro",
        title: "Metabolismo Invisível: o que a Calorimetria Indireta revela sobre a Estética Corporal",
        materialStatus: "Sem novos materiais individuais nesta versão.",
        speakerAssets: [{ name: "Braian Cordeiro", note: "Foto e materiais pendentes" }],
      },
      {
        time: "17h20",
        speakers: "Faruk Kalil, Vanessa Erthal e Alessandra Pinheiro",
        title: "Performance Feminina e Estética de Alta Definição",
        materialStatus: "Ementas, mini-CVs, fotos e redes sociais dos três palestrantes recebidos.",
        speakerAssets: [
          { name: "Faruk Kalil", photo: "/manus-storage/faruk-kalil_88627fd4.webp", social: [{ label: "@prof.dr.farukkalil", url: "https://www.instagram.com/prof.dr.farukkalil/" }, { label: "@ekfprime", url: "https://www.instagram.com/ekfprime/" }] },
          { name: "Vanessa Erthal", photo: "/manus-storage/vanessa-erthal_5369a135.webp", social: [{ label: "@vane_erthal", url: "https://www.instagram.com/vane_erthal/" }] },
          { name: "Alessandra Pinheiro", photo: "/manus-storage/alessandra-pinheiro_6e1e4de4.webp", social: [{ label: "@alessandrapinheiroifbbpro", url: "https://www.instagram.com/alessandrapinheiroifbbpro/" }] },
        ],
      },
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
    congress: "Nutrição Estética",
    title: "GLP-1, cirurgia plástica e preservação de massa muscular",
    tension: "O emagrecimento medicamentoso muda o momento da cirurgia, a preparação metabólica e a proteção da massa muscular.",
    audience: "Nutricionistas clínicos e estéticos, profissionais ligados à cirurgia plástica e equipes que acompanham pacientes em uso de GLP-1.",
    sessions: "Preparação metabólica; GLP-1 e cirurgia plástica; calorimetria indireta.",
  },
  {
    id: "lipedema",
    congress: "Nutrição Estética",
    title: "Lipedema além do olhar exclusivamente estético",
    tension: "A dor central é diferenciar, avaliar e integrar metabolismo, bioenergética, hormônios e tratamento físico.",
    audience: "Nutricionistas, profissionais habilitados em estética e equipes multidisciplinares que atendem mulheres com suspeita ou diagnóstico de lipedema.",
    sessions: "Lipedema 360°; GLP-1 e resposta hormonal no lipedema.",
  },
  {
    id: "saude-mulher",
    congress: "Nutrição Estética",
    title: "Saúde da mulher, longevidade e composição corporal",
    tension: "Metabolismo, força, mobilidade, fáscia, envelhecimento e estética precisam ser tratados como uma jornada integrada.",
    audience: "Nutricionistas e profissionais de saúde que trabalham com mulheres adultas, envelhecimento saudável, força e composição corporal.",
    sessions: "Bioenergética mitocondrial; sistema musculoesquelético e longevidade; performance feminina.",
  },
  {
    id: "cabelo-pele",
    congress: "Nutrição Estética",
    title: "Queda capilar, pele e sinais que exigem investigação",
    tension: "Ferritina isolada e protocolos genéricos não explicam toda queda capilar nem todas as respostas da pele.",
    audience: "Profissionais de nutrição estética, saúde capilar, pele e acompanhamento de pacientes em emagrecimento.",
    sessions: "Queda capilar, mitocôndria, inflamação e metabolômica; nutrição regenerativa.",
  },
  {
    id: "regenerativa",
    congress: "Nutrição Estética",
    title: "Nutrição regenerativa e avaliação individualizada",
    tension: "O público procura critérios para decidir melhor, não mais um protocolo universal vendido como solução.",
    audience: "Nutricionistas e profissionais habilitados que desejam atualizar avaliação, raciocínio clínico e integração de condutas.",
    sessions: "Estética e nutrição regenerativa; bioenergética; calorimetria indireta.",
  },
  {
    id: "performance-feminina",
    congress: "Nutrição Estética",
    title: "Performance feminina e estética de alta definição",
    tension: "Definição corporal não pode ser reduzida a dieta, treino ou aparência sem considerar força, massa muscular, recuperação e saúde.",
    audience: "Nutricionistas esportivos e estéticos, treinadores e profissionais que acompanham mulheres em performance e composição corporal.",
    sessions: "Sistema musculoesquelético; calorimetria indireta; performance feminina e estética de alta definição.",
  },
  {
    id: "sonafe-avaliacao-recursos",
    congress: "SONAFE",
    title: "Avaliar antes de escolher o recurso",
    tension: "Crioterapia, fotobiomodulação, ativação muscular e mobilização miofascial perdem sentido quando aparecem antes da leitura do atleta, da modalidade e do objetivo.",
    audience: "Fisioterapeutas esportivos e equipes que precisam qualificar raciocínio clínico, avaliação e escolha contextualizada de recursos.",
    sessions: "Crioterapia; fotobiomodulação; ativação muscular e especificidade; mobilização miofascial.",
  },
  {
    id: "sonafe-carga-prevencao",
    congress: "SONAFE",
    title: "Carga, prevenção e fatores de risco",
    tension: "Prevenir não é apenas reagir à lesão: exige compreender carga, fatores intrínsecos e extrínsecos, fase esportiva e resposta individual.",
    audience: "Fisioterapeutas, preparadores e equipes multidisciplinares envolvidos em prevenção, monitoramento e progressão de atletas.",
    sessions: "Controle de carga nos membros superiores; fatores intrínsecos e extrínsecos no futebol.",
  },
  {
    id: "sonafe-futebol-feminino-base",
    congress: "SONAFE",
    title: "Futebol feminino e formação esportiva",
    tension: "Mulheres e crianças atletas exigem avaliação, prevenção e reabilitação que considerem contexto, desenvolvimento e demandas específicas do futebol.",
    audience: "Profissionais que atuam no futebol feminino, categorias de base, clubes, clínicas e projetos de desenvolvimento esportivo.",
    sessions: "Avaliação funcional da mulher atleta; lesões em crianças atletas; isquiotibiais no futebol feminino.",
  },
  {
    id: "sonafe-concussao-return-play",
    congress: "SONAFE",
    title: "Da lesão ao Return to Play",
    tension: "O retorno ao esporte exige decisões integradas, comunicação profissional e critérios que não terminam quando a dor diminui.",
    audience: "Fisioterapeutas esportivos, equipes clínicas e profissionais envolvidos em concussão, reabilitação e retorno ao jogo.",
    sessions: "Concussão no esporte; mesa-redonda Profissão Fisioterapeuta: da lesão ao Return to Play.",
  },
];

export const conferenceCoordinators: ConferenceCoordinator[] = [
  {
    congressId: "nutricao-esportiva",
    name: "Andréia Naves",
    bio: "Diplomada pelo The Institute for Functional Medicine (USA); membro do Instituto Brasileiro de Nutrição Funcional; autora de livros em Nutrição Clínica e Esportiva Funcional e do Tratado de Nutrição Esportiva Funcional; CEO da Nutreex Clínica e da Experiência em Nutrição Esportiva de Excelência.",
    photo: "/manus-storage/andreia-naves_fdd10266.webp",
    social: [{ label: "@andreia_naves", url: "https://www.instagram.com/andreia_naves/" }],
  },
  {
    congressId: "nutricao-estetica",
    name: "Luisa Wolpe",
    bio: "Nutricionista, técnica em Estética Facial e Corporal, especialista em Nutrição Clínica e mestre em Medicina Interna. Professora, coordenadora de pós-graduação, palestrante e mentora na área de Nutrição e Estética.",
    photo: "/manus-storage/luisa-wolpe_bbd86adc.webp",
    social: [{ label: "@luwolpenutricionista", url: "https://www.instagram.com/luwolpenutricionista/" }],
  },
  {
    congressId: "gestao",
    name: "Dudu Netto",
    bio: "Diretor Técnico e sócio da Bodytech Company, mestre em Ciência da Motricidade Humana e especialista em Ciência do Exercício. Atua em programas, inovação e estratégias para o mercado fitness.",
    photo: "/manus-storage/dudu-netto_304f80bf.webp",
    social: [{ label: "@nettodudu", url: "https://www.instagram.com/nettodudu/" }],
  },
  {
    congressId: "wttc",
    name: "Cris Parente",
    bio: "CEO da World Top Trainers Certification; eleito Melhor Personal Trainer do Mundo pelo American Council on Exercise; professor da pós-graduação em Personal Training da USP e professor formador na Comunidade Europeia.",
    photo: "/manus-storage/cris-parente_5188fbbf.webp",
    social: [
      { label: "@crisparente", url: "https://www.instagram.com/crisparente/" },
      { label: "@worldtoptrainers", url: "https://www.instagram.com/worldtoptrainers/" },
    ],
  },
  {
    congressId: "sonafe",
    name: "Leonardo Luiz Barretti Secchi",
    bio: "Fisioterapeuta, doutor em Fisioterapia pela UFSCar, mestre em Ciências da Saúde pela FMUSP e especialista em Reabilitação Aplicada ao Esporte pela UNIFESP/CETE. Membro da SONAFE/SP, Diretor Científico da SONAFE Brasil 2026–2027, docente e fisioterapeuta clínico.",
    bioSource: "Mini-CV complementado pela programação SONAFE 2027",
    photo: "/manus-storage/leonardo-barretti_22460685.webp",
    social: [{ label: "@fisio.leobarretti", url: "https://www.instagram.com/fisio.leobarretti/" }],
  },
  {
    congressId: "sonafe",
    name: "Rafael Fernandes Temoteo",
    bio: "Fisioterapeuta, mestre em Bioengenharia, especialista em Terapia Manual e Postural, coordenador de pós-graduação em Podoposturologia Clínica e Funcional, professor e presidente da Sociedade Nacional de Fisioterapia Esportiva e Atividade Física.",
    photo: "/manus-storage/rafael-temoteo_55ffba79.webp",
    social: [{ label: "@sonafebrasil", url: "https://www.instagram.com/sonafebrasil/" }],
  },
  {
    congressId: "bodybuilding",
    name: "Ricardo Pannain",
    photo: "/manus-storage/ricardo-pannain_a4e799c5.webp",
    social: [{ label: "@ricardopannain", url: "https://www.instagram.com/ricardopannain/" }],
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
