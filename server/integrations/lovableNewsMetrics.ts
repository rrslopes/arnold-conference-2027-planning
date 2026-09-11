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
    historico_no_arnold: z.array(breakdown).max(10),
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

export async function fetchLovableNewsMetrics(from: string, to: string) {
  if (!ENV.lovableMetricsApiToken) throw new Error("Integração Lovable ainda não configurada.");
  const url = new URL(LOVABLE_NEWS_METRICS_URL);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${ENV.lovableMetricsApiToken}` },
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new Error("Não foi possível consultar a LP de novidades.");
  }
  if (!response.ok) throw new Error(response.status === 401 ? "Credencial da integração Lovable recusada." : `A LP de novidades respondeu com status ${response.status}.`);
  const parsed = lovableNewsMetricsSchema.safeParse(await response.json());
  if (!parsed.success) {
    console.error("[LovableNewsMetrics] Resposta recusada pela validação de segurança", {
      from,
      to,
      issues: parsed.error.issues.slice(0, 5).map(issue => ({
        path: issue.path.join("."),
        code: issue.code,
        message: issue.message,
      })),
    });
    throw new Error("O Lovable enviou dados fora das regras esperadas. A atualização foi interrompida e os dados anteriores continuam preservados.");
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

export async function fetchLovableNewsOfficialSeries(from: string, to: string) {
  const dates = listCivilDates(from, to);
  if (!dates.length || dates.length > 120) throw new Error("O lote diário deve conter entre 1 e 120 dias.");
  const dailyPayloads: LovableNewsMetrics[] = [];
  for (let offset = 0; offset < dates.length; offset += 4) {
    const batch = dates.slice(offset, offset + 4);
    dailyPayloads.push(...await Promise.all(batch.map(date => fetchLovableNewsMetrics(date, date))));
  }
  const rollupPayload = await fetchLovableNewsMetrics(from, to);
  const dailyConversions = dailyPayloads.reduce((total, payload) => total + payload.captacao.conversoes_no_periodo, 0);
  if (dailyConversions !== rollupPayload.captacao.conversoes_no_periodo) {
    throw new Error("A soma diária não coincide com o consolidado. Nenhum dado foi salvo.");
  }
  return {
    daily: dailyPayloads.map(payload => mapLovableNewsMetricsToSnapshot(payload, "daily")),
    rollup: mapLovableNewsMetricsToSnapshot(rollupPayload, "rollup"),
  };
}
