import { z } from "zod";
import {
  clearMetricProgress,
  clearObjectiveProgress,
  deleteEmailPerformance,
  deleteLeadProfileSnapshot,
  getSharedPlanningState,
  saveCalendarWorkflow,
  saveEmailPerformance,
  saveEmailWorkflow,
  saveLeadProfileSnapshot,
  saveMetricProgress,
  saveObjectiveProgress,
  saveOccupancyProgress,
  saveSocialMonthlyResults,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { EDITORIAL_STATUS_IDS, isValidArtworkUrl } from "../../shared/editorialWorkflow";
import { EMAIL_STATUS_IDS, isValidEmailPreviewUrl } from "../../shared/emailWorkflow";
import { isValidSentEmailUrl } from "../../shared/emailPerformance";

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
  accountsReached: optionalCount,
  views: optionalCount,
  interactions: optionalCount,
  netFollowers: z.number().int().min(-100_000_000).max(100_000_000).nullable(),
  reelsPublished: optionalCount,
  reelsMedianReach: optionalCount,
  reelsMedianViews: optionalCount,
  reelsMedianInteractions: optionalCount,
  reelsMedianShares: optionalCount,
  reelsMedianSaves: optionalCount,
  carouselsPublished: optionalCount,
  carouselsMedianReach: optionalCount,
  carouselsMedianViews: optionalCount,
  carouselsMedianInteractions: optionalCount,
  carouselsMedianShares: optionalCount,
  carouselsMedianSaves: optionalCount,
  storiesPublished: optionalCount,
  storiesMedianReach: optionalCount,
  storiesMedianViews: optionalCount,
  storyReplies: optionalCount,
  storyLinkClicks: optionalCount,
  storyStickerTaps: optionalCount,
  storyProfileVisits: optionalCount,
  note: z.string().max(2000),
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
}).superRefine((entry, ctx) => {
  if (entry.sentAt > Date.now() + 86_400_000) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sentAt"], message: "A data de envio não pode estar no futuro." });
  }
});

const leadProfileCountFields = [
  "firstTimeCount", "attended2026Count", "attendedPastCount", "nutritionAestheticsCount", "sportsNutritionCount", "sportsPhysioCount", "businessManagementCount", "physicalEducationCount", "bodybuildingCount", "otherInterestCount", "singleInterestCount", "multipleInterestsCount",
] as const;
const leadProfileEntry = z.object({
  id: z.number().int().positive().optional(),
  periodStartAt: z.number().int().positive(),
  periodEndAt: z.number().int().positive(),
  totalLeads: z.number().int().min(0).max(100_000_000),
  newLeads: z.number().int().min(0).max(100_000_000),
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
  singleInterestCount: optionalCount,
  multipleInterestsCount: optionalCount,
  topCities: z.array(z.object({ city: z.string().trim().min(1).max(120), count: z.number().int().min(0).max(100_000_000) })).max(5),
  note: z.string().max(2000),
}).superRefine((entry, ctx) => {
  if (entry.periodStartAt > entry.periodEndAt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodStartAt"], message: "O início do período deve ser anterior ao fechamento." });
  if (entry.periodEndAt > Date.now() + 86_400_000) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["periodEndAt"], message: "A data de referência não pode estar no futuro." });
  if (entry.newLeads > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["newLeads"], message: "Novos leads não podem ultrapassar o total acumulado." });
  leadProfileCountFields.forEach(field => {
    if (entry[field] !== null && entry[field]! > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: "O valor não pode ultrapassar o total de leads." });
  });
  if ((entry.firstTimeCount ?? 0) + (entry.attended2026Count ?? 0) + (entry.attendedPastCount ?? 0) > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["firstTimeCount"], message: "O histórico de participação não pode ultrapassar o total de leads." });
  if ((entry.singleInterestCount ?? 0) + (entry.multipleInterestsCount ?? 0) > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["singleInterestCount"], message: "A afinidade não pode ultrapassar o total de leads." });
  if (entry.topCities.reduce((total, item) => total + item.count, 0) > entry.totalLeads) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["topCities"], message: "A soma das cidades não pode ultrapassar o total de leads." });
});

export const planningRouter = router({
  getState: publicProcedure.query(() => getSharedPlanningState()),
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
  clearObjectives: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearObjectiveProgress({ id: 0, name: input.actorName || null })),
  clearMetrics: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearMetricProgress({ id: 0, name: input.actorName || null })),
});
