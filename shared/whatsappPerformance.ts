import type { SocialMonthKey } from "./socialMetrics";

export const WHATSAPP_MONTHS = [
  { key: "2026-09", label: "Set/26" },
  { key: "2026-10", label: "Out/26" },
  { key: "2026-11", label: "Nov/26" },
  { key: "2026-12", label: "Dez/26" },
  { key: "2027-01", label: "Jan/27" },
  { key: "2027-02", label: "Fev/27" },
  { key: "2027-03", label: "Mar/27" },
  { key: "2027-04", label: "Abr/27" },
] as const satisfies ReadonlyArray<{ key: SocialMonthKey; label: string }>;

export const WHATSAPP_RESULT_FIELDS = ["delivered", "linkClicks", "replies", "optOuts", "attributedPurchases", "humanHandoffs"] as const;
export type WhatsAppResultField = typeof WHATSAPP_RESULT_FIELDS[number];
export type WhatsAppMonthlyResult = Record<WhatsAppResultField, number | null> & { monthKey: SocialMonthKey; note: string; updatedAt?: number };

export function getLatestWhatsAppResult<T extends Pick<WhatsAppMonthlyResult, "monthKey">>(entries: T[]) {
  return [...entries].sort((a, b) => b.monthKey.localeCompare(a.monthKey))[0] ?? null;
}
