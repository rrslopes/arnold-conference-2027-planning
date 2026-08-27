/**
 * Design philosophy: "Sala de Comando da Campanha" — conteúdo estratégico profundo,
 * hierarquia editorial forte e interação orientada a decisão dentro do KV Arnold.
 */

export const brandAssets = {
  hero: "/manus-storage/arnold-command-hero_db100545.png",
  leadMagnets: "/manus-storage/arnold-lead-magnets_5de6d7ca.png",
  calendar: "/manus-storage/arnold-calendar-system_c7b193d0.png",
  roadmap: "/manus-storage/arnold-roadmap-path_bc3c3ece.png",
  planningSymbol: "/manus-storage/arnold-planning-symbol_cfdc9bf9.png",
  conferenceLogo: "/manus-storage/arnold-conference_1787f747.png",
  sportsLogo: "/manus-storage/arnold-sports_46035173.png",
};

export const congressLogos: Record<string, string> = {
  "Gestão de Academias": "/manus-storage/gestao-academias_2529f491.png",
  WTTC: "/manus-storage/wttc_d9097d77.png",
  SONAFE: "/manus-storage/sonafe_80343a38.png",
  "Nutrição Estética": "/manus-storage/nutricao-estetica_8fde3830.png",
  "Nutrição Esportiva": "/manus-storage/nutricao-esportiva_98acbfec.png",
  Bodybuilding: "/manus-storage/bodybuilding_8be0165c.png",
};

export const navigation = [
  { id: "visao", label: "Visão geral" },
  { id: "objetivos", label: "Objetivos" },
  { id: "publicos", label: "Públicos" },
  { id: "iscas", label: "Iscas digitais" },
  { id: "laboratorio", label: "Laboratório" },
  { id: "calendario", label: "Calendário" },
  { id: "email", label: "E-mail" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "roadmap", label: "Roadmap" },
  { id: "indicadores", label: "Indicadores" },
];

export const objectives = [
  { id: "atencao", stage: "Atenção", objective: "Recuperar alcance qualificado e participação", signals: "Retenção, respostas, compartilhamentos, visitas e comentários com palavra-chave" },
  { id: "captacao", stage: "Captação", objective: "Converter audiência e base em leads identificados", signals: "Conversão na landing page e interesse por congresso" },
  { id: "ativacao", stage: "Ativação", objective: "Fazer o lead consumir a recompensa", signals: "Aula escolhida, início, profundidade e segunda aula" },
  { id: "qualificacao", stage: "Qualificação", objective: "Identificar intenção e objeções", signals: "Guardar data, teste interativo, página de congresso, perguntas frequentes e respostas" },
  { id: "venda", stage: "Venda", objective: "Converter no primeiro lote", signals: "Checkout, compra, receita e tempo até compra" },
  { id: "expansao", stage: "Expansão", objective: "Aumentar valor e adequação", signals: "Venda complementar coerente, quando oferta e agenda permitirem" },
  { id: "experiencia", stage: "Experiência", objective: "Preparar presença e gerar prova", signals: "Acesso a guias, credenciamento, presença, satisfação e indicação" },
];

export const congresses = [
  { name: "Gestão de Academias", audience: "Proprietários, gestores, coordenadores e líderes", tension: "Crescer sem exaurir o dono, perder equipe ou competir apenas por estrutura", promise: "Gestão, cultura, estratégia e inovação para negócios mais fortes no setor de academias e atividade física", accent: "#CBDB2A" },
  { name: "WTTC", audience: "Personal trainers e profissionais de Educação Física", tension: "Boa técnica sem posicionamento, método, carreira ou capacidade comercial", promise: "Evolução profissional integrada: entrega, reputação, carreira e negócio", accent: "#CCB9A6" },
  { name: "SONAFE", audience: "Fisioterapeutas e equipes multidisciplinares", tension: "Decisões fragmentadas entre avaliação, recuperação, reabilitação e retorno", promise: "Atualização aplicada e integração para uma atuação esportiva mais segura e consistente", accent: "#9DD9D2" },
  { name: "Nutrição Estética", audience: "Nutricionistas e profissionais habilitados em estética e saúde", tension: "Platô, reganho, lipedema, pele, metabolismo e excesso de protocolos genéricos", promise: "Avaliação mais refinada e estratégias individualizadas, com base técnica", accent: "#E7A7C8" },
  { name: "Nutrição Esportiva", audience: "Nutricionistas, médicos, treinadores e profissionais de desempenho", tension: "Marketing, hiper-suplementação e receita universal versus fisiologia, saúde e contexto", promise: "Decisões mais criteriosas para um desempenho esportivo sustentável", accent: "#F2C667" },
  { name: "Bodybuilding", audience: "Treinadores, nutricionistas, fisioterapeutas, atletas e equipes", tension: "Copiar preparação, negligenciar recuperação ou reduzir o processo a fármacos", promise: "Preparação integrada: treino, nutrição, recuperação, estética e competição", accent: "#F48C5A" },
];

export type LeadMagnet = {
  id: number;
  period: string;
  title: string;
  coverage: string;
  role: string;
  summary: string;
  format: string;
  content: string[];
  materials: string[];
  production: string[];
  limit: string;
  cta: string;
  status: "pronto" | "planejado" | "dependente";
  masterclasses?: { speaker: string; theme: string; problem: string; relation: string }[];
};

