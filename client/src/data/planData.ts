import { operationalBriefs, optionModes, type ProductionBrief } from "./calendarBriefs";
import { cutAuditByCalendarId, type CutValidation } from "./cutValidations";
import { calendarMilestones, type CalendarMilestone } from "./calendarMilestones";

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
  { id: "inteligencia", label: "Programação & conteúdo" },
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
    content: ["Apresentação dos títulos oficiais e dos três desafios profissionais", "Orientação sobre por qual aula começar", "Data da abertura de vendas em 23/09 às 12h"],
    materials: ["Vídeos não listados já autorizados", "Títulos oficiais validados nas programações e nos vídeos", "Fotos, nomes e descrições temáticas dos três palestrantes", "Landing page, página de obrigado e rastreamento"],
    production: ["Aplicar títulos oficiais e descrições temáticas nos três cartões", "Padronizar os metadados do YouTube, se houver acesso de edição", "Testar formulário, entrega e e-mail imediato", "Configurar palavra-chave AULAS com link fixo"],
    limit: "Não prometer aulas de WTTC, SONAFE ou Bodybuilding.",
    cta: "Acessar as três masterclasses gratuitas",
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
      { prompt: "Qual problema mais limita seu próximo avanço?", criterion: "Reconhece a dor dominante que o resultado precisa enfrentar.", answerExamples: ["Crescer ou organizar meu negócio", "Estruturar método, carreira ou posicionamento", "Avaliar, reabilitar ou retornar ao esporte", "Individualizar respostas clínicas ou estéticas", "Planejar performance e preparação"] },
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
  optionMode?: "alternatives" | "inputs";
  productionBrief?: ProductionBrief;
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
  congresses: string[];
};

