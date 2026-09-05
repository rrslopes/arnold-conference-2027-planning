import { describe, expect, it } from "vitest";
import {
  INTEREST_FIELDS,
  NEWS_LP_SOURCE,
  getLatestLeadProfileSnapshot,
  parseCities,
  percentageOfLeads,
  sortInterestProfile,
  validateLeadProfileSnapshot,
  type LeadProfileSnapshotDraft,
} from "../shared/leadProfile";

const base: LeadProfileSnapshotDraft = {
  periodStartAt: Date.UTC(2026, 8, 1), periodEndAt: Date.UTC(2026, 8, 4), totalLeads: 100, newLeads: 20,
  firstTimeCount: 50, attended2026Count: 30, attendedPastCount: 20,
  nutritionAestheticsCount: 55, sportsNutritionCount: 50, sportsPhysioCount: 25, businessManagementCount: 20,
  physicalEducationCount: 30, bodybuildingCount: 15, otherInterestCount: 5,
  singleInterestCount: 40, multipleInterestsCount: 60,
  topCities: [{ city: "São Paulo", count: 45 }], note: "Fechamento de QA",
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

  it("maps form labels to the correct congresses", () => {
    expect(INTEREST_FIELDS.find(item => item.key === "sportsPhysioCount")?.congress).toBe("SONAFE");
    expect(INTEREST_FIELDS.find(item => item.key === "physicalEducationCount")?.congress).toBe("WTTC");
    expect(INTEREST_FIELDS.find(item => item.key === "businessManagementCount")?.congress).toBe("Gestão de Academias");
  });

  it("selects the latest closing date without summing snapshots", () => {
    expect(getLatestLeadProfileSnapshot([{ periodEndAt: 2, updatedAt: 1 }, { periodEndAt: 4, updatedAt: 1 }, { periodEndAt: 3, updatedAt: 9 }])?.periodEndAt).toBe(4);
  });

  it("rejects impossible participation, affinity and city totals", () => {
    const issues = validateLeadProfileSnapshot({ ...base, firstTimeCount: 101, singleInterestCount: 70, multipleInterestsCount: 50, topCities: [{ city: "São Paulo", count: 80 }, { city: "Rio", count: 30 }] });
    expect(issues.map(item => item.field)).toEqual(expect.arrayContaining(["firstTimeCount", "participation", "affinity", "topCities"]));
  });

  it("parses city JSON defensively", () => {
    expect(parseCities('[{"city":"São Paulo","count":8}]')).toEqual([{ city: "São Paulo", count: 8 }]);
    expect(parseCities("texto inválido")).toEqual([]);
  });
});
