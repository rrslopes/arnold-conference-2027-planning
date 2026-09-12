import { z } from "zod";
import { ENV } from "../_core/env";
import { MASTERCLASS_LP_SOURCE } from "../../shared/masterclassLanding";
import { civilDateToUtcNoon } from "../../shared/brasiliaTime";

export const LOVABLE_MASTERCLASS_METRICS_URL = "https://masterclassconference.savagetgroup.com.br/api/public/metrics";

const count = z.number().int().min(0).max(100_000_000);
const lesson = z.object({
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  palestrante: z.string().min(1).max(180),
  area: z.string().min(1).max(180),
  inicios: count,
  conclusoes: count,
  espectadores: count,
  percentual_medio_assistido: z.number().int().min(0).max(100),
});

export const lovableMasterclassMetricsSchema = z.object({
  origem: z.literal("LP das Masterclasses"),
  periodo: z.object({
    inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  atualizado_em: z.string().datetime(),
  trafego_e_captacao: z.object({
    sessoes_na_lp: count,
    inicios_de_formulario: count,
    acessos_pagina_obrigado: count,
    novos_leads_no_periodo: count,
    pessoas_unicas_no_periodo: count,
    total_acumulado_de_leads: count,
    total_acumulado_pessoas_unicas: count,
    conversao_sessao_lead: z.number().min(0).max(1).nullable(),
  }),
  consumo_das_aulas: z.array(lesson).max(100),
  avanco_no_funil: z.object({
    cliques_para_lp_de_novidades: count,
    cliques_para_os_congressos: count,
    cliques_para_compra: count,
  }),
  origens: z.array(z.object({
    canal: z.string().trim().min(1).max(80),
    sessoes: count,
    leads: count,
  })).max(100),
}).superRefine((payload, ctx) => {
  const slugs = new Set(payload.consumo_das_aulas.map(item => item.slug));
  if (slugs.size !== payload.consumo_das_aulas.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consumo_das_aulas"], message: "Cada aula precisa ter um slug único." });
  payload.consumo_das_aulas.forEach((item, index) => {
    if (item.conclusoes > item.inicios) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consumo_das_aulas", index, "conclusoes"], message: "Conclusões não podem ultrapassar inícios." });
    if (item.espectadores > item.inicios) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consumo_das_aulas", index, "espectadores"], message: "Espectadores não podem ultrapassar inícios." });
  });
  if (payload.trafego_e_captacao.novos_leads_no_periodo > payload.trafego_e_captacao.total_acumulado_de_leads) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["trafego_e_captacao", "novos_leads_no_periodo"], message: "Novos leads não podem ultrapassar o total acumulado." });
  }
  if (payload.trafego_e_captacao.pessoas_unicas_no_periodo > payload.trafego_e_captacao.novos_leads_no_periodo) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["trafego_e_captacao", "pessoas_unicas_no_periodo"], message: "Pessoas únicas não podem ultrapassar as inscrições brutas do período." });
  }
  if (payload.trafego_e_captacao.total_acumulado_pessoas_unicas > payload.trafego_e_captacao.total_acumulado_de_leads) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["trafego_e_captacao", "total_acumulado_pessoas_unicas"], message: "Pessoas únicas acumuladas não podem ultrapassar as inscrições brutas acumuladas." });
  }
  if (payload.trafego_e_captacao.pessoas_unicas_no_periodo > payload.trafego_e_captacao.total_acumulado_pessoas_unicas) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["trafego_e_captacao", "pessoas_unicas_no_periodo"], message: "Pessoas únicas do período não podem ultrapassar o total acumulado de pessoas únicas." });
  }
});

export type LovableMasterclassMetrics = z.infer<typeof lovableMasterclassMetricsSchema>;

export async function fetchLovableMasterclassMetrics(from: string, to: string) {
  if (!ENV.lovableMasterclassMetricsToken) throw new Error("Integração Lovable ainda não configurada.");
  const url = new URL(LOVABLE_MASTERCLASS_METRICS_URL);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${ENV.lovableMasterclassMetricsToken}` },
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new Error("Não foi possível alcançar o endpoint da LP. Tente novamente.");
  }

  if (response.status === 401 || response.status === 403) throw new Error("O token da integração foi recusado pelo endpoint Lovable.");
  if (!response.ok) throw new Error(`O endpoint da LP respondeu com status ${response.status}.`);

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("O endpoint da LP não retornou um JSON válido.");
  }
  const parsed = lovableMasterclassMetricsSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("[LovableMasterclassMetrics] Resposta recusada pela validação de segurança", {
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
  if (parsed.data.periodo.inicio !== from || parsed.data.periodo.fim !== to) throw new Error("O período retornado pelo endpoint difere do período solicitado.");
  return parsed.data;
}

export function mapLovableMetricsToSnapshot(payload: LovableMasterclassMetrics) {
  const lessons = new Map(payload.consumo_das_aulas.map(item => [item.slug, item]));
  const andreia = lessons.get("nutricao-esportiva");
  const ana = lessons.get("nutricao-estetica");
  const roberto = lessons.get("gestao-de-academias");
  const instagramDm = payload.origens.find(item => item.canal === "instagram_dm");

  return {
    sourceKey: MASTERCLASS_LP_SOURCE.key,
    periodStartAt: civilDateToUtcNoon(payload.periodo.inicio),
    periodEndAt: civilDateToUtcNoon(payload.periodo.fim),
    totalLeads: payload.trafego_e_captacao.total_acumulado_de_leads,
    newLeads: payload.trafego_e_captacao.novos_leads_no_periodo,
    uniquePeopleInPeriod: payload.trafego_e_captacao.pessoas_unicas_no_periodo,
    totalUniquePeople: payload.trafego_e_captacao.total_acumulado_pessoas_unicas,
    sessions: payload.trafego_e_captacao.sessoes_na_lp,
    dmSessions: instagramDm?.sessoes ?? null,
    formStarts: payload.trafego_e_captacao.inicios_de_formulario,
    dmConversions: instagramDm?.leads ?? null,
    thankYouPageAccesses: payload.trafego_e_captacao.acessos_pagina_obrigado,
    anaLessonStarts: ana?.inicios ?? null,
    anaLessonCompletions: ana?.conclusoes ?? null,
    anaUniqueViewers: ana?.espectadores ?? null,
    anaAverageWatchPercent: ana?.percentual_medio_assistido ?? null,
    andreiaLessonStarts: andreia?.inicios ?? null,
    andreiaLessonCompletions: andreia?.conclusoes ?? null,
    andreiaUniqueViewers: andreia?.espectadores ?? null,
    andreiaAverageWatchPercent: andreia?.percentual_medio_assistido ?? null,
    robertoLessonStarts: roberto?.inicios ?? null,
    robertoLessonCompletions: roberto?.conclusoes ?? null,
    robertoUniqueViewers: roberto?.espectadores ?? null,
    robertoAverageWatchPercent: roberto?.percentual_medio_assistido ?? null,
    congressHubClicks: payload.avanco_no_funil.cliques_para_os_congressos,
    newsLpClicks: payload.avanco_no_funil.cliques_para_lp_de_novidades,
    salesPageClicks: payload.avanco_no_funil.cliques_para_compra,
    originsJson: JSON.stringify(payload.origens.map(item => ({ channel: item.canal, sessions: item.sessoes, leads: item.leads }))),
    syncSource: "lovable-api",
    providerUpdatedAt: Date.parse(payload.atualizado_em),
    note: "Dados agregados sincronizados do endpoint oficial da LP das masterclasses.",
  };
}