export const leadMagnets: LeadMagnet[] = [
  {
    id: 1,
    period: "Setembro",
    title: "Seleção Arnold Conference — 3 masterclasses",
    coverage: "Gestão, Nutrição Estética e Nutrição Esportiva",
    role: "Provar a qualidade do conteúdo e iniciar a captação",
    summary: "Uma seleção curada de três aulas completas da edição de 2026, oferecidas em uma mesma landing page. Os vídeos ficam incorporados à página de obrigado e o e-mail de acesso retorna para essa página.",
    format: "Landing page + página de obrigado com 3 vídeos completos + sequência de e-mail",
    content: ["Apresentação dos três desafios profissionais", "Orientação sobre por qual aula começar", "Data da abertura de vendas em 23/09 às 12h"],
    materials: ["Vídeos não listados já autorizados", "Fotos e nomes dos três palestrantes", "Resumo validado das aulas", "Landing page, página de obrigado e rastreamento"],
    production: ["Revisar títulos e metadados dos vídeos", "Montar os três cartões antes dos reprodutores", "Testar formulário, entrega e e-mail imediato", "Configurar palavra-chave AULAS com link fixo"],
    limit: "Não prometer aulas de WTTC, SONAFE ou Bodybuilding.",
    cta: "Acessar as três masterclasses gratuitas",
    status: "pronto",
    masterclasses: [
      { speaker: "Ana Paula Pujol", theme: "Estratégias nutricionais avançadas para platô, reganho e diferenças metabólicas", problem: "Por que alguns pacientes param de perder peso ou recuperam o peso perdido", relation: "Nutrição Estética" },
      { speaker: "Andreia Naves", theme: "Planejamento do uso de carboidratos antes, durante e depois do exercício", problem: "Como adaptar consumo e suplementação ao esforço, tolerância e realidade do atleta", relation: "Nutrição Esportiva" },
      { speaker: "Roberto Tranjan", theme: "Academia como organismo de Corpo, Mente e Alma", problem: "Por que boa estrutura não resolve sobrecarga do dono, desengajamento e perda de alunos", relation: "Gestão de Academias" },
    ],
  },
  {
    id: 2,
    period: "Novembro",
    title: "Diagnóstico Profissional Arnold 2027",
    coverage: "Todos os 6 congressos",
    role: "Captar públicos de todas as áreas e orientar a escolha",
    summary: "Questionário interativo de 8 a 12 perguntas que devolve um perfil resumido, o desafio prioritário, um congresso principal e até dois congressos complementares.",
    format: "Experiência interativa de 3–5 minutos + resultado na tela + resumo por e-mail",
    content: ["Profissão e momento profissional", "Desafio prioritário", "Congresso principal e complementares", "Justificativa simples e próximo passo"],
    materials: ["Ficha validada de uma página por congresso", "Matriz de perguntas, alternativas e pesos", "Textos para seis resultados", "Links oficiais e consentimentos"],
    production: ["Reunião com seis coordenadores", "Criar regra de pontuação e desempate", "Testar com 10–15 perfis", "Integrar formulário e base", "Publicar páginas de resultado"],
    limit: "O resultado orienta a escolha; não substitui aconselhamento profissional nem inventa compatibilidades de agenda.",
    cta: "Descobrir meu caminho no Arnold Conference",
    status: "planejado",
  },
  {
    id: 3,
    period: "Janeiro",
    title: "Guia — Academia como Organismo",
    coverage: "Gestão de Academias",
    role: "Gerar leads qualificados e aprofundar gestão, estratégia e liderança",
    summary: "Guia preenchível que transforma conceitos de Roberto Tranjan, Gláucia Guarcello e Zé Roberto em uma ferramenta de reflexão para gestores.",
    format: "PDF de 15–20 páginas + folha-resumo de plano de ação",
    content: ["Corpo: estrutura, operação e controles", "Mente: estratégia, foco e relação com o aluno", "Alma: equipe, cultura e propósito", "Três ações prioritárias para 30 dias"],
    materials: ["Slides e transcrições", "Autorização para usar estruturas conceituais", "Exemplos reais e imagens autorizadas", "Revisão de palestrantes ou coordenação"],
    production: ["Selecionar conceitos", "Redigir exercícios", "Validar conteúdo", "Diagramar o guia", "Criar landing page e e-mail de entrega"],
    limit: "Não apresentar como diagnóstico empresarial definitivo nem prometer resultado financeiro.",
    cta: "Baixar o guia e avaliar minha academia",
    status: "planejado",
  },
  {
    id: 4,
    period: "Janeiro",
    title: "Guia — Além do Platô",
    coverage: "Nutrição Estética",
    role: "Gerar leads qualificados por uma dor clínica ampla e relevante",
    summary: "Material educacional que organiza perguntas e fatores para ampliar a avaliação antes de repetir uma estratégia genérica.",
    format: "PDF visual de 18–24 páginas em 3 blocos",
    content: ["Efeito platô e reganho", "Demandas estéticas e condições associadas", "Ambiente, pele e exposoma"],
    materials: ["Slides e artigos citados", "Imagens clínicas licenciadas", "Autorização das palestrantes", "Revisão técnica e jurídica"],
    production: ["Extrair afirmações", "Checar fontes", "Organizar perguntas", "Fazer revisão científica", "Diagramar e publicar"],
    limit: "Não substituir avaliação clínica, indicar protocolo ou universalizar números da palestra.",
    cta: "Baixar o guia Além do Platô",
    status: "dependente",
  },
  {
    id: 5,
    period: "Janeiro",
    title: "Guia — Carboidrato e Desempenho",
    coverage: "Nutrição Esportiva",
    role: "Gerar leads qualificados com conteúdo aplicável",
    summary: "Roteiro educacional de perguntas para organizar decisões antes, durante e depois do treino ou competição, com base principal na aula de Andreia Naves.",
    format: "PDF de 18–24 páginas + fluxograma visual de decisão",
    content: ["Demanda, intensidade e duração do treino", "Alimentação, suplementação e tolerância gastrointestinal", "Estratégia antes, durante e depois", "Diferenças entre atleta amador e elite"],
    materials: ["Slides e referências científicas", "Confirmação de números", "Autorização das palestras", "Revisão médica e nutricional"],
    production: ["Consolidar conceitos", "Verificar dados", "Construir roteiro e fluxograma", "Revisar", "Diagramar e lançar"],
    limit: "Não recomendar doses, prescrever suplementação ou substituir avaliação individual.",
    cta: "Baixar o roteiro de planejamento",
    status: "dependente",
  },
  {
    id: 6,
    period: "Março",
    title: "Planejador da Jornada Arnold 2027",
    coverage: "Todos os 6 congressos",
    role: "Ajudar na decisão, organizar a participação e encaminhar para a compra",
    summary: "Experiência interativa para pessoas que já conhecem o evento, mas precisam comparar opções, dias e sessões antes de concluir a compra.",
    format: "Página interativa ou formulário com recomendação na tela",
    content: ["Profissão e objetivo", "Congressos de interesse", "Dias disponíveis", "Rota sugerida e conflitos de horário"],
    materials: ["Programação 2027 validada", "Horários, salas e compatibilidades", "Regras comerciais e Conference Pass, se existir", "Links oficiais de compra"],
    production: ["Desenhar mapa de decisão", "Criar protótipo", "Testar compreensão", "Desenvolver", "Revisar operação e publicar"],
    limit: "Se a agenda não estiver pronta, publicar comparador simples, sem recomendar sessões específicas.",
    cta: "Planejar minha jornada e fazer a inscrição",
    status: "dependente",
  },
];

