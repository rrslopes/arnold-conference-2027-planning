export const NEWS_LP_SOURCE = {
  key: "conference-news-lp",
  label: "LP de novidades do Conference 2027",
  url: "https://oferta.savagetgroup.com.br/conference-2027",
} as const;

export const PARTICIPATION_FIELDS = [
  { key: "firstTimeCount", label: "Primeira participação", sourceLabel: "Nunca! Será a primeira vez" },
  { key: "attended2026Count", label: "Esteve em 2026", sourceLabel: "Sim! Estive em 2026" },
  { key: "attendedPastCount", label: "Esteve em outras edições", sourceLabel: "Sim! Estive em outra(s) edição(es), mas não em 2026" },
] as const;

export const INTEREST_FIELDS = [
  { key: "nutritionAestheticsCount", label: "Nutrição Estética", congress: "Nutrição Estética" },
  { key: "sportsNutritionCount", label: "Nutrição Esportiva", congress: "Nutrição Esportiva" },
  { key: "sportsPhysioCount", label: "Fisioterapia Esportiva", congress: "SONAFE" },
  { key: "businessManagementCount", label: "Gestão de Negócios", congress: "Gestão de Academias" },
  { key: "physicalEducationCount", label: "Educação Física e Personal Training", congress: "WTTC" },
  { key: "bodybuildingCount", label: "Bodybuilding", congress: "Bodybuilding" },
  { key: "otherInterestCount", label: "Outra área", congress: "Outra área" },
] as const;

export type ParticipationField = (typeof PARTICIPATION_FIELDS)[number]["key"];
export type InterestField = (typeof INTEREST_FIELDS)[number]["key"];
export type LeadProfileCountField = ParticipationField | InterestField;
export type LeadProfileBreakdown = { canal: string; conversoes: number };
export type LeadProfileCity = { opcao: string; pessoas: number; percentual: number };
export type LeadProfileClickOrigin = { canal: string; cliques: number };

export type LeadProfileSnapshotDraft = {
  id?: number;
  periodStartAt: number;
  periodEndAt: number;
  totalLeads: number;
  newLeads: number;
  uniquePeopleInPeriod?: number | null;
  totalUniquePeople?: number | null;
  profileBaseCount?: number | null;
  sessions: number | null;
  dmSessions: number | null;
  formStarts: number | null;
  dmConversions: number | null;
  firstTimeCount: number | null;
  attended2026Count: number | null;
  attendedPastCount: number | null;
  nutritionAestheticsCount: number | null;
  sportsNutritionCount: number | null;
  sportsPhysioCount: number | null;
  businessManagementCount: number | null;
  physicalEducationCount: number | null;
  bodybuildingCount: number | null;
  otherInterestCount: number | null;
  topCitiesJson?: string;
  originsJson?: string | null;
  masterclassClicks?: number | null;
  masterclassClickOriginsJson?: string | null;
  syncSource?: string;
  providerUpdatedAt?: number | null;
  providerObservation?: string | null;
  note: string;
};

export type LeadProfileSnapshot = LeadProfileSnapshotDraft & {
  id: number;
  sourceKey: typeof NEWS_LP_SOURCE.key;
  uniquePeopleInPeriod: number | null;
  totalUniquePeople: number | null;
  profileBaseCount: number | null;
  topCitiesJson: string;
  originsJson: string | null;
  masterclassClicks: number | null;
  masterclassClickOriginsJson: string | null;
  syncSource: string;
  providerUpdatedAt: number | null;
  providerObservation: string | null;
  updatedAt: number;
};

export type LeadProfileValidationIssue = {
  field: string;
  message: string;
};

export function percentageOfLeads(count: number | null, totalLeads: number) {
  if (count === null || totalLeads <= 0) return null;
  return Math.round((count / totalLeads) * 10_000) / 100;
}

export function profilePercentageBase(snapshot: Pick<LeadProfileSnapshotDraft, "profileBaseCount" | "totalLeads">) {
  return snapshot.profileBaseCount ?? snapshot.totalLeads;
}

export function calculateLpConversionRate(newLeads: number, sessions: number | null) {
  if (sessions === null || sessions <= 0) return null;
  return Math.round((newLeads / sessions) * 10_000) / 100;
}

