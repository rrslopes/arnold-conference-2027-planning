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

function createContext(id: number, name: string): TrpcContext {
  return {
    user: {
      id,
      openId: `qa-${id}-${runId}`,
      email: `qa-${id}@example.com`,
      name,
      loginMethod: "qa",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
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
    const browserA = appRouter.createCaller(createContext(900001, actorAName));
    const browserB = appRouter.createCaller(createContext(900002, actorBName));

    await browserA.planning.saveObjectives({
      entries: [{ key: objectiveKey, target: "1200", current: "180", note: "Registro do navegador A", validated: false }],
    });

    const readInBrowserB = await browserB.planning.getState();
    expect(readInBrowserB.objectives.find(item => item.objectiveKey === objectiveKey)).toMatchObject({
      target: "1200",
      current: "180",
      updatedByName: actorAName,
    });

    await browserB.planning.saveObjectives({
      entries: [{ key: objectiveKey, target: "1200", current: "360", note: "Atualização do navegador B", validated: true }],
    });

    const readBackInBrowserA = await browserA.planning.getState();
    expect(readBackInBrowserA.objectives.find(item => item.objectiveKey === objectiveKey)).toMatchObject({
      current: "360",
      note: "Atualização do navegador B",
      validated: true,
      updatedByName: actorBName,
    });
  });
});
