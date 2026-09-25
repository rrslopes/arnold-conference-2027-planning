import { operationalBriefs, optionModes, type ProductionBrief } from "./calendarBriefs";
import { cutAuditByCalendarId, type CutValidation } from "./cutValidations";
import { calendarMilestones, type CalendarMilestone } from "./calendarMilestones";
import {
  octoberCalendarBase,
  octoberDestinations,
  octoberEmailBase,
  emailOperationalGates,
  octoberLaunchWindow,
  octoberWhatsAppPlan,
} from "./octoberPlan";

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

export const WTTC_PUBLIC_NAME = "Certificação Internacional em Personal Training – WTTC";

export function getCongressDisplayName(name: string) {
  return name === "WTTC" ? WTTC_PUBLIC_NAME : name;
}

export const externalDestinations = {
  masterclasses: "https://masterclassconference.savagetgroup.com.br/",
  news: "https://oferta.savagetgroup.com.br/conference-2027",
} as const;

export const navigation = [
  { id: "visao", label: "Visão geral" },
  { id: "objetivos", label: "Objetivos" },
  { id: "publicos", label: "Públicos" },
  { id: "inteligencia", label: "Programação & conteúdo" },
  { id: "iscas", label: "Iscas digitais" },
  { id: "laboratorio", label: "Laboratório" },
  { id: "calendario", label: "Calendário" },
  { id: "midia-paga", label: "Mídia paga" },
  { id: "email", label: "E-mail" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "roadmap", label: "Roadmap" },
  { id: "indicadores", label: "Indicadores" },
];

export const objectives = [
  {
    id: "atencao",
    stage: "Atenção",
    objective: "Recuperar alcance qualificado e participação",
    signals: "Retenção, respostas, compartilhamentos, visitas e volume geral de mensagens; não atribuir resultado a uma palavra-chave isolada",
    whatToFill: "Escolha de uma a três métricas que representem atenção no período, como alcance, interações, retenção ou respostas.",
    howToGet: "Consulte Indicadores > Instagram e o relatório da Meta ou mLabs. Compare meta e resultado no mesmo período; não some métricas diferentes.",
    whenToUpdate: "No fechamento de cada semana durante o aquecimento e novamente no fechamento mensal.",
    targetExample: "Ex.: alcance semanal ≥ [meta aprovada] e interações ≥ [meta aprovada]",
    currentExample: "Ex.: alcance 5.480; 108 interações — 09 a 15/09",
    evidenceExample: "Ex.: Indicadores > Instagram; relatório mLabs de 09 a 15/09; decisão: reforçar Reels",
    validationRule: "Valide quando o resultado do mesmo período atingir o critério e a fonte estiver registrada.",
  },
  {
    id: "captacao",
    stage: "Captação",
    objective: "Converter audiência e base em leads identificados",
    signals: "Conversão na landing page e interesse por congresso",
    whatToFill: "Use leads convertidos e taxa de conversão da LP; complemente com interesses declarados quando a fonte oferecer esse dado.",
    howToGet: "Consulte Indicadores > Central de Landing Pages. Use sessões e leads da mesma LP e do mesmo intervalo para calcular a conversão.",
    whenToUpdate: "Semanalmente e até 72 horas após cada campanha ou pico de tráfego relevante.",
    targetExample: "Ex.: ≥ [meta] leads na LP de novidades; conversão ≥ [meta]%",
    currentExample: "Ex.: 94 leads; conversão 8,3% — 01 a 15/09",
    evidenceExample: "Ex.: Central de LPs > LP de novidades; fotografia salva em 15/09",
    validationRule: "Valide quando volume e/ou conversão atingirem a meta definida para a mesma LP e período.",
  },
  {
    id: "ativacao",
    stage: "Ativação",
    objective: "Fazer o lead consumir a recompensa",
    signals: "Aula escolhida, início, profundidade e segunda aula",
    whatToFill: "Registre acesso à página de obrigado, início das aulas e avanço para uma segunda aula somente quando houver rastreamento confiável.",
    howToGet: "Consulte Indicadores > Central de Landing Pages > Masterclasses. Não estime reproduções, conclusão ou profundidade ausentes.",
    whenToUpdate: "Entre 48 e 72 horas após cada disparo e no fechamento semanal enquanto a isca estiver ativa.",
    targetExample: "Ex.: acesso à recompensa ≥ [meta]%; segunda aula ≥ [meta]%",
    currentExample: "Ex.: 61% acessaram a recompensa; segunda aula ainda sem rastreamento",
    evidenceExample: "Ex.: Central de LPs > Masterclasses; fotografia de 18/09; segunda aula = aguardando dado",
    validationRule: "Valide apenas os critérios mensuráveis. Dado sem rastreamento deve continuar como pendente, não como zero.",
  },
  {
    id: "qualificacao",
    stage: "Qualificação",
    objective: "Identificar intenção e objeções",
    signals: "Guardar data, teste interativo, página de congresso, perguntas frequentes e respostas",
    whatToFill: "Defina o comportamento que indica intenção: interesse por congresso, clique em conteúdo específico, pergunta recebida ou resposta a uma ação.",
    howToGet: "Use Central de LPs, desempenho de e-mail e consolidação das perguntas. Registre apenas sinais identificáveis; não inferir intenção por alcance.",
    whenToUpdate: "Após cada ação de segmentação e no fechamento semanal da campanha.",
    targetExample: "Ex.: ≥ [meta] leads com interesse declarado e ≥ [meta] respostas qualificadas",
    currentExample: "Ex.: 38 leads com interesse; 12 perguntas úteis — semana de 15/09",
    evidenceExample: "Ex.: exportação da LP + consolidação da caixa de perguntas de 16/09",
    validationRule: "Valide quando o sinal escolhido tiver volume mínimo definido e puder orientar uma decisão de conteúdo ou segmentação.",
  },
  {
    id: "venda",
    stage: "Venda",
    objective: "Converter quando a janela comercial estiver ativa",
    signals: "Checkout, compra, receita e tempo até compra",
    whatToFill: "Use inscrições confirmadas, receita ou percentual de lotação por sala. Antes da abertura, mantenha este objetivo como aguardando operação.",
    howToGet: "Consulte Indicadores > Lotação e os dados confirmados da ticketeira. Não preencher intenção, clique ou lead como venda.",
    whenToUpdate: "Somente após a abertura: diariamente na primeira semana e depois no fechamento semanal ou mensal.",
    targetExample: "Ex.: [meta] inscrições confirmadas ou [meta]% de lotação por sala",
    currentExample: "Ex.: 42 inscrições confirmadas; 26% da sala — até 30/09",
    evidenceExample: "Ex.: relatório da ticketeira de 30/09 + painel de Lotação atualizado",
    validationRule: "Valide somente com compra confirmada e conciliada. Enquanto a janela não abrir, não validar.",
  },
  {
    id: "expansao",
    stage: "Expansão",
    objective: "Aumentar valor e adequação",
    signals: "Venda complementar coerente, quando oferta e agenda permitirem",
    whatToFill: "Registre adesão a uma oferta complementar apenas se existir combinação comercial aprovada e compatibilidade operacional confirmada.",
    howToGet: "Use ticketeira ou CRM com identificação da compra complementar. Não pressupor Conference Pass nem compatibilidade de horários.",
    whenToUpdate: "Após a ativação de uma oferta complementar e no fechamento de cada período comercial.",
    targetExample: "Ex.: taxa de adesão complementar ≥ [meta]% — ou ‘não aplicável’ enquanto não houver oferta",
    currentExample: "Ex.: não aplicável — oferta complementar ainda não definida",
    evidenceExample: "Ex.: regra comercial aprovada + relatório de compras complementares",
    validationRule: "Valide somente se a oferta existir, estiver aprovada e atingir o critério definido. Caso contrário, mantenha como não aplicável.",
  },
  {
    id: "experiencia",
    stage: "Experiência",
    objective: "Preparar presença e gerar prova",
    signals: "Acesso a guias, credenciamento, presença, satisfação e indicação",
    whatToFill: "Escolha um critério da etapa operacional: consumo de guia, credenciamento, presença, satisfação ou indicação.",
    howToGet: "Use os sistemas de credenciamento, presença e pesquisa pós-evento quando estiverem disponíveis. Não antecipar satisfação antes da experiência.",
    whenToUpdate: "Na fase pré-evento para orientação e credenciamento; durante e após o evento para presença, satisfação e indicação.",
    targetExample: "Ex.: credenciamento antecipado ≥ [meta]% ou satisfação ≥ [meta]",
    currentExample: "Ex.: ainda não aplicável — medição começa no pré-evento",
    evidenceExample: "Ex.: relatório de credenciamento ou pesquisa pós-evento com data e período",
    validationRule: "Valide cada critério no momento correto da jornada; antes disso, mantenha como aguardando medição.",
  },
];

export const congresses = [
  { name: "Nutrição Esportiva", audience: "Nutricionistas, médicos, treinadores e profissionais de desempenho", tension: "Marketing, hiper-suplementação e receita universal versus fisiologia, saúde e contexto", promise: "Decisões mais criteriosas para um desempenho esportivo sustentável", accent: "#F2C667" },
  { name: "Nutrição Estética", audience: "Nutricionistas e profissionais habilitados em estética e saúde", tension: "Platô, reganho, lipedema, pele, metabolismo e excesso de protocolos genéricos", promise: "Avaliação mais refinada e estratégias individualizadas, com base técnica", accent: "#E7A7C8" },
  { name: "SONAFE", audience: "Fisioterapeutas esportivos e equipes multidisciplinares que atuam da prevenção ao retorno ao esporte", tension: "Decisões fragmentadas entre prevenção, avaliação, recuperação, reabilitação e retorno", promise: "Atualização aplicada e integração para prevenir lesões, qualificar a reabilitação e sustentar um retorno mais seguro ao esporte", accent: "#9DD9D2" },
  { name: "Gestão de Academias", audience: "Proprietários, gestores, coordenadores e líderes", tension: "Crescer sem exaurir o dono, perder equipe ou competir apenas por estrutura", promise: "Gestão, cultura, estratégia e inovação para negócios mais fortes no setor de academias e atividade física", accent: "#CBDB2A" },
  { name: "WTTC", displayName: WTTC_PUBLIC_NAME, audience: "Personal trainers com carreira em desenvolvimento que buscam ampliar sua atuação profissional internacional", tension: "Carreira consolidada no mercado local, mas ainda sem certificação internacional, método reconhecido ou mobilidade profissional estruturada", promise: "Certificação Internacional em Personal Training com chancela WTTC, presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo", accent: "#CCB9A6" },
  { name: "Bodybuilding", audience: "Treinadores, nutricionistas, fisioterapeutas, atletas e equipes", tension: "Copiar preparação, negligenciar recuperação ou reduzir o processo a fármacos", promise: "Preparação integrada: treino, nutrição, recuperação, estética e competição", accent: "#F48C5A" },
];

