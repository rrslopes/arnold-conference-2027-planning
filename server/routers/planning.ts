import { z } from "zod";
import {
  clearMetricProgress,
  clearObjectiveProgress,
  getSharedPlanningState,
  saveMetricProgress,
  saveObjectiveProgress,
} from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const sharedText = z.string().max(5000);

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
  getState: protectedProcedure.query(() => getSharedPlanningState()),
  saveObjectives: protectedProcedure
    .input(z.object({ entries: z.array(objectiveEntry).max(50) }))
    .mutation(({ input, ctx }) => saveObjectiveProgress(input.entries, ctx.user)),
  saveMetrics: protectedProcedure
    .input(z.object({ entries: z.array(metricEntry).max(100) }))
    .mutation(({ input, ctx }) => saveMetricProgress(input.entries, ctx.user)),
  clearObjectives: protectedProcedure
    .mutation(({ ctx }) => clearObjectiveProgress(ctx.user)),
  clearMetrics: protectedProcedure
    .mutation(({ ctx }) => clearMetricProgress(ctx.user)),
});