export const futureMaterials = [
  { congress: "WTTC", materials: "Ementa e diferenciais de 2027; matriz de competências; informações de carreira; depoimentos e casos autorizados; contribuições de Cris Parente.", use: "Conteúdos de carreira e insumos para o diagnóstico e o planejador." },
  { congress: "SONAFE", materials: "Temas e diferenciais de 2027; confirmação do esgotamento de 2026; prints anonimizados e autorizados; contribuições do comitê.", use: "Prova de demanda e conteúdos sobre atualização e retorno ao esporte." },
  { congress: "Bodybuilding", materials: "Pilares aprovados; programação preliminar; imagens e depoimentos autorizados; contribuições de treino, nutrição e fisioterapia; revisão jurídica.", use: "Conteúdo integrado sem promessas, protocolos ou informação sensível não validada." },
];

export const cutMethod = [
  { step: 1, title: "Definir a função", action: "Escolher se a peça gera atenção, captação, qualificação ou venda.", criterion: "A equipe consegue dizer qual próximo passo espera do público." },
  { step: 2, title: "Procurar o trecho", action: "Buscar afirmação clara, pergunta, comparação, exemplo ou erro frequente.", criterion: "A fala funciona sem os minutos anteriores." },
  { step: 3, title: "Preservar o contexto", action: "Incluir a frase anterior ou posterior quando ela evita interpretação errada.", criterion: "O corte não muda o sentido da palestra." },
  { step: 4, title: "Montar a peça", action: "Abrir com a ideia forte, identificar o especialista, desenvolver e fechar com CTA.", criterion: "O vídeo entrega valor mesmo para quem não clicar." },
  { step: 5, title: "Validar", action: "Conferir conteúdo, legenda, nome, cargo, direitos e direcionamento.", criterion: "Responsável técnico aprova quando o tema exigir." },
  { step: 6, title: "Usar alternativa", action: "Se não houver trecho claro, usar reel narrado, carrossel, texto animado ou nova gravação.", criterion: "A peça não depende de uma fala inexistente." },
];

export const pieceTypes = [
  { name: "Corte de afirmação", use: "Fala completa em 20–45 segundos", when: "Quando há começo, meio e fim", fallback: "Reel narrado com conceito validado" },
  { name: "Corte de comparação", use: "Contrasta duas escolhas, crenças ou condutas", when: "Quando o contraste gera comentário ou clique", fallback: "Carrossel A versus B" },
  { name: "Pergunta e resposta", use: "Pergunta comum respondida de forma objetiva", when: "Quando funciona sem contexto extenso", fallback: "Nova gravação dirigida" },
  { name: "Microcaso", use: "Contexto, decisão e aprendizado sem identificação", when: "SONAFE, Nutrição e Bodybuilding", fallback: "Caso hipotético revisado em carrossel" },
  { name: "Reel narrado", use: "Narração + imagens de apoio + textos", when: "Quando não há fala direta utilizável", fallback: "Carrossel ou texto animado" },
  { name: "Nova gravação", use: "Resposta a uma pergunta específica", when: "WTTC, SONAFE e peças de lançamento", fallback: "Áudio autorizado com imagens" },
  { name: "Carrossel educativo", use: "Organiza perguntas, sinais, dilemas ou decisões", when: "Quando a fonte é transcrição ou programação", fallback: "Reel narrado com os mesmos tópicos" },
  { name: "Stories interativos", use: "Enquete, pergunta, teste e lembrete", when: "Pesquisa, segmentação e link", fallback: "Formulário curto" },
];

export const keywords = [
  { word: "AULAS", use: "Conteúdos das três masterclasses", destination: "Landing page das masterclasses", note: "Única palavra que promete acesso às aulas" },
  { word: "LEMBRETE", use: "Novidade e abertura de vendas", destination: "Landing page geral", note: "Link fixo de novidades" },
  { word: "FISIO", use: "Conteúdos SONAFE", destination: "Landing page geral", note: "Não promete material SONAFE" },
  { word: "WTTC", use: "Conteúdos da certificação", destination: "Landing page geral", note: "Não promete aula exclusiva" },
  { word: "BODY", use: "Conteúdos Bodybuilding", destination: "Landing page geral", note: "Não promete material exclusivo" },
  { word: "LOTE", use: "Abertura das vendas", destination: "Página central de vendas", note: "Ativar após validar URL" },
  { word: "CONGRESSO", use: "Conteúdo comparativo", destination: "Página central de vendas", note: "Sem recomendação personalizada" },
  { word: "ESTETICA", use: "Nutrição Estética pós-abertura", destination: "Página específica ou central", note: "Somente URL aprovada" },
];

export type CalendarItem = {
  id: string;
  date: string;
  phase: string;
  channel: string;
  title: string;
  origin: string;
  idea: string;
  optionLabel?: string;
  options?: string[];
  fallback: string;
  cta: string;
  keyword?: string;
  destination: string;
  congresses: string[];
};