export type LeadMagnet = {
  id: number;
  period: string;
  title: string;
  campaignTitle?: string;
  campaignSubtitle?: string;
  coverage: string;
  role: string;
  summary: string;
  format: string;
  content: string[];
  materials: string[];
  production: string[];
  limit: string;
  cta: string;
  destination?: { label: string; url: string };
  status: "pronto" | "planejado" | "dependente";
  masterclasses?: { speaker: string; officialTitle: string; editorialSubtitle?: string; theme: string; problem: string; relation: string }[];
  questions?: { prompt: string; criterion: string; answerExamples: string[] }[];
  resultDelivery?: { title: string; detail: string }[];
  sourceRanking?: { rank: number; source: string; use: string; status: "transcrita" | "a transcrever" | "complementar" }[];
  contentBlocks?: { title: string; outcome: string; source: string }[];
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
    content: ["Apresentação dos títulos oficiais e dos três desafios profissionais", "Orientação sobre por qual aula começar", "Convite para acompanhar novidades e receber o aviso de abertura quando a data estiver confirmada"],
    materials: ["Vídeos não listados já autorizados", "Títulos oficiais validados nas programações e nos vídeos", "Fotos, nomes e descrições temáticas dos três palestrantes", "Landing page, página de obrigado e rastreamento"],
    production: ["Aplicar títulos oficiais e descrições temáticas nos três cartões", "Padronizar os metadados do YouTube, se houver acesso de edição", "Testar formulário, entrega e e-mail imediato", "Configurar palavra-chave AULAS com link fixo"],
    limit: `Não prometer aulas da ${WTTC_PUBLIC_NAME}, do SONAFE ou de Bodybuilding.`,
    cta: "Acessar as três masterclasses gratuitas",
    destination: { label: "Abrir landing page das masterclasses", url: externalDestinations.masterclasses },
    status: "pronto",
    masterclasses: [
      { speaker: "Ana Paula Pujol", officialTitle: "Estratégias Nutricionais para Emagrecimento", editorialSubtitle: "Estratégias avançadas além da restrição calórica", theme: "Efeito platô, reganho de peso e diferenças metabólicas entre pacientes", problem: "Por que alguns pacientes param de perder peso ou recuperam o peso perdido", relation: "Nutrição Estética" },
      { speaker: "Andreia Naves", officialTitle: "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática", theme: "Uso de carboidratos antes, durante e depois do exercício, considerando fisiologia, produtos e tecnologias de personalização", problem: "Como adaptar consumo e suplementação ao esforço, à tolerância e à realidade do atleta", relation: "Nutrição Esportiva" },
      { speaker: "Roberto Tranjan", officialTitle: "Academias em Alta Potência: de corpo, mente e alma", theme: "Academia como organismo que equilibra estrutura, estratégia, relacionamento, liderança e cultura", problem: "Por que boa estrutura não resolve sobrecarga do dono, desengajamento e perda de alunos", relation: "Gestão de Academias" },
    ],
  },
  {
    id: 2,
    period: "Novembro",
    title: "Diagnóstico Arnold 2027",
    campaignTitle: "Onde sua carreira está travada?",
    campaignSubtitle: "Responda em poucos minutos e descubra qual congresso enfrenta o desafio que mais limita seu próximo avanço profissional.",
    coverage: "Todos os 6 congressos",
    role: "Captar públicos de todas as áreas e orientar a escolha",
    summary: "Questionário interativo de 10 perguntas que identifica atuação, desafio, contexto, objetivo e momento de decisão. A lógica interna cruza os critérios e devolve um congresso principal, a justificativa do resultado e até dois caminhos complementares.",
    format: "Experiência interativa de 3–5 minutos + resultado personalizado na tela + resumo e próximos passos por e-mail",
    content: ["Dez perguntas com alternativas claras", "Critérios de qualificação por atuação, dor, contexto, objetivo e maturidade", "Seis perfis principais de resultado", "Congresso principal, justificativa e até dois complementares", "Próximo passo editorial ou comercial"],
    materials: ["Ficha validada de uma página por congresso", "Matriz interna de perguntas, alternativas, pesos e desempate", "Textos completos para seis resultados", "Páginas dos congressos, links oficiais e consentimentos", "Validação dos seis coordenadores"],
    production: ["Validar os critérios com os seis coordenadores", "Construir a matriz interna de pontuação sem exibir os pesos ao público", "Redigir e diagramar os seis resultados", "Testar com 10–15 perfis profissionais", "Integrar respostas e interesse à base", "Publicar resultado na tela e e-mail espelho"],
    limit: "O diagnóstico orienta uma escolha de conteúdo e congresso. Ele não avalia competência profissional, não apresenta uma nota ao participante e não substitui aconselhamento técnico.",
    cta: "Descobrir qual congresso enfrenta meu desafio agora",
    status: "planejado",
    questions: [
      { prompt: "Qual é sua atuação principal hoje?", criterion: "Identifica a proximidade profissional inicial com cada congresso.", answerExamples: ["Gestão de academia ou estúdio", "Personal training ou Educação Física", "Fisioterapia esportiva", "Nutrição, saúde ou estética", "Treino, preparação ou bodybuilding"] },
      { prompt: "Qual problema mais limita seu próximo avanço?", criterion: "Reconhece a dor dominante que o resultado precisa enfrentar.", answerExamples: ["Crescer ou organizar meu negócio", "Estruturar método, carreira, posicionamento ou atuação internacional", "Prevenir, avaliar, reabilitar ou retornar ao esporte", "Individualizar respostas clínicas ou estéticas", "Planejar performance e preparação"] },
      { prompt: "Onde esse problema aparece com mais força?", criterion: "Localiza o contexto real da dificuldade.", answerExamples: ["Na empresa ou operação", "No consultório ou atendimento", "Na equipe multidisciplinar", "No treino ou competição", "Na construção da minha carreira"] },
      { prompt: "Com quem você trabalha ou deseja trabalhar?", criterion: "Relaciona o público atendido às especialidades dos congressos.", answerExamples: ["Alunos e clientes de academia", "Praticantes e atletas amadores", "Atletas de alto rendimento", "Pacientes em reabilitação", "Pacientes com objetivos clínicos ou estéticos"] },
      { prompt: "Que tipo de decisão você vem adiando?", criterion: "Indica a natureza do bloqueio e o tipo de aprofundamento necessário.", answerExamples: ["Uma decisão de negócio", "Uma conduta ou avaliação", "Uma especialização profissional", "Uma estratégia de treino ou performance", "A escolha de um congresso"] },
      { prompt: "O que mais falta para você avançar?", criterion: "Diferencia necessidade de método, atualização, integração, aplicação ou negócio.", answerExamples: ["Método aplicável", "Atualização técnica", "Visão integrada", "Posicionamento e carreira", "Gestão e tomada de decisão"] },
      { prompt: "Qual resultado você precisa construir nos próximos seis meses?", criterion: "Define a prioridade temporal que orientará a recomendação.", answerExamples: ["Crescer com mais controle", "Atender com mais segurança", "Melhorar performance e recuperação", "Fortalecer carreira e autoridade", "Aprofundar uma especialidade"] },
      { prompt: "Você busca profundidade em uma área ou integração entre áreas?", criterion: "Ajuda a separar congresso principal de caminhos complementares.", answerExamples: ["Uma área específica", "Duas áreas conectadas", "Uma visão multidisciplinar", "Ainda não sei"] },
      { prompt: "Qual é sua experiência com o Arnold Conference?", criterion: "Ajusta o nível de explicação e registra histórico de relacionamento.", answerExamples: ["Nunca participei", "Já acompanhei conteúdos", "Já fui a uma edição", "Participo com frequência"] },
      { prompt: "Em que momento de decisão você está?", criterion: "Diferencia descoberta, comparação e intenção de compra.", answerExamples: ["Estou conhecendo", "Já tenho alguns congressos em mente", "Estou comparando opções", "Quero decidir e me inscrever"] },
    ],
    resultDelivery: [
      { title: "Seu perfil em uma frase", detail: "Nomeia o momento profissional sem criar rótulo de competência ou diagnóstico técnico." },
      { title: "Desafio prioritário reconhecido", detail: "Retoma as respostas mais determinantes e explicita o problema que guiou a recomendação." },
      { title: "Congresso principal", detail: "Apresenta o congresso mais aderente, sua proposta de valor e por que ele apareceu para aquele perfil." },
      { title: "Três frentes para aprofundar", detail: "Traduz o resultado em questões concretas que o participante poderá investigar no congresso." },
      { title: "Até dois caminhos complementares", detail: "Mostra congressos adjacentes somente quando as respostas indicarem uma necessidade realmente integrada." },
      { title: "Próximo passo personalizado", detail: "Direciona para conteúdo, página do congresso ou inscrição, de acordo com a fase comercial da campanha." },
      { title: "Resumo por e-mail", detail: "Replica o resultado, registra os interesses na base e oferece o mesmo próximo passo sem mudar a recomendação." },
    ],
  },
  {
    id: 3,
    period: "Janeiro",
    title: "Mapa de Crescimento da Academia",
    campaignTitle: "Sua academia está crescendo — ou só ficando maior?",
    campaignSubtitle: "As decisões que separam expansão saudável de crescimento caro, dono sobrecarregado e equipe sem direção.",
    coverage: "Gestão de Academias",
    role: "Gerar leads qualificados por uma dor de crescimento, escala e decisão",
    summary: "Kit de decisão enxuto para identificar quando o crescimento aumenta receita e capacidade — e quando apenas amplia custo, complexidade, dependência do dono e perda de direção.",
    format: "Microguia de 8 páginas + infográfico de decisão + checklist interativo + plano de 30 dias em uma página",
    content: ["Leitura rápida dos sintomas do crescimento desorganizado", "Infográfico para escolher a direção de crescimento", "Checklist interativo de capacidade e dependência do dono", "Plano de 30 dias com três decisões"],
    materials: ["Transcrições prioritárias de Marcelo Stefani e Américo José", "Transcrição validada de Gláucia Guarcello", "Slides, dados e exemplos autorizados", "Painéis de nicho e tendências como expansão", "Revisão da coordenação de Gestão"],
    production: ["Transcrever Marcelo Stefani e Américo José", "Extrair somente decisões, critérios, exemplos e limites essenciais", "Redigir quatro módulos curtos e uma ferramenta por módulo", "Validar dados financeiros e de mercado", "Revisar com a coordenação", "Publicar o microguia, o checklist e o plano de uma página"],
    limit: "Não apresentar como diagnóstico empresarial definitivo nem prometer resultado financeiro.",
    cta: "Mapear onde minha academia está crescendo errado",
    status: "planejado",
    sourceRanking: [
      { rank: 1, source: "Marcelo Stefani — Do 100K ao Milhão", use: "Decisões que alteram escala, capacidade e complexidade do negócio.", status: "a transcrever" },
      { rank: 2, source: "Gláucia Guarcello — Menos Forecast, Mais Foresight", use: "Cenários e decisão em ambientes de incerteza.", status: "transcrita" },
      { rank: 3, source: "Américo José — Crescer Para Onde?", use: "Escolha do modelo e direção de expansão.", status: "a transcrever" },
      { rank: 4, source: "Paulo Akiau e Dudu Netto — Mercado Fitness nos próximos 3 anos", use: "Dados, tendências, riscos e timing.", status: "complementar" },
      { rank: 5, source: "Painel Joana Doin — Modelos que Escalam Diferente", use: "Alternativas de nicho e exemplos comparáveis.", status: "complementar" },
    ],
    contentBlocks: [
      { title: "Quando crescer começa a pesar", outcome: "Duas páginas de leitura + checklist dos sinais de custo, complexidade e dependência do dono.", source: "Marcelo Stefani + Roberto Tranjan" },
      { title: "Crescer para onde?", outcome: "Infográfico de uma página para comparar expansão, nicho, eficiência e fortalecimento da operação.", source: "Américo José + painel de nichos" },
      { title: "Sua operação aguenta o próximo passo?", outcome: "Checklist interativo de 10 itens com resultado por faixa: sustentar, preparar ou testar.", source: "Marcelo Stefani + Gláucia Guarcello" },
      { title: "Próximos 30 dias", outcome: "Plano de uma página: uma decisão para interromper, uma para testar e uma para aprofundar.", source: "Síntese editorial validada" },
    ],
  },
  {
    id: 4,
    period: "Janeiro",
    title: "Antes de Repetir o Protocolo",
    campaignTitle: "Quando o paciente não responde, insistir na mesma conduta pode ser parte do problema.",
    campaignSubtitle: "Um guia de investigação para diferenciar platô, reganho, condições associadas e respostas estéticas que exigem outra leitura.",
    coverage: "Nutrição Estética",
    role: "Gerar leads qualificados por uma dor clínica ampla e relevante",
    summary: "Kit clínico-educacional de leitura rápida para reconhecer o que ainda precisa ser investigado antes de reduzir mais calorias, repetir uma estratégia ou tratar queixas visualmente semelhantes como se fossem o mesmo problema.",
    format: "Microguia visual de 8–10 páginas + infográfico de diferenciação + checklist interativo de investigação",
    content: ["Fluxo rápido: por que 'não respondeu' não é diagnóstico", "Infográfico para diferenciar cenários que parecem semelhantes", "Checklist de perguntas antes de repetir a conduta", "Quadro de sinais para revisar, integrar ou encaminhar"],
    materials: ["Transcrições de Ana Paula Pujol e Luisa Wolpe/Suellen Becher", "Transcrição prioritária de Alessandra Feltre", "Transcrição prioritária de Olívia Fernandes e Adam Abbas", "Slides, artigos e imagens licenciadas", "Revisão nutricional, médica, dermatológica e jurídica"],
    production: ["Transcrever Alessandra Feltre e Olívia Fernandes/Adam Abbas", "Extrair apenas hipóteses, sinais, perguntas e limites que cabem nos quatro módulos", "Checar estudos, números, medicamentos e atribuições", "Construir o fluxo, o infográfico e o checklist", "Fazer revisão multidisciplinar", "Publicar os três formatos como uma única entrega"],
    limit: "Não substituir avaliação clínica, indicar protocolo ou universalizar números da palestra.",
    cta: "Revisar o que pode estar faltando antes de repetir a conduta",
    status: "dependente",
    sourceRanking: [
      { rank: 1, source: "Luisa Wolpe e Suellen Becher — Celulite e Lipedema", use: "Diferenciação clínica e perguntas de anamnese.", status: "transcrita" },
      { rank: 2, source: "Ana Paula Pujol — Estratégias Nutricionais para Emagrecimento", use: "Platô, reganho e fatores além da restrição repetida.", status: "transcrita" },
      { rank: 3, source: "Alessandra Feltre — GLP-1 e o novo rosto do emagrecimento", use: "Mulheres 40+, massa muscular, pele e acompanhamento.", status: "a transcrever" },
      { rank: 4, source: "Olívia Fernandes e Adam Abbas — Acne e Hormônios", use: "Investigação, limites profissionais e integração de cuidados.", status: "a transcrever" },
      { rank: 5, source: "Mika Yamaguchi — Clima e Saúde da Pele", use: "Ambiente, barreira cutânea e diferenciação editorial.", status: "complementar" },
    ],
    contentBlocks: [
      { title: "'Não respondeu' não é diagnóstico", outcome: "Fluxo de duas páginas para separar dados ausentes, adesão, contexto, hipótese clínica e necessidade de integração.", source: "Ana Paula Pujol + síntese das fontes" },
      { title: "Queixas parecidas, leituras diferentes", outcome: "Infográfico de uma página sobre platô/reganho, celulite/lipedema/flacidez, pele e condições associadas.", source: "Luisa Wolpe, Suellen Becher, Mika Yamaguchi e Alessandra Feltre" },
      { title: "Antes de repetir a conduta", outcome: "Checklist interativo de 12 perguntas sobre histórico, resposta, sinais, contexto, expectativas e limites profissionais.", source: "Ana Paula Pujol + Olívia Fernandes e Adam Abbas" },
      { title: "Revisar, integrar ou encaminhar", outcome: "Quadro final de uma página para organizar o próximo passo sem sugerir protocolo ou prescrição.", source: "Síntese multidisciplinar revisada" },
    ],
  },
  {
    id: 5,
    period: "Janeiro",
    title: "O Protocolo Certo no Atleta Errado",
    campaignTitle: "Pare de copiar protocolo de atleta.",
    campaignSubtitle: "As perguntas que evitam trocar performance por fadiga, desconforto gastrointestinal ou perda de massa muscular.",
    coverage: "Nutrição Esportiva",
    role: "Gerar leads qualificados com conteúdo aplicável",
    summary: "Kit de decisão rápida para organizar modalidade, nível, rotina, saúde, objetivo e tolerância antes de repetir a estratégia de outro atleta, escolher um suplemento ou aumentar a restrição.",
    format: "Microguia de 8–10 páginas + ficha interativa do atleta + fluxograma de decisão em uma página",
    content: ["Ficha de contexto antes de discutir estratégia", "Infográfico: amador não é elite em miniatura", "Fluxo de perguntas para antes, durante e depois do esforço", "Checklist final: estratégia antes do produto"],
    materials: ["Transcrições de Daniel Coimbra, Andreia Naves e Bruno Zylber", "Transcrição prioritária de Humberto Nicastro e Guilherme Dilda", "Transcrição prioritária de Ivan Lucas e Amanda Brant", "Slides, referências e confirmação de números", "Revisão médica, nutricional e jurídica"],
    production: ["Transcrever Humberto/Guilherme, Ivan Lucas e Amanda Brant", "Extrair critérios, sinais, contrapontos e limites essenciais", "Conferir dados e evidências", "Construir a ficha interativa, o infográfico e o fluxograma", "Fazer revisão médica e nutricional", "Publicar os três formatos como uma única entrega"],
    limit: "Não recomendar doses, prescrever suplementação ou substituir avaliação individual.",
    cta: "Parar de copiar e começar a planejar pelo contexto do atleta",
    status: "dependente",
    sourceRanking: [
      { rank: 1, source: "Daniel Coimbra — Estratégias Nutricionais em Corredores", use: "Individualidade, baixa disponibilidade energética e sinais de alerta.", status: "transcrita" },
      { rank: 2, source: "Andreia Naves — Suplementação de Carboidratos", use: "Timing, produtos, tolerância e contexto do esforço.", status: "transcrita" },
      { rank: 3, source: "Humberto Nicastro e Guilherme Dilda — Endurance no Amador", use: "Diferenças entre amador, elite, performance, composição e saúde.", status: "a transcrever" },
      { rank: 4, source: "Ivan Lucas — GLP-1/GIP e Massa Muscular", use: "Preservação de massa e acompanhamento multidisciplinar.", status: "a transcrever" },
      { rank: 5, source: "Amanda Brant — O Paradoxo do Antioxidante", use: "Critérios para separar benefício esperado de interferência na adaptação.", status: "complementar" },
    ],
    contentBlocks: [
      { title: "Contexto antes do protocolo", outcome: "Ficha interativa com seis campos: modalidade, nível, rotina, objetivo, saúde e tolerância.", source: "Daniel Coimbra + síntese das fontes" },
      { title: "Amador não é elite em miniatura", outcome: "Infográfico de uma página com diferenças de rotina, recuperação, alimentação, objetivo e monitoramento.", source: "Humberto Nicastro e Guilherme Dilda" },
      { title: "Antes, durante e depois do esforço", outcome: "Fluxograma de perguntas sobre demanda, carboidrato, tolerância, baixa disponibilidade energética e recuperação.", source: "Andreia Naves + Daniel Coimbra + Bruno Zylber" },
      { title: "Estratégia antes do produto", outcome: "Checklist final para revisar evidência, objetivo, risco, acompanhamento e resposta individual.", source: "Amanda Brant + Ivan Lucas + síntese revisada" },
    ],
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
  { congress: WTTC_PUBLIC_NAME, materials: "Ementa e diferenciais de 2027; documentação sobre validade internacional, presença em 5 continentes e 18 países (mais de 35 mil treinadores no mundo) e requisitos de atuação profissional; matriz de competências; depoimentos e casos autorizados; contribuições de Cris Parente.", use: "Conteúdos de carreira, mobilidade profissional internacional e insumos para o diagnóstico e o planejador." },
  { congress: "SONAFE", materials: "Temas e diferenciais de 2027; confirmação do esgotamento de 2026; prints anonimizados e autorizados; contribuições do comitê sobre prevenção, avaliação, reabilitação, recuperação e retorno ao esporte.", use: "Prova de demanda e conteúdos que cubram toda a jornada, incluindo prevenção." },
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
  { name: "Nova gravação", use: "Resposta a uma pergunta específica", when: `${WTTC_PUBLIC_NAME}, SONAFE e peças de lançamento`, fallback: "Áudio autorizado com imagens" },
  { name: "Carrossel educativo", use: "Organiza perguntas, sinais, dilemas ou decisões", when: "Quando a fonte é transcrição ou programação", fallback: "Reel narrado com os mesmos tópicos" },
  { name: "Stories interativos", use: "Enquete, pergunta, teste e lembrete", when: "Pesquisa, segmentação e link", fallback: "Formulário curto" },
];

