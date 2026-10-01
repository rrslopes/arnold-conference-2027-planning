import { brasiliaCivilDate } from "../shared/brasiliaTime";
import { NEWS_LP_SOURCE } from "../shared/leadProfile";
import { MASTERCLASS_LP_SOURCE } from "../shared/masterclassLanding";
import { getLandingMonthlyBlocks, saveLandingMonthlyBlock, type LandingSource } from "./db";
import { fetchLovableMasterclassMetrics, mapLovableMetricsToSnapshot } from "./integrations/lovableMasterclassMetrics";
import { fetchLovableNewsMetrics, mapLovableNewsMetricsToSnapshot } from "./integrations/lovableNewsMetrics";

export const FIRST_LANDING_MONTH = "2026-09";
export const LANDING_SOURCES = [NEWS_LP_SOURCE.key, MASTERCLASS_LP_SOURCE.key] as const;

export function endOfCivilMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) throw new Error("Mês inválido.");
  return new Date(Date.UTC(year, month, 0, 12)).toISOString().slice(0, 10);
}

export function previousCivilMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 2, 1, 12)).toISOString().slice(0, 7);
}

export function nextCivilMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month, 1, 12)).toISOString().slice(0, 7);
}

export async function syncLandingMonth(sourceKey: LandingSource, monthKey: string, to: string, close = false, allowClosed = false) {
  const today = brasiliaCivilDate();
  const from = `${monthKey}-01`;
  if (monthKey < FIRST_LANDING_MONTH || to.slice(0, 7) !== monthKey || to < from || to > today) throw new Error("O período mensal solicitado é inválido em Brasília.");
  if (close && to !== endOfCivilMonth(monthKey)) throw new Error("Só é possível fechar após consultar o mês completo.");
  const existing = (await getLandingMonthlyBlocks(sourceKey)).find(block => block.monthKey === monthKey);
  if (existing?.status === "closed" && !allowClosed) throw new Error(`O mês ${monthKey} está fechado. Solicite explicitamente a ressincronização do mês fechado.`);
  const entry = sourceKey === MASTERCLASS_LP_SOURCE.key
    ? mapLovableMetricsToSnapshot(await fetchLovableMasterclassMetrics(from, to))
    : mapLovableNewsMetricsToSnapshot(await fetchLovableNewsMetrics(from, to));
  return saveLandingMonthlyBlock(sourceKey, monthKey, entry, close ? "closed" : "open", allowClosed);
}

/** Fechar todos os meses anteriores pendentes antes de abrir/atualizar o mês corrente. */
export async function syncCurrentLandingMonth(sourceKey: LandingSource, date = new Date()) {
  const today = brasiliaCivilDate(date);
  const currentMonth = today.slice(0, 7);
  if (currentMonth < FIRST_LANDING_MONTH) throw new Error("Os blocos mensais começam em setembro de 2026.");
  const existing = await getLandingMonthlyBlocks(sourceKey);
  const byMonth = new Map(existing.map(block => [block.monthKey, block]));
  const closed: string[] = [];
  for (let monthKey = FIRST_LANDING_MONTH; monthKey < currentMonth; monthKey = nextCivilMonth(monthKey)) {
    if (byMonth.get(monthKey)?.status === "closed") continue;
    await syncLandingMonth(sourceKey, monthKey, endOfCivilMonth(monthKey), true);
    closed.push(monthKey);
  }
  const current = await syncLandingMonth(sourceKey, currentMonth, today);
  return { ...current, from: `${currentMonth}-01`, to: today, closed };
}
