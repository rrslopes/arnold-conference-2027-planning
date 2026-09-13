import { z } from "zod";
import { ENV } from "../_core/env";
import {
  INTEREST_FIELDS,
  NEWS_DAILY_SYNC_SOURCE,
  NEWS_LP_SOURCE,
  NEWS_ROLLUP_SYNC_SOURCE,
  PARTICIPATION_FIELDS,
  type LeadProfileSnapshotKind,
} from "../../shared/leadProfile";
import { civilDateToUtcNoon } from "../../shared/brasiliaTime";

export const LOVABLE_NEWS_METRICS_URL = "https://masterclassconference.savagetgroup.com.br/api/public/metrics-novidades";

const count = z.number().int().min(0).max(100_000_000);
const percent = z.number().min(0).max(100);
const breakdown = z.object({ opcao: z.string().trim().min(1).max(180), pessoas: count, percentual: percent }).strict();
const channelConversions = z.object({ canal: z.string().trim().min(1).max(80), conversoes: count }).strict();
const clickOrigin = z.object({ canal: z.string().trim().min(1).max(80), cliques: count }).strict();

export type NewsRejectedField = {
  field: string;
  value: string;
  reason: string;
};

function valueAtPath(payload: unknown, path: Array<string | number>) {
  return path.reduce<unknown>((current, segment) => {
    if (current === null || typeof current !== "object") return undefined;
    return (current as Record<string | number, unknown>)[segment];
  }, payload);
}

function readablePath(payload: unknown, path: Array<string | number>) {
  return path.reduce<string>((label, segment, index) => {
    if (typeof segment === "number") {
      const parent = valueAtPath(payload, path.slice(0, index));
      const item = Array.isArray(parent) ? parent[segment] : undefined;
      const itemLabel = item && typeof item === "object"
        ? "opcao" in item
          ? String((item as { opcao: unknown }).opcao)
          : "canal" in item
            ? String((item as { canal: unknown }).canal)
            : null
        : null;
      return `${label}[${itemLabel || segment}]`;
    }
    return label ? `${label}.${segment}` : segment;
  }, "");
}

function readableValue(value: unknown) {
  if (value === undefined) return "ausente";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value.length > 100 ? `${value.slice(0, 97)}...` : value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `lista com ${value.length} item(ns)`;
  return "objeto recebido";
}

function readableReason(issue: z.ZodIssue) {
  if (issue.code === "unrecognized_keys") return `Campos não previstos no contrato: ${issue.keys.join(", ")}.`;
  return issue.message;
}

export function diagnoseNewsContractIssues(payload: unknown, issues: z.ZodIssue[]): NewsRejectedField[] {
  return issues.slice(0, 10).map(issue => {
    const path = issue.path.filter((segment): segment is string | number => typeof segment === "string" || typeof segment === "number");
    return {
      field: readablePath(payload, path) || "resposta",
      value: readableValue(valueAtPath(payload, path)),
      reason: readableReason(issue),
    };
  });
}

export function formatNewsContractError(fields: NewsRejectedField[]) {
  const details = fields.map(item => `${item.field} = ${item.value} — ${item.reason}`).join("; ");
  return `Campos rejeitados: ${details}. Nenhuma fotografia foi alterada.`;
}