export const keywords = [
  { word: "AULAS", use: "Conteúdos das três masterclasses", destination: "Landing page das masterclasses", url: externalDestinations.masterclasses, note: "Única palavra que promete acesso às aulas" },
  { word: "LEMBRETE", use: "Novidades e aviso de abertura", destination: "Landing page geral de novidades", url: externalDestinations.news, note: "Direciona para cadastro; não promete data nem lembrete individual" },
  { word: "FISIO", use: "Conteúdos SONAFE", destination: "Landing page geral de novidades", url: externalDestinations.news, note: "Não promete material SONAFE" },
  { word: "WTTC", use: `Conteúdos da ${WTTC_PUBLIC_NAME}`, destination: "Landing page geral de novidades", url: externalDestinations.news, note: "A palavra-chave é abreviada; a peça deve apresentar o nome completo antes da sigla e não promete aula exclusiva" },
  { word: "BODY", use: "Conteúdos Bodybuilding", destination: "Landing page geral de novidades", url: externalDestinations.news, note: "Não promete material exclusivo" },
  { word: "LOTE", use: "Abertura das vendas", destination: "Página central de vendas — URL pendente", note: "Ativar somente após validar a ticketeira e a URL" },
  { word: "CONGRESSO", use: "Conteúdo comparativo", destination: "Landing page geral de novidades", url: externalDestinations.news, note: "Direciona para cadastro; sem recomendação personalizada" },
  { word: "ESTETICA", use: "Conteúdos de Nutrição Estética", destination: "Landing page geral de novidades", url: externalDestinations.news, note: "Direciona para cadastro e novidades da edição" },
];