const calendarBase: CalendarItem[] = [
  { id: "0831", date: "31/08", phase: "Reativação", channel: "Feed", title: "Dia do Nutricionista", origin: "Pauta já programada pelo cliente", idea: "Manter a pauta e a produção aprovadas. A peça abre o período de reativação sem precisar ser reformulada.", fallback: "Não se aplica.", cta: "Marcar um profissional, salvar ou compartilhar", destination: "Interação no Instagram", congresses: ["Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0901", date: "01/09", phase: "Reativação", channel: "Feed/Reel", title: "Cris Parente e desenvolvimento profissional", origin: "Pauta já programada pelo cliente", idea: "Manter a pauta definida. O conteúdo reativa profissionais de Educação Física e interessados na certificação.", fallback: "Não se aplica.", cta: "Comentar sobre carreira ou desenvolvimento profissional", destination: "Interação no Instagram", congresses: ["WTTC"] },
  { id: "0902", date: "02/09", phase: "Reativação", channel: "Stories", title: "Teste de interesse por desafio", origin: "Produção nova sem dependência de vídeo", idea: "Publicar uma sequência de sete Stories diferentes: uma caixa de perguntas aberta e seis enquetes, uma para cada congresso. Cada enquete tem sua própria pergunta e duas respostas clicáveis.", storyCards: [{ card: "Story 1 de 7", format: "Caixa de perguntas", prompt: "Se você pudesse resolver um desafio profissional hoje, qual seria?", note: "Resposta aberta. Não apresentar opções neste card." }, { card: "Story 2 de 7", format: "Enquete — Gestão de Academias", prompt: "Na gestão da sua academia, o que mais desafia você hoje?", answers: ["Atrair novos alunos", "Reter alunos atuais"] }, { card: "Story 3 de 7", format: "Enquete — WTTC", prompt: "Na carreira de personal trainer, o que mais limita seu crescimento?", answers: ["Método e entrega", "Posicionamento e vendas"] }, { card: "Story 4 de 7", format: "Enquete — SONAFE", prompt: "No retorno ao esporte, onde está sua maior dúvida?", answers: ["Avaliar e decidir", "Integrar a equipe"] }, { card: "Story 5 de 7", format: "Enquete — Nutrição Estética", prompt: "Qual desafio aparece mais no seu atendimento?", answers: ["Platô e reganho", "Demandas estéticas"] }, { card: "Story 6 de 7", format: "Enquete — Nutrição Esportiva", prompt: "O que exige mais segurança na sua conduta hoje?", answers: ["Planejar a estratégia", "Escolher suplementos"] }, { card: "Story 7 de 7", format: "Enquete — Bodybuilding", prompt: "Na preparação, o que mais precisa de integração?", answers: ["Treino e dieta", "Recuperação e saúde"] }], fallback: "Carrossel com seis situações profissionais, somente se a equipe preferir publicação no feed.", cta: "Responder às enquetes e à caixa de perguntas", destination: "Interação no Instagram", congresses: ["Todos"] },
  { id: "0903", date: "03/09", phase: "Reativação", channel: "Carrossel/Reel", title: "Seis congressos, seis desafios", origin: "Produção nova", idea: "Apresentar uma dor concreta de cada área, evitando uma lista institucional de nomes.", optionLabel: "Desafios a apresentar", options: ["Gestão de Academias: gestão, retenção e força do negócio", "WTTC: carreira, posicionamento e entrega do personal", "SONAFE: avaliação, reabilitação e retorno seguro ao esporte", "Nutrição Estética: platô, reganho e diferenciação de demandas", "Nutrição Esportiva: estratégia nutricional aplicada ao desempenho", "Bodybuilding: preparação integrada e decisões individualizadas"], fallback: "Stories com seis telas, uma por congresso.", cta: "Qual desafio conversa mais com seu momento?", destination: "Comentários e enquete", congresses: ["Todos"] },
  { id: "0904", date: "04/09", phase: "Reativação", channel: "Reel", title: "Pílula de uma masterclass", origin: "Corte do acervo, se houver trecho localizável", idea: "Escolher uma das três falas e usar 25–45 segundos com começo e conclusão compreensíveis.", optionLabel: "Opções de corte para localizar", options: ["Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol: fala explicando por que o platô não deve ser reduzido à falta de força de vontade.", "Update na Suplementação de Carboidratos, com Andreia Naves: fala mostrando por que a estratégia nutricional não começa somente quando a fadiga aparece.", "Academias em Alta Potência, com Roberto Tranjan: fala explicando por que estrutura física não basta para uma academia forte."], fallback: "Reel narrado que apresenta uma das perguntas e informa que, em breve, três aulas completas serão liberadas.", cta: "Salvar e comentar qual tema quer aprofundar", destination: "Interação no Instagram", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0905", date: "05/09", phase: "Reativação", channel: "Stories", title: "Escuta da audiência", origin: "Produção nova", idea: "Publicar sete Stories separados. O primeiro coleta respostas abertas; os seis seguintes são enquetes independentes, uma por congresso, sempre com duas respostas clicáveis.", storyCards: [{ card: "Story 1 de 7", format: "Caixa de perguntas", prompt: "Se você pudesse assistir a uma aula completa do Arnold Conference hoje, qual problema gostaria de resolver?", note: "Resposta aberta. Usar as palavras recebidas para orientar pautas futuras." }, { card: "Story 2 de 7", format: "Enquete — Gestão de Academias", prompt: "Seu principal desafio na academia está mais onde?", answers: ["Operação e equipe", "Crescimento e estratégia"] }, { card: "Story 3 de 7", format: "Enquete — Nutrição Estética", prompt: "Qual tema você mais gostaria de aprofundar?", answers: ["Platô e reganho", "Estética e composição"] }, { card: "Story 4 de 7", format: "Enquete — Nutrição Esportiva", prompt: "Qual decisão gera mais dúvida na prática?", answers: ["Planejamento nutricional", "Suplementação"] }, { card: "Story 5 de 7", format: "Enquete — WTTC", prompt: "Na carreira como personal, qual é o maior bloqueio?", answers: ["Técnica e método", "Posicionamento e vendas"] }, { card: "Story 6 de 7", format: "Enquete — SONAFE", prompt: "Em fisioterapia esportiva, qual tema pede mais atualização?", answers: ["Avaliação e decisão", "Retorno ao esporte"] }, { card: "Story 7 de 7", format: "Enquete — Bodybuilding", prompt: "Na preparação, o que você mais quer aprofundar?", answers: ["Treino e dieta", "Recuperação e saúde"] }], fallback: "Post estático com a pergunta aberta do primeiro Story, somente se houver necessidade de presença no feed.", cta: "Responder à caixa e às enquetes", destination: "Respostas dos Stories", congresses: ["Todos"] },
  { id: "0906", date: "06/09", phase: "Reativação", channel: "Reel", title: "Antecipação das três aulas", origin: "Montagem com cenas das masterclasses", idea: "Combinar três trechos visuais de 4–6 segundos; as falas não precisam aparecer completas. Exibir o título oficial e uma expressão curta de orientação para cada aula.", optionLabel: "Cenas, títulos e assuntos para procurar", options: ["Estratégias Nutricionais para Emagrecimento — além da restrição calórica: Ana Paula Pujol citando platô ou reganho de peso.", "Update na Suplementação de Carboidratos — tecnologia, ciência e aplicação: Andreia Naves mencionando carboidrato ou desempenho esportivo.", "Academias em Alta Potência — corpo, mente e alma: Roberto Tranjan falando sobre liderança, equipe ou a tríade Corpo–Mente–Alma."], fallback: "Montagem sem falas, com cenas dos três palestrantes, títulos oficiais e expressões curtas de orientação.", cta: "Salvar e acompanhar a liberação em 08/09", keyword: "LEMBRETE", destination: "Landing page geral, se usar palavra-chave", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0907", date: "07/09", phase: "Transição", channel: "Stories", title: "Amanhã: liberação das aulas", origin: "Produção nova", idea: "Publicar quatro Stories: um anúncio e três cards de preferência. Como a enquete do Instagram aceita duas respostas, cada aula recebe seu próprio card.", storyCards: [{ card: "Story 1 de 4", format: "Anúncio", prompt: "Amanhã, três aulas completas do Arnold Conference 2026 serão liberadas gratuitamente.", note: "Exibir a data 08/09 e cenas das três aulas." }, { card: "Story 2 de 4", format: "Enquete — Nutrição Estética", prompt: "Você começaria por uma aula sobre platô, reganho e emagrecimento além da restrição calórica?", answers: ["Sim, começaria", "Quero ver as outras"] }, { card: "Story 3 de 4", format: "Enquete — Nutrição Esportiva", prompt: "Você começaria por uma aula sobre estratégia e suplementação de carboidratos?", answers: ["Sim, começaria", "Quero ver as outras"] }, { card: "Story 4 de 4", format: "Enquete — Gestão", prompt: "Você começaria por uma aula sobre liderança, cultura e força do negócio?", answers: ["Sim, começaria", "Quero ver as outras"] }], fallback: "Uma tela estática com os três títulos e a data de 08/09.", cta: "Acompanhar o perfil para acessar amanhã", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0908", date: "08/09", phase: "Captação", channel: "Reel + carrossel", title: "Lançamento das três masterclasses", origin: "Montagem; não depende de corte específico", idea: "Apresentar as aulas pelo título oficial, relacionar cada uma a um desafio e informar que são conteúdos completos de 2026.", optionLabel: "Títulos oficiais, desafios e aulas", options: ["Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol — platô, reganho e estratégias avançadas além da restrição calórica.", "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática, com Andreia Naves — planejamento do carboidrato e recursos de suplementação.", "Academias em Alta Potência: de corpo, mente e alma, com Roberto Tranjan — gestão, liderança, cultura e equilíbrio do negócio."], fallback: "Montagem com cenas dos três vídeos, títulos oficiais e narração da equipe de marketing; ou carrossel de seis telas. Não depende de nova gravação.", cta: "Comente AULAS e receba o link", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0909", date: "09/09", phase: "Captação", channel: "Stories", title: "Por qual aula começar?", origin: "Produção nova", idea: "Publicar quatro Stories de orientação. Não é uma enquete: cada card descreve um perfil e oferece o mesmo link para a página das três aulas.", storyCards: [{ card: "Story 1 de 4", format: "Orientação", prompt: "Por qual das três masterclasses começar? Escolha pelo desafio mais próximo da sua atuação.", note: "Apresentar rapidamente os três caminhos." }, { card: "Story 2 de 4", format: "Perfil + link", prompt: "Se você atende emagrecimento, comece por Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol.", note: "Adicionar sticker de link para a landing page das masterclasses." }, { card: "Story 3 de 4", format: "Perfil + link", prompt: "Se trabalha com nutrição e desempenho esportivo, comece por Update na Suplementação de Carboidratos, com Andreia Naves.", note: "Adicionar o mesmo sticker de link." }, { card: "Story 4 de 4", format: "Perfil + link", prompt: "Se lidera academia ou equipe, comece por Academias em Alta Potência, com Roberto Tranjan.", note: "Adicionar o mesmo sticker de link." }], fallback: "Carrossel ‘Por qual aula começar?’ com os três títulos oficiais, somente se houver capacidade.", cta: "Acessar as três aulas", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0910", date: "10/09", phase: "Captação", channel: "Reel", title: "Primeiro corte de masterclass", origin: "Corte localizável no acervo", idea: "Escolher uma das opções testadas em 04/09, priorizando a que recebeu mais respostas. Identificar o corte pelo título oficial da aula. O trecho deve ter 25–45 segundos, contexto suficiente e entregar uma ideia útil antes da interrupção.", optionLabel: "Opções de corte para localizar", options: ["Estratégias Nutricionais para Emagrecimento, com Ana Paula Pujol: por que o platô não deve ser tratado apenas como falta de força de vontade.", "Update na Suplementação de Carboidratos, com Andreia Naves: por que a estratégia nutricional precisa começar antes de a fadiga aparecer.", "Academias em Alta Potência, com Roberto Tranjan: por que uma academia forte exige mais do que estrutura física."], fallback: "Reel narrado que apresenta a pergunta e convida para a explicação completa na aula.", cta: "Comente AULAS para assistir à explicação completa", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Gestão de Academias", "Nutrição Estética", "Nutrição Esportiva"] },
  { id: "0911", date: "11/09", phase: "Captação", channel: "Carrossel", title: "Antes de escolher um gel esportivo", origin: "Aula ‘Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática’, de Andreia Naves", idea: "Organizar perguntas que o profissional precisa fazer antes de recomendar ou escolher um gel esportivo, evitando transformar números em regra universal.", optionLabel: "Perguntas que estruturam o carrossel", options: ["Qual é a demanda energética e a duração do treino?", "Como está a tolerância gastrointestinal do atleta?", "Em qual momento o produto seria consumido?", "O atleta está adaptado a essa estratégia?"], fallback: "Localizar na aula uma comparação entre marketing do produto e fisiologia; usar como corte somente após revisão técnica.", cta: "Comente AULAS para assistir à masterclass", keyword: "AULAS", destination: "Landing page das masterclasses", congresses: ["Nutrição Esportiva"] },
  { id: "0912", date: "12/09", phase: "Captação", channel: "Stories", title: "WTTC e carreira", origin: "Reaproveitamento ou enquete", idea: "Publicar quatro Stories separados para investigar limitações de carreira sem tentar colocar quatro respostas em uma única enquete.", storyCards: [{ card: "Story 1 de 4", format: "Contexto", prompt: "Crescer como personal exige mais do que conhecimento técnico. Queremos entender o que mais limita sua evolução hoje." }, { card: "Story 2 de 4", format: "Enquete", prompt: "Qual destes pontos mais limita sua carreira hoje?", answers: ["Posicionamento", "Método de trabalho"] }, { card: "Story 3 de 4", format: "Enquete", prompt: "E no relacionamento comercial, qual é o maior desafio?", answers: ["Conquistar clientes", "Reter clientes"] }, { card: "Story 4 de 4", format: "Caixa de perguntas", prompt: "Qual situação da sua carreira você gostaria de aprofundar no Arnold Conference?", note: "Resposta aberta. Usar o aprendizado para pautas futuras do WTTC." }], fallback: "Carrossel com três sinais de uma carreira que precisa amadurecer, aprovado por Cris Parente.", cta: "Responder e comentar WTTC para acompanhar as novidades", keyword: "WTTC", destination: "Landing page geral", congresses: ["WTTC"] },
  { id: "0913", date: "13/09", phase: "Captação", channel: "Reel narrado", title: "Copiar preparação ou construir estratégia?", origin: "Produção nova; sem corte", idea: "Mostrar que o que funciona para um atleta pode ser inadequado para outro e que as decisões precisam ser integradas.", optionLabel: "Perguntas que conduzem a narrativa", options: ["O treino foi individualizado para esse atleta?", "A dieta responde ao objetivo, à fase e à resposta individual?", "A recuperação está sendo considerada junto com treino e dieta?"], fallback: "Carrossel ‘Copiar preparação ou construir estratégia?’ com os mesmos três eixos.", cta: "Comente BODY para acompanhar as novidades", keyword: "BODY", destination: "Landing page geral", congresses: ["Bodybuilding"] },
  { id: "0914", date: "14/09", phase: "Captação", channel: "Reel narrado", title: "Prova histórica de demanda SONAFE", origin: "Prints autorizados de 2026", idea: "Fazer mensagens de quem ficou de fora aparecerem em sequência e ocuparem a tela; ocultar nomes, fotos, telefones e qualquer dado pessoal.", optionLabel: "Mensagens reais que podem ser destacadas", options: ["Vai abrir nova turma?", "Ainda tem vaga?", "Fiquei de fora."], fallback: "Se os prints não puderem ser publicados, usar números internos aprovados ou uma narração geral: as vagas de 2026 se esgotaram e recebemos pedidos de nova turma. Não inventar quantidade nem urgência.", cta: "Comente FISIO para acompanhar as novidades", keyword: "FISIO", destination: "Landing page geral", congresses: ["SONAFE"] },
  { id: "0915", date: "15/09", phase: "Pré-venda", channel: "Reel + carrossel", title: "Abertura confirmada para 23/09", origin: "Produção nova", idea: "Colocar o público no centro e informar que as vendas abrem em 23/09, às 12h.", optionLabel: "Opções de abordagem", options: ["Apresentar seis perfis profissionais e mostrar o caminho de cada um entre os congressos.", "Convidar três especialistas a completar a frase: ‘Em 2027, minha área precisa de mais…’."], fallback: "Animação com cenas de 2026, nomes dos seis congressos e a data.", cta: "Comente LEMBRETE", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0916", date: "16/09", phase: "Pré-venda", channel: "Stories", title: "Mapa de objeções", origin: "Caixa de perguntas", idea: "Publicar quatro Stories: uma caixa aberta, duas enquetes complementares e um card final de lembrete. As categorias não são respostas da caixa; elas orientam perguntas separadas.", storyCards: [{ card: "Story 1 de 4", format: "Caixa de perguntas", prompt: "O que você ainda precisa saber antes de escolher um congresso?", note: "Resposta aberta. Agrupar as dúvidas recebidas por tema." }, { card: "Story 2 de 4", format: "Enquete", prompt: "O que mais pesa na sua decisão neste momento?", answers: ["Preço e condições", "Conteúdo e programação"] }, { card: "Story 3 de 4", format: "Enquete", prompt: "Qual dúvida prática precisa ser resolvida primeiro?", answers: ["Local e logística", "Compatibilidade de agenda"] }, { card: "Story 4 de 4", format: "Lembrete", prompt: "As vendas abrem em 23/09, às 12h.", note: "Adicionar o sticker de lembrete da abertura. Não prometer resposta individual às dúvidas enviadas." }], fallback: "Formulário curto com a pergunta aberta e os quatro temas como campos de seleção.", cta: "Enviar a dúvida e ativar o lembrete", destination: "Interação e lembrete no Instagram", congresses: ["Todos"] },
  { id: "0917", date: "17/09", phase: "Pré-venda", channel: "Carrossel", title: "WTTC versus Gestão de Academias", origin: "Produção nova", idea: "Comparar os focos dos dois congressos e mostrar complementaridade sem inventar programação ou compatibilidade de horários.", optionLabel: "Casos para orientar a comparação", options: ["Personal que quer fortalecer carreira, método, posicionamento e entrega — prioridade WTTC.", "Gestor que quer fortalecer negócio, liderança, cultura, operação e inovação — prioridade Gestão de Academias.", "Profissional com os dois desafios — apresentar complementaridade, condicionada à programação oficial."], fallback: "Reel narrado com os dois casos principais: personal querendo crescer na carreira versus gestor querendo fortalecer a academia.", cta: "Salvar e acompanhar as novidades", destination: "Landing page geral", congresses: ["WTTC", "Gestão de Academias"] },
  { id: "0918", date: "18/09", phase: "Pré-venda", channel: "Stories", title: "Escolha em 60 segundos", origin: "Teste interativo", idea: "Publicar oito Stories. Cada pergunta ocupa um card próprio e recebe duas respostas. O último card explica como interpretar os ‘sim’ e leva para a página geral.", storyCards: [{ card: "Story 1 de 8", format: "Instrução", prompt: "Responda às próximas seis perguntas. Cada ‘sim’ aponta para um congresso que pode fazer sentido para você." }, { card: "Story 2 de 8", format: "Enquete — Gestão", prompt: "Você lidera uma academia ou negócio do setor?", answers: ["Sim, é meu contexto", "Não é meu foco"] }, { card: "Story 3 de 8", format: "Enquete — WTTC", prompt: "Quer fortalecer sua carreira e entrega como personal trainer?", answers: ["Sim, é meu objetivo", "Não é meu foco"] }, { card: "Story 4 de 8", format: "Enquete — SONAFE", prompt: "Atua com reabilitação e retorno ao esporte?", answers: ["Sim, atuo", "Não é meu foco"] }, { card: "Story 5 de 8", format: "Enquete — Nutrição Estética", prompt: "Trabalha com estética, emagrecimento ou composição corporal?", answers: ["Sim, trabalho", "Não é meu foco"] }, { card: "Story 6 de 8", format: "Enquete — Nutrição Esportiva", prompt: "Trabalha com nutrição e desempenho esportivo?", answers: ["Sim, trabalho", "Não é meu foco"] }, { card: "Story 7 de 8", format: "Enquete — Bodybuilding", prompt: "Vive profissionalmente o universo do Bodybuilding?", answers: ["Sim, faz parte", "Não é meu foco"] }, { card: "Story 8 de 8", format: "Resultado + link", prompt: "Os congressos associados aos seus ‘sim’ indicam por onde começar. Se marcou mais de um, compare os objetivos de cada área.", note: "Adicionar sticker de link para a landing page geral." }], fallback: "Carrossel com os seis perfis, somente se houver capacidade.", cta: "Ver o resultado e acessar as novidades", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0919", date: "19/09", phase: "Pré-venda", channel: "Carrossel", title: "Decisões no retorno ao esporte", origin: "Programação SONAFE 2026", idea: "Apresentar territórios de decisão, não um protocolo clínico.", optionLabel: "Decisões que estruturam o carrossel", options: ["Avaliar o atleta.", "Compreender a carga.", "Alinhar com treinador e profissional de Educação Física.", "Definir o objetivo da reabilitação.", "Monitorar a resposta.", "Preparar o retorno ao esporte.", "Sustentar a recuperação.", "Considerar a saúde mental."], fallback: "Nova gravação com especialista respondendo: ‘Qual decisão mais costuma ser esquecida no retorno ao esporte?’.", cta: "Comente FISIO", keyword: "FISIO", destination: "Landing page geral", congresses: ["SONAFE"] },
  { id: "0920", date: "20/09", phase: "Pré-venda", channel: "Stories", title: "Teste de escolha", origin: "Situações práticas", idea: "Publicar oito Stories. A pessoa responde a seis situações independentes e pode marcar mais de um interesse; não existe uma única resposta final obrigatória.", storyCards: [{ card: "Story 1 de 8", format: "Instrução", prompt: "Marque ‘é meu desafio’ em todas as situações que combinarem com seu momento. Você pode ter mais de um congresso de interesse." }, { card: "Story 2 de 8", format: "Enquete — Gestão", prompt: "Quero fortalecer liderança, cultura, operação e crescimento da academia.", answers: ["É meu desafio", "Não é prioridade"] }, { card: "Story 3 de 8", format: "Enquete — WTTC", prompt: "Quero fortalecer método, entrega, carreira e posicionamento como personal.", answers: ["É meu desafio", "Não é prioridade"] }, { card: "Story 4 de 8", format: "Enquete — SONAFE", prompt: "Quero aprofundar avaliação, reabilitação e retorno seguro ao esporte.", answers: ["É meu desafio", "Não é prioridade"] }, { card: "Story 5 de 8", format: "Enquete — Nutrição Estética", prompt: "Quero aprofundar emagrecimento, estética e composição corporal.", answers: ["É meu desafio", "Não é prioridade"] }, { card: "Story 6 de 8", format: "Enquete — Nutrição Esportiva", prompt: "Quero tomar decisões melhores sobre nutrição e desempenho esportivo.", answers: ["É meu desafio", "Não é prioridade"] }, { card: "Story 7 de 8", format: "Enquete — Bodybuilding", prompt: "Quero integrar treino, dieta, recuperação e preparação competitiva.", answers: ["É meu desafio", "Não é prioridade"] }, { card: "Story 8 de 8", format: "Resultado + link", prompt: "Marcou mais de um? Registre um interesse principal e um secundário na página.", note: "Adicionar sticker de link para a landing page geral." }], fallback: "Formulário simples de recomendação com interesse principal e secundário.", cta: "Responder, salvar o resultado e acessar o link", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0921", date: "21/09", phase: "Pré-venda", channel: "Carrossel", title: "Nutrição Esportiva — 48 horas", origin: "Transcrições validadas", idea: "Usar três comparações com exemplos gerais derivados das transcrições e revisados tecnicamente.", optionLabel: "Comparações do carrossel", options: ["Evidência versus moda.", "Estratégia individual versus receita pronta.", "Desempenho imediato versus saúde sustentável."], fallback: "Usar corte de Andreia Naves, Daniel Coimbra ou Bruno Zylber somente se houver fala completa que represente uma das comparações.", cta: "Comente LEMBRETE", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Nutrição Esportiva"] },
  { id: "0922", date: "22/09", phase: "Pré-venda", channel: "Reel + Stories", title: "Amanhã, às 12h", origin: "Nova gravação, animação ou apresentação", idea: "No Reel, reunir as quatro informações confirmadas. Nos Stories, desdobrar o conteúdo em quatro telas com uma enquete de prontidão e um link final.", storyCards: [{ card: "Story 1 de 4", format: "Informação", prompt: "As vendas do Arnold Conference 2027 abrem amanhã, às 12h." }, { card: "Story 2 de 4", format: "Informação", prompt: "Os seis congressos estarão disponíveis para escolha.", note: "Exibir os seis nomes; preço e condições apenas se aprovados." }, { card: "Story 3 de 4", format: "Enquete", prompt: "Você já sabe qual congresso quer escolher?", answers: ["Sim, já escolhi", "Ainda vou comparar"] }, { card: "Story 4 de 4", format: "Lembrete + link", prompt: "Acompanhe a abertura amanhã, às 12h.", note: "Adicionar sticker de lembrete e link para a landing page geral." }], fallback: "Animação com textos e cenas do evento.", cta: "Comente LEMBRETE ou use o link dos Stories", keyword: "LEMBRETE", destination: "Landing page geral", congresses: ["Todos"] },
  { id: "0923a", date: "23/09 · 9h", phase: "Abertura", channel: "Stories", title: "Agenda do dia", origin: "Produção nova", idea: "Publicar três Stories informativos em horários diferentes. Não são opções de uma enquete; são etapas da cobertura do dia.", storyCards: [{ card: "Story 1 de 3 · 9h", format: "Confirmação", prompt: "É hoje: as vendas abrem às 12h.", note: "Adicionar sticker de lembrete para 12h." }, { card: "Story 2 de 3 · 12h", format: "Abertura + link", prompt: "Vendas abertas para os seis congressos.", note: "Adicionar link para a página central de vendas." }, { card: "Story 3 de 3 · após 12h", format: "Orientação", prompt: "Ainda não sabe qual congresso escolher? Compare seu objetivo com os seis perfis.", note: "Adicionar link para a página comparativa ou central de vendas." }], fallback: "Post estático com os mesmos horários.", cta: "Ativar o lembrete e, após 12h, acessar as vendas", destination: "Lembrete no Instagram e página de vendas", congresses: ["Todos"] },
  { id: "0923b", date: "23/09 · 12h", phase: "Abertura", channel: "Reel + carrossel + Stories", title: "Vendas abertas", origin: "Produção nova", idea: "Anunciar a abertura, apresentar os seis congressos e conduzir para a compra.", optionLabel: "Opções de formato principal", options: ["Apresentador anuncia ‘Vendas abertas’ e cita os seis congressos.", "Montagem com uma cena de cada área.", "Carrossel com uma tela por congresso e uma tela final de compra."], fallback: "Animação com identidade do evento, nomes dos congressos e primeiro lote.", cta: "Comente LOTE ou acesse o link na bio", keyword: "LOTE", destination: "Página central de vendas", congresses: ["Todos"] },
  { id: "0923c", date: "23/09 · 19h", phase: "Abertura", channel: "Stories", title: "Perguntas frequentes das primeiras horas", origin: "Dúvidas reais do atendimento", idea: "Publicar uma sequência de três a seis Stories. Cada card responde uma única dúvida realmente recebida; as perguntas abaixo são modelos de organização, não um roteiro para inventar objeções.", storyCards: [{ card: "Story-modelo 1", format: "Pergunta + resposta", prompt: "O que a inscrição inclui?", note: "Usar apenas se a dúvida tiver sido recebida. Responder com informação oficial e link de compra." }, { card: "Story-modelo 2", format: "Pergunta + resposta", prompt: "Como escolher o congresso?", note: "Explicar pelos perfis profissionais e objetivos; não inventar compatibilidade de horários." }, { card: "Story-modelo 3", format: "Pergunta + resposta", prompt: "Quais são as condições comerciais?", note: "Usar apenas preço, lote e parcelamento aprovados." }, { card: "Story-modelo 4", format: "Pergunta + resposta", prompt: "Como funciona o acesso e onde será realizado?", note: "Responder com logística oficial." }, { card: "Story-modelo 5", format: "Pergunta + resposta", prompt: "Qual é o canal de suporte?", note: "Exibir o contato oficial de atendimento." }], fallback: "Vídeo curto de um responsável pelo atendimento respondendo às três dúvidas mais recorrentes.", cta: "Enviar dúvida ou retomar a inscrição", destination: "Atendimento e página de vendas", congresses: ["Todos"] },
  { id: "0924", date: "24/09", phase: "Aceleração", channel: "Carrossel", title: "Qual congresso faz sentido para você?", origin: "Produção nova", idea: "Mostrar seis perfis e o congresso mais relacionado, explicando complementaridades possíveis e condicionando a escolha final à programação.", optionLabel: "Perfis para o comparativo", options: ["Lidera academia ou negócio fitness — Gestão de Academias.", "Quer fortalecer carreira e entrega como personal — WTTC.", "Atua com fisioterapia, reabilitação e retorno ao esporte — SONAFE.", "Trabalha com estética e composição corporal — Nutrição Estética.", "Trabalha com desempenho e esporte — Nutrição Esportiva.", "Vive preparação e cultura competitiva — Bodybuilding."], fallback: "Reel narrado ‘Qual congresso faz sentido para você?’ com os seis perfis.", cta: "Comente CONGRESSO", keyword: "CONGRESSO", destination: "Página central de vendas", congresses: ["Todos"] },
  { id: "0925", date: "25/09", phase: "Aceleração", channel: "Carrossel", title: "Profundidade em Nutrição Estética", origin: "Transcrições", idea: "Usar temas do acervo como exemplo de profundidade, sem afirmar que compõem a programação de 2027.", optionLabel: "Temas que podem ser apresentados", options: ["Platô e reganho de peso — referência na aula de Ana Paula Pujol.", "Diferenciação de celulite, lipedema e flacidez — referência na aula de Luisa Volpe e Sullen Becher.", "Ambiente, pele e exposoma — referência na aula de Mika Yamaguchi."], fallback: "Corte de Ana Paula, Luisa/Sullen ou Mika apenas se houver trecho completo, compreensível isoladamente e aprovado.", cta: "Comente ESTETICA", keyword: "ESTETICA", destination: "Página específica ou central de vendas", congresses: ["Nutrição Estética"] },
  { id: "0926", date: "26/09", phase: "Aceleração", channel: "Stories/Reel", title: "Cinco dúvidas que impedem a compra", origin: "Atendimento", idea: "Selecionar cinco dúvidas reais. No Reel, responder as cinco em sequência; nos Stories, publicar um card por dúvida. Os exemplos abaixo só podem ser usados quando a informação estiver confirmada.", storyCards: [{ card: "Story 1 de 5", format: "Pergunta + resposta", prompt: "O que está incluído na inscrição?", note: "Responder com a entrega oficial do congresso e link de compra." }, { card: "Story 2 de 5", format: "Pergunta + resposta", prompt: "Como escolher o congresso mais adequado?", note: "Usar os perfis e propostas de valor; não prometer compatibilidade de horários." }, { card: "Story 3 de 5", format: "Pergunta + resposta", prompt: "Quais são o preço e as condições de pagamento?", note: "Usar somente informações comerciais aprovadas." }, { card: "Story 4 de 5", format: "Pergunta + resposta", prompt: "Como funcionam acesso, local e logística?", note: "Usar somente dados oficiais." }, { card: "Story 5 de 5", format: "Pergunta + resposta", prompt: "Onde tirar dúvidas antes de concluir a compra?", note: "Exibir o canal oficial de atendimento." }], fallback: "Carrossel de perguntas frequentes com uma pergunta por tela.", cta: "Responder ou retomar a inscrição", destination: "Página de vendas ou atendimento", congresses: ["Todos"] },
  { id: "0927", date: "27/09", phase: "Aceleração", channel: "Feed", title: "Prova e próximos passos", origin: "Dados e depoimentos reais", idea: "Usar somente provas verificáveis e autorizadas. Não fabricar escassez; qualquer dado de procura ou venda precisa ser aprovado.", optionLabel: "Fontes de prova que podem ser usadas", options: ["Comentários autorizados.", "Dúvidas reais que foram resolvidas.", "Depoimentos de edições anteriores.", "Dados de interesse ou procura previamente aprovados."], fallback: "Bastidores da equipe e explicação sobre os próximos conteúdos.", cta: "Escolher o congresso e fazer a inscrição", destination: "Página central de vendas", congresses: ["Todos"] },
];

export const calendar: CalendarItem[] = calendarBase.map(item => {
  const cutAudit = cutAuditByCalendarId[item.id];
  return {
    ...item,
    ...(cutAudit?.overrides ?? {}),
    productionBrief: operationalBriefs[item.id],
    optionMode: optionModes[item.id],
    cutValidations: cutAudit?.validations,
    milestone: calendarMilestones[item.id],
  };
});

export const emailBase = [
  { id: "email-base-reativacao", date: "31/08 ou 01/09", audience: "Participantes/compradores anteriores, alunos, ex-alunos e contatos válidos", objective: "Reapresentar o Arnold Conference, citar os seis congressos e abrir a temporada de novidades.", materials: "Bloco visual com os seis nomes e uma pergunta sobre interesse.", cta: "Quero receber as novidades", destination: "Landing page geral", rule: "Um disparo; excluir descadastrados, inválidos e contatos sem base legal." },
  { id: "email-base-masterclasses", date: "08/09", audience: "Participantes anteriores, alunos, ex-alunos, leads recentes e engajados", objective: "Lançar a seleção com as três masterclasses de 2026.", materials: "Títulos oficiais, descrições temáticas, fotos dos palestrantes, explicação da edição e página testada.", cta: "Quero acessar as 3 masterclasses", destination: "Landing page das masterclasses", rule: "Não prometer aulas de WTTC, SONAFE ou Bodybuilding." },
  { id: "email-base-recuperacao", date: "11/09", audience: "Quem recebeu 08/09 e não converteu", objective: "Recuperar a captação com os títulos oficiais, os três temas e uma razão concreta para assistir.", materials: "Versão curta; variação para abriu sem clicar e clicou sem preencher, se possível.", cta: "Acessar as masterclasses gratuitas", destination: "Landing page das masterclasses", rule: "Suprimir quem já converteu." },
  { id: "email-base-anuncio-abertura", date: "15/09", audience: "Engajados de setembro, participantes anteriores e leads recentes", objective: "Anunciar abertura em 23/09 às 12h e apresentar os seis congressos.", materials: "Data, horário e seis nomes; condições somente se aprovadas.", cta: "Quero acompanhar a abertura", destination: "Landing page geral", rule: "Não prometer lembrete individual sem rotina configurada." },
  { id: "email-base-comparativo", date: "18/09", audience: "Base engajada e participantes anteriores", objective: "Ajudar na escolha com comparativo dos seis congressos.", materials: "Público, problema profissional e transformação de cada congresso.", cta: "Ver qual congresso combina com meu objetivo", destination: "Página comparativa ou landing page geral", rule: "Não afirmar compatibilidade de horários antes da programação." },
  { id: "email-base-48h", date: "21/09", audience: "Quem abriu/clicou 15 ou 18/09 e participantes anteriores", objective: "Preparar as 48 horas finais.", materials: "Horário, opções disponíveis e critérios de escolha.", cta: "Conhecer os 6 congressos antes da abertura", destination: "Página comparativa ou geral", rule: "Segmentar por dados do mailing, não por interação social." },
  { id: "email-base-vespera", date: "22/09", audience: "Engajados, inscritos na página geral e participantes anteriores", objective: "Reforçar amanhã às 12h.", materials: "Data, horário, seis congressos e informação comercial aprovada.", cta: "Quero acompanhar a abertura amanhã", destination: "Landing page geral", rule: "Um botão e nenhuma escassez não confirmada." },
  { id: "email-base-vendas-abertas", date: "23/09 · 12h", audience: "Contatos válidos e engajados", objective: "Informar vendas abertas.", materials: "Seis cards, preços, condições, primeiro lote, suporte e links testados.", cta: "Escolher meu congresso e fazer a inscrição", destination: "Página central de vendas", rule: "Excluir compradores identificados quando possível." },
  { id: "email-base-recuperar-inscricao", date: "24–25/09", audience: "Clicou em páginas comerciais e não comprou; ou não compradores engajados", objective: "Recuperar decisão e inscrição.", materials: "Perguntas frequentes, quadro de escolha e canal de atendimento.", cta: "Retomar minha inscrição", destination: "Congresso visitado ou página central", rule: "Interromper após compra, resposta negativa ou descadastro." },
];

export const emailNurture = [
  { id: "email-nurture-imediato", moment: "Imediato", content: "Confirmação, instrução e apresentação das três aulas com título oficial, palestrante e descrição temática.", cta: "Acessar agora as 3 masterclasses", destination: "Página de obrigado", condition: "Todos os novos cadastros" },
  { id: "email-nurture-d1", moment: "+1 dia", content: "Orientação sobre por onde começar; destacar a aula relacionada se houver interesse declarado e identificar os três botões pelos títulos oficiais.", cta: "Escolher minha primeira masterclass", destination: "Página de obrigado", condition: "Não exigir personalização sem campo de interesse" },
  { id: "email-nurture-d3", moment: "+3 dias", content: "Uma ideia útil de cada aula vinculada ao título oficial: platô/reganho em Estratégias Nutricionais para Emagrecimento; carboidratos no Update na Suplementação de Carboidratos; Corpo, Mente e Alma em Academias em Alta Potência.", cta: "Continuar assistindo às aulas", destination: "Página de obrigado", condition: "Suprimir descadastrados" },
  { id: "email-nurture-d5", moment: "+5 dias", content: "Relacionar as aulas aos três congressos correspondentes.", cta: "Conhecer os congressos", destination: "Página comparativa ou landing page geral", condition: "Não sugerir aulas das outras áreas" },
  { id: "email-nurture-anuncio-abertura", moment: "15/09", content: "Anúncio de abertura em 23/09 às 12h.", cta: "Quero acompanhar a abertura", destination: "Landing page geral", condition: "Entradas tardias recebem a data no próximo e-mail útil" },
  { id: "email-nurture-48h", moment: "21/09", content: "Comparativo resumido e preparação para a abertura.", cta: "Conhecer os 6 congressos", destination: "Página comparativa ou geral", condition: "Não presumir interesse sem dados" },
  { id: "email-nurture-vendas-abertas", moment: "23/09 · 12h", content: "Vendas abertas, oferta aprovada e caminhos de compra.", cta: "Escolher meu congresso e fazer a inscrição", destination: "Página central de vendas", condition: "Suprimir compradores quando possível" },
];

export const emailAssets = [
  { material: "Landing page das masterclasses", minimum: "Promessa, títulos oficiais, descrições temáticas, palestrantes, formulário, consentimentos e rastreamento", deadline: "Antes de 08/09" },
  { material: "Página de obrigado", minimum: "Três vídeos, títulos oficiais, descrições temáticas, orientação e data de vendas", deadline: "Antes de 08/09" },
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
