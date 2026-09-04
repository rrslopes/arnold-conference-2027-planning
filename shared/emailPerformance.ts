export const EMAIL_PERFORMANCE_WEIGHTS = {
  openRate: 0.3,
  clickRate: 0.7,
  unsubscribePenalty: 2,
  spamPenalty: 20,
} as const;

export const EMAIL_RATE_FIELDS = ["openRate", "clickRate", "unsubscribeRate", "spamRate"] as const;

export type EmailRateField = typeof EMAIL_RATE_FIELDS[number];

export type EmailPerformanceValues = Record<EmailRateField, number | null>;

export type EmailPerformanceEntry = EmailPerformanceValues & {
  id: number;
  campaignName: string;
  subject: string;
  sentAt: number;
  emailUrl: string;
  updatedAt: number;
};

export type EmailPerformanceDraft = Omit<EmailPerformanceEntry, "id" | "updatedAt"> & { id?: number };

export type EmailPerformanceRanked = EmailPerformanceEntry & {
  score: number | null;
  position: number | null;
};

export function isValidSentEmailUrl(value: string) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function hasCompleteEmailRates(values: EmailPerformanceValues) {
  return EMAIL_RATE_FIELDS.every(field => values[field] !== null && Number.isFinite(values[field]) && values[field]! >= 0 && values[field]! <= 100);
}

export function calculateEmailPerformanceScore(values: EmailPerformanceValues) {
  if (!hasCompleteEmailRates(values)) return null;
  const score =
    values.openRate! * EMAIL_PERFORMANCE_WEIGHTS.openRate +
    values.clickRate! * EMAIL_PERFORMANCE_WEIGHTS.clickRate -
    values.unsubscribeRate! * EMAIL_PERFORMANCE_WEIGHTS.unsubscribePenalty -
    values.spamRate! * EMAIL_PERFORMANCE_WEIGHTS.spamPenalty;
  return Math.round(Math.max(0, Math.min(100, score)) * 100) / 100;
}

export function rankEmailPerformance(entries: EmailPerformanceEntry[]): EmailPerformanceRanked[] {
  const ranked = entries
    .map(entry => ({ ...entry, score: calculateEmailPerformanceScore(entry) }))
    .sort((a, b) => {
      if (a.score === null && b.score !== null) return 1;
      if (a.score !== null && b.score === null) return -1;
      if (a.score !== null && b.score !== null && a.score !== b.score) return b.score - a.score;
      if (a.clickRate !== b.clickRate) return (b.clickRate ?? -1) - (a.clickRate ?? -1);
      if (a.spamRate !== b.spamRate) return (a.spamRate ?? Number.POSITIVE_INFINITY) - (b.spamRate ?? Number.POSITIVE_INFINITY);
      if (a.unsubscribeRate !== b.unsubscribeRate) return (a.unsubscribeRate ?? Number.POSITIVE_INFINITY) - (b.unsubscribeRate ?? Number.POSITIVE_INFINITY);
      if (a.openRate !== b.openRate) return (b.openRate ?? -1) - (a.openRate ?? -1);
      return b.sentAt - a.sentAt;
    });

  let position = 0;
  return ranked.map(entry => {
    if (entry.score === null) return { ...entry, position: null };
    position += 1;
    return { ...entry, position };
  });
}

export function toStoredRate(value: number | null) {
  return value === null ? null : Math.round(value * 1_000);
}

export function fromStoredRate(value: number | null) {
  return value === null ? null : value / 1_000;
}
