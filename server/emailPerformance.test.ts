import { describe, expect, it } from "vitest";
import {
  calculateEmailPerformanceScore,
  fromStoredRate,
  hasCompleteEmailRates,
  isValidSentEmailUrl,
  rankEmailPerformance,
  toStoredRate,
  type EmailPerformanceEntry,
} from "../shared/emailPerformance";

const complete = { openRate: 30, clickRate: 5, unsubscribeRate: 0.2, spamRate: 0.01 };

describe("email performance ranking", () => {
  it("gives clicks more influence than openings", () => {
    const openingGain = calculateEmailPerformanceScore({ ...complete, openRate: 40 });
    const clickGain = calculateEmailPerformanceScore({ ...complete, clickRate: 15 });
    expect(clickGain).toBeGreaterThan(openingGain!);
  });

  it("penalizes unsubscribe and spam while keeping a non-negative score", () => {
    expect(calculateEmailPerformanceScore(complete)).toBe(11.9);
    expect(calculateEmailPerformanceScore({ ...complete, spamRate: 2 })).toBe(0);
  });

  it("keeps the score pending until all four rates exist", () => {
    expect(hasCompleteEmailRates({ ...complete, clickRate: null })).toBe(false);
    expect(calculateEmailPerformanceScore({ ...complete, clickRate: null })).toBeNull();
  });

  it("ranks complete entries first and uses click rate as the first tie-breaker", () => {
    const base: Omit<EmailPerformanceEntry, "id" | "campaignName" | "clickRate"> = {
      subject: "Assunto",
      sentAt: Date.UTC(2026, 8, 4),
      emailUrl: "https://example.com/email",
      openRate: 30,
      unsubscribeRate: 0,
      spamRate: 0,
      updatedAt: 1,
    };
    const ranked = rankEmailPerformance([
      { ...base, id: 1, campaignName: "A", clickRate: 6 },
      { ...base, id: 2, campaignName: "B", openRate: 37, clickRate: 3 },
      { ...base, id: 3, campaignName: "Pendente", clickRate: null },
    ]);
    expect(ranked.map(item => [item.campaignName, item.position])).toEqual([["A", 1], ["B", 2], ["Pendente", null]]);
  });

  it("converts rates to integer storage without losing three decimal places", () => {
    expect(toStoredRate(4.275)).toBe(4275);
    expect(fromStoredRate(4275)).toBe(4.275);
    expect(toStoredRate(null)).toBeNull();
  });

  it("accepts only HTTPS links", () => {
    expect(isValidSentEmailUrl("https://example.com/email")).toBe(true);
    expect(isValidSentEmailUrl("http://example.com/email")).toBe(false);
    expect(isValidSentEmailUrl("javascript:alert(1)")).toBe(false);
  });
});