export type CalendarItem = {
  id: string;
  date: string;
  phase: string;
  channel: string;
  title: string;
  origin: string;
  originUrl?: string;
  originLinkLabel?: string;
  materialLinks?: Array<{
    label: string;
    url: string;
    kind: "video" | "post" | "spreadsheet";
  }>;
  idea: string;
  optionLabel?: string;
  options?: string[];
  optionMode?: "alternatives" | "inputs";
  productionBrief?: ProductionBrief;
  agencyResearch?: {
    owner: string;
    request: string;
    deliverables: string[];
    validation: string;
    fallback: string;
  };
  cutValidations?: CutValidation[];
  milestone?: CalendarMilestone;
  storyCards?: Array<{
    card: string;
    format: string;
    prompt: string;
    answers?: string[];
    note?: string;
  }>;
  fallback: string;
  cta: string;
  keyword?: string;
  destination: string;
  destinationUrl?: string;
  congresses: string[];
};

const calendarMaterialUrls = {
  anaPaula: "https://www.youtube.com/watch?v=asItej-OIk8",
  andreia: "https://youtu.be/tAqcK_GgzD8",
  roberto: "https://youtu.be/QSjVRVEvZMs",
  bruno: "https://youtu.be/8hnvXCzfd3U",
  daniel: "https://youtu.be/qCvC2bwxV_0",
  mika: "https://youtu.be/nze1GDIzj9c",
  sonafeBodybuilding: "https://www.instagram.com/reels/DYfnzGHP81D/",
  sonafeRecovery: "https://www.instagram.com/p/DTnBm0Qlo0Q/",
  sonafeProgram: "https://docs.google.com/spreadsheets/d/1P6EooZAA6mVkYVMC-hVUfbBvGfxxCx-8/edit?gid=656380718#gid=656380718",
} as const;

