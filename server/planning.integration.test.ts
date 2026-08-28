import { afterAll, describe, expect, it } from "vitest";
import { eq, or } from "drizzle-orm";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { appRouter } from "./routers";
import { objectiveProgress, planningActivity } from "../drizzle/schema";

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const objectiveKey = `qa-sync-${runId}`;
const actorAName = `QA Navegador A ${runId}`;
const actorBName = `QA Navegador B ${runId}`;

function createAnonymousContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe.sequential("shared planning persistence", () => {
  afterAll(async () => {
    const db = await getDb();
    if (!db) return;
    await db.delete(objectiveProgress).where(eq(objectiveProgress.objectiveKey, objectiveKey));
    await db.delete(planningActivity).where(or(eq(planningActivity.actorName, actorAName), eq(planningActivity.actorName, actorBName)));
  });

  it("saves in one authenticated session and reads in another", async () => {
    const anonymousBrowserA = appRouter.createCaller(createAnonymousContext());
    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());

    await anonymousBrowserA.planning.saveObjectives({
      entries: [{ key: objectiveKey, target: "1200", current: "180", note: "Registro do navegador A", validated: false }],
      actorName: actorAName,
    });

    const readInBrowserB = await anonymousBrowserB.planning.getState();
    expect(readInBrowserB.objectives.find(item => item.objectiveKey === objectiveKey)).toMatchObject({
      target: "1200",
      current: "180",
      updatedByName: actorAName,
    });
    expect(readInBrowserB.activity.some(item => item.actorName === actorAName && item.entityType === "objectives")).toBe(true);

    await anonymousBrowserB.planning.saveObjectives({
      entries: [{ key: objectiveKey, target: "1200", current: "360", note: "Atualização do navegador B", validated: true }],
      actorName: actorBName,
    });

    const readBackInBrowserA = await anonymousBrowserA.planning.getState();
    expect(readBackInBrowserA.objectives.find(item => item.objectiveKey === objectiveKey)).toMatchObject({
      current: "360",
      note: "Atualização do navegador B",
      validated: true,
      updatedByName: actorBName,
    });
    expect(readBackInBrowserA.activity.some(item => item.actorName === actorBName && item.entityType === "objectives")).toBe(true);
  });
});
