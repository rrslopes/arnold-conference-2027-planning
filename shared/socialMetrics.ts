export const SOCIAL_MONTHS = [
  { key: "2026-09", label: "Set/26", fullLabel: "Setembro de 2026", phase: "Aquecimento e abertura de vendas" },
  { key: "2026-10", label: "Out/26", fullLabel: "Outubro de 2026", phase: "Sustentação pós-lançamento" },
  { key: "2026-11", label: "Nov/26", fullLabel: "Novembro de 2026", phase: "Aquisição temática" },
  { key: "2026-12", label: "Dez/26", fullLabel: "Dezembro de 2026", phase: "Manutenção de presença" },
  { key: "2027-01", label: "Jan/27", fullLabel: "Janeiro de 2027", phase: "Retomada da campanha" },
  { key: "2027-02", label: "Fev/27", fullLabel: "Fevereiro de 2027", phase: "Consideração e prova" },
  { key: "2027-03", label: "Mar/27", fullLabel: "Março de 2027", phase: "Aceleração final" },
  { key: "2027-04", label: "Abr/27", fullLabel: "Abril de 2027", phase: "Cobertura do evento" },
] as const;

export type SocialMonthKey = typeof SOCIAL_MONTHS[number]["key"];

export const SOCIAL_RESULT_FIELDS = [
  "accountsReached",
  "views",
  "interactions",
  "netFollowers",
  "metaMessagesSent",
  "reelsPublished",
  "reelsMedianReach",
  "reelsMedianViews",
  "reelsMedianInteractions",
  "reelsMedianLikes",
  "reelsMedianComments",
  "reelsMedianShares",
  "reelsMedianSaves",
  "carouselsPublished",
  "carouselsMedianReach",
  "carouselsMedianViews",
  "carouselsMedianInteractions",
  "carouselsMedianShares",
  "carouselsMedianSaves",
  "postsPublished",
  "postsTypicalReach",
  "postsTypicalViews",
  "postsTypicalInteractions",
  "postsTypicalLikes",
  "postsTypicalComments",
  "postsTypicalShares",
  "postsTypicalSaves",
  "storiesPublished",
  "storiesMedianReach",
  "storiesMedianViews",
  "storiesTotalViews",
  "storiesAverageViews",
  "storiesBestViews",
  "storyReplies",
  "storyLinkClicks",
  "storyStickerTaps",
  "storyProfileVisits",
] as const;

export type SocialResultField = typeof SOCIAL_RESULT_FIELDS[number];
export type SocialMonthlyValues = Record<SocialResultField, number | null>;

export type SocialMonthlyResult = SocialMonthlyValues & {
  monthKey: SocialMonthKey;
  periodStartAt: number | null;
  periodEndAt: number | null;
  isPartial: boolean;
  note: string;
};

// A mLabs gera um relatório compartilhável por período: cada mês tem o seu link.
// Mês sem link mostra o aviso de relatório ainda não disponível.
export const MLABS_REPORT_URLS: Partial<Record<SocialMonthKey, string>> = {
  "2026-09": "https://relatorio.digital/2EWOaNDZwIGNzYmMwMGMwITYaNDbmZmW.html",
};

export const MLABS_REPORT_URL = MLABS_REPORT_URLS["2026-09"] as string;

export function getMlabsReportUrl(monthKey: SocialMonthKey) {
  return MLABS_REPORT_URLS[monthKey] ?? null;
}

export const SOCIAL_BEST_TIMES = [
  { day: "Segunda", recommended: "11:30 e 19:00", avoid: "12:00 e 18:00" },
  { day: "Terça", recommended: "15:30 e 16:30", avoid: "12:00 e 18:00" },
  { day: "Quarta", recommended: "16:30 e 17:30", avoid: "12:00 e 18:00" },
  { day: "Quinta", recommended: "11:30 e 19:00", avoid: "12:00 e 18:00" },
  { day: "Sexta", recommended: "17:30 e 18:30", avoid: "12:00 e 18:00" },
  { day: "Sábado", recommended: "09:30 e 22:00", avoid: "10:00 e 12:00" },
  { day: "Domingo", recommended: "09:30 e 17:00", avoid: "08:00 e 09:00" },
] as const;

export function formatStatisticMode(sample: number | null) {
  if (sample === null || sample <= 0) return "Aguardando publicações";
  if (sample < 3) return "Resultado do período";
  return "Mediana do período";
}

