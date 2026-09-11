import { afterAll, describe, expect, it } from "vitest";
import { deleteLeadProfileSnapshot, getSharedPlanningState, upsertSyncedLeadProfileSeries } from "./db";
import { NEWS_DAILY_SYNC_SOURCE, NEWS_ROLLUP_SYNC_SOURCE } from "../shared/leadProfile";

const dayOne = Date.parse("2026-07-01T12:00:00.000Z");
const dayTwo = Date.parse("2026-07-02T12:00:00.000Z");
const note = "Teste automatizado da série oficial da LP de novidades.";
const storedIds: number[] = [];

const base = {
  sourceKey: "conference-news-lp" as const,
  totalLeads: 20,
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
  providerUpdatedAt: Date.parse("2026-07-02T13:00:00.000Z"),
  providerObservation: "Teste agregado.",
  note,
};

const entries = [
  { ...base, periodStartAt: dayOne, periodEndAt: dayOne, newLeads: 7, syncSource: NEWS_DAILY_SYNC_SOURCE },
  { ...base, periodStartAt: dayTwo, periodEndAt: dayTwo, newLeads: 1, uniquePeopleInPeriod: 1, profileBaseCount: 1, syncSource: NEWS_DAILY_SYNC_SOURCE },
  { ...base, periodStartAt: dayOne, periodEndAt: dayTwo, newLeads: 8, uniquePeopleInPeriod: 8, profileBaseCount: 8, syncSource: NEWS_ROLLUP_SYNC_SOURCE },
];

afterAll(async () => {
  const state = await getSharedPlanningState();
  for (const row of state.leadProfileResults.filter(item => item.note === note)) await deleteLeadProfileSnapshot(row.id);
});

describe("persistência idempotente da série oficial da LP de novidades", () => {
  it("mantém dois dias e um consolidado sobreposto sem criar novas linhas ao repetir", async () => {
    const first = await upsertSyncedLeadProfileSeries(entries);
    const second = await upsertSyncedLeadProfileSeries(entries.map(entry => ({ ...entry, totalLeads: 21 })));
    const state = await getSharedPlanningState();
    const matches = state.leadProfileResults.filter(row => row.note === note);
    storedIds.push(...matches.map(row => row.id));
    expect(first).toMatchObject({ created: 3, updated: 0, total: 3 });
    expect(second).toMatchObject({ created: 0, updated: 3, total: 3 });
    expect(matches).toHaveLength(3);
    expect(matches.filter(row => row.syncSource === NEWS_DAILY_SYNC_SOURCE)).toHaveLength(2);
    expect(matches.filter(row => row.syncSource === NEWS_ROLLUP_SYNC_SOURCE)).toHaveLength(1);
  });
});
