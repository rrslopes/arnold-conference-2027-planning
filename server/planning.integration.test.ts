import { afterAll, describe, expect, it } from "vitest";
import { eq, or } from "drizzle-orm";
import type { TrpcContext } from "./_core/context";
import { getDb, saveOccupancyProgress } from "./db";
import { appRouter } from "./routers";
import { calendarWorkflow, emailWorkflow, monthlyCongressSales, objectiveProgress, planningActivity, roomOccupancy } from "../drizzle/schema";

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const objectiveKey = `qa-sync-${runId}`;
const occupancyKey = `qa-occupancy-${runId}`;
const workflowKey = "9999";
const emailWorkflowKey = `email-base-qa-sync-${runId}`;
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
    await db.delete(monthlyCongressSales).where(eq(monthlyCongressSales.congressKey, occupancyKey));
    await db.delete(roomOccupancy).where(eq(roomOccupancy.congressKey, occupancyKey));
    await db.delete(calendarWorkflow).where(eq(calendarWorkflow.calendarItemId, workflowKey));
    await db.delete(emailWorkflow).where(eq(emailWorkflow.emailItemId, emailWorkflowKey));
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

  it("persists capacity and monthly sales for a second anonymous browser", async () => {
    await saveOccupancyProgress([{ congressKey: occupancyKey, capacity: 500, monthlySales: [
      { monthKey: "2026-09", sold: 80 },
      { monthKey: "2026-10", sold: 45 },
    ] }], { id: 0, name: actorAName });

    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());
    const state = await anonymousBrowserB.planning.getState();
    expect(state.occupancy.find(item => item.congressKey === occupancyKey)).toMatchObject({ capacity: 500, updatedByName: actorAName });
    expect(state.monthlySales.filter(item => item.congressKey === occupancyKey).map(item => [item.monthKey, item.sold])).toEqual(expect.arrayContaining([
      ["2026-09", 80],
      ["2026-10", 45],
    ]));
    expect(state.activity.some(item => item.actorName === actorAName && item.entityType === "occupancy")).toBe(true);
  });

  it("synchronizes caption, artwork link and status between anonymous browsers", async () => {
    const anonymousBrowserA = appRouter.createCaller(createAnonymousContext());
    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());

    await anonymousBrowserA.planning.saveCalendarWorkflow({
      calendarItemId: workflowKey,
      caption: "Legenda criada pelo navegador A",
      artworkUrl: "https://drive.google.com/file/d/qa-a/view",
      status: "aprovar-legenda",
    });

    const readInBrowserB = await anonymousBrowserB.planning.getState();
    expect(readInBrowserB.editorialWorkflow.find(item => item.calendarItemId === workflowKey)).toMatchObject({
      caption: "Legenda criada pelo navegador A",
      artworkUrl: "https://drive.google.com/file/d/qa-a/view",
      status: "aprovar-legenda",
    });

    await anonymousBrowserB.planning.saveCalendarWorkflow({
      calendarItemId: workflowKey,
      caption: "Legenda ajustada e aprovada pelo navegador B",
      artworkUrl: "https://drive.google.com/file/d/qa-b/view",
      status: "aprovado-para-programar",
    });

    const readBackInBrowserA = await anonymousBrowserA.planning.getState();
    expect(readBackInBrowserA.editorialWorkflow.find(item => item.calendarItemId === workflowKey)).toMatchObject({
      caption: "Legenda ajustada e aprovada pelo navegador B",
      artworkUrl: "https://drive.google.com/file/d/qa-b/view",
      status: "aprovado-para-programar",
    });
  });

  it("synchronizes email preview and email-specific status between anonymous browsers", async () => {
    const anonymousBrowserA = appRouter.createCaller(createAnonymousContext());
    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());

    await anonymousBrowserA.planning.saveEmailWorkflow({
      emailItemId: emailWorkflowKey,
      previewUrl: "https://example.com/email-preview-a",
      status: "em-criacao",
    });

    const readInBrowserB = await anonymousBrowserB.planning.getState();
    expect(readInBrowserB.emailApprovals.find(item => item.emailItemId === emailWorkflowKey)).toMatchObject({
      previewUrl: "https://example.com/email-preview-a",
      status: "em-criacao",
    });

    await anonymousBrowserB.planning.saveEmailWorkflow({
      emailItemId: emailWorkflowKey,
      previewUrl: "https://example.com/email-preview-b",
      status: "email-mkt-aprovado",
    });

    const readBackInBrowserA = await anonymousBrowserA.planning.getState();
    expect(readBackInBrowserA.emailApprovals.find(item => item.emailItemId === emailWorkflowKey)).toMatchObject({
      previewUrl: "https://example.com/email-preview-b",
      status: "email-mkt-aprovado",
    });
  });
});
