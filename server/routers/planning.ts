import { z } from "zod";
import {
  clearMetricProgress,
  clearObjectiveProgress,
  getSharedPlanningState,
  saveMetricProgress,
  saveObjectiveProgress,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";

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

export const planningRouter = router({
  getState: publicProcedure.query(() => getSharedPlanningState()),
  saveObjectives: publicProcedure
    .input(z.object({ entries: z.array(objectiveEntry).max(50), actorName }))
    .mutation(({ input }) => saveObjectiveProgress(input.entries, { id: 0, name: input.actorName || null })),
  saveMetrics: publicProcedure
    .input(z.object({ entries: z.array(metricEntry).max(100), actorName }))
    .mutation(({ input }) => saveMetricProgress(input.entries, { id: 0, name: input.actorName || null })),
  clearObjectives: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearObjectiveProgress({ id: 0, name: input.actorName || null })),
  clearMetrics: publicProcedure
    .input(z.object({ actorName }))
    .mutation(({ input }) => clearMetricProgress({ id: 0, name: input.actorName || null })),
});
