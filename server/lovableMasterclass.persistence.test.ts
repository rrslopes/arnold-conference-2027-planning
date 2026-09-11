import { afterAll, describe, expect, it } from "vitest";
import { deleteMasterclassLandingSnapshot, getSharedPlanningState, upsertSyncedMasterclassLandingSnapshot } from "./db";

const periodStartAt = Date.parse("2026-08-01T12:00:00.000Z");
const periodEndAt = Date.parse("2026-08-02T12:00:00.000Z");
let storedId: number | undefined;

const entry = {
  sourceKey: "masterclass-lp",
  periodStartAt,
  periodEndAt,
  totalLeads: 20,
  newLeads: 8,
  sessions: 40,
  dmSessions: 4,
  formStarts: 12,
  dmConversions: 2,
  thankYouPageAccesses: 8,
  anaLessonStarts: 5,
  anaLessonCompletions: 2,
  anaUniqueViewers: 4,
  anaAverageWatchPercent: 35,
  andreiaLessonStarts: 6,
  andreiaLessonCompletions: 3,
  andreiaUniqueViewers: 5,
  andreiaAverageWatchPercent: 42,
  robertoLessonStarts: 3,
  robertoLessonCompletions: 1,
  robertoUniqueViewers: 3,
  robertoAverageWatchPercent: 29,
  congressHubClicks: 0,
  newsLpClicks: 4,
  salesPageClicks: 0,
  originsJson: JSON.stringify([{ channel: "email", sessions: 10, leads: 3 }]),
  syncSource: "lovable-api",
  providerUpdatedAt: Date.parse("2026-08-02T13:00:00.000Z"),
  note: "Teste automatizado de idempotência Lovable.",
};

afterAll(async () => {
  if (storedId) await deleteMasterclassLandingSnapshot(storedId);
});

describe("persistência idempotente da sincronização Lovable", () => {
  it("atualiza a mesma fotografia quando origem e período se repetem", async () => {
    const first = await upsertSyncedMasterclassLandingSnapshot(entry);
    storedId = first.id;
    const second = await upsertSyncedMasterclassLandingSnapshot({ ...entry, newLeads: 9, totalLeads: 21 });
    const state = await getSharedPlanningState();
    const matches = state.masterclassLandingResults.filter(row => row.sourceKey === entry.sourceKey && row.periodStartAt === periodStartAt && row.periodEndAt === periodEndAt);

    expect(first.action).toBe("created");
    expect(second.action).toBe("updated");
    expect(second.id).toBe(first.id);
    expect(matches).toHaveLength(1);
    expect(matches[0]?.newLeads).toBe(9);
    expect(matches[0]?.syncSource).toBe("lovable-api");
  });
});
