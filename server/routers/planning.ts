import { z } from "zod";
import {
  clearMetricProgress,
  clearObjectiveProgress,
  deleteEmailPerformance,
  deleteLeadProfileSnapshot,
  deleteMasterclassLandingSnapshot,
  getSharedPlanningState,
  saveCalendarWorkflow,
  saveEmailPerformance,
  saveEmailWorkflow,
  saveLeadProfileSnapshot,
  saveMasterclassLandingSnapshot,
  saveMetricProgress,
  saveObjectiveProgress,
  saveOccupancyProgress,
  saveSocialMonthlyResults,
  saveWhatsAppMonthlyResults,
  upsertSyncedMasterclassLandingSnapshot,
  upsertSyncedLeadProfileSnapshot,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { fetchLovableMasterclassMetrics, mapLovableMetricsToSnapshot } from "../integrations/lovableMasterclassMetrics";
import { fetchLovableNewsMetrics, mapLovableNewsMetricsToSnapshot } from "../integrations/lovableNewsMetrics";
import { EDITORIAL_STATUS_IDS, isValidArtworkUrl } from "../../shared/editorialWorkflow";
import { EMAIL_STATUS_IDS, isValidEmailPreviewUrl } from "../../shared/emailWorkflow";
import { isValidSentEmailUrl } from "../../shared/emailPerformance";
import { brasiliaCivilDate, civilDateToUtcNoon } from "../../shared/brasiliaTime";

const sharedText = z.string().max(5000);
const actorName = z.string().trim().max(120).optional();

const objectiveEntry = z.object({
  key: z.string().min(1).max(80),
  target: sharedText,
  current: sharedText,
  note: sharedText,
  validated: z.boolean(),
});

const metricEntry = z.object({
  key: z.string().min(1).max(180),
  target: sharedText,
  actual: sharedText,
  note: sharedText,
  done: z.boolean(),
});

const congressKey = z.enum(["gestao-academias", "wttc", "sonafe", "nutricao-estetica", "nutricao-esportiva", "bodybuilding"]);
const monthKey = z.enum(["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"]);
const occupancyEntry = z.object({
  congressKey,
  capacity: z.number().int().min(1).max(100000).nullable(),
  expandedCapacity: z.number().int().min(1).max(100000).nullable(),
  expansionConfirmed: z.boolean(),
  expansionActive: z.boolean(),
  monthlySales: z.array(z.object({ monthKey, sold: z.number().int().min(0).max(100000) })).length(8),
}).superRefine((entry, ctx) => {
  if (entry.expansionActive && !entry.expandedCapacity) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expandedCapacity"], message: "Informe a capacidade ampliada antes de ativá-la." });
  }
  if (entry.expansionActive && !entry.expansionConfirmed) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expansionActive"], message: "Confirme operacionalmente a mudança para auditório antes de ativar a capacidade ampliada." });
  }
  if (entry.capacity && entry.expandedCapacity && entry.expandedCapacity <= entry.capacity) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expandedCapacity"], message: "A capacidade ampliada deve ser maior que a capacidade-base." });
  }
});

