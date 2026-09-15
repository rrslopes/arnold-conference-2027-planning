import { describe, expect, it } from "vitest";
import {
  INTEREST_FIELDS,
  NEWS_LP_SOURCE,
  getLatestLeadProfileSnapshot,
  percentageOfLeads,
  profilePercentageBase,
  sortInterestProfile,
  validateLeadProfileSnapshot,
  type LeadProfileSnapshotDraft,
} from "../shared/leadProfile";

const base: LeadProfileSnapshotDraft = {
  periodStartAt: Date.UTC(2026, 8, 1), periodEndAt: Date.UTC(2026, 8, 4), totalLeads: 100, newLeads: 20,
  firstTimeCount: 50, attended2026Count: 30, attendedPastCount: 20,
  nutritionAestheticsCount: 55, sportsNutritionCount: 50, sportsPhysioCount: 25, businessManagementCount: 20,
  physicalEducationCount: 30, bodybuildingCount: 15, otherInterestCount: 5,
  note: "Fechamento de QA",
};

describe("lead profile snapshots", () => {
  it("keeps the source fixed to the news landing page", () => {
    expect(NEWS_LP_SOURCE.url).toBe("https://oferta.savagetgroup.com.br/conference-2027");
    expect(NEWS_LP_SOURCE.key).toBe("conference-news-lp");
  });

  it("allows multiple interests to total more than 100 percent", () => {
    const mentions = INTEREST_FIELDS.reduce((total, field) => total + (base[field.key] ?? 0), 0);
    expect(mentions).toBeGreaterThan(base.totalLeads);
    expect(validateLeadProfileSnapshot(base)).toEqual([]);
  });

  it("calculates percentages and ranks interests by declared mentions", () => {
    expect(percentageOfLeads(25, 100)).toBe(25);
    expect(sortInterestProfile(base)[0]).toMatchObject({ label: "Nutrição Estética", count: 55, percentage: 55 });
  });

  it("uses the synchronized period base instead of the accumulated campaign total", () => {
    const incremental = { ...base, totalLeads: 120, newLeads: 16, uniquePeopleInPeriod: 16, totalUniquePeople: 120, profileBaseCount: 16, nutritionAestheticsCount: 6, sportsNutritionCount: 7, sportsPhysioCount: 4, businessManagementCount: 6, physicalEducationCount: 3, bodybuildingCount: 2, otherInterestCount: 2, firstTimeCount: 7, attended2026Count: 8, attendedPastCount: 1 };
    expect(profilePercentageBase(incremental)).toBe(16);
    expect(sortInterestProfile(incremental)[0]).toMatchObject({ label: "Nutrição Esportiva", count: 7, percentage: 43.75 });
    expect(validateLeadProfileSnapshot(incremental)).toEqual([]);
  });

  it("maps form labels to the correct congresses", () => {
    expect(INTEREST_FIELDS.find(item => item.key === "sportsPhysioCount")?.congress).toBe("SONAFE");
    expect(INTEREST_FIELDS.find(item => item.key === "physicalEducationCount")?.congress).toBe("Certificação Internacional em Personal Training – WTTC");
    expect(INTEREST_FIELDS.find(item => item.key === "businessManagementCount")?.congress).toBe("Gestão de Academias");
  });

  it("selects the latest closing date without summing snapshots", () => {
    expect(getLatestLeadProfileSnapshot([{ periodEndAt: 2, updatedAt: 1 }, { periodEndAt: 4, updatedAt: 1 }, { periodEndAt: 3, updatedAt: 9 }])?.periodEndAt).toBe(4);
  });

  it("prioritizes the official rollup over a daily snapshot with the same closing date", () => {
    const selected = getLatestLeadProfileSnapshot([
      { periodEndAt: 11, updatedAt: 9, syncSource: "lovable-api-daily", kind: "daily" },
      { periodEndAt: 11, updatedAt: 1, syncSource: "lovable-api-rollup", kind: "rollup" },
    ]);
    expect(selected?.kind).toBe("rollup");
  });

  it("rejects impossible participation totals", () => {
    const issues = validateLeadProfileSnapshot({ ...base, firstTimeCount: 101 });
    expect(issues.map(item => item.field)).toEqual(expect.arrayContaining(["firstTimeCount", "participation"]));
  });

  it("keeps affinity and cities outside the active draft", () => {
    expect("singleInterestCount" in base).toBe(false);
    expect("multipleInterestsCount" in base).toBe(false);
    expect("topCities" in base).toBe(false);
  });
});