export const SOCIAL_ACCOUNT_GOALS = [
  { key: "accountsReached", label: "Contas alcançadas", minimum: 25_000, operational: 32_000, stretch: 40_000, baseline: 23_200 },
  { key: "views", label: "Visualizações", minimum: 45_000, operational: 60_000, stretch: 80_000, baseline: 42_549 },
  { key: "interactions", label: "Interações com o conteúdo", minimum: 1_800, operational: 2_400, stretch: 3_200, baseline: 1_700 },
  { key: "netFollowers", label: "Crescimento líquido de seguidores", minimum: 50, operational: 100, stretch: 150, baseline: 42 },
] as const satisfies ReadonlyArray<{
  key: Extract<SocialResultField, "accountsReached" | "views" | "interactions" | "netFollowers">;
  label: string;
  minimum: number;
  operational: number;
  stretch: number;
  baseline: number;
}>;

export const SOCIAL_FORMAT_GOALS = [
  {
    key: "reels",
    label: "Reels",
    basis: "Mínimo: reativação de agosto (6 Reels). Operacional: mediana do aquecimento de março (23 Reels). Superação: percentil 65 de março.",
    sampleNote: "A referência privilegia a mediana e não depende dos conteúdos fora da curva.",
    metrics: [
      { label: "Alcance mediano", field: "reelsMedianReach", minimum: 1_949, operational: 3_996, stretch: 7_549 },
      { label: "Visualizações medianas", field: "reelsMedianViews", minimum: 2_491, operational: 4_739, stretch: 6_259 },
      { label: "Interações medianas", field: "reelsMedianInteractions", minimum: 44, operational: 89, stretch: 159 },
      { label: "Compartilhamentos medianos", field: "reelsMedianShares", minimum: 9, operational: 12, stretch: 30 },
      { label: "Salvamentos medianos", field: "reelsMedianSaves", minimum: 3, operational: 5, stretch: 9 },
    ],
  },
  {
    key: "carousels",
    label: "Carrosséis · base histórica",
    basis: "Faixas calculadas somente com os 5 carrosséis do aquecimento de março: mediana, percentil 65 e percentil 80.",
    sampleNote: "A operação atual agrupa carrosséis e imagens estáticas como Posts não Reels. Esta referência histórica permanece identificada como carrossel e não é aplicada automaticamente a uma amostra mista.",
    metrics: [
      { label: "Alcance mediano", field: "carouselsMedianReach", minimum: 1_847, operational: 2_190, stretch: 4_391 },
      { label: "Visualizações medianas", field: "carouselsMedianViews", minimum: 3_461, operational: 4_933, stretch: 8_943 },
      { label: "Interações medianas", field: "carouselsMedianInteractions", minimum: 46, operational: 86, stretch: 136 },
      { label: "Compartilhamentos medianos", field: "carouselsMedianShares", minimum: 10, operational: 11, stretch: 18 },
      { label: "Salvamentos medianos", field: "carouselsMedianSaves", minimum: 1, operational: 3, stretch: 6 },
    ],
  },
  {
    key: "stories",
    label: "Stories",
    basis: "Faixas de alcance e visualização calculadas nos 73 Stories de março: mediana, percentil 65 e percentil 80.",
    sampleNote: "Respostas, cliques, figurinhas e visitas ao perfil são acompanhados como totais reais. Retenção, avanços, voltas e saídas seguem sem linha de base.",
    metrics: [
      { label: "Alcance mediano por Story", field: "storiesMedianReach", minimum: 175, operational: 277, stretch: 1_227 },
      { label: "Visualizações medianas por Story", field: "storiesMedianViews", minimum: 227, operational: 382, stretch: 1_496 },
    ],
  },
] as const;

export const SOCIAL_STORY_ACTION_GOALS = [
  {
    key: "repliesPer100",
    label: "Respostas a cada 100 Stories",
    minimum: 5,
    operational: 13,
    stretch: 16,
    basis: "Valores observados: março 5,5; maio 13,3; abril 16,1. Agosto foi excluído por conter somente 2 Stories.",
  },
  {
    key: "linkClicksPer100",
    label: "Cliques no link a cada 100 Stories",
    minimum: 140,
    operational: 158,
    stretch: 216,
    basis: "Valores observados: maio 140; abril 157,9; março 216,4. Interpretar junto da quantidade de Stories com link.",
  },
  {
    key: "profileVisitsPer100",
    label: "Visitas ao perfil a cada 100 Stories",
    minimum: 116,
    operational: 182,
    stretch: 207,
    basis: "Valores observados: março 116,4; abril 182,4; maio 206,7. Agosto foi excluído pela amostra mínima.",
  },
] as const;

