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
export type LeadProfileCountField = ParticipationField | InterestField | "singleInterestCount" | "multipleInterestsCount";

export type CityBreakdown = {
  city: string;
  count: number;
};

export type LeadProfileSnapshotDraft = {
  id?: number;
  periodStartAt: number;
  periodEndAt: number;
  totalLeads: number;
  newLeads: number;
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
  singleInterestCount: number | null;
  multipleInterestsCount: number | null;
  topCities: CityBreakdown[];
  note: string;
};

export type LeadProfileSnapshot = LeadProfileSnapshotDraft & {
  id: number;
  sourceKey: typeof NEWS_LP_SOURCE.key;
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

export function getLatestLeadProfileSnapshot<T extends Pick<LeadProfileSnapshot, "periodEndAt" | "updatedAt">>(snapshots: T[]) {
  return [...snapshots].sort((a, b) => b.periodEndAt - a.periodEndAt || b.updatedAt - a.updatedAt)[0] ?? null;
}

export function sortInterestProfile(snapshot: LeadProfileSnapshotDraft) {
  return INTEREST_FIELDS
    .map(field => ({ ...field, count: snapshot[field.key], percentage: percentageOfLeads(snapshot[field.key], snapshot.totalLeads) }))
    .sort((a, b) => (b.count ?? -1) - (a.count ?? -1));
}

export function validateLeadProfileSnapshot(snapshot: LeadProfileSnapshotDraft) {
  const issues: LeadProfileValidationIssue[] = [];
  if (snapshot.periodStartAt > snapshot.periodEndAt) issues.push({ field: "periodStartAt", message: "O início do período deve ser anterior ao fechamento." });
  if (snapshot.totalLeads < 0) issues.push({ field: "totalLeads", message: "O total de leads não pode ser negativo." });
  if (snapshot.newLeads < 0 || snapshot.newLeads > snapshot.totalLeads) issues.push({ field: "newLeads", message: "Novos leads devem ficar entre zero e o total acumulado." });

  const optionalFields: LeadProfileCountField[] = [
    ...PARTICIPATION_FIELDS.map(field => field.key),
    ...INTEREST_FIELDS.map(field => field.key),
    "singleInterestCount",
    "multipleInterestsCount",
  ];
  optionalFields.forEach(field => {
    const value = snapshot[field];
    if (value !== null && (value < 0 || value > snapshot.totalLeads)) issues.push({ field, message: "O valor deve ficar entre zero e o total de leads da fotografia." });
  });

  const participationTotal = PARTICIPATION_FIELDS.reduce((total, field) => total + (snapshot[field.key] ?? 0), 0);
  if (participationTotal > snapshot.totalLeads) issues.push({ field: "participation", message: "A soma do histórico de participação não pode ultrapassar o total de leads." });

  const affinityTotal = (snapshot.singleInterestCount ?? 0) + (snapshot.multipleInterestsCount ?? 0);
  if (affinityTotal > snapshot.totalLeads) issues.push({ field: "affinity", message: "A soma dos perfis de interesse único e múltiplo não pode ultrapassar o total de leads." });

  const normalizedCities = snapshot.topCities.map(item => ({ city: item.city.trim(), count: item.count })).filter(item => item.city || item.count > 0);
  if (normalizedCities.length > 5) issues.push({ field: "topCities", message: "Informe no máximo cinco cidades." });
  if (normalizedCities.some(item => !item.city || item.count < 0 || item.count > snapshot.totalLeads)) issues.push({ field: "topCities", message: "Cada cidade precisa de nome e quantidade válida." });
  if (normalizedCities.reduce((total, item) => total + item.count, 0) > snapshot.totalLeads) issues.push({ field: "topCities", message: "A soma das cidades não pode ultrapassar o total de leads." });
  return issues;
}

export function normalizeCities(cities: CityBreakdown[]) {
  return cities.map(item => ({ city: item.city.trim(), count: item.count })).filter(item => item.city || item.count > 0).slice(0, 5);
}

export function parseCities(value: string): CityBreakdown[] {
  try {
    const parsed = JSON.parse(value) as CityBreakdown[];
    return Array.isArray(parsed) ? parsed.filter(item => typeof item?.city === "string" && Number.isInteger(item?.count)) : [];
  } catch {
    return [];
  }
}