export const lovableNewsMetricsSchema = z.object({
  origem: z.literal("LP de Novidades 2027"),
  url: z.literal(NEWS_LP_SOURCE.url),
  periodo: z.object({
    inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fuso: z.literal("America/Sao_Paulo"),
  }).strict(),
  atualizado_em: z.string().datetime(),
  captacao: z.object({
    conversoes_no_periodo: count,
    pessoas_unicas_no_periodo: count,
    total_acumulado_conversoes: count,
    total_acumulado_pessoas_unicas: count,
  }).strict(),
  avanco_no_funil: z.object({
    cliques_vindos_da_masterclass: count,
    origens_dos_cliques: z.array(clickOrigin).max(100),
  }).strict(),
  origens: z.array(channelConversions).max(100),
  areas_de_interesse: z.array(z.object({ area: z.string().trim().min(1).max(180), pessoas: count, percentual: percent }).strict()).max(30),
  campos_personalizados: z.object({
    base_de_calculo: count,
    areas_de_interesse: z.array(breakdown).max(30),
    historico_no_arnold: z.array(breakdown),
    observacao: z.string().trim().min(1).max(2000),
    cidades: z.array(breakdown).max(20),
  }).strict(),
}).strict().superRefine((payload, ctx) => {
  const { captacao, campos_personalizados } = payload;
  if (payload.periodo.inicio > payload.periodo.fim) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodo", "inicio"], message: "O início deve ser anterior ao fim." });
  if (captacao.conversoes_no_periodo > captacao.total_acumulado_conversoes) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["captacao", "conversoes_no_periodo"], message: "Conversões do período não podem superar o acumulado." });
  if (captacao.pessoas_unicas_no_periodo > captacao.conversoes_no_periodo) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["captacao", "pessoas_unicas_no_periodo"], message: "Pessoas únicas não podem superar conversões brutas." });
  if (captacao.total_acumulado_pessoas_unicas > captacao.total_acumulado_conversoes) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["captacao", "total_acumulado_pessoas_unicas"], message: "Pessoas únicas acumuladas não podem superar conversões acumuladas." });
  const validProfileBases = new Set([
    captacao.pessoas_unicas_no_periodo,
    captacao.conversoes_no_periodo,
  ]);
  if (!validProfileBases.has(campos_personalizados.base_de_calculo)) ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path: ["campos_personalizados", "base_de_calculo"],
    message: "A base do perfil deve corresponder às pessoas únicas ou às respostas do período.",
  });
  const topAreas = payload.areas_de_interesse.map(item => `${item.area}:${item.pessoas}`).sort();
  const profileAreas = campos_personalizados.areas_de_interesse.map(item => `${item.opcao}:${item.pessoas}`).sort();
  if (JSON.stringify(topAreas) !== JSON.stringify(profileAreas)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["areas_de_interesse"], message: "Os dois rankings de interesse precisam coincidir." });
  campos_personalizados.historico_no_arnold.forEach((item, index) => {
    if (item.pessoas > campos_personalizados.base_de_calculo) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["campos_personalizados", "historico_no_arnold", index], message: "Histórico não pode superar a base do perfil." });
  });
});

export type LovableNewsMetrics = z.infer<typeof lovableNewsMetricsSchema>;

const RETRYABLE_HTTP_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