const optionalCount = z.number().int().min(0).max(100_000_000).nullable();
const socialMonthlyEntry = z.object({
  monthKey,
  periodStartAt: z.number().int().positive().nullable().default(null),
  periodEndAt: z.number().int().positive().nullable().default(null),
  isPartial: z.boolean().default(false),
  accountsReached: optionalCount,
  views: optionalCount,
  interactions: optionalCount,
  netFollowers: z.number().int().min(-100_000_000).max(100_000_000).nullable(),
  metaMessagesSent: optionalCount.default(null),
  reelsPublished: optionalCount,
  reelsMedianReach: optionalCount,
  reelsMedianViews: optionalCount,
  reelsMedianInteractions: optionalCount,
  reelsMedianLikes: optionalCount.default(null),
  reelsMedianComments: optionalCount.default(null),
  reelsMedianShares: optionalCount,
  reelsMedianSaves: optionalCount,
  carouselsPublished: optionalCount,
  carouselsMedianReach: optionalCount,
  carouselsMedianViews: optionalCount,
  carouselsMedianInteractions: optionalCount,
  carouselsMedianShares: optionalCount,
  carouselsMedianSaves: optionalCount,
  postsPublished: optionalCount.default(null),
  postsTypicalReach: optionalCount.default(null),
  postsTypicalViews: optionalCount.default(null),
  postsTypicalInteractions: optionalCount.default(null),
  postsTypicalLikes: optionalCount.default(null),
  postsTypicalComments: optionalCount.default(null),
  postsTypicalShares: optionalCount.default(null),
  postsTypicalSaves: optionalCount.default(null),
  storiesPublished: optionalCount,
  storiesMedianReach: optionalCount,
  storiesMedianViews: optionalCount,
  storiesTotalViews: optionalCount.default(null),
  storiesAverageViews: z.number().min(0).max(100_000_000).nullable().default(null),
  storiesBestViews: optionalCount.default(null),
  storyReplies: optionalCount,
  storyLinkClicks: optionalCount,
  storyStickerTaps: optionalCount,
  storyProfileVisits: optionalCount,
  note: z.string().max(2000),
}).superRefine((entry, ctx) => {
  if ((entry.periodStartAt === null) !== (entry.periodEndAt === null)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodStartAt"], message: "Informe o início e o fim do período." });
  if (entry.periodStartAt !== null && entry.periodEndAt !== null && entry.periodStartAt > entry.periodEndAt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodStartAt"], message: "O início do período deve ser anterior ao fim." });
  if (entry.isPartial && (entry.periodStartAt === null || entry.periodEndAt === null)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["isPartial"], message: "Um resultado parcial precisa informar o período coberto." });
});

const calendarWorkflowEntry = z.object({
  calendarItemId: z.string().regex(/^\d{4}[a-c]?$/).max(24),
  caption: z.string().max(5000),
  artworkUrl: z.string().trim().max(2048).refine(isValidArtworkUrl, "Informe um link HTTPS válido."),
  status: z.enum(EDITORIAL_STATUS_IDS),
});

const emailWorkflowEntry = z.object({
  emailItemId: z.string().regex(/^email-(base|nurture)-[a-z0-9-]+$/).max(48),
  previewUrl: z.string().trim().max(2048).refine(isValidEmailPreviewUrl, "Informe um link HTTPS válido."),
  status: z.enum(EMAIL_STATUS_IDS),
});

const optionalRate = z.number().min(0).max(100).nullable();
const emailPerformanceEntry = z.object({
  id: z.number().int().positive().optional(),
  campaignName: z.string().trim().min(1).max(180),
  subject: z.string().trim().min(1).max(255),
  sentAt: z.number().int().positive(),
  emailUrl: z.string().trim().max(2048).refine(isValidSentEmailUrl, "Informe um link HTTPS válido para o e-mail enviado."),
  openRate: optionalRate,
  clickRate: optionalRate,
  unsubscribeRate: optionalRate,
  spamRate: optionalRate,
  deliveredCount: optionalCount.default(null),
  uniqueClicks: optionalCount.default(null),
  attributedConversions: optionalCount.default(null),
  attributedRevenueCents: optionalCount.default(null),
}).superRefine((entry, ctx) => {
  if (entry.sentAt > Date.now() + 86_400_000) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sentAt"], message: "A data de envio não pode estar no futuro." });
  }
  if (entry.deliveredCount !== null && entry.uniqueClicks !== null && entry.uniqueClicks > entry.deliveredCount) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["uniqueClicks"], message: "Cliques únicos não podem ultrapassar os e-mails entregues." });
});

