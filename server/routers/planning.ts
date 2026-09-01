import { z } from "zod";
import {
  clearMetricProgress,
  clearObjectiveProgress,
  getSharedPlanningState,
  saveCalendarWorkflow,
  saveEmailWorkflow,
  saveMetricProgress,
  saveObjectiveProgress,
  saveOccupancyProgress,
  saveSocialMonthlyResults,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { EDITORIAL_STATUS_IDS, isValidArtworkUrl } from "../../shared/editorialWorkflow";
import { EMAIL_STATUS_IDS, isValidEmailPreviewUrl } from "../../shared/emailWorkflow";

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
  clearObjectives: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearObjectiveProgress({ id: 0, name: input.actorName || null })),
  clearMetrics: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearMetricProgress({ id: 0, name: input.actorName || null })),
});