export const calendar: CalendarItem[] = [
  { id: "0831", date: "31/08", phase: "Reativação", channel: "Feed", title: "Dia do Nutricionista", origin: "Pauta já programada pelo cliente", idea: "Manter a pauta e a produção aprovadas. A peça abre o período de reativação sem precisar ser reformulada.", fallback: "Não se aplica.", cta: "Marcar um profissional, salvar ou compartilhar", destination: "Interação no Instagram", congresses: ["Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0901", date: "01/09", phase: "Reativação", channel: "Feed/Reel", title: "Cris Parente e desenvolvimento profissional", origin: "Pauta já programada pelo cliente", idea: "Manter a pauta definida. O conteúdo reativa profissionais de Educação Física e interessados na certificação.", fallback: "Não se aplica.", cta: "Comentar sobre carreira ou desenvolvimento profissional", destination: "Interação no Instagram", congresses: ["WTTC"] },
  { id: "0902", date: "02/09", phase: "Reativação", channel: "Stories", title: "Teste de interesse por desafio", origin: "Produção nova sem dependência de vídeo", idea: "Criar uma situação para cada congresso e pedir que a pessoa escolha o desafio mais próximo de sua realidade.", optionLabel: "Situações para a enquete", options: ["Gestão: sua maior dificuldade é atrair e manter alunos?", "WTTC: seu desafio é transformar conhecimento técnico em carreira?", "SONAFE: sua dúvida é decidir o melhor caminho de reabilitação e retorno ao esporte?", "Nutrição Estética: você precisa lidar com platô, reganho ou demandas estéticas?", "Nutrição Esportiva: seu desafio é planejar a nutrição para melhorar o desempenho?", "Bodybuilding: você precisa integrar treino, dieta e recuperação na preparação?"], fallback: "Carrossel com seis situações profissionais, somente se a equipe preferir publicação no feed.", cta: "Responder à enquete", destination: "Interação no Instagram", congresses: ["Todos"] },
  { id: "0903", date: "03/09", phase: "Reativação", channel: "Carrossel/Reel", title: "Seis congressos, seis desafios", origin: "Produção nova", idea: "Apresentar uma dor concreta de cada área, evitando uma lista institucional de nomes.", optionLabel: "Desafios a apresentar", options: ["Gestão de Academias: gestão, retenção e força do negócio", "WTTC: carreira, posicionamento e entrega do personal", "SONAFE: avaliação, reabilitação e retorno seguro ao esporte", "Nutrição Estética: platô, reganho e diferenciação de demandas", "Nutrição Esportiva: estratégia nutricional aplicada ao desempenho", "Bodybuilding: preparação integrada e decisões individualizadas"], fallback: "Stories com seis telas, uma por congresso.", cta: "Qual desafio conversa mais com seu momento?", destination: "Comentários e enquete", congresses: ["Todos"] },
  { id: "0904", date: "04/09", phase: "Reativação", channel: "Reel", title: "Pílula de uma masterclass", origin: "Corte do acervo, se houver trecho localizável", idea: "Escolher uma das três falas e usar 25–45 segundos com começo e conclusão compreensíveis.", optionLabel: "Opções de corte para localizar", options: ["Ana Paula Pujol: fala explicando por que o platô não deve ser reduzido à falta de força de vontade.", "Andreia Naves: fala mostrando por que a estratégia nutricional não começa somente quando a fadiga aparece.", "Roberto Tranjan: fala explicando por que estrutura física não basta para uma academia forte."], fallback: "Reel narrado que apresenta uma das perguntas e informa que, em breve, três aulas completas serão liberadas.", cta: "Salvar e comentar qual tema quer aprofundar", destination: "Interação no Instagram", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0905", date: "05/09", phase: "Reativação", channel: "Stories", title: "Escuta da audiência", origin: "Produção nova", idea: "Usar uma caixa de perguntas e uma enquete complementar para captar a linguagem e as dores da audiência.", optionLabel: "Perguntas e respostas da interação", options: ["Caixa: se você pudesse assistir a uma aula completa do Arnold Conference hoje, qual problema gostaria de resolver?", "Enquete: gestão", "Enquete: estética", "Enquete: nutrição esportiva", "Enquete: carreira", "Enquete: fisioterapia", "Enquete: Bodybuilding"], fallback: "Post estático com a mesma pergunta, somente se houver necessidade de presença no feed.", cta: "Enviar a principal dúvida", destination: "Respostas dos Stories", congresses: ["Todos"] },
  { id: "0906", date: "06/09", phase: "Reativação", channel: "Reel", title: "Antecipação das três aulas", origin: "Montagem com cenas das masterclasses", idea: "Combinar três trechos visuais de 4–6 segundos; as falas não precisam aparecer completas.", optionLabel: "Cenas e assuntos para procurar", options: ["Ana Paula Pujol citando platô ou reganho de peso.", "Andreia Naves mencionando carboidrato ou desempenho esportivo.", "Roberto Tranjan falando sobre liderança, equipe ou Corpo–Mente–Alma."], fallback: "Montagem sem falas, com cenas dos três palestrantes e textos curtos apresentando os desafios.", cta: "Salvar e acompanhar a liberação em 08/09", keyword: "LEMBRETE", destination: "Landing page geral, se usar palavra-chave", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0907", date: "07/09", phase: "Transição", channel: "Stories", title: "Amanhã: liberação das aulas", origin: "Produção nova", idea: "Relembrar os três desafios e perguntar por qual aula a pessoa começaria.", optionLabel: "Opções da enquete", options: ["Estética: platô e reganho.", "Desempenho esportivo: estratégia nutricional.", "Gestão: liderança e equipe."], fallback: "Uma tela estática com os três temas e a data de 08/09.", cta: "Acompanhar o perfil para acessar amanhã", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0908", date: "08/09", phase: "Captação", channel: "Reel + carrossel", title: "Lançamento das três masterclasses", origin: "Montagem; não depende de corte específico", idea: "Apresentar três desafios, relacionar cada um à aula correspondente e informar que são conteúdos completos de 2026.", optionLabel: "Desafios e aulas a apresentar", options: ["Platô e reganho — masterclass de Ana Paula Pujol.", "Nutrição voltada ao desempenho esportivo — masterclass de Andreia Naves.", "Liderança e gestão — masterclass de Roberto Tranjan."], fallback: "Montagem com cenas dos três vídeos, títulos e narração da equipe de marketing; ou carrossel de seis telas. Não depende de nova gravação.", cta: "Comente AULAS e receba o link", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0909", date: "09/09", phase: "Captação", channel: "Stories", title: "Por qual aula começar?", origin: "Produção nova", idea: "Orientar o acesso somente entre as três aulas realmente disponíveis.", optionLabel: "Caminhos de orientação", options: ["Se você atende emagrecimento, comece por Ana Paula Pujol.", "Se trabalha com nutrição e desempenho esportivo, comece por Andreia Naves.", "Se lidera academia ou equipe, comece por Roberto Tranjan."], fallback: "Carrossel ‘Por qual aula começar?’, somente se houver capacidade.", cta: "Acessar as três aulas", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0910", date: "10/09", phase: "Captação", channel: "Reel", title: "Primeiro corte de masterclass", origin: "Corte localizável no acervo", idea: "Escolher uma das opções testadas em 04/09, priorizando a que recebeu mais respostas. O corte deve ter 25–45 segundos, contexto suficiente e entregar uma ideia útil antes da interrupção.", optionLabel: "Opções de corte para localizar", options: ["Ana Paula Pujol: por que o platô não deve ser tratado apenas como falta de força de vontade.", "Andreia Naves: por que a estratégia nutricional precisa começar antes de a fadiga aparecer.", "Roberto Tranjan: por que uma academia forte exige mais do que estrutura física."], fallback: "Reel narrado que apresenta a pergunta e convida para a explicação completa na aula.", cta: "Comente AULAS para assistir à explicação completa", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0911", date: "11/09", phase: "Captação", channel: "Carrossel", title: "Antes de escolher um gel esportivo", origin: "Aula de Andreia Naves", idea: "Organizar perguntas que o profissional precisa fazer antes de recomendar ou escolher um gel esportivo, evitando transformar números em regra universal.", optionLabel: "Perguntas que estruturam o carrossel", options: ["Qual é a demanda energética e a duração do treino?", "Como está a tolerância gastrointestinal do atleta?", "Em qual momento o produto seria consumido?", "O atleta está adaptado a essa estratégia?"], fallback: "Localizar na aula uma comparação entre marketing do produto e fisiologia; usar como corte somente após revisão técnica.", cta: "Comente AULAS para assistir à masterclass", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Nutrição Esportiva"] },
  { id: "0912", date: "12/09", phase: "Captação", channel: "Stories", title: "WTTC e carreira", origin: "Reaproveitamento ou enquete", idea: "Reaproveitar uma ideia do conteúdo de Cris Parente ou usar uma enquete sobre o principal limitador da carreira.", optionLabel: "Respostas da enquete", options: ["Posicionamento profissional.", "Método de trabalho.", "Vendas.", "Retenção de clientes."], fallback: "Carrossel com três sinais de uma carreira que precisa amadurecer, aprovado por Cris Parente.", cta: "Comente WTTC para acompanhar as novidades", keyword: "WTTC", destination: "Landing page geral", congresses: ["WTTC"] },
  { id: "0913", date: "13/09", phase: "Captação", channel: "Reel narrado", title: "Copiar preparação ou construir estratégia?", origin: "Produção nova; sem corte", idea: "Mostrar que o que funciona para um atleta pode ser inadequado para outro e que as decisões precisam ser integradas.", optionLabel: "Perguntas que conduzem a narrativa", options: ["O treino foi individualizado para esse atleta?", "A dieta responde ao objetivo, à fase e à resposta individual?", "A recuperação está sendo considerada junto com treino e dieta?"], fallback: "Carrossel ‘Copiar preparação ou construir estratégia?’ com os mesmos três eixos.", cta: "Comente BODY para acompanhar as novidades", keyword: "BODY", destination: "Landing page geral", congresses: ["Bodybuilding"] },
  { id: "0914", date: "14/09", phase: "Captação", channel: "Reel narrado", title: "Prova histórica de demanda SONAFE", origin: "Prints autorizados de 2026", idea: "Fazer mensagens de quem ficou de fora aparecerem em sequência e ocuparem a tela; ocultar nomes, fotos, telefones e qualquer dado pessoal.", optionLabel: "Mensagens reais que podem ser destacadas", options: ["Vai abrir nova turma?", "Ainda tem vaga?", "Fiquei de fora."], fallback: "Se os prints não puderem ser publicados, usar números internos aprovados ou uma narração geral: as vagas de 2026 se esgotaram e recebemos pedidos de nova turma. Não inventar quantidade nem urgência.", cta: "Comente FISIO para acompanhar as novidades", keyword: "FISIO", destination: "Landing page geral", congresses: ["SONAFE"] },
  { id: "0915", date: "15/09", phase: "Pré-venda", channel: "Reel + carrossel", title: "Abertura confirmada para 23/09", origin: "Produção nova", idea: "Colocar o público no centro e informar que as vendas abrem em 23/09, às 12h.", optionLabel: "Opções de abordagem", options: ["Apresentar seis perfis profissionais e mostrar o caminho de cada um entre os congressos.", "Convidar três especialistas a completar a frase: ‘Em 2027, minha área precisa de mais…’."], fallback: "Animação com cenas de 2026, nomes dos seis congressos e a data.", cta: "Comente LEMBRETE", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0916", date: "16/09", phase: "Pré-venda", channel: "Stories", title: "Mapa de objeções", origin: "Caixa de perguntas", idea: "Perguntar o que a pessoa precisa saber antes de escolher um congresso e agrupar as respostas para orientar as próximas pautas.", optionLabel: "Categorias de objeção", options: ["Conteúdo.", "Programação.", "Preço e condições.", "Logística.", "Compatibilidade entre congressos."], fallback: "Formulário curto de perguntas.", cta: "Enviar a dúvida e ativar o lembrete", destination: "Interação e landing page geral", congresses: ["Todos"] },
  { id: "0917", date: "17/09", phase: "Pré-venda", channel: "Carrossel", title: "WTTC versus Gestão de Academias", origin: "Produção nova", idea: "Comparar os focos dos dois congressos e mostrar complementaridade sem inventar programação ou compatibilidade de horários.", optionLabel: "Casos para orientar a comparação", options: ["Personal que quer fortalecer carreira, método, posicionamento e entrega — prioridade WTTC.", "Gestor que quer fortalecer negócio, liderança, cultura, operação e inovação — prioridade Gestão de Academias.", "Profissional com os dois desafios — apresentar complementaridade, condicionada à programação oficial."], fallback: "Reel narrado com os dois casos principais: personal querendo crescer na carreira versus gestor querendo fortalecer a academia.", cta: "Salvar e acompanhar as novidades", destination: "Landing page geral", congresses: ["WTTC", "Gestão de Academias"] },
  { id: "0918", date: "18/09", phase: "Pré-venda", channel: "Stories", title: "Escolha em 60 segundos", origin: "Teste interativo", idea: "Usar seis perguntas de perfil, cada uma apontando para um congresso; o resultado aparece nos próprios Stories.", optionLabel: "Perguntas do teste", options: ["Você lidera uma academia?", "Quer fortalecer sua carreira como personal trainer?", "Atua com reabilitação e retorno ao esporte?", "Trabalha com estética?", "Trabalha com desempenho esportivo?", "Vive o universo do Bodybuilding?"], fallback: "Carrossel com os seis perfis, somente se houver capacidade.", cta: "Ver o resultado e acessar as novidades", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0919", date: "19/09", phase: "Pré-venda", channel: "Carrossel", title: "Decisões no retorno ao esporte", origin: "Programação SONAFE 2026", idea: "Apresentar territórios de decisão, não um protocolo clínico.", optionLabel: "Decisões que estruturam o carrossel", options: ["Avaliar o atleta.", "Compreender a carga.", "Alinhar com treinador e profissional de Educação Física.", "Definir o objetivo da reabilitação.", "Monitorar a resposta.", "Preparar o retorno ao esporte.", "Sustentar a recuperação.", "Considerar a saúde mental."], fallback: "Nova gravação com especialista respondendo: ‘Qual decisão mais costuma ser esquecida no retorno ao esporte?’.", cta: "Comente FISIO", keyword: "FISIO", destination: "Landing page geral", congresses: ["SONAFE"] },
  { id: "0920", date: "20/09", phase: "Pré-venda", channel: "Stories", title: "Teste de escolha", origin: "Situações práticas", idea: "Apresentar situações profissionais, mostrar o congresso mais relacionado e permitir registrar mais de um interesse.", optionLabel: "Respostas que o teste deve permitir", options: ["Este é meu congresso principal.", "Tenho interesse em mais de um congresso.", "Quero registrar um interesse secundário."], fallback: "Formulário simples de recomendação.", cta: "Responder, salvar o resultado e acessar o link", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0921", date: "21/09", phase: "Pré-venda", channel: "Carrossel", title: "Nutrição Esportiva — 48 horas", origin: "Transcrições validadas", idea: "Usar três comparações com exemplos gerais derivados das transcrições e revisados tecnicamente.", optionLabel: "Comparações do carrossel", options: ["Evidência versus moda.", "Estratégia individual versus receita pronta.", "Desempenho imediato versus saúde sustentável."], fallback: "Usar corte de Andreia Naves, Daniel Coimbra ou Bruno Zylber somente se houver fala completa que represente uma das comparações.", cta: "Comente LEMBRETE", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Nutrição Esportiva"] },
  { id: "0922", date: "22/09", phase: "Pré-venda", channel: "Reel + Stories", title: "Amanhã, às 12h", origin: "Nova gravação, animação ou apresentação", idea: "Usar a peça para responder objetivamente o que já está confirmado antes da abertura.", optionLabel: "Informações que precisam aparecer", options: ["As vendas abrem amanhã, às 12h.", "Os seis congressos estarão disponíveis.", "O público poderá escolher sua área de interesse.", "Preço e condições aparecem somente se estiverem aprovados."], fallback: "Animação com textos e cenas do evento.", cta: "Comente LEMBRETE ou use o link dos Stories", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0923a", date: "23/09 · 9h", phase: "Abertura", channel: "Stories", title: "Agenda do dia", origin: "Produção nova", idea: "Evitar contagem regressiva vazia; cada tela precisa informar algo útil.", optionLabel: "Blocos da agenda", options: ["9h: confirmação da abertura.", "12h: vendas abertas.", "Após a abertura: orientação sobre como escolher o congresso."], fallback: "Post estático com os mesmos horários.", cta: "Ativar lembrete das 12h", destination: "Lembrete no Instagram", congresses: ["Todos"] },
  { id: "0923b", date: "23/09 · 12h", phase: "Abertura", channel: "Reel + carrossel + Stories", title: "Vendas abertas", origin: "Produção nova", idea: "Anunciar a abertura, apresentar os seis congressos e conduzir para a compra.", optionLabel: "Opções de formato principal", options: ["Apresentador anuncia ‘Vendas abertas’ e cita os seis congressos.", "Montagem com uma cena de cada área.", "Carrossel com uma tela por congresso e uma tela final de compra."], fallback: "Animação com identidade do evento, nomes dos congressos e primeiro lote.", cta: "Comente LOTE ou acesse o link na bio", keyword: "LOTE", destination: "Página central de vendas", congresses: ["Todos"] },
  { id: "0923c", date: "23/09 · 19h", phase: "Abertura", channel: "Stories", title: "Perguntas frequentes das primeiras horas", origin: "Dúvidas reais do atendimento", idea: "Responder somente perguntas efetivamente recebidas e informações já confirmadas.", optionLabel: "Categorias de perguntas a monitorar", options: ["O que a inscrição inclui?", "Como escolher o congresso?", "Quais são as condições comerciais?", "Como funciona o acesso?", "Onde será realizado?", "Qual é o canal de suporte?"], fallback: "Vídeo curto de um responsável pelo atendimento.", cta: "Enviar dúvida ou retomar a inscrição", destination: "Atendimento e página de vendas", congresses: ["Todos"] },
  { id: "0924", date: "24/09", phase: "Aceleração", channel: "Carrossel", title: "Qual congresso faz sentido para você?", origin: "Produção nova", idea: "Mostrar seis perfis e o congresso mais relacionado, explicando complementaridades possíveis e condicionando a escolha final à programação.", optionLabel: "Perfis para o comparativo", options: ["Lidera academia ou negócio fitness — Gestão de Academias.", "Quer fortalecer carreira e entrega como personal — WTTC.", "Atua com fisioterapia, reabilitação e retorno ao esporte — SONAFE.", "Trabalha com estética e composição corporal — Nutrição Estética.", "Trabalha com desempenho e esporte — Nutrição Esportiva.", "Vive preparação e cultura competitiva — Bodybuilding."], fallback: "Reel narrado ‘Qual congresso faz sentido para você?’ com os seis perfis.", cta: "Comente CONGRESSO", keyword: "CONGRESSO", destination: "Página central de vendas", congresses: ["Todos"] },
  { id: "0925", date: "25/09", phase: "Aceleração", channel: "Carrossel", title: "Profundidade em Nutrição Estética", origin: "Transcrições", idea: "Usar temas do acervo como exemplo de profundidade, sem afirmar que compõem a programação de 2027.", optionLabel: "Temas que podem ser apresentados", options: ["Platô e reganho de peso — referência na aula de Ana Paula Pujol.", "Diferenciação de celulite, lipedema e flacidez — referência na aula de Luisa Volpe e Sullen Becher.", "Ambiente, pele e exposoma — referência na aula de Mika Yamaguchi."], fallback: "Corte de Ana Paula, Luisa/Sullen ou Mika apenas se houver trecho completo, compreensível isoladamente e aprovado.", cta: "Comente ESTETICA", keyword: "ESTETICA", destination: "Página específica ou central de vendas", congresses: ["Nutrição Estética"] },
  { id: "0926", date: "26/09", phase: "Aceleração", channel: "Stories/Reel", title: "Cinco dúvidas que impedem a compra", origin: "Atendimento", idea: "Selecionar as cinco dúvidas reais mais recorrentes, abrir cada resposta com a pergunta exata e usar somente informação comercial oficial.", optionLabel: "Categorias para organizar as dúvidas reais", options: ["Conteúdo incluído.", "Como escolher o congresso.", "Preço e condições de pagamento.", "Acesso, local e logística.", "Atendimento e suporte."], fallback: "Carrossel de perguntas frequentes.", cta: "Responder ou retomar a inscrição", destination: "Página de vendas ou atendimento", congresses: ["Todos"] },
  { id: "0927", date: "27/09", phase: "Aceleração", channel: "Comunidade", title: "Prova e próximos passos", origin: "Dados e depoimentos reais", idea: "Usar somente provas verificáveis e autorizadas. Não fabricar escassez; qualquer dado de procura ou venda precisa ser aprovado.", optionLabel: "Fontes de prova que podem ser usadas", options: ["Comentários autorizados.", "Dúvidas reais que foram resolvidas.", "Depoimentos de edições anteriores.", "Dados de interesse ou procura previamente aprovados."], fallback: "Bastidores da equipe e explicação sobre os próximos conteúdos.", cta: "Escolher o congresso e fazer a inscrição", destination: "Página central de vendas", congresses: ["Todos"] },
];

export const emailBase = [
  { date: "31/08 ou 01/09", audience: "Participantes/compradores anteriores, alunos, ex-alunos e contatos válidos", objective: "Reapresentar o Arnold Conference, citar os seis congressos e abrir a temporada de novidades.", materials: "Bloco visual com os seis nomes e uma pergunta sobre interesse.", cta: "Quero receber as novidades", destination: "Landing page geral", rule: "Um disparo; excluir descadastrados, inválidos e contatos sem base legal." },
  { date: "08/09", audience: "Participantes anteriores, alunos, ex-alunos, leads recentes e engajados", objective: "Lançar a seleção com as três masterclasses de 2026.", materials: "Resumo, fotos dos palestrantes, explicação da edição e página testada.", cta: "Quero acessar as 3 masterclasses", destination: "Landing page das masterclasses", rule: "Não prometer aulas de WTTC, SONAFE ou Bodybuilding." },
  { date: "11/09", audience: "Quem recebeu 08/09 e não converteu", objective: "Recuperar a captação com os três temas e uma razão concreta para assistir.", materials: "Versão curta; variação para abriu sem clicar e clicou sem preencher, se possível.", cta: "Acessar as masterclasses gratuitas", destination: "Landing page das masterclasses", rule: "Suprimir quem já converteu." },
  { date: "15/09", audience: "Engajados de setembro, participantes anteriores e leads recentes", objective: "Anunciar abertura em 23/09 às 12h e apresentar os seis congressos.", materials: "Data, horário e seis nomes; condições somente se aprovadas.", cta: "Quero acompanhar a abertura", destination: "Landing page geral", rule: "Não prometer lembrete individual sem rotina configurada." },
  { date: "18/09", audience: "Base engajada e participantes anteriores", objective: "Ajudar na escolha com comparativo dos seis congressos.", materials: "Público, problema profissional e transformação de cada congresso.", cta: "Ver qual congresso combina com meu objetivo", destination: "Página comparativa ou landing page geral", rule: "Não afirmar compatibilidade de horários antes da programação." },
  { date: "21/09", audience: "Quem abriu/clicou 15 ou 18/09 e participantes anteriores", objective: "Preparar as 48 horas finais.", materials: "Horário, opções disponíveis e critérios de escolha.", cta: "Conhecer os 6 congressos antes da abertura", destination: "Página comparativa ou geral", rule: "Segmentar por dados do mailing, não por interação social." },
  { date: "22/09", audience: "Engajados, inscritos na página geral e participantes anteriores", objective: "Reforçar amanhã às 12h.", materials: "Data, horário, seis congressos e informação comercial aprovada.", cta: "Quero acompanhar a abertura amanhã", destination: "Landing page geral", rule: "Um botão e nenhuma escassez não confirmada." },
  { date: "23/09 · 12h", audience: "Contatos válidos e engajados", objective: "Informar vendas abertas.", materials: "Seis cards, preços, condições, primeiro lote, suporte e links testados.", cta: "Escolher meu congresso e fazer a inscrição", destination: "Página central de vendas", rule: "Excluir compradores identificados quando possível." },
  { date: "24–25/09", audience: "Clicou em páginas comerciais e não comprou; ou não compradores engajados", objective: "Recuperar decisão e inscrição.", materials: "Perguntas frequentes, quadro de escolha e canal de atendimento.", cta: "Retomar minha inscrição", destination: "Congresso visitado ou página central", rule: "Interromper após compra, resposta negativa ou descadastro." },
];

export const emailNurture = [
  { moment: "Imediato", content: "Confirmação, instrução e apresentação das três aulas.", cta: "Acessar agora as 3 masterclasses", destination: "Página de obrigado", condition: "Todos os novos cadastros" },
  { moment: "+1 dia", content: "Orientação sobre por onde começar; destacar a aula relacionada se houver interesse declarado.", cta: "Escolher minha primeira masterclass", destination: "Página de obrigado", condition: "Não exigir personalização sem campo de interesse" },
  { moment: "+3 dias", content: "Uma ideia útil de cada aula: platô/reganho; carboidratos; Corpo, Mente e Alma.", cta: "Continuar assistindo às aulas", destination: "Página de obrigado", condition: "Suprimir descadastrados" },
  { moment: "+5 dias", content: "Relacionar as aulas aos três congressos correspondentes.", cta: "Conhecer os congressos", destination: "Página comparativa ou landing page geral", condition: "Não sugerir aulas das outras áreas" },
  { moment: "15/09", content: "Anúncio de abertura em 23/09 às 12h.", cta: "Quero acompanhar a abertura", destination: "Landing page geral", condition: "Entradas tardias recebem a data no próximo e-mail útil" },
  { moment: "21/09", content: "Comparativo resumido e preparação para a abertura.", cta: "Conhecer os 6 congressos", destination: "Página comparativa ou geral", condition: "Não presumir interesse sem dados" },
  { moment: "23/09 · 12h", content: "Vendas abertas, oferta aprovada e caminhos de compra.", cta: "Escolher meu congresso e fazer a inscrição", destination: "Página central de vendas", condition: "Suprimir compradores quando possível" },
];

export const emailAssets = [
  { material: "Landing page das masterclasses", minimum: "Promessa, temas, palestrantes, formulário, consentimentos e rastreamento", deadline: "Antes de 08/09" },
  { material: "Página de obrigado", minimum: "Três vídeos, títulos, orientação e data de vendas", deadline: "Antes de 08/09" },
  { material: "Landing page geral", minimum: "Proposta de cadastro, formulário e consentimentos", deadline: "Já disponível" },
  { material: "Página dos seis congressos", minimum: "Nome, público, problema e proposta de cada congresso", deadline: "Preferencialmente antes de 18/09" },
  { material: "Página central de vendas", minimum: "Congressos, preços, condições, primeiro lote, suporte e inscrição", deadline: "Testada antes de 23/09" },
  { material: "Perguntas frequentes", minimum: "Conteúdo, programação disponível, condições, logística, escolha e suporte", deadline: "Antes de 22/09" },
];

export const whatsappPlan = [
  { date: "08/09", segment: "Participantes, abandonadores anteriores e leads recentes com consentimento", function: "Convidar para as masterclasses com valor", destination: "Landing page das masterclasses" },
  { date: "15/09", segment: "Consumiu, guardou data, participou antes ou tem alta intenção", function: "Confirmar 23/09 e o congresso de interesse", destination: "Calendário ou página central" },
  { date: "23/09 · 12h", segment: "Alta intenção, abandonadores anteriores e lembretes", function: "Informar vendas abertas", destination: "Página comercial" },
  { date: "Pós-abertura", segment: "Checkout abandonado atual, com consentimento", function: "Recuperação comportamental", destination: "Checkout ou atendimento" },
];

export const roadmap = [
  { month: "Out", title: "Aprender e corrigir", summary: "Analisar setembro, comparar origens, mapear objeções, melhorar páginas e preparar o diagnóstico.", deliverables: ["Relatório por origem", "Mapa de interesse", "Revisão da jornada", "Workshop de conteúdo"] },
  { month: "Nov", title: "Diagnóstico abrangente", summary: "Captar e reativar públicos dos seis congressos por meio de dilemas e perfis profissionais.", deliverables: ["Diagnóstico Profissional", "Páginas de resultado", "Distribuição por parceiros", "E-mail para não compradores"] },
  { month: "Dez", title: "Relacionar e produzir", summary: "Manter presença útil, responder dúvidas e concentrar a equipe na produção dos guias de janeiro.", deliverables: ["Curadoria de conteúdo", "Bastidores", "Revisões técnicas", "Produção dos três guias"] },
  { month: "Jan", title: "Ferramentas de aplicação", summary: "Lançar de forma escalonada os três guias especializados previstos no contrato.", deliverables: ["Guia de Gestão", "Guia de Nutrição Estética", "Guia de Nutrição Esportiva"] },
  { month: "Fev", title: "Prova e comparação", summary: "Conectar temas, especialistas e benefícios a dores concretas, com programação mais madura.", deliverables: ["Comparador simples", "Conteúdos por dor", "Integração de compradores", "Venda complementar compatível"] },
  { month: "Mar", title: "Planejador de alta intenção", summary: "Ajudar o público a comparar congressos, sessões e dias e encaminhar para compra.", deliverables: ["Planejador da Jornada", "Recomendações", "Apoio à alta intenção", "Recuperação de abandono"] },
  { month: "Abr", title: "Conversão e experiência", summary: "Equilibrar decisão final dos não compradores com preparação e experiência dos inscritos.", deliverables: ["Conversão final", "Guia do Participante", "Credenciamento e agenda", "Prova e pré-lista de 2028"] },
];

export const kpiLayers = [
  { id: "conteudo", layer: "Conteúdo", metrics: ["Alcance qualificado", "Retenção", "Salvamentos", "Compartilhamentos", "Comentários com palavra", "Respostas"] },
  { id: "dm", layer: "Mensagem direta", metrics: ["Gatilhos", "Mensagens enviadas", "Links enviados", "Cliques", "Taxa de cliques"] },
  { id: "landing", layer: "Landing page", metrics: ["Sessões", "Inícios", "Conversões", "Taxa de conversão", "Abandono"] },
  { id: "recompensa", layer: "Recompensa", metrics: ["Visitas à página de obrigado", "Aula escolhida", "Início de aula", "Profundidade", "Segunda aula"] },
  { id: "email", layer: "E-mail", metrics: ["Entrega", "Cliques", "Conversões", "Descadastros", "Spam", "Receita"] },
  { id: "whatsapp", layer: "WhatsApp", metrics: ["Entrega", "Cliques", "Respostas", "Pedidos de saída", "Compras", "Atendimentos"] },
  { id: "comercial", layer: "Comercial", metrics: ["Visitas", "Checkouts", "Pagamentos pendentes", "Compras", "Receita", "Tempo até compra"] },
];

export const phaseSummary = [
  { label: "Reativação", period: "31/08–06/09", count: "5 feed/reels + 2 Stories", purpose: "Reaquecer e mapear interesses" },
  { label: "Transição", period: "07/09", count: "Stories", purpose: "Antecipar a liberação" },
  { label: "Captação", period: "08–14/09", count: "5 feed/reels + 2 Stories", purpose: "Levar às aulas e registrar interesse" },
  { label: "Pré-venda", period: "15–22/09", count: "5 feed/reels + 3 Stories", purpose: "Ajudar na escolha e responder objeções" },
  { label: "Abertura", period: "23/09", count: "1 peça principal + Stories", purpose: "Direcionar para compra" },
];
