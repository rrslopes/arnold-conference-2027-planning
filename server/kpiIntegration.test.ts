import { describe, expect, it } from "vitest";
import { buildAutomaticKpis, buildSourceSummary, type KpiIntegrationState } from "../shared/kpiIntegration";

function state(overrides: Partial<KpiIntegrationState> = {}): KpiIntegrationState {
  return { socialResults: [], emailPerformanceResults: [], leadProfileResults: [], masterclassLandingResults: [], whatsappResults: [], monthlySales: [], ...overrides };
}

describe("consolidação automática dos KPIs", () => {
  it("calcula conversão e abandono da LP somente com os denominadores informados", () => {
    const rows = buildAutomaticKpis("landing", state({ leadProfileResults: [{ periodStartAt: Date.UTC(2026, 8, 1), periodEndAt: Date.UTC(2026, 8, 30), totalLeads: 140, newLeads: 40, sessions: 200, dmSessions: 35, formStarts: 60, dmConversions: 8, updatedAt: Date.UTC(2026, 8, 30) }] }));
    expect(rows.find(row => row.key === "lp-conversion-rate")?.value).toBe(20);
    expect(rows.find(row => row.key === "lp-abandonments")?.value).toBe(20);
    expect(rows.find(row => row.key === "lp-leads")?.source).toContain("Novidades");
  });

  it("não estima taxa ou abandono quando sessões e inícios não foram medidos", () => {
    const rows = buildAutomaticKpis("landing", state({ leadProfileResults: [{ periodStartAt: 1, periodEndAt: 2, totalLeads: 94, newLeads: 94, sessions: null, dmSessions: null, formStarts: null, dmConversions: null, updatedAt: 3 }] }));
    expect(rows.find(row => row.key === "lp-conversion-rate")?.value).toBeNull();
    expect(rows.find(row => row.key === "lp-abandonments")?.value).toBeNull();
  });

  it("usa a campanha de e-mail mais recente como fonte única", () => {
    const rows = buildAutomaticKpis("email", state({ emailPerformanceResults: [{ campaignName: "Entrega", sentAt: 10, openRateMilli: 30000, clickRateMilli: 5000, unsubscribeRateMilli: 200, spamRateMilli: 10, deliveredCount: 800, uniqueClicks: 40, attributedConversions: 7, attributedRevenueCents: 123450 }] }));
    expect(rows.find(row => row.key === "email-click-rate")?.value).toBe(5);
    expect(rows.find(row => row.key === "email-revenue")?.value).toBe(1234.5);
    expect(rows.every(row => row.period.includes("Entrega"))).toBe(true);
  });

  it("usa o fechamento mensal mais recente de WhatsApp sem duplicar entradas", () => {
    const rows = buildAutomaticKpis("whatsapp", state({ whatsappResults: [{ monthKey: "2026-09", delivered: 450, linkClicks: 30, replies: 12, optOuts: 1, attributedPurchases: 2, humanHandoffs: 6 }, { monthKey: "2026-10", delivered: 600, linkClicks: 54, replies: 20, optOuts: 2, attributedPurchases: 4, humanHandoffs: 9 }] }));
    expect(rows.find(row => row.key === "whatsapp-clicks")?.value).toBe(54);
    expect(rows.find(row => row.key === "whatsapp-clicks")?.period).toBe("2026-10");
  });

  it("deriva inscrições mensais e acumuladas da lotação", () => {
    const rows = buildAutomaticKpis("comercial", state({ monthlySales: [{ monthKey: "2026-09", sold: 10 }, { monthKey: "2026-09", sold: 5 }, { monthKey: "2026-10", sold: 8 }] }));
    expect(rows.find(row => row.key === "sales-monthly")?.value).toBe(8);
    expect(rows.find(row => row.key === "sales-cumulative")?.value).toBe(23);
  });

  it("automatiza consumo da recompensa sem estimar eventos ausentes e resume as fontes", () => {
    const base = state({ socialResults: [{ monthKey: "2026-09", accountsReached: 30000, views: 50000, interactions: 2200, netFollowers: 90, metaMessagesSent: 700 }], masterclassLandingResults: [{ periodStartAt: 1, periodEndAt: 2, totalLeads: 120, newLeads: 30, sessions: 100, dmSessions: 10, formStarts: 40, dmConversions: 5, thankYouPageAccesses: 24, anaLessonStarts: 12, anaLessonCompletions: 6, andreiaLessonStarts: null, andreiaLessonCompletions: null, robertoLessonStarts: 8, robertoLessonCompletions: 4, congressHubClicks: 7, newsLpClicks: 3, salesPageClicks: null, updatedAt: 3 }] });
    const reward = buildAutomaticKpis("recompensa", base);
    expect(reward.find(row => row.key === "reward-access-rate")?.value).toBe(80);
    expect(reward.find(row => row.key === "reward-ana-rate")?.value).toBe(50);
    expect(reward.find(row => row.key === "reward-andreia-rate")?.value).toBeNull();
    expect(buildAutomaticKpis("dm", base).map(row => row.value)).toEqual([30000, 50000, 2200, 90, 700]);
    expect(buildSourceSummary(base).find(item => item.key === "social")?.value).toBe(2200);
    expect(buildSourceSummary(base).find(item => item.key === "landing")?.value).toBe(30);
  });
});