async function fetchLovableNewsResponse(url: URL) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${ENV.lovableMetricsApiToken}` },
        signal: AbortSignal.timeout(12_000),
      });
      if (!RETRYABLE_HTTP_STATUS.has(response.status) || attempt === 3) return response;
    } catch (error) {
      lastError = error;
      if (attempt === 3) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, attempt * 250));
  }
  throw lastError;
}

export async function fetchLovableNewsMetrics(from: string, to: string) {
  if (!ENV.lovableMetricsApiToken) throw new Error("Integração Lovable ainda não configurada.");
  const url = new URL(LOVABLE_NEWS_METRICS_URL);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
  let response: Response;
  try {
    response = await fetchLovableNewsResponse(url);
  } catch {
    throw new Error("Não foi possível consultar a LP de novidades após 3 tentativas. Nenhuma fotografia foi alterada.");
  }
  if (!response.ok) throw new Error(response.status === 401 ? "Credencial da integração Lovable recusada." : `A LP de novidades respondeu com status ${response.status}.`);
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("A LP de novidades não retornou um JSON válido. Nenhuma fotografia foi alterada.");
  }
  const parsed = lovableNewsMetricsSchema.safeParse(payload);
  if (!parsed.success) {
    const rejectedFields = diagnoseNewsContractIssues(payload, parsed.error.issues);
    console.error("[LovableNewsMetrics] Resposta recusada pela validação de segurança", {
      from,
      to,
      issues: rejectedFields,
    });
    throw new Error(formatNewsContractError(rejectedFields));
  }
  if (parsed.data.periodo.inicio !== from || parsed.data.periodo.fim !== to) throw new Error("O período devolvido pela LP não corresponde ao período solicitado.");
  return parsed.data;
}

function countByOption(items: Array<{ opcao: string; pessoas: number }>, label: string) {
  return items.find(item => item.opcao === label)?.pessoas ?? null;
}

export function mapLovableNewsMetricsToSnapshot(payload: LovableNewsMetrics, kind: LeadProfileSnapshotKind = "rollup") {
  const profile = payload.campos_personalizados;
  const interests = Object.fromEntries(INTEREST_FIELDS.map(field => [field.key, countByOption(profile.areas_de_interesse, field.label)]));
  const participation = Object.fromEntries(PARTICIPATION_FIELDS.map(field => [field.key, countByOption(profile.historico_no_arnold, field.sourceLabel)]));
  const dmConversions = payload.origens.find(item => item.canal === "instagram_dm")?.conversoes ?? null;
  return {
    sourceKey: NEWS_LP_SOURCE.key,
    periodStartAt: civilDateToUtcNoon(payload.periodo.inicio),
    periodEndAt: civilDateToUtcNoon(payload.periodo.fim),
    totalLeads: payload.captacao.total_acumulado_conversoes,
    newLeads: payload.captacao.conversoes_no_periodo,
    uniquePeopleInPeriod: payload.captacao.pessoas_unicas_no_periodo,
    totalUniquePeople: payload.captacao.total_acumulado_pessoas_unicas,
    profileBaseCount: profile.base_de_calculo,
    sessions: null,
    dmSessions: null,
    formStarts: null,
    dmConversions,
    ...participation,
    ...interests,
    singleInterestCount: null,
    multipleInterestsCount: null,
    topCitiesJson: JSON.stringify(profile.cidades),
    originsJson: JSON.stringify(payload.origens),
    masterclassClicks: payload.avanco_no_funil.cliques_vindos_da_masterclass,
    masterclassClickOriginsJson: JSON.stringify(payload.avanco_no_funil.origens_dos_cliques),
    syncSource: kind === "daily" ? NEWS_DAILY_SYNC_SOURCE : kind === "rollup" ? NEWS_ROLLUP_SYNC_SOURCE : "manual",
    providerUpdatedAt: Date.parse(payload.atualizado_em),
    providerObservation: profile.observacao,
    note: "Dados agregados sincronizados do endpoint oficial da LP de novidades.",
  };
}

function listCivilDates(from: string, to: string) {
  const dates: string[] = [];
  const cursor = new Date(`${from}T12:00:00.000Z`);
  const limit = new Date(`${to}T12:00:00.000Z`);
  while (cursor <= limit) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export async function fetchLovableNewsOfficialSeries(
  from: string,
  to: string,
  options: { existingDaily?: Array<{ date: string; conversions: number }>; refreshRecentDays?: number } = {},
) {
  const dates = listCivilDates(from, to);
  if (!dates.length || dates.length > 120) throw new Error("O lote diário deve conter entre 1 e 120 dias.");
  const existingConversions = new Map((options.existingDaily ?? []).map(item => [item.date, item.conversions]));
  const refreshRecentDays = Math.max(1, Math.min(options.refreshRecentDays ?? 3, dates.length));
  const recentDates = new Set(dates.slice(-refreshRecentDays));
  const datesToFetch = dates.filter(date => !existingConversions.has(date) || recentDates.has(date));
  const dailyPayloads: LovableNewsMetrics[] = [];
  for (const date of datesToFetch) {
    dailyPayloads.push(await fetchLovableNewsMetrics(date, date));
  }
  const rollupPayload = await fetchLovableNewsMetrics(from, to);
  const conversionsByDate = new Map(existingConversions);
  dailyPayloads.forEach(payload => conversionsByDate.set(payload.periodo.inicio, payload.captacao.conversoes_no_periodo));
  let dailyConversions = dates.reduce((total, date) => total + (conversionsByDate.get(date) ?? 0), 0);
  if (dailyConversions !== rollupPayload.captacao.conversoes_no_periodo) {
    const fetchedDates = new Set(dailyPayloads.map(payload => payload.periodo.inicio));
    for (const date of dates) {
      if (fetchedDates.has(date)) continue;
      const payload = await fetchLovableNewsMetrics(date, date);
      dailyPayloads.push(payload);
      conversionsByDate.set(date, payload.captacao.conversoes_no_periodo);
    }
    dailyConversions = dates.reduce((total, date) => total + (conversionsByDate.get(date) ?? 0), 0);
  }
  if (dailyConversions !== rollupPayload.captacao.conversoes_no_periodo) {
    throw new Error("A soma diária não coincide com o consolidado. Nenhum dado foi salvo.");
  }
  return {
    daily: dailyPayloads.map(payload => mapLovableNewsMetricsToSnapshot(payload, "daily")),
    rollup: mapLovableNewsMetricsToSnapshot(rollupPayload, "rollup"),
    totalDailyCount: dates.length,
    fetchedDailyCount: dailyPayloads.length,
    reusedDailyCount: dates.length - dailyPayloads.length,
  };
}