export function calculateUniquePeopleConversionRate(uniquePeople: number | null | undefined, sessions: number | null) {
  if (uniquePeople === null || uniquePeople === undefined || sessions === null || sessions <= 0) return null;
  return Math.round((uniquePeople / sessions) * 10_000) / 100;
}

export function calculateLpAbandonments(formStarts: number | null, newLeads: number) {
  if (formStarts === null) return null;
  return Math.max(0, formStarts - newLeads);
}

export function getLatestLeadProfileSnapshot<T extends Pick<LeadProfileSnapshot, "periodEndAt" | "updatedAt">>(snapshots: T[]) {
  return [...snapshots].sort((a, b) => b.periodEndAt - a.periodEndAt || b.updatedAt - a.updatedAt)[0] ?? null;
}

export function sortInterestProfile(snapshot: LeadProfileSnapshotDraft) {
  const base = profilePercentageBase(snapshot);
  return INTEREST_FIELDS
    .map(field => ({ ...field, count: snapshot[field.key], percentage: percentageOfLeads(snapshot[field.key], base) }))
    .sort((a, b) => (b.count ?? -1) - (a.count ?? -1));
}

export function validateLeadProfileSnapshot(snapshot: LeadProfileSnapshotDraft) {
  const issues: LeadProfileValidationIssue[] = [];
  if (snapshot.periodStartAt > snapshot.periodEndAt) issues.push({ field: "periodStartAt", message: "O início do período deve ser anterior ao fechamento." });
  if (snapshot.totalLeads < 0) issues.push({ field: "totalLeads", message: "O total de leads não pode ser negativo." });
  if (snapshot.newLeads < 0 || snapshot.newLeads > snapshot.totalLeads) issues.push({ field: "newLeads", message: "Novos leads devem ficar entre zero e o total acumulado." });
  if (snapshot.uniquePeopleInPeriod !== undefined && snapshot.uniquePeopleInPeriod !== null && (snapshot.uniquePeopleInPeriod < 0 || snapshot.uniquePeopleInPeriod > snapshot.newLeads)) issues.push({ field: "uniquePeopleInPeriod", message: "Pessoas únicas do período devem ficar entre zero e as conversões brutas do período." });
  if (snapshot.totalUniquePeople !== undefined && snapshot.totalUniquePeople !== null && (snapshot.totalUniquePeople < 0 || snapshot.totalUniquePeople > snapshot.totalLeads)) issues.push({ field: "totalUniquePeople", message: "Pessoas únicas acumuladas devem ficar entre zero e as conversões brutas acumuladas." });
  if (snapshot.profileBaseCount !== undefined && snapshot.profileBaseCount !== null && snapshot.profileBaseCount < 0) issues.push({ field: "profileBaseCount", message: "A base de cálculo do perfil não pode ser negativa." });
  (["sessions", "dmSessions", "formStarts", "dmConversions"] as const).forEach(field => {
    const value = snapshot[field];
    if (value !== null && value < 0) issues.push({ field, message: "O valor não pode ser negativo." });
  });
  if (snapshot.dmSessions !== null && snapshot.sessions !== null && snapshot.dmSessions > snapshot.sessions) issues.push({ field: "dmSessions", message: "Sessões via DM não podem ultrapassar as sessões totais." });
  if (snapshot.formStarts !== null && snapshot.formStarts < snapshot.newLeads) issues.push({ field: "formStarts", message: "Inícios de formulário não podem ser menores que os novos leads." });
  if (snapshot.dmConversions !== null && snapshot.dmConversions > snapshot.newLeads) issues.push({ field: "dmConversions", message: "Conversões via DM não podem ultrapassar os novos leads." });

  const optionalFields: LeadProfileCountField[] = [
    ...PARTICIPATION_FIELDS.map(field => field.key),
    ...INTEREST_FIELDS.map(field => field.key),
  ];
  const base = profilePercentageBase(snapshot);
  optionalFields.forEach(field => {
    const value = snapshot[field];
    if (value !== null && (value < 0 || value > base)) issues.push({ field, message: "O valor deve ficar entre zero e a base de cálculo do perfil." });
  });

  const participationTotal = PARTICIPATION_FIELDS.reduce((total, field) => total + (snapshot[field.key] ?? 0), 0);
  if (participationTotal > base) issues.push({ field: "participation", message: "A soma do histórico de participação não pode ultrapassar a base de cálculo do perfil." });
  return issues;
}
