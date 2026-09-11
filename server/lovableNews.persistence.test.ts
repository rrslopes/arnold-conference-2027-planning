import { afterAll, describe, expect, it } from "vitest";
import { deleteLeadProfileSnapshot, getSharedPlanningState, upsertSyncedLeadProfileSnapshot } from "./db";

const periodStartAt = Date.parse("2026-07-01T12:00:00.000Z");
const periodEndAt = Date.parse("2026-07-02T12:00:00.000Z");
let storedId: number | undefined;

const entry = {
  sourceKey: "conference-news-lp" as const,
  periodStartAt,
  periodEndAt,
  totalLeads: 20,
  newLeads: 8,
  uniquePeopleInPeriod: 7,
  totalUniquePeople: 18,
  profileBaseCount: 7,
  sessions: null,
  dmSessions: null,
  formStarts: null,
  dmConversions: 2,
  firstTimeCount: 3,
  attended2026Count: 2,
  attendedPastCount: 2,
  nutritionAestheticsCount: 4,
  sportsNutritionCount: 3,
  sportsPhysioCount: 2,
  businessManagementCount: 2,
  physicalEducationCount: 1,
  bodybuildingCount: 1,
  otherInterestCount: 0,
  singleInterestCount: null,
  multipleInterestsCount: null,
  topCitiesJson: "[]",
  originsJson: "[]",
  masterclassClicks: 4,
  masterclassClickOriginsJson: "[]",
  syncSource: "lovable-api",
  providerUpdatedAt: Date.parse("2026-07-02T13:00:00.000Z"),
  providerObservation: "Teste agregado.",
  note: "Teste automatizado de idempotência da LP de novidades.",
};

afterAll(async () => {
  if (storedId) await deleteLeadProfileSnapshot(storedId);
});

describe("persistência idempotente da LP de novidades", () => {
  it("atualiza o mesmo período e bloqueia sobreposição parcial", async () => {
    const first = await upsertSyncedLeadProfileSnapshot(entry);
    storedId = first.id;
    const second = await upsertSyncedLeadProfileSnapshot({ ...entry, newLeads: 9, uniquePeopleInPeriod: 8, profileBaseCount: 8 });
    await expect(upsertSyncedLeadProfileSnapshot({ ...entry, periodStartAt: periodEndAt, periodEndAt: periodEndAt + 86_400_000 })).rejects.toThrow("sobrepõe");
    const state = await getSharedPlanningState();
    const matches = state.leadProfileResults.filter(row => row.periodStartAt === periodStartAt && row.periodEndAt === periodEndAt);
    expect(first.action).toBe("created");
    expect(second.action).toBe("updated");
    expect(second.id).toBe(first.id);
    expect(matches).toHaveLength(1);
    expect(matches[0]?.uniquePeopleInPeriod).toBe(8);
  });
});
