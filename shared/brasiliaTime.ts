export const BRASILIA_TIME_ZONE = "America/Sao_Paulo";

function datePartsInBrasilia(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BRASILIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const read = (type: "year" | "month" | "day") => parts.find(part => part.type === type)?.value ?? "";
  return { year: read("year"), month: read("month"), day: read("day") };
}

export function brasiliaCivilDate(date = new Date()) {
  const { year, month, day } = datePartsInBrasilia(date);
  return `${year}-${month}-${day}`;
}

export function firstDayOfBrasiliaMonth(date = new Date()) {
  return `${brasiliaCivilDate(date).slice(0, 7)}-01`;
}

export function civilDateToUtcNoon(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return Number.NaN;
  return Date.parse(`${value}T12:00:00.000Z`);
}

export function civilDateFromUtcNoon(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

export function addDaysToCivilDate(value: string, days: number) {
  const timestamp = civilDateToUtcNoon(value);
  if (!Number.isFinite(timestamp)) return "";
  return civilDateFromUtcNoon(timestamp + days * 86_400_000);
}

export function formatCivilDateBR(value: number) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

export function formatTimestampInBrasilia(value: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRASILIA_TIME_ZONE,
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false,
  }).format(new Date(value));
}