const leadProfileCountFields = [
  "firstTimeCount", "attended2026Count", "attendedPastCount", "nutritionAestheticsCount", "sportsNutritionCount", "sportsPhysioCount", "businessManagementCount", "physicalEducationCount", "bodybuildingCount", "otherInterestCount",
] as const;
const leadProfileEntry = z.object({
  id: z.number().int().positive().optional(),
  periodStartAt: z.number().int().positive(),
  periodEndAt: z.number().int().positive(),
  totalLeads: z.number().int().min(0).max(100_000_000),
  newLeads: z.number().int().min(0).max(100_000_000),
  sessions: optionalCount.default(null),
  dmSessions: optionalCount.default(null),
  formStarts: optionalCount.default(null),
  dmConversions: optionalCount.default(null),
  firstTimeCount: optionalCount,
  attended2026Count: optionalCount,
  attendedPastCount: optionalCount,
  nutritionAestheticsCount: optionalCount,
  sportsNutritionCount: optionalCount,
  sportsPhysioCount: optionalCount,
  businessManagementCount: optionalCount,
  physicalEducationCount: optionalCount,
  bodybuildingCount: optionalCount,
  otherInterestCount: optionalCount,
  note: z.string().max(2000),
}).superRefine((entry, ctx) => {
  if (entry.periodStartAt > entry.periodEndAt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodStartAt"], message: "O início do período deve ser anterior ao fechamento." });
  if (entry.periodEndAt > Date.now() + 86_400_000) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodEndAt"], message: "A data de referência não pode estar no futuro." });
  if (entry.newLeads > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["newLeads"], message: "Novos leads não podem ultrapassar o total acumulado." });
  if (entry.dmSessions !== null && entry.sessions !== null && entry.dmSessions > entry.sessions) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dmSessions"], message: "Sessões via DM não podem ultrapassar as sessões totais." });
  if (entry.formStarts !== null && entry.formStarts < entry.newLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["formStarts"], message: "Inícios de formulário não podem ser menores que os novos leads." });
  if (entry.dmConversions !== null && entry.dmConversions > entry.newLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dmConversions"], message: "Conversões via DM não podem ultrapassar os novos leads." });
  leadProfileCountFields.forEach(field => {
    if (entry[field] !== null && entry[field]! > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: "O valor não pode ultrapassar o total de leads." });
  });
  if ((entry.firstTimeCount ?? 0) + (entry.attended2026Count ?? 0) + (entry.attendedPastCount ?? 0) > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["firstTimeCount"], message: "O histórico de participação não pode ultrapassar o total de leads." });
});

const masterclassLandingEntry = z.object({
  id: z.number().int().positive().optional(),
  periodStartAt: z.number().int().positive(),
  periodEndAt: z.number().int().positive(),
  totalLeads: z.number().int().min(0).max(100_000_000),
  newLeads: z.number().int().min(0).max(100_000_000),
  sessions: optionalCount,
  dmSessions: optionalCount,
  formStarts: optionalCount,
  dmConversions: optionalCount,
  thankYouPageAccesses: optionalCount,
  anaLessonStarts: optionalCount,
  anaLessonCompletions: optionalCount,
  andreiaLessonStarts: optionalCount,
  andreiaLessonCompletions: optionalCount,
  robertoLessonStarts: optionalCount,
  robertoLessonCompletions: optionalCount,
  congressHubClicks: optionalCount,
  newsLpClicks: optionalCount,
  salesPageClicks: optionalCount,
  note: z.string().max(2000),
}).superRefine((entry, ctx) => {
  if (entry.periodStartAt > entry.periodEndAt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodStartAt"], message: "O início do período deve ser anterior ao fechamento." });
  if (entry.periodEndAt > Date.now() + 86_400_000) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodEndAt"], message: "A data de referência não pode estar no futuro." });
  if (entry.newLeads > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["newLeads"], message: "Novos leads não podem ultrapassar o total acumulado." });
  if (entry.dmSessions !== null && entry.sessions !== null && entry.dmSessions > entry.sessions) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dmSessions"], message: "Sessões via DM não podem ultrapassar as sessões totais." });
  if (entry.formStarts !== null && entry.formStarts < entry.newLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["formStarts"], message: "Inícios de formulário não podem ser menores que os novos leads." });
  if (entry.dmConversions !== null && entry.dmConversions > entry.newLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dmConversions"], message: "Conversões via DM não podem ultrapassar os novos leads." });
  const lessons = [
    ["anaLessonStarts", "anaLessonCompletions"],
    ["andreiaLessonStarts", "andreiaLessonCompletions"],
    ["robertoLessonStarts", "robertoLessonCompletions"],
  ] as const;
  lessons.forEach(([startsKey, completionsKey]) => {
    const starts = entry[startsKey];
    const completions = entry[completionsKey];
    if (starts !== null && completions !== null && completions > starts) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [completionsKey], message: "Conclusões não podem ultrapassar os inícios da aula." });
  });
});

export const masterclassSyncPeriod = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data inicial no formato AAAA-MM-DD."),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data final no formato AAAA-MM-DD."),
}).superRefine((period, ctx) => {
  const from = civilDateToUtcNoon(period.from);
  const to = civilDateToUtcNoon(period.to);
  if (!Number.isFinite(from) || !Number.isFinite(to) || from > to) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["from"], message: "O início do período deve ser anterior ao fim." });
  if (period.to > brasiliaCivilDate()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["to"], message: "A data final não pode estar no futuro em Brasília." });
  if (Number.isFinite(from) && Number.isFinite(to) && to - from > 366 * 86_400_000) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["to"], message: "O período não pode ultrapassar 366 dias." });
});