export const SOCIAL_HISTORY = [
  {
    key: "2026-03",
    label: "Março · aquecimento",
    context: "30 posts próprios e 73 Stories. É a fase histórica mais comparável ao aquecimento da campanha de 2027.",
    reels: { sample: 23, reach: 3_996, views: 4_739, interactions: 89, shares: 12, saves: 5 },
    carousels: { sample: 5, reach: 1_847, views: 3_461, interactions: 46, shares: 10, saves: 1 },
    stories: { sample: 73, reach: 175, views: 227, replies: 4, linkClicks: 158, stickerTaps: 117, profileVisits: 85 },
  },
  {
    key: "2026-04",
    label: "Abril · evento",
    context: "70 posts próprios e 380 Stories. Cobertura presencial excepcional; não deve ser usada como padrão para meses comuns.",
    reels: { sample: 45, reach: 2_963, views: 4_108, interactions: 101, shares: 6, saves: 3 },
    carousels: { sample: 21, reach: 3_182, views: 5_169, interactions: 89, shares: 8, saves: 3 },
    stories: { sample: 380, reach: 2_188, views: 2_503, replies: 61, linkClicks: 600, stickerTaps: 5_554, profileVisits: 693 },
  },
  {
    key: "2026-05",
    label: "Maio · pós-evento",
    context: "12 posts próprios e 15 Stories. Representa desaceleração pós-evento, não a cadência desejada da campanha.",
    reels: { sample: 6, reach: 1_382, views: 1_741, interactions: 27, shares: 3.5, saves: 0.5 },
    carousels: { sample: 4, reach: 888, views: 2_266, interactions: 50, shares: 2, saves: 0.5 },
    stories: { sample: 15, reach: 168, views: 189, replies: 2, linkClicks: 21, stickerTaps: 0, profileVisits: 31 },
  },
  {
    key: "2026-08",
    label: "Agosto · reativação",
    context: "9 posts próprios, 2 Stories e retomada apenas em 21/08. A conta registrou 23,2 mil de alcance, 42.549 visualizações, 1,7 mil interações e saldo de +42 seguidores no período de 28 dias.",
    reels: { sample: 6, reach: 1_949, views: 2_491, interactions: 44, shares: 8.5, saves: 2.5 },
    carousels: { sample: 1, reach: 3_913, views: 8_758, interactions: 380, shares: 70, saves: 24 },
    stories: { sample: 2, reach: 506, views: 605, replies: 2, linkClicks: 0, stickerTaps: 0, profileVisits: 12 },
  },
] as const;

export const SOCIAL_MISSING_BASELINES = [
  "Taxa de conclusão de sequências de Stories",
  "Avanços, voltas, próximo Story e saídas separados",
  "Toques em figurinhas por Story elegível, pois a exportação não identifica quais Stories continham figurinha",
  "Seguidores gerados por Story fora da cobertura presencial do evento",
  "Conversão de alcance em leads atribuída por UTM",
] as const;

export function createEmptySocialValues(): SocialMonthlyValues {
  return Object.fromEntries(SOCIAL_RESULT_FIELDS.map(field => [field, null])) as SocialMonthlyValues;
}

export function calculateGoalProgress(actual: number | null, target: number) {
  if (actual === null || !Number.isFinite(actual) || target <= 0) {
    return { percentage: null, barPercentage: 0, reached: false };
  }
  const percentage = (actual / target) * 100;
  return { percentage, barPercentage: Math.min(100, Math.max(0, percentage)), reached: actual >= target };
}

export function hasAnySocialResult(values: SocialMonthlyValues) {
  return SOCIAL_RESULT_FIELDS.some(field => values[field] !== null);
}

export function calculatePerHundred(total: number | null, published: number | null) {
  if (total === null || published === null || !Number.isFinite(total) || !Number.isFinite(published) || published <= 0) return null;
  return (total / published) * 100;
}