const calendarBase: CalendarItem[] = [
  { id: "0831", date: "31/08", phase: "Reativação", channel: "Feed", title: "Dia do Nutricionista", origin: "Pauta já programada pelo cliente", idea: "Manter a pauta e a produção aprovadas. A peça abre o período de reativação sem precisar ser reformulada.", fallback: "Não se aplica.", cta: "Marcar um profissional, salvar ou compartilhar", destination: "Interação no Instagram", congresses: ["Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0901", date: "01/09", phase: "Reativação", channel: "Feed/Reel", title: "Cris Parente e desenvolvimento profissional", origin: "Pauta já programada pelo cliente", idea: "Manter a pauta definida. O conteúdo reativa profissionais de Educação Física e interessados na certificação.", fallback: "Não se aplica.", cta: "Comentar sobre carreira ou desenvolvimento profissional", destination: "Interação no Instagram", congresses: ["WTTC"] },
  { id: "0902", date: "02/09", phase: "Reativação", channel: "Stories", title: "Teste de interesse por desafio", origin: "Produção nova sem dependência de vídeo", idea: "Publicar uma sequência de sete Stories diferentes: uma caixa de perguntas aberta e seis enquetes, uma para cada congresso. Cada enquete tem sua própria pergunta e duas respostas clicáveis.", storyCards: [{ card: "Story 1 de 7", format: "Caixa de perguntas", prompt: "Se você pudesse resolver um desafio profissional hoje, qual seria?", note: "Resposta aberta. Não apresentar opções neste card." }, { card: "Story 2 de 7", format: "Enquete — Gestão de Academias", prompt: "Na gestão da sua academia, o que mais desafia você hoje?", answers: ["Atrair novos alunos", "Reter alunos atuais"] }, { card: "Story 3 de 7", format: `Enquete — ${WTTC_PUBLIC_NAME}`, prompt: "Na carreira de personal trainer, o que mais limita seu crescimento?", answers: ["Método e entrega", "Posicionamento e vendas"] }, { card: "Story 4 de 7", format: "Enquete — SONAFE", prompt: "No retorno ao esporte, onde está sua maior dúvida?", answers: ["Avaliar e decidir", "Integrar a equipe"] }, { card: "Story 5 de 7", format: "Enquete — Nutrição Estética", prompt: "Qual desafio aparece mais no seu atendimento?", answers: ["Platô e reganho", "Demandas estéticas"] }, { card: "Story 6 de 7", format: "Enquete — Nutrição Esportiva", prompt: "O que exige mais segurança na sua conduta hoje?", answers: ["Planejar a estratégia", "Escolher suplementos"] }, { card: "Story 7 de 7", format: "Enquete — Bodybuilding", prompt: "Na preparação, o que mais precisa de integração?", answers: ["Treino e dieta", "Recuperação e saúde"] }], fallback: "Carrossel com seis situações profissionais, somente se a equipe preferir publicação no feed.", cta: "Responder às enquetes e à caixa de perguntas", destination: "Interação no Instagram", congresses: ["Todos"] },
  { id: "0903", date: "03/09", phase: "Reativação", channel: "Carrossel/Reel", title: "Seis congressos, seis desafios", origin: "Produção nova", idea: "Apresentar uma dor concreta de cada área, evitando uma lista institucional de nomes.", optionLabel: "Desafios a apresentar", options: ["Gestão de Academias: liderança, estratégia empresarial e resultados para academias e redes", `${WTTC_PUBLIC_NAME}: certificação com chancela WTTC e carreira internacional, presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo`, "SONAFE: prevenção, avaliação, reabilitação e retorno seguro ao esporte", "Nutrição Estética: platô, reganho e diferenciação de demandas", "Nutrição Esportiva: estratégia nutricional aplicada ao desempenho", "Bodybuilding: preparação integrada e decisões individualizadas"], fallback: "Stories com seis telas, uma por congresso.", cta: "Qual desafio conversa mais com seu momento?", destination: "Comentários e enquete", congresses: ["Todos"] },
  { id: "0904", date: "04/09", phase: "Reativação", channel: "Reel", title: "Pílula de uma masterclass", origin: "Corte do acervo, se houver trecho localizável", materialLinks: [{ label: "Abrir íntegra — Ana Paula Pujol", url: calendarMaterialUrls.anaPaula, kind: "video" }, { label: "Abrir íntegra — Andreia Naves", url: calendarMaterialUrls.andreia, kind: "video" }, { label: "Abrir íntegra — Roberto Tranjan", url: calendarMaterialUrls.roberto, kind: "video" }], idea: "Escolher uma das três falas e usar 25–45 segundos com começo e conclusão compreensíveis.", optionLabel: "Opções de corte para localizar", options: ["Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol: fala explicando por que o platô não deve ser reduzido à falta de força de vontade.", "Update na Suplementação de Carboidratos, com Andreia Naves: fala mostrando por que a estratégia nutricional não começa somente quando a fadiga aparece.", "Academias em Alta Potência, com Roberto Tranjan: fala explicando por que estrutura física não basta para uma academia forte."], fallback: "Reel narrado que apresenta uma das perguntas e informa que, em breve, três aulas completas serão liberadas.", cta: "Salvar e comentar qual tema quer aprofundar", destination: "Interação no Instagram", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0905", date: "05/09", phase: "Reativação", channel: "Stories", title: "Escuta da audiência", origin: "Produção nova", idea: "Publicar sete Stories separados. O primeiro coleta respostas abertas; os seis seguintes são enquetes independentes, uma por congresso, sempre com duas respostas clicáveis.", storyCards: [{ card: "Story 1 de 7", format: "Caixa de perguntas", prompt: "Se você pudesse assistir a uma aula completa do Arnold Conference hoje, qual problema gostaria de resolver?", note: "Resposta aberta. Usar as palavras recebidas para orientar pautas futuras." }, { card: "Story 2 de 7", format: "Enquete — Gestão de Academias", prompt: "Seu principal desafio na academia está mais onde?", answers: ["Operação e equipe", "Crescimento e estratégia"] }, { card: "Story 3 de 7", format: "Enquete — Nutrição Estética", prompt: "Qual tema você mais gostaria de aprofundar?", answers: ["Platô e reganho", "Estética e composição"] }, { card: "Story 4 de 7", format: "Enquete — Nutrição Esportiva", prompt: "Qual decisão gera mais dúvida na prática?", answers: ["Planejamento nutricional", "Suplementação"] }, { card: "Story 5 de 7", format: `Enquete — ${WTTC_PUBLIC_NAME}`, prompt: "Na carreira como personal, qual é o maior bloqueio?", answers: ["Técnica e método", "Posicionamento e vendas"] }, { card: "Story 6 de 7", format: "Enquete — SONAFE", prompt: "Em fisioterapia esportiva, qual tema pede mais atualização?", answers: ["Avaliação e decisão", "Retorno ao esporte"] }, { card: "Story 7 de 7", format: "Enquete — Bodybuilding", prompt: "Na preparação, o que você mais quer aprofundar?", answers: ["Treino e dieta", "Recuperação e saúde"] }], fallback: "Post estático com a pergunta aberta do primeiro Story, somente se houver necessidade de presença no feed.", cta: "Responder à caixa e às enquetes", destination: "Respostas dos Stories", congresses: ["Todos"] },
  { id: "0906", date: "06/09", phase: "Reativação", channel: "Reel", title: "Antecipação das três aulas", origin: "Montagem com cenas das masterclasses", materialLinks: [{ label: "Abrir íntegra — Ana Paula Pujol", url: calendarMaterialUrls.anaPaula, kind: "video" }, { label: "Abrir íntegra — Andreia Naves", url: calendarMaterialUrls.andreia, kind: "video" }, { label: "Abrir íntegra — Roberto Tranjan", url: calendarMaterialUrls.roberto, kind: "video" }], idea: "Combinar três trechos visuais de 4–6 segundos; as falas não precisam aparecer completas. Exibir o título oficial e uma expressão curta de orientação para cada aula.", optionLabel: "Cenas, títulos e assuntos para procurar", options: ["Estratégias Nutricionais para Emagrecimento — além da restrição calórica: Ana Paula Pujol citando platô ou reganho de peso.", "Update na Suplementação de Carboidratos — tecnologia, ciência e aplicação: Andreia Naves mencionando carboidrato ou desempenho esportivo.", "Academias em Alta Potência — corpo, mente e alma: Roberto Tranjan falando sobre liderança, equipe ou a tríade Corpo–Mente–Alma."], fallback: "Montagem sem falas, com cenas dos três palestrantes, títulos oficiais e expressões curtas de orientação.", cta: "Salvar e acompanhar a liberação em 08/09", keyword: "LEMBRETE", destination: "Landing page geral, se usar palavra-chave", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0907", date: "07/09", phase: "Transição", channel: "Stories", title: "Amanhã: liberação das aulas", origin: "Produção nova", idea: "Publicar quatro Stories: um anúncio e três cards de preferência. Como a enquete do Instagram aceita duas respostas, cada aula recebe seu próprio card.", storyCards: [{ card: "Story 1 de 4", format: "Anúncio", prompt: "Amanhã, três aulas completas do Arnold Conference 2026 serão liberadas gratuitamente.", note: "Exibir a data 08/09 e cenas das três aulas." }, { card: "Story 2 de 4", format: "Enquete — Nutrição Estética", prompt: "Você começaria por uma aula sobre platô, reganho e emagrecimento além da restrição calórica?", answers: ["Sim, começaria", "Quero ver as outras"] }, { card: "Story 3 de 4", format: "Enquete — Nutrição Esportiva", prompt: "Você começaria por uma aula sobre estratégia e suplementação de carboidratos?", answers: ["Sim, começaria", "Quero ver as outras"] }, { card: "Story 4 de 4", format: "Enquete — Gestão", prompt: "Você começaria por uma aula sobre liderança, cultura e força do negócio?", answers: ["Sim, começaria", "Quero ver as outras"] }], fallback: "Uma tela estática com os três títulos e a data de 08/09.", cta: "Acompanhar o perfil para acessar amanhã", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0908", date: "08/09", phase: "Captação", channel: "Reel + carrossel", title: "Lançamento das três masterclasses", origin: "Montagem; não depende de corte específico", materialLinks: [{ label: "Abrir íntegra — Ana Paula Pujol", url: calendarMaterialUrls.anaPaula, kind: "video" }, { label: "Abrir íntegra — Andreia Naves", url: calendarMaterialUrls.andreia, kind: "video" }, { label: "Abrir íntegra — Roberto Tranjan", url: calendarMaterialUrls.roberto, kind: "video" }], idea: "Apresentar as aulas pelo título oficial, relacionar cada uma a um desafio e informar que são conteúdos completos de 2026.", optionLabel: "Títulos oficiais, desafios e aulas", options: ["Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol — platô, reganho e estratégias avançadas além da restrição calórica.", "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática, com Andreia Naves — planejamento do carboidrato e recursos de suplementação.", "Academias em Alta Potência: de corpo, mente e alma, com Roberto Tranjan — gestão, liderança, cultura e equilíbrio do negócio."], fallback: "Montagem com cenas dos três vídeos, títulos oficiais e narração da equipe de marketing; ou carrossel de seis telas. Não depende de nova gravação.", cta: "Comente AULAS e receba o link", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0909", date: "09/09", phase: "Captação", channel: "Stories", title: "Por qual aula começar?", origin: "Produção nova", idea: "Publicar quatro Stories de orientação. Não é uma enquete: cada card descreve um perfil e oferece o mesmo link para a página das três aulas.", storyCards: [{ card: "Story 1 de 4", format: "Orientação", prompt: "Por qual das três masterclasses começar? Escolha pelo desafio mais próximo da sua atuação.", note: "Apresentar rapidamente os três caminhos." }, { card: "Story 2 de 4", format: "Perfil + link", prompt: "Se você atende emagrecimento, comece por Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol.", note: "Adicionar sticker de link para a landing page das masterclasses." }, { card: "Story 3 de 4", format: "Perfil + link", prompt: "Se trabalha com nutrição e desempenho esportivo, comece por Update na Suplementação de Carboidratos, com Andreia Naves.", note: "Adicionar o mesmo sticker de link." }, { card: "Story 4 de 4", format: "Perfil + link", prompt: "Se lidera academia ou equipe, comece por Academias em Alta Potência, com Roberto Tranjan.", note: "Adicionar o mesmo sticker de link." }], fallback: "Carrossel ‘Por qual aula começar?’ com os três títulos oficiais, somente se houver capacidade.", cta: "Acessar as três aulas", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0910", date: "10/09", phase: "Captação", channel: "Reel", title: "Primeiro corte de masterclass", origin: "Corte localizável no acervo", materialLinks: [{ label: "Abrir íntegra — Ana Paula Pujol", url: calendarMaterialUrls.anaPaula, kind: "video" }, { label: "Abrir íntegra — Andreia Naves", url: calendarMaterialUrls.andreia, kind: "video" }, { label: "Abrir íntegra — Roberto Tranjan", url: calendarMaterialUrls.roberto, kind: "video" }], idea: "Escolher uma das opções testadas em 04/09, priorizando a que recebeu mais respostas. Identificar o corte pelo título oficial da aula. O trecho deve ter 25–45 segundos, contexto suficiente e entregar uma ideia útil antes da interrupção.", optionLabel: "Opções de corte para localizar", options: ["Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol: por que o platô não deve ser tratado apenas como falta de força de vontade.", "Update na Suplementação de Carboidratos, com Andreia Naves: por que a estratégia nutricional precisa começar antes de a fadiga aparecer.", "Academias em Alta Potência, com Roberto Tranjan: por que uma academia forte exige mais do que estrutura física."], fallback: "Reel narrado que apresenta a pergunta e convida para a explicação completa na aula.", cta: "Comente AULAS para assistir à explicação completa", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0911", date: "11/09", phase: "Captação", channel: "Carrossel", title: "Antes de escolher um gel esportivo", origin: "Aula ‘Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática’, de Andreia Naves", materialLinks: [{ label: "Abrir íntegra — Andreia Naves", url: calendarMaterialUrls.andreia, kind: "video" }], idea: "Organizar perguntas que o profissional precisa fazer antes de recomendar ou escolher um gel esportivo, evitando transformar números em regra universal.", optionLabel: "Perguntas que estruturam o carrossel", options: ["Qual é a demanda energética e a duração do treino?", "Como está a tolerância gastrointestinal do atleta?", "Em qual momento o produto seria consumido?", "O atleta está adaptado a essa estratégia?"], fallback: "Localizar na aula uma comparação entre marketing do produto e fisiologia; usar como corte somente após revisão técnica.", cta: "Comente AULAS para assistir à masterclass", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Nutrição Esportiva"] },
  { id: "0912", date: "12/09", phase: "Captação", channel: "Stories", title: `${WTTC_PUBLIC_NAME}: carreira internacional`, origin: "Reaproveitamento ou enquete", idea: "Publicar quatro Stories separados para investigar limitações de carreira e contextualizar a certificação internacional sem compará-la a outro congresso.", storyCards: [{ card: "Story 1 de 4", format: "Contexto", prompt: `${WTTC_PUBLIC_NAME} é destinada a personal trainers que buscam ampliar sua atuação profissional internacional, com chancela WTTC: uma certificação presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo.` }, { card: "Story 2 de 4", format: "Enquete", prompt: "Qual destes pontos mais limita sua carreira hoje?", answers: ["Posicionamento", "Método de trabalho"] }, { card: "Story 3 de 4", format: "Enquete", prompt: "E no relacionamento comercial, qual é o maior desafio?", answers: ["Conquistar clientes", "Reter clientes"] }, { card: "Story 4 de 4", format: "Caixa de perguntas", prompt: "Qual situação da sua carreira internacional você gostaria de aprofundar no Arnold Conference?", note: `Resposta aberta. Usar o aprendizado para pautas futuras da ${WTTC_PUBLIC_NAME}.` }], fallback: `Carrossel com três sinais de uma carreira que pode avançar com a ${WTTC_PUBLIC_NAME}, aprovado por Cris Parente.`, cta: `Responder e comentar WTTC para acompanhar as novidades da ${WTTC_PUBLIC_NAME}`, keyword: "WTTC", destination: "Landing page geral", congresses: ["WTTC"] },
  { id: "0913", date: "13/09", phase: "Captação", channel: "Reel narrado", title: "Copiar preparação ou construir estratégia?", origin: "Produção nova; sem corte", idea: "Mostrar que o que funciona para um atleta pode ser inadequado para outro e que as decisões precisam ser integradas.", optionLabel: "Perguntas que conduzem a narrativa", options: ["O treino foi individualizado para esse atleta?", "A dieta responde ao objetivo, à fase e à resposta individual?", "A recuperação está sendo considerada junto com treino e dieta?"], fallback: "Carrossel ‘Copiar preparação ou construir estratégia?’ com os mesmos três eixos.", cta: "Comente BODY para acompanhar as novidades", keyword: "BODY", destination: "Landing page geral", congresses: ["Bodybuilding"] },
  { id: "0914", date: "14/09", phase: "Captação", channel: "Reel narrado", title: "Prova histórica de demanda SONAFE", origin: "Prints autorizados de 2026", idea: "Fazer mensagens de quem ficou de fora aparecerem em sequência e ocuparem a tela; ocultar nomes, fotos, telefones e qualquer dado pessoal.", optionLabel: "Mensagens reais que podem ser destacadas", options: ["Vai abrir nova turma?", "Ainda tem vaga?", "Fiquei de fora."], fallback: "Se os prints não puderem ser publicados, usar números internos aprovados ou uma narração geral: as vagas de 2026 se esgotaram e recebemos pedidos de nova turma. Não inventar quantidade nem urgência.", cta: "Comente FISIO para acompanhar as novidades", keyword: "FISIO", destination: "Landing page geral", congresses: ["SONAFE"] },
  { id: "0915", date: "15/09", phase: "Aquecimento", channel: "Reel + carrossel", title: "Seis congressos. Qual conversa com seu momento?", origin: "Produção nova a partir das propostas de valor validadas", idea: "Colocar o público no centro, apresentar seis perfis profissionais e convidar para a lista de novidades sem anunciar data de vendas.", optionLabel: "Perfis que estruturam a peça", options: ["Gestor, diretor ou proprietário que busca fortalecer liderança, estratégia e resultados — Gestão de Academias.", `Personal trainer que quer ampliar a atuação profissional internacional, com a chancela WTTC, presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo — ${WTTC_PUBLIC_NAME}.`, "Atua com prevenção, avaliação, reabilitação e retorno ao esporte — SONAFE.", "Trabalha com emagrecimento, estética ou composição corporal — Nutrição Estética.", "Atua com nutrição e desempenho esportivo — Nutrição Esportiva.", "Vive preparação, competição ou suporte ao atleta — Bodybuilding."], fallback: "Animação com cenas de 2026, os seis congressos e convite para receber novidades.", cta: "Cadastre-se para receber as novidades e o aviso de abertura", keyword: "LEMBRETE", destination: "Landing page geral de novidades", congresses: ["Todos"] },
  { id: "0916", date: "16/09", phase: "Aquecimento", channel: "Stories", title: "O que você precisa saber para escolher?", origin: "Caixa de perguntas e duas enquetes", idea: "Publicar quatro Stories para mapear dúvidas editoriais, sem perguntar por preço ou prazo ainda não confirmados.", storyCards: [{ card: "Story 1 de 4", format: "Caixa de perguntas", prompt: "O que você precisa saber para escolher um congresso?", note: "Resposta aberta. Agrupar as dúvidas recebidas por tema." }, { card: "Story 2 de 4", format: "Enquete", prompt: "O que você quer entender primeiro?", answers: ["Temas e programação", "Para quem é cada sala"] }, { card: "Story 3 de 4", format: "Enquete", prompt: "O que mais demonstra valor para você?", answers: ["Aplicação prática", "Nível de aprofundamento"] }, { card: "Story 4 de 4", format: "Link", prompt: "Cadastre-se para receber as novidades e o aviso de abertura.", note: "Adicionar link para a landing page geral de novidades; não usar contagem regressiva." }], fallback: "Post estático com a pergunta aberta e link para a lista de novidades.", cta: "Enviar a dúvida e cadastrar-se para receber novidades", destination: "Interação e landing page geral de novidades", congresses: ["Todos"] },
  { id: "0917", date: "17/09", phase: "Aquecimento", channel: "Carrossel", title: `${WTTC_PUBLIC_NAME}: uma carreira que pode atravessar fronteiras`, origin: "Produção nova a partir do diferencial internacional validado pelo cliente", idea: `Apresentar a ${WTTC_PUBLIC_NAME} de forma independente para personal trainers que já desenvolvem sua carreira e buscam ampliar a atuação profissional internacional.`, optionLabel: "Eixos que estruturam a peça", options: ["Público: personal trainers que já possuem uma carreira e desejam ampliar seu campo de atuação profissional.", "Diferencial: certificação internacional com chancela WTTC.", "Alcance: uma certificação presente em 5 continentes e 18 países, com mais de 35 mil treinadores no mundo.", "Próximo passo: acompanhar as informações oficiais sobre formação, requisitos e edição de 2027."], fallback: `Reel narrado que explica, isoladamente, para quem é a ${WTTC_PUBLIC_NAME}, seu alcance internacional e a necessidade de acompanhar os requisitos oficiais.`, cta: "Salvar e cadastrar-se para receber as novidades", destination: "Landing page geral de novidades", congresses: ["WTTC"] },
  { id: "0918", date: "18/09", phase: "Aquecimento", channel: "Carrossel", title: "O que as programações de 2027 já revelam", origin: "Programações provisórias confirmadas de Nutrição Estética e SONAFE 2027", materialLinks: [{ label: "Abrir planilha SONAFE 2027", url: calendarMaterialUrls.sonafeProgram, kind: "spreadsheet" }], idea: "Demonstrar profundidade com fatos já recebidos: organizar os territórios temáticos das duas salas com programação disponível e identificar claramente as outras quatro como pendentes, sem comparar congressos com públicos distintos.", optionLabel: "Estrutura do carrossel", options: ["Explicar que duas das seis programações já foram recebidas e que as demais seguem em construção.", "Nutrição Estética: mostrar a amplitude entre metabolismo, cirurgia plástica, GLP-1, lipedema, saúde da mulher, calorimetria e performance.", "SONAFE: mostrar a amplitude entre recursos terapêuticos, ativação, controle de carga, diferentes populações esportivas, lesões, concussão e retorno ao esporte.", "Fechar distinguindo programação provisória recebida de sala ainda pendente, com convite para acompanhar as atualizações."], fallback: "Carrossel curto com os dois programas já recebidos, seus principais territórios e o aviso transparente de que as demais salas ainda serão atualizadas.", cta: "Salvar e cadastrar-se para acompanhar as próximas programações", destination: "Landing page geral de novidades", congresses: ["Nutrição Estética", "SONAFE", "Todos"] },
  { id: "0919", date: "19/09", phase: "Aquecimento", channel: "Carrossel + Stories", title: "Decisões no retorno ao esporte", origin: "Programação SONAFE 2026 e duas referências públicas analisadas", materialLinks: [{ label: "Abrir Reel — avaliação contextualizada", url: calendarMaterialUrls.sonafeBodybuilding, kind: "video" }, { label: "Abrir post — recovery e prevenção", url: calendarMaterialUrls.sonafeRecovery, kind: "post" }], idea: "Apresentar territórios de decisão, não um protocolo clínico, e complementar com duas perguntas segmentadas para SONAFE e Nutrição Estética.", optionLabel: "Decisões que estruturam o carrossel", options: ["Avaliar o atleta e compreender o contexto.", "Compreender a carga e as demandas do esporte.", "Alinhar fisioterapia, treinamento e demais profissionais.", "Monitorar resposta, recuperação e progressão.", "Integrar prevenção de recorrências ao retorno."], storyCards: [{ card: "Story 1 de 3", format: "Contexto", prompt: "Hoje, a escolha passa por cuidado, prevenção e leitura individual do caso." }, { card: "Story 2 de 3", format: "Enquete — SONAFE", prompt: "Seu trabalho exige aprofundar prevenção, avaliação e retorno ao esporte?", answers: ["Sim, é meu contexto", "Não é meu foco"] }, { card: "Story 3 de 3", format: "Enquete — Nutrição Estética", prompt: "Seu trabalho exige aprofundar emagrecimento, estética e composição corporal?", answers: ["Sim, é meu contexto", "Não é meu foco"] }], fallback: "Nova gravação com especialista respondendo: ‘Qual decisão mais costuma ser esquecida no retorno ao esporte?’. O conteúdo técnico deve ser revisado antes da publicação.", cta: "Comente FISIO e cadastre-se para receber as novidades", keyword: "FISIO", destination: "Landing page geral de novidades", congresses: ["SONAFE", "Nutrição Estética"] },
  { id: "0920", date: "20/09", phase: "Aquecimento", channel: "Stories", title: "Escolha por afinidade — performance", origin: "Escuta segmentada derivada do carrossel de 18/09", idea: "Concluir a série com apenas Nutrição Esportiva e Bodybuilding, evitando uma sequência de seis enquetes no mesmo dia.", storyCards: [{ card: "Story 1 de 3", format: "Contexto", prompt: "Performance pode exigir decisões diferentes conforme sua atuação profissional." }, { card: "Story 2 de 3", format: "Enquete — Nutrição Esportiva", prompt: "Seu desafio está em nutrição, saúde e desempenho esportivo?", answers: ["Sim, é meu contexto", "Não é meu foco"] }, { card: "Story 3 de 3", format: "Enquete — Bodybuilding", prompt: "Seu desafio está em integrar treino, dieta, recuperação e preparação competitiva?", answers: ["Sim, é meu contexto", "Não é meu foco"] }], fallback: "Duas telas estáticas com os perfis de Nutrição Esportiva e Bodybuilding.", cta: "Responder e acessar a lista de novidades", destination: "Landing page geral de novidades", congresses: ["Nutrição Esportiva", "Bodybuilding"] },
  { id: "0921", date: "21/09", phase: "Aquecimento", channel: "Carrossel", title: "Três decisões que exigem critério na Nutrição Esportiva", origin: "Transcrições validadas de Andreia Naves, Daniel Coimbra e Bruno Zylber", materialLinks: [{ label: "Abrir íntegra — Andreia Naves", url: calendarMaterialUrls.andreia, kind: "video" }, { label: "Abrir íntegra — Daniel Coimbra", url: calendarMaterialUrls.daniel, kind: "video" }, { label: "Abrir íntegra — Bruno Zylber", url: calendarMaterialUrls.bruno, kind: "video" }], idea: "Usar três comparações com exemplos gerais derivados das transcrições e revisados tecnicamente, sem contagem regressiva comercial.", optionLabel: "Comparações do carrossel", options: ["Evidência versus moda.", "Estratégia individual versus receita pronta.", "Desempenho imediato versus saúde sustentável."], fallback: "Usar corte de Andreia Naves, Daniel Coimbra ou Bruno Zylber somente se houver fala completa que represente uma das comparações.", cta: "Salvar e cadastrar-se para receber as novidades", destination: "Landing page geral de novidades", congresses: ["Nutrição Esportiva"] },
  { id: "0922", date: "22/09", phase: "Aquecimento", channel: "Reel + carrossel", title: "A equipe que o público não vê no físico de palco", origin: "Reel Arnold Conference DVZDZWEFPP3, com Ricardo Pannain; aproximadamente 00:00–01:06, com fala principal entre 00:52 e 01:06", originUrl: "https://www.instagram.com/reel/DVZDZWEFPP3/", originLinkLabel: "Abrir Reel de referência no Instagram", idea: "Mostrar que a preparação de alto rendimento não se resume ao atleta e ao treinador: Ricardo Pannain relata a presença de medicina, Educação Física, nutrição, LPF e psicologia em sua estrutura. Tratar como experiência profissional relatada, sem prometer efeito causal sobre performance.", optionLabel: "Eixos que estruturam a peça", options: ["O resultado visível no palco é sustentado por decisões que o público não vê.", "Cada especialidade tem função e limite próprios dentro da preparação.", "Integração exige comunicação entre profissionais, não sobreposição de condutas.", "Saúde mental faz parte do suporte relatado pela equipe, sem transformar a fala em afirmação clínica universal."], fallback: "Carrossel narrado com os quatro eixos e identificação explícita de que se trata do modelo de equipe relatado por Ricardo Pannain.", cta: "Comente BODY e acompanhe as novidades", keyword: "BODY", destination: "Landing page geral de novidades", congresses: ["Bodybuilding"] },
  { id: "0923", date: "23/09", phase: "Aquecimento", channel: "Carrossel + Stories de apoio", title: "Não existe um único tipo de atleta", origin: "Programação provisória SONAFE 2027", materialLinks: [{ label: "Abrir planilha SONAFE 2027", url: calendarMaterialUrls.sonafeProgram, kind: "spreadsheet" }], idea: "Tratar 23/09 como um dia comum de aquecimento: uma única pauta central mostra como população, modalidade e demanda mudam as perguntas da fisioterapia esportiva. Usar apenas os títulos confirmados da programação sobre mulher no futebol, crianças atletas, esporte paralímpico, concussão e retorno ao esporte; não transformar títulos em orientação clínica. Os Stories são apoio opcional da mesma ativação.", optionLabel: "Contextos confirmados que estruturam a peça", options: ["Mulher atleta de futebol — avaliação funcional do sistema musculoesquelético.", "Crianças atletas de futebol — lesões em uma população específica.", "Esporte paralímpico — trajetória e desafios próprios do campo.", "Concussão e Return to Play — decisões que exigem contexto e atualização profissional."], storyCards: [{ card: "Story 1 de 3", format: "Contexto", prompt: "Mulher, criança, atleta paralímpico e diferentes modalidades não apresentam o mesmo contexto de decisão." }, { card: "Story 2 de 3", format: "Enquete", prompt: "Qual dimensão mais exige aprofundamento na sua prática hoje?", answers: ["População atendida", "Demanda do esporte"] }, { card: "Story 3 de 3", format: "Link", prompt: "Cadastre-se para receber as novidades do Arnold Conference 2027.", note: "Adicionar link para a landing page geral de novidades. Não solicitar dados clínicos nem abrir uma segunda sequência no mesmo dia." }], fallback: "Publicar somente o carrossel com quatro contextos presentes na programação SONAFE 2027. Os Stories podem ser omitidos se a grade do dia estiver carregada.", cta: "Comente FISIO e cadastre-se para receber as novidades", keyword: "FISIO", destination: "Landing page geral de novidades", congresses: ["SONAFE"] },
  { id: "0924", date: "24/09", phase: "Aquecimento", channel: "Carrossel", title: "Antes de escolher seu congresso, responda a estas 4 perguntas", origin: "Públicos e propostas de valor validados + programações 2027 já recebidas", idea: "Entregar um checklist de autoavaliação para ajudar o profissional a filtrar qual congresso conversa melhor com seu momento de carreira. A peça não compara salas nem reapresenta os seis perfis: conduz a pessoa por quatro decisões — momento profissional, desafio prioritário, profundidade esperada e aplicação desejada — e explica que a escolha final deve considerar a programação oficial de cada congresso.", optionLabel: "As quatro perguntas que formam o checklist", options: ["Momento profissional — você quer aprimorar sua atuação atual ou preparar um próximo passo na carreira?", "Desafio prioritário — qual problema concreto você precisa compreender melhor ou enfrentar com mais repertório?", "Profundidade esperada — os temas confirmados correspondem ao seu nível de experiência e vão além de uma visão introdutória?", "Aplicação desejada — o que você espera conseguir analisar, decidir ou estruturar melhor depois do evento?"], fallback: "Reel narrado com os mesmos quatro passos do checklist. Manter a ordem momento → desafio → profundidade → aplicação e concluir orientando a consulta às programações oficiais.", cta: "Salve o checklist e cadastre-se para acompanhar as programações e próximas confirmações", keyword: "CONGRESSO", destination: "Landing page geral de novidades", congresses: ["Todos"] },
  { id: "0925", date: "25/09", phase: "Aquecimento", channel: "Carrossel", title: "Profundidade em Nutrição Estética", origin: "Transcrições", materialLinks: [{ label: "Abrir íntegra — Ana Paula Pujol", url: calendarMaterialUrls.anaPaula, kind: "video" }, { label: "Abrir íntegra — Mika Yamaguchi", url: calendarMaterialUrls.mika, kind: "video" }], idea: "Usar temas do acervo como exemplo de profundidade, sem afirmar que compõem a programação de 2027.", optionLabel: "Temas que podem ser apresentados", options: ["Platô e reganho de peso — referência na aula de Ana Paula Pujol.", "Diferenciação de celulite, lipedema e flacidez — referência na aula de Luisa Volpe e Sullen Becher.", "Ambiente, pele e exposoma — referência na aula de Mika Yamaguchi."], fallback: "Corte de Ana Paula, Luisa/Sullen ou Mika apenas se houver trecho completo, compreensível isoladamente e aprovado.", cta: "Comente ESTETICA e acompanhe as novidades", keyword: "ESTETICA", destination: "Landing page geral de novidades", congresses: ["Nutrição Estética"] },
  { id: "0926", date: "26/09", phase: "Aquecimento", channel: "Stories/Reel", title: "Cinco perguntas para escolher melhor", origin: "Propostas de valor e dúvidas reais da audiência", idea: "Responder dúvidas de orientação que independem de preço, checkout ou data comercial.", storyCards: [{ card: "Story 1 de 5", format: "Pergunta + orientação", prompt: "Para quem é cada congresso?", note: "Responder pelos públicos e desafios profissionais validados." }, { card: "Story 2 de 5", format: "Pergunta + orientação", prompt: "Posso ter interesse em mais de uma sala?", note: "Sim, mas não afirmar compatibilidade de horários antes da programação completa." }, { card: "Story 3 de 5", format: "Pergunta + orientação", prompt: "Como avaliar a profundidade dos conteúdos?", note: "Usar programação confirmada e referências de 2026 claramente identificadas." }, { card: "Story 4 de 5", format: "Pergunta + orientação", prompt: "Onde acompanho as atualizações?", note: "Direcionar para a landing page geral de novidades." }, { card: "Story 5 de 5", format: "Link", prompt: "Cadastre-se para receber as novidades e o aviso de abertura.", note: "Adicionar link para a landing page geral de novidades." }], fallback: "Carrossel de cinco perguntas com uma resposta objetiva por tela.", cta: "Salvar e acessar a lista de novidades", destination: "Landing page geral de novidades", congresses: ["Todos"] },
  { id: "0927", date: "27/09", phase: "Aquecimento", channel: "Reel + carrossel", title: "Sua academia resiste a um cenário que você não projetou?", origin: "Íntegra de Gláucia Guarcello no Arnold Conference 2026; transcrição validada, com conferência final no vídeo original", idea: "Levar gestores, diretores e proprietários de academias a questionar planejamentos que dependem de uma única previsão. A partir da fala de Gláucia Guarcello, mostrar que cenários não servem para adivinhar o futuro: servem para testar se a estratégia continua de pé diante de incertezas diferentes. No fechamento, oferecer a masterclass Academias em Alta Potência, de Roberto Tranjan, como aprofundamento complementar sobre direção estratégica, relação com alunos, equipe e equilíbrio do negócio — sem apresentá-la como continuação da fala de Gláucia. Identificar as duas palestras como acervo de 2026, sem afirmar que os temas ou palestrantes integram a programação de 2027.", optionLabel: "Sequência e insumos para produzir", options: ["Pergunta de abertura: sua academia resiste a um cenário que você não projetou?", "Contexto: escolher uma incerteza de alto impacto para a academia; exemplos de pergunta, e não previsões, podem envolver comportamento do aluno, adoção de serviços digitais ou pressão sobre custos.", "Teste: desenhar dois cenários opostos e plausíveis para a mesma incerteza, sem tentar escolher qual deles vai acontecer.", "Decisão: perguntar o que precisa ser ajustado agora para a academia permanecer de pé nos dois cenários.", "Fonte principal: corte aproximado de 41:38 a 42:04 da íntegra de Gláucia; conferir começo, fim, áudio, imagem e slides antes da edição.", "Ponte para a isca: apresentar Academias em Alta Potência, de Roberto Tranjan, como uma segunda perspectiva sobre direção, relação com alunos e equipe — não como resposta direta ao teste de cenários."], fallback: "Carrossel gráfico de seis cards com pergunta, conceito de cenários, uma incerteza exemplificativa, dois cenários opostos, teste de robustez e convite para a masterclass. Não depende de depoimento, bastidor ou nova gravação.", cta: "Comente AULAS para acessar gratuitamente a masterclass Academias em Alta Potência", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias"] },
];

export const calendar: CalendarItem[] = [...calendarBase, ...(octoberCalendarBase as CalendarItem[])].map(item => {
  const cutAudit = cutAuditByCalendarId[item.id];
  return {
    ...item,
    ...(cutAudit?.overrides ?? {}),
    productionBrief: item.productionBrief ?? operationalBriefs[item.id],
    optionMode: optionModes[item.id],
    cutValidations: item.cutValidations ?? cutAudit?.validations,
    milestone: calendarMilestones[item.id],
  };
});

export const emailBase = [
  { id: "email-base-reativacao", date: "31/08 ou 01/09", audience: "Participantes/compradores anteriores, alunos, ex-alunos e contatos válidos", objective: "Reapresentar o Arnold Conference, citar os seis congressos e abrir a temporada de novidades.", materials: "Bloco visual com os seis nomes e uma pergunta sobre interesse.", cta: "Quero receber as novidades", destination: "Landing page geral", rule: "Um disparo; excluir descadastrados, inválidos e contatos sem base legal." },
  { id: "email-base-masterclasses", date: "08/09", audience: "Participantes anteriores, alunos, ex-alunos, leads recentes e engajados", objective: "Lançar a seleção com as três masterclasses de 2026.", materials: "Títulos oficiais, descrições temáticas, fotos dos palestrantes, explicação da edição e página testada.", cta: "Quero acessar as 3 masterclasses", destination: "Landing page das masterclasses", rule: `Não prometer aulas da ${WTTC_PUBLIC_NAME}, do SONAFE ou de Bodybuilding.` },
  { id: "email-base-recuperacao", date: "11/09", audience: "Quem recebeu 08/09 e não converteu", objective: "Recuperar a captação com os títulos oficiais, os três temas e uma razão concreta para assistir.", materials: "Versão curta; variação para abriu sem clicar e clicou sem preencher, se possível.", cta: "Acessar as masterclasses gratuitas", destination: "Landing page das masterclasses", rule: "Suprimir quem já converteu." },
  { id: "email-base-anuncio-abertura", date: "15/09", audience: "Engajados de setembro, participantes anteriores e leads recentes", objective: "Apresentar os seis congressos por perfil e ampliar a lista de pessoas que desejam receber novidades e o aviso de abertura.", materials: "Seis perfis profissionais, proposta de cada congresso e landing page geral testada.", cta: "Quero receber as novidades", destination: "Landing page geral", rule: "Não citar data, preço ou condição comercial enquanto a operação não estiver confirmada." },
  { id: "email-base-comparativo", date: "18/09", audience: "Base engajada e participantes anteriores; priorizar afinidade com Nutrição Estética ou SONAFE quando o dado estiver disponível", objective: "Demonstrar a profundidade já visível nos temas centrais das programações definitivas de Nutrição Estética e SONAFE.", materials: "Temas centrais autorizados das duas programações, sem revelar grade, horários, títulos integrais ou palestrantes.", cta: "Acompanhar as próximas programações", destination: "Landing page geral de novidades", rule: "Uma única versão. Quem já está na lista pode consumir o conteúdo e não precisa se cadastrar novamente." },
  { id: "email-base-48h", date: "21/09", audience: "Quem abriu ou clicou em 15 ou 18/09 e profissionais com interesse em Nutrição Esportiva", objective: "Demonstrar profundidade por três tensões: evidência versus moda, individualização versus receita pronta e desempenho imediato versus saúde sustentável.", materials: "Transcrições validadas de Andreia Naves, Daniel Coimbra e Bruno Zylber; a masterclass de Andreia funciona como aprofundamento do primeiro eixo.", cta: "Aprofundar com a masterclass de Andreia Naves", destination: "Landing page das masterclasses", rule: "Uma única versão; não incluir doses, protocolos ou promessas de performance." },
  { id: "email-base-vespera", date: "22/09", audience: "Leads com interesse em Bodybuilding e públicos de performance", objective: "Mostrar a equipe multidisciplinar que sustenta decisões de preparação além do que aparece no palco.", materials: "Reel DVZDZWEFPP3, publicado em 02/03/2026, apresentado como acervo e relato profissional de Ricardo Pannain; fechamento faz a ponte com o repertório e as próximas novidades de 2027.", cta: "Acompanhar as novidades de Bodybuilding", destination: "Landing page geral de novidades", rule: "Uma única versão. Reel como referência secundária clicável; não reproduzir a data e o CTA comercial antigos, não confirmar tema ou palestrante em 2027 e não inferir efeito causal sobre performance, títulos ou saúde." },
  { id: "email-base-vendas-abertas", date: "23/09", audience: "Leads com interesse em SONAFE e profissionais ligados à Fisioterapia Esportiva", objective: "Mostrar como diferentes populações, modalidades e demandas ampliam as perguntas da Fisioterapia Esportiva.", materials: "Temas centrais autorizados da programação definitiva SONAFE 2027: mulher no futebol, crianças atletas, esporte paralímpico, concussão e retorno ao esporte.", cta: "Acompanhar as novidades da SONAFE", destination: "Landing page geral de novidades", rule: "Uma única versão; preservar grade completa e não transformar temas em protocolo ou afirmação clínica." },
  { id: "email-base-recuperar-inscricao", date: "24–25/09", audience: "Base engajada; priorizar quem ainda não declarou área de interesse", objective: "Oferecer quatro critérios para validar a escolha de congresso sem repetir o comparativo de perfis.", materials: "Checklist de momento profissional, problema prioritário, profundidade dos temas e aplicação esperada.", cta: "Registrar ou atualizar minha área de interesse", destination: "Landing page geral de novidades", rule: "Uma única versão; quem já declarou interesse não precisa preencher novamente." },
  ...octoberEmailBase,
];

export const emailNurture = [
  { id: "email-nurture-imediato", moment: "Imediato", content: "Confirmação, instrução e apresentação das três aulas com título oficial, palestrante e descrição temática.", cta: "Acessar agora as 3 masterclasses", destination: "Página de obrigado", condition: "Todos os novos cadastros" },
  { id: "email-nurture-d1", moment: "+1 dia", content: "Orientação sobre por onde começar; destacar a aula relacionada se houver interesse declarado e identificar os três botões pelos títulos oficiais.", cta: "Escolher minha primeira masterclass", destination: "Página de obrigado", condition: "Não exigir personalização sem campo de interesse" },
  { id: "email-nurture-d3", moment: "+3 dias", content: "Uma ideia útil de cada aula vinculada ao título oficial: platô/reganho em Estratégias Nutricionais para Emagrecimento; carboidratos no Update na Suplementação de Carboidratos; Corpo, Mente e Alma em Academias em Alta Potência.", cta: "Continuar assistindo às aulas", destination: "Página de obrigado", condition: "Suprimir descadastrados" },
  { id: "email-nurture-d5", moment: "+5 dias", content: "Relacionar as aulas aos três congressos correspondentes.", cta: "Conhecer os congressos", destination: "Página comparativa ou landing page geral", condition: "Não sugerir aulas das outras áreas" },
  { id: "email-nurture-anuncio-abertura", moment: "+8 dias", content: "Apresentar os seis congressos e orientar a escolha pelo desafio profissional, sem data comercial.", cta: "Conhecer os seis caminhos", destination: "Landing page geral", condition: "Não presumir interesse nem citar abertura sem confirmação operacional" },
  { id: "email-nurture-48h", moment: "+12 dias", content: "Convidar o lead a permanecer na lista para receber novidades, futuras divulgações oficiais e o aviso de abertura.", cta: "Quero receber as novidades", destination: "Landing page geral", condition: "Não antecipar programação; manter frequência moderada e suprimir descadastros" },
  { id: "email-nurture-vendas-abertas", moment: "30/09 · D-6", content: "Transferir o lead para a sequência comercial somente quando data, checkout, condições, URLs e suporte estiverem validados.", cta: "Acompanhar a abertura em 06/10", destination: "Landing page geral", condition: "Não ativar automaticamente; depende do gate operacional D-6" },
];

export const emailAssets = [
  { material: "Landing page das masterclasses", minimum: "Promessa, títulos oficiais, descrições temáticas, palestrantes, formulário, consentimentos e rastreamento", deadline: "Antes de 08/09" },
  { material: "Página de obrigado", minimum: "Três vídeos, títulos oficiais, descrições temáticas e orientação de consumo; sem data comercial não confirmada", deadline: "Já disponível; revisar se houver menção a 23/09" },
  { material: "Landing page geral", minimum: "Proposta de cadastro, formulário e consentimentos", deadline: "Já disponível" },
  { material: "Página dos seis congressos", minimum: "Nome, público, problema e proposta de cada congresso", deadline: "Preferencialmente antes de 18/09" },
  { material: "Página central de vendas", minimum: "Congressos, preços, condições, primeiro lote, suporte e inscrição", deadline: "Obrigatoriamente testada antes do anúncio em 30/09 e retestada em 06/10" },
  { material: "Perguntas frequentes", minimum: "Conteúdo, programação disponível, condições, logística, escolha e suporte", deadline: "Aprovadas antes do anúncio em 30/09 e revisadas até a abertura" },
];

export const whatsappPlan = [
  { date: "08/09", segment: "Participantes, abandonadores anteriores e leads recentes com consentimento", function: "Convidar para as masterclasses com valor", destination: "Landing page das masterclasses" },
  { date: "15/09", segment: "Consumiu as masterclasses, participou antes ou demonstrou alta intenção", function: "Convidar para a lista de novidades e registrar o congresso de interesse, sem anunciar data", destination: "Landing page geral de novidades" },
  ...octoberWhatsAppPlan,
];

export const roadmap = [
  { month: "Out", title: "Abrir, converter e aprender", summary: "Anunciar 06/10 com gates verdes, abrir as seis rotas de venda e usar compra confirmada e ocupação por sala para orientar conteúdo, CRM e mídia.", deliverables: ["Abertura em 06/10", "Venda por produto", "Recuperação de checkout", "Fechamento de ocupação"] },
  { month: "Nov", title: "Diagnóstico abrangente", summary: "Captar e reativar públicos dos seis congressos por meio de dilemas e perfis profissionais.", deliverables: ["Diagnóstico Profissional", "Páginas de resultado", "Distribuição por parceiros", "E-mail para não compradores"] },
  { month: "Dez", title: "Relacionar e produzir", summary: "Manter presença útil, responder dúvidas e concentrar a equipe na produção dos guias de janeiro.", deliverables: ["Curadoria de conteúdo", "Bastidores", "Revisões técnicas", "Produção dos três guias"] },
  { month: "Jan", title: "Ferramentas de aplicação", summary: "Lançar de forma escalonada os três guias especializados previstos no contrato.", deliverables: ["Guia de Gestão", "Guia de Nutrição Estética", "Guia de Nutrição Esportiva"] },
  { month: "Fev", title: "Prova e comparação", summary: "Conectar temas, especialistas e benefícios a dores concretas, com programação mais madura.", deliverables: ["Comparador simples", "Conteúdos por dor", "Integração de compradores", "Venda complementar compatível"] },
  { month: "Mar", title: "Planejador de alta intenção", summary: "Ajudar o público a comparar congressos, sessões e dias e encaminhar para compra.", deliverables: ["Planejador da Jornada", "Recomendações", "Apoio à alta intenção", "Recuperação de abandono"] },
  { month: "Abr", title: "Conversão e experiência", summary: "Equilibrar decisão final dos não compradores com preparação e experiência dos inscritos.", deliverables: ["Conversão final", "Guia do Participante", "Credenciamento e agenda", "Prova e pré-lista de 2028"] },
];

export const launchWindow = octoberLaunchWindow;
export { emailOperationalGates };

export const kpiLayers = [
  {
    id: "dm",
    layer: "Social e Meta",
    purpose: "Consolida alcance, visualizações, interações, seguidores e conversas por mensagem iniciadas no fechamento social mensal.",
    cadence: "Preencha uma única vez em Metas sociais e resultado mensal; esta camada recebe automaticamente o fechamento mais recente.",
    source: "Indicadores → Metas sociais e resultado mensal, com dados exportados do Instagram e do relatório geral de mensagens da Meta.",
    avoid: `Não redigite os resultados nesta tabela nem desdobre AULAS, FISIO, a palavra-chave WTTC da ${WTTC_PUBLIC_NAME} ou outra automação: a Meta não oferece essa granularidade.`,
    constraint: "LIMITAÇÃO DA FONTE: o relatório da Meta consolida conversas iniciadas e contatos, mas não permite comparar individualmente automações ou palavras-chave. Use UTMs nas páginas de destino apenas para medir o tráfego e as conversões agregadas provenientes de DM.",
    metrics: [],
  },
  {
    id: "landing",
    layer: "Landing pages",
    purpose: "Consolida as conversões identificadas e, quando a própria LP mede visitas, acompanha a passagem do acesso à conversão sem misturar as fontes.",
    cadence: "Atualize semanalmente e feche cada campanha; use o acumulado somente quando o relatório reunir todas as páginas sem duplicidade.",
    source: "Cada LP possui uma área específica. O painel traz os valores medidos e identifica claramente o que cada fonte não consegue medir.",
    avoid: "Não registre seguidores, interações sociais ou compras nesta etapa.",
    metrics: [
      { key: "Conversões", label: "Leads convertidos — consolidado de todas as origens", description: "Total mensal de leads de todas as LPs e canais, conciliado sem duplicidade. A contribuição da LP de novidades já aparece automaticamente acima." },
    ],
  },
  {
    id: "recompensa",
    layer: "Consumo da recompensa",
    purpose: "Indica se o lead acessou a página de obrigado, iniciou ou concluiu cada masterclass e avançou para os congressos.",
    cadence: "Atualize a fotografia da LP das masterclasses; esta camada será recalculada automaticamente.",
    source: "Central de Landing Pages · LP das masterclasses, página de obrigado e eventos reais do player.",
    avoid: "Não redigite os dados nesta camada nem estime consumo quando o evento não estiver configurado.",
    metrics: [],
  },
  {
    id: "email",
    layer: "E-mail",
    purpose: "Acompanha a capacidade do e-mail de entregar mensagens, gerar tráfego e contribuir para conversões.",
    cadence: "Atualize após cada disparo e consolide o acumulado da régua ou campanha.",
    source: "Relatórios do RD Station e parâmetros UTM das páginas de destino.",
    avoid: "Não atribua conversões ou receita ao e-mail sem rastreamento compatível.",
    metrics: [],
  },
  {
    id: "whatsapp",
    layer: "WhatsApp",
    purpose: "Mede a resposta dos segmentos mais qualificados aos disparos e atendimentos pelo canal.",
    cadence: "Atualize após cada disparo; o plano limita o uso a, no máximo, uma ação semanal.",
    source: "Plataforma oficial de disparo, links rastreados e registros do atendimento.",
    avoid: "Não misture conversas orgânicas sem relação com a campanha nem atribua compras sem rastreamento.",
    metrics: [],
  },
  {
    id: "comercial",
    layer: "Venda",
    purpose: "Acompanha a passagem da intenção comercial para checkout, pagamento e receita.",
    cadence: "Atualize semanalmente e confira mensalmente com os lançamentos de lotação por congresso.",
    source: "Plataforma de vendas, checkout, gateway de pagamento e relatório financeiro.",
    avoid: "Não use intenção, lead ou clique como compra; a lotação deve receber somente inscrições confirmadas.",
    metrics: [
      { key: "Visitas", label: "Visitas à página de compra", description: "Acessos rastreados à página comercial no período." },
      { key: "Checkouts", label: "Checkouts iniciados", description: "Pessoas que iniciaram o processo de pagamento." },
      { key: "Pagamentos pendentes", label: "Pagamentos pendentes", description: "Checkouts ainda sem confirmação financeira." },
      { key: "Compras", label: "Pedidos pagos — transações", description: "Quantidade de pedidos pagos na ticketeira, não de ingressos. Preencha somente se o relatório de vendas separar transações; as inscrições por sala já entram automaticamente pela lotação." },
      { key: "Receita", label: "Receita confirmada", description: "Valor financeiro das compras confirmadas no período." },
      { key: "Tempo até compra", label: "Tempo até a compra", description: "Intervalo entre primeiro contato rastreável e compra; informe unidade e método." },
    ],
  },
];

export const phaseSummary = [
  { label: "Reativação", period: "31/08–06/09", count: "5 feed/reels + 2 Stories", purpose: "Reaquecer e mapear interesses" },
  { label: "Transição", period: "07/09", count: "Stories", purpose: "Antecipar a liberação" },
  { label: "Captação", period: "08–14/09", count: "5 feed/reels + 2 Stories", purpose: "Levar às aulas e registrar interesse" },
  { label: "Aquecimento", period: "15–27/09", count: "Conteúdo contínuo + Stories segmentados", purpose: "Ajudar na escolha e ampliar a lista sem prometer data" },
  { label: "Intensificação", period: "28/09–05/10", count: "8 posts de feed + 1 sugestão de migração de perfil", purpose: "Abrir por Nutrição Esportiva, anunciar 06/10, provar demanda e reforçar a proximidade da abertura" },
  { label: "Abertura", period: "06/10", count: "1 carrossel + 6 Stories com links", purpose: "Levar cada público à página oficial do congresso correto" },
  { label: "Venda contínua", period: "07–31/10", count: "24 posts de feed com Stories e pílulas derivados + 4 collabs de tendência da Leal", purpose: "Alternar apresentação de produto, conteúdo técnico, autoridade e urgência comercial para converter inscrições" },
];