let lastMasterclassSyncAt = 0;
let lastNewsSyncAt = 0;

const whatsappMonthlyEntry = z.object({
  monthKey,
  delivered: optionalCount,
  linkClicks: optionalCount,
  replies: optionalCount,
  optOuts: optionalCount,
  attributedPurchases: optionalCount,
  humanHandoffs: optionalCount,
  note: z.string().max(2000),
});

export const planningRouter = router({
  getState: publicProcedure.query(() => getSharedPlanningState()),
  getMasterclassSyncStatus: publicProcedure.query(() => ({ configured: Boolean(ENV.lovableMasterclassMetricsToken) })),
  getNewsSyncStatus: publicProcedure.query(() => ({ configured: Boolean(ENV.lovableMetricsApiToken) })),
  saveObjectives: publicProcedure
    .input(z.object({ entries: z.array(objectiveEntry).max(50), actorName }))
    .mutation(({ input }) => saveObjectiveProgress(input.entries, { id: 0, name: input.actorName || null })),
  saveMetrics: publicProcedure
    .input(z.object({ entries: z.array(metricEntry).max(100), actorName }))
    .mutation(({ input }) => saveMetricProgress(input.entries, { id: 0, name: input.actorName || null })),
  saveOccupancy: publicProcedure
    .input(z.object({ entries: z.array(occupancyEntry).length(6), actorName }))
    .mutation(({ input }) => saveOccupancyProgress(input.entries, { id: 0, name: input.actorName || null })),
  saveSocialResults: publicProcedure
    .input(z.object({ entries: z.array(socialMonthlyEntry).length(8) }))
    .mutation(({ input }) => saveSocialMonthlyResults(input.entries)),
  saveWhatsAppResults: publicProcedure
    .input(z.object({ entries: z.array(whatsappMonthlyEntry).length(8) }))
    .mutation(({ input }) => saveWhatsAppMonthlyResults(input.entries)),
  saveCalendarWorkflow: publicProcedure
    .input(calendarWorkflowEntry)
    .mutation(({ input }) => saveCalendarWorkflow(input)),
  saveEmailWorkflow: publicProcedure
    .input(emailWorkflowEntry)
    .mutation(({ input }) => saveEmailWorkflow(input)),
  saveEmailPerformance: publicProcedure
    .input(emailPerformanceEntry)
    .mutation(({ input }) => saveEmailPerformance(input)),
  deleteEmailPerformance: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => deleteEmailPerformance(input.id)),
  saveLeadProfileSnapshot: publicProcedure
    .input(leadProfileEntry)
    .mutation(({ input }) => saveLeadProfileSnapshot(input)),
  deleteLeadProfileSnapshot: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => deleteLeadProfileSnapshot(input.id)),
  syncLeadProfileSnapshot: publicProcedure
    .input(masterclassSyncPeriod)
    .mutation(async ({ input }) => {
      const now = Date.now();
      if (now - lastNewsSyncAt < 5_000) throw new Error("Aguarde alguns segundos antes de sincronizar novamente.");
      lastNewsSyncAt = now;
      const payload = await fetchLovableNewsMetrics(input.from, input.to);
      return upsertSyncedLeadProfileSnapshot(mapLovableNewsMetricsToSnapshot(payload));
    }),
  saveMasterclassLandingSnapshot: publicProcedure
    .input(masterclassLandingEntry)
    .mutation(({ input }) => saveMasterclassLandingSnapshot(input)),
  syncMasterclassLandingSnapshot: publicProcedure
    .input(masterclassSyncPeriod)
    .mutation(async ({ input }) => {
      const now = Date.now();
      if (now - lastMasterclassSyncAt < 5_000) throw new Error("Aguarde alguns segundos antes de sincronizar novamente.");
      lastMasterclassSyncAt = now;
      const payload = await fetchLovableMasterclassMetrics(input.from, input.to);
      return upsertSyncedMasterclassLandingSnapshot(mapLovableMetricsToSnapshot(payload));
    }),
  deleteMasterclassLandingSnapshot: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => deleteMasterclassLandingSnapshot(input.id)),
  clearObjectives: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearObjectiveProgress({ id: 0, name: input.actorName || null })),
  clearMetrics: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearMetricProgress({ id: 0, name: input.actorName || null })),
});
