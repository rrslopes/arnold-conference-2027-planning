export const MASTERCLASS_LP_SOURCE = {
  key: "masterclass-lp" as const,
  label: "LP das masterclasses",
  url: "https://masterclassconference.savagetgroup.com.br/",
  thankYouUrl: "https://masterclassconference.savagetgroup.com.br/obrigado",
};

export const MASTERCLASS_LESSONS = [
  { key: "ana" as const, speaker: "Ana Paula Pujol", congress: "Nutrição Estética" },
  { key: "andreia" as const, speaker: "Andreia Naves", congress: "Nutrição Esportiva" },
  { key: "roberto" as const, speaker: "Roberto Tranjan", congress: "Gestão de Academias" },
];

export type MasterclassLandingSnapshotDraft = {
  id?: number;
  periodStartAt: number;
  periodEndAt: number;
  totalLeads: number;
  newLeads: number;
  sessions: number | null;
  dmSessions: number | null;
  formStarts: number | null;
  dmConversions: number | null;
  thankYouPageAccesses: number | null;
  anaLessonStarts: number | null;
  anaLessonCompletions: number | null;
  andreiaLessonStarts: number | null;
  andreiaLessonCompletions: number | null;
  robertoLessonStarts: number | null;
  robertoLessonCompletions: number | null;
  congressHubClicks: number | null;
  newsLpClicks: number | null;
  salesPageClicks: number | null;
  note: string;
};

export type MasterclassLandingSnapshot = MasterclassLandingSnapshotDraft & {
  id: number;
  updatedAt: number;
};

export type MasterclassLandingIssue = {
  field: keyof MasterclassLandingSnapshotDraft | "period";
  message: string;
};

const optionalCountFields: Array<keyof MasterclassLandingSnapshotDraft> = [
  "sessions",
  "dmSessions",
  "formStarts",
  "dmConversions",
  "thankYouPageAccesses",
  "anaLessonStarts",
  "anaLessonCompletions",
  "andreiaLessonStarts",
  "andreiaLessonCompletions",
  "robertoLessonStarts",
  "robertoLessonCompletions",
  "congressHubClicks",
  "newsLpClicks",
  "salesPageClicks",
];

function isCount(value: unknown) {
  return Number.isInteger(value) && Number(value) >= 0;
}

export function calculateRate(numerator: number | null, denominator: number | null) {
  if (numerator === null || denominator === null || denominator <= 0) return null;
  return (numerator / denominator) * 100;
}

export function calculateAbandonments(formStarts: number | null, leads: number) {
  if (formStarts === null || formStarts < leads) return null;
  return formStarts - leads;
}

export function getLatestMasterclassSnapshot<T extends Pick<MasterclassLandingSnapshot, "periodEndAt" | "updatedAt">>(rows: T[]) {
  return [...rows].sort((a, b) => b.periodEndAt - a.periodEndAt || b.updatedAt - a.updatedAt)[0] ?? null;
}

export function getLessonPerformance(snapshot: MasterclassLandingSnapshotDraft) {
  return MASTERCLASS_LESSONS.map(lesson => {
    const startsKey = `${lesson.key}LessonStarts` as const;
    const completionsKey = `${lesson.key}LessonCompletions` as const;
    const starts = snapshot[startsKey] as number | null;
    const completions = snapshot[completionsKey] as number | null;
    return { ...lesson, starts, completions, completionRate: calculateRate(completions, starts) };
  });
}

export function validateMasterclassLandingSnapshot(snapshot: MasterclassLandingSnapshotDraft) {
  const issues: MasterclassLandingIssue[] = [];
  if (!Number.isFinite(snapshot.periodStartAt) || !Number.isFinite(snapshot.periodEndAt) || snapshot.periodStartAt > snapshot.periodEndAt) {
    issues.push({ field: "period", message: "Informe um período válido." });
  }
  if (!isCount(snapshot.totalLeads)) issues.push({ field: "totalLeads", message: "O total acumulado deve ser um número inteiro não negativo." });
  if (!isCount(snapshot.newLeads)) issues.push({ field: "newLeads", message: "Os novos leads devem ser um número inteiro não negativo." });
  if (isCount(snapshot.totalLeads) && isCount(snapshot.newLeads) && snapshot.newLeads > snapshot.totalLeads) {
    issues.push({ field: "newLeads", message: "Novos leads não podem superar o total acumulado." });
  }
  optionalCountFields.forEach(field => {
    const value = snapshot[field];
    if (value !== null && !isCount(value)) issues.push({ field, message: "Use somente números inteiros não negativos ou deixe em branco." });
  });
  MASTERCLASS_LESSONS.forEach(lesson => {
    const starts = snapshot[`${lesson.key}LessonStarts` as const] as number | null;
    const completions = snapshot[`${lesson.key}LessonCompletions` as const] as number | null;
    if (starts !== null && completions !== null && completions > starts) {
      issues.push({ field: `${lesson.key}LessonCompletions` as keyof MasterclassLandingSnapshotDraft, message: `Conclusões de ${lesson.speaker} não podem superar os inícios.` });
    }
  });
  return issues;
}
