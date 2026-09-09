import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getSharedPlanningState: vi.fn(),
  saveObjectiveProgress: vi.fn(),
  saveMetricProgress: vi.fn(),
  saveOccupancyProgress: vi.fn(),
  saveSocialMonthlyResults: vi.fn(),
  saveWhatsAppMonthlyResults: vi.fn(),
  saveCalendarWorkflow: vi.fn(),
  saveEmailWorkflow: vi.fn(),
  saveEmailPerformance: vi.fn(),
  deleteEmailPerformance: vi.fn(),
  saveLeadProfileSnapshot: vi.fn(),
  deleteLeadProfileSnapshot: vi.fn(),
  saveMasterclassLandingSnapshot: vi.fn(),
  deleteMasterclassLandingSnapshot: vi.fn(),
  clearObjectiveProgress: vi.fn(),
  clearMetricProgress: vi.fn(),
}));

vi.mock("./db", () => mocks);

import { appRouter } from "./routers";

function createContext(): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "collaborator-7",
      email: "collaborator@example.com",
      name: "Colaboradora",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("planning router", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the shared planning state", async () => {
    const payload = { objectives: [], metrics: [], activity: [] };
    mocks.getSharedPlanningState.mockResolvedValue(payload);
    const caller = appRouter.createCaller(createContext());
    await expect(caller.planning.getState()).resolves.toEqual(payload);
  });

  it("saves objective entries with the authenticated actor", async () => {
    mocks.saveObjectiveProgress.mockResolvedValue({ updatedAt: 123, updatedByName: "Colaboradora" });
    const caller = appRouter.createCaller(createContext());
    const entries = [{ key: "audiencia", target: "1000", current: "240", note: "Primeira leitura", validated: false }];
    await caller.planning.saveObjectives({ entries, actorName: "Colaboradora" });
    expect(mocks.saveObjectiveProgress).toHaveBeenCalledWith(entries, { id: 0, name: "Colaboradora" });
  });

  it("saves metric entries with the authenticated actor", async () => {
    mocks.saveMetricProgress.mockResolvedValue({ updatedAt: 456, updatedByName: "Colaboradora" });
    const caller = appRouter.createCaller(createContext());
    const entries = [{ key: "conteudo::Alcance qualificado", target: "5000", actual: "1800", note: "Semana 1", done: true }];
    await caller.planning.saveMetrics({ entries, actorName: "Colaboradora" });
    expect(mocks.saveMetricProgress).toHaveBeenCalledWith(entries, { id: 0, name: "Colaboradora" });
  });

  it("saves capacity and eight monthly sales values for all six congresses", async () => {
    mocks.saveOccupancyProgress.mockResolvedValue({ updatedAt: 789, updatedByName: "Colaboradora" });
    const caller = appRouter.createCaller(createContext());
    const congressKeys = ["gestao-academias", "wttc", "sonafe", "nutricao-estetica", "nutricao-esportiva", "bodybuilding"] as const;
    const monthKeys = ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"] as const;
    const entries = congressKeys.map(congressKey => ({
      congressKey,
      capacity: congressKey === "gestao-academias" ? 600 : null,
      expandedCapacity: congressKey === "nutricao-estetica" ? 240 : null,
      expansionConfirmed: false,
      expansionActive: false,
      monthlySales: monthKeys.map(monthKey => ({ monthKey, sold: monthKey === "2026-09" ? 12 : 0 })),
    }));
    await caller.planning.saveOccupancy({ entries, actorName: "Colaboradora" });
    expect(mocks.saveOccupancyProgress).toHaveBeenCalledWith(entries, { id: 0, name: "Colaboradora" });
  });

  it("rejects occupancy payloads with zero capacity or incomplete months", async () => {
    const caller = appRouter.createCaller(createContext());
    const invalidEntries = [{ congressKey: "wttc" as const, capacity: 0, expandedCapacity: null, expansionConfirmed: false, expansionActive: false, monthlySales: [{ monthKey: "2026-09" as const, sold: 10 }] }];
    await expect(caller.planning.saveOccupancy({ entries: invalidEntries, actorName: "Colaboradora" })).rejects.toThrow();
    expect(mocks.saveOccupancyProgress).not.toHaveBeenCalled();
  });

  it("rejects an active expansion without a larger expanded capacity", async () => {
    const caller = appRouter.createCaller(createContext());
    const monthKeys = ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"] as const;
    const congressKeys = ["gestao-academias", "wttc", "sonafe", "nutricao-estetica", "nutricao-esportiva", "bodybuilding"] as const;
    const entries = congressKeys.map(congressKey => ({
      congressKey,
      capacity: congressKey === "nutricao-estetica" ? 162 : 279,
      expandedCapacity: congressKey === "nutricao-estetica" ? 162 : null,
      expansionConfirmed: congressKey === "nutricao-estetica",
      expansionActive: congressKey === "nutricao-estetica",
      monthlySales: monthKeys.map(monthKey => ({ monthKey, sold: 0 })),
    }));
    await expect(caller.planning.saveOccupancy({ entries })).rejects.toThrow();
    expect(mocks.saveOccupancyProgress).not.toHaveBeenCalled();
  });

  it("blocks the expanded target until the operation confirms the auditorium", async () => {
    const caller = appRouter.createCaller(createContext());
    const monthKeys = ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"] as const;
    const congressKeys = ["gestao-academias", "wttc", "sonafe", "nutricao-estetica", "nutricao-esportiva", "bodybuilding"] as const;
    const entries = congressKeys.map(congressKey => ({
      congressKey,
      capacity: congressKey === "nutricao-estetica" ? 162 : 279,
      expandedCapacity: congressKey === "nutricao-estetica" ? 240 : null,
      expansionConfirmed: false,
      expansionActive: congressKey === "nutricao-estetica",
      monthlySales: monthKeys.map(monthKey => ({ monthKey, sold: 0 })),
    }));
    await expect(caller.planning.saveOccupancy({ entries })).rejects.toThrow(/Confirme operacionalmente/);
    expect(mocks.saveOccupancyProgress).not.toHaveBeenCalled();
  });

  it("saves eight monthly social results without authentication", async () => {
    mocks.saveSocialMonthlyResults.mockResolvedValue({ updatedAt: 790 });
    const monthKeys = ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"] as const;
    const entries = monthKeys.map((monthKey, index) => ({
      monthKey,
      accountsReached: index === 0 ? 32000 : null,
      views: index === 0 ? 60000 : null,
      interactions: index === 0 ? 2400 : null,
      netFollowers: index === 0 ? 100 : null,
      metaMessagesSent: index === 0 ? 850 : null,
      reelsPublished: null,
      reelsMedianReach: null,
      reelsMedianViews: null,
      reelsMedianInteractions: null,
      reelsMedianShares: null,
      reelsMedianSaves: null,
      carouselsPublished: null,
      carouselsMedianReach: null,
      carouselsMedianViews: null,
      carouselsMedianInteractions: null,
      carouselsMedianShares: null,
      carouselsMedianSaves: null,
      storiesPublished: null,
      storiesMedianReach: null,
      storiesMedianViews: null,
      storyReplies: null,
      storyLinkClicks: null,
      storyStickerTaps: null,
      storyProfileVisits: null,
      note: index === 0 ? "Primeiro mês da campanha" : "",
    }));
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    await caller.planning.saveSocialResults({ entries });
    expect(mocks.saveSocialMonthlyResults).toHaveBeenCalledTimes(1);
    expect(mocks.saveSocialMonthlyResults.mock.calls[0]?.[0]).toMatchObject(entries);
  });

  it("saves eight monthly WhatsApp results without authentication", async () => {
    mocks.saveWhatsAppMonthlyResults.mockResolvedValue({ updatedAt: 791 });
    const monthKeys = ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"] as const;
    const entries = monthKeys.map((monthKey, index) => ({ monthKey, delivered: index === 0 ? 480 : null, linkClicks: index === 0 ? 42 : null, replies: index === 0 ? 18 : null, optOuts: index === 0 ? 2 : null, attributedPurchases: index === 0 ? 3 : null, humanHandoffs: index === 0 ? 9 : null, note: "" }));
    const caller = appRouter.createCaller(createContext());
    await caller.planning.saveWhatsAppResults({ entries });
    expect(mocks.saveWhatsAppMonthlyResults).toHaveBeenCalledWith(entries);
  });

  it("rejects estimated, negative or incomplete social payloads", async () => {
    const caller = appRouter.createCaller(createContext());
    const invalidEntry = {
      monthKey: "2026-09" as const,
      accountsReached: -1,
      views: null,
      interactions: null,
      netFollowers: -20,
      reelsPublished: null,
      reelsMedianReach: null,
      reelsMedianViews: null,
      reelsMedianInteractions: null,
      reelsMedianShares: null,
      reelsMedianSaves: null,
      carouselsPublished: null,
      carouselsMedianReach: null,
      carouselsMedianViews: null,
      carouselsMedianInteractions: null,
      carouselsMedianShares: null,
      carouselsMedianSaves: null,
      storiesPublished: null,
      storiesMedianReach: null,
      storiesMedianViews: null,
      storyReplies: null,
      storyLinkClicks: null,
      storyStickerTaps: null,
      storyProfileVisits: null,
      note: "",
    };
    await expect(caller.planning.saveSocialResults({ entries: [invalidEntry] as never })).rejects.toThrow();
    expect(mocks.saveSocialMonthlyResults).not.toHaveBeenCalled();
  });

  it("saves caption, artwork link and status for one calendar item without authentication", async () => {
    mocks.saveCalendarWorkflow.mockResolvedValue({ updatedAt: 987 });
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    const entry = {
      calendarItemId: "0923b",
      caption: "Legenda em revisão pelo cliente.",
      artworkUrl: "https://drive.google.com/file/d/example/view",
      status: "aprovar-arte" as const,
    };
    await caller.planning.saveCalendarWorkflow(entry);
    expect(mocks.saveCalendarWorkflow).toHaveBeenCalledWith(entry);
  });

  it("rejects invalid workflow status and non-HTTPS artwork links", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.planning.saveCalendarWorkflow({
      calendarItemId: "0923b",
      caption: "Legenda",
      artworkUrl: "javascript:alert(1)",
      status: "aprovar-arte",
    })).rejects.toThrow();
    await expect(caller.planning.saveCalendarWorkflow({
      calendarItemId: "0923b",
      caption: "Legenda",
      artworkUrl: "https://drive.google.com/file/d/example/view",
      status: "status-inexistente" as never,
    })).rejects.toThrow();
    expect(mocks.saveCalendarWorkflow).not.toHaveBeenCalled();
  });

  it("saves preview link and email-specific status without authentication", async () => {
    mocks.saveEmailWorkflow.mockResolvedValue({ updatedAt: 988 });
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    const entry = {
      emailItemId: "email-base-masterclasses",
      previewUrl: "https://app.rdstation.com.br/email/preview/example",
      status: "aprovar-texto-adri" as const,
    };
    await caller.planning.saveEmailWorkflow(entry);
    expect(mocks.saveEmailWorkflow).toHaveBeenCalledWith(entry);
  });

  it("rejects invalid email status, item id and non-HTTPS preview links", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.planning.saveEmailWorkflow({
      emailItemId: "email-base-masterclasses",
      previewUrl: "http://example.com/preview",
      status: "aprovar-texto-adri",
    })).rejects.toThrow();
    await expect(caller.planning.saveEmailWorkflow({
      emailItemId: "masterclasses",
      previewUrl: "https://example.com/preview",
      status: "aprovar-texto-adri",
    })).rejects.toThrow();
    await expect(caller.planning.saveEmailWorkflow({
      emailItemId: "email-base-masterclasses",
      previewUrl: "https://example.com/preview",
      status: "aprovar-arte-social" as never,
    })).rejects.toThrow();
    expect(mocks.saveEmailWorkflow).not.toHaveBeenCalled();
  });

  it("saves a dispatched email with progressive metrics without authentication", async () => {
    mocks.saveEmailPerformance.mockResolvedValue({ updatedAt: 989 });
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    const entry = {
      campaignName: "Masterclasses · entrega imediata",
      subject: "Suas três masterclasses estão disponíveis",
      sentAt: Date.UTC(2026, 8, 4, 12),
      emailUrl: "https://example.com/email-enviado",
      openRate: 31.4,
      clickRate: null,
      unsubscribeRate: null,
      spamRate: null,
      deliveredCount: null,
      uniqueClicks: null,
      attributedConversions: null,
      attributedRevenueCents: null,
    };
    await caller.planning.saveEmailPerformance(entry);
    expect(mocks.saveEmailPerformance).toHaveBeenCalledWith(entry);
  });

  it("rejects invalid rates, future sends and non-HTTPS sent email links", async () => {
    const caller = appRouter.createCaller(createContext());
    const valid = {
      campaignName: "Campanha",
      subject: "Assunto",
      sentAt: Date.UTC(2026, 8, 4, 12),
      emailUrl: "https://example.com/email",
      openRate: 30,
      clickRate: 5,
      unsubscribeRate: 0.2,
      spamRate: 0.01,
      deliveredCount: null,
      uniqueClicks: null,
      attributedConversions: null,
      attributedRevenueCents: null,
    };
    await expect(caller.planning.saveEmailPerformance({ ...valid, clickRate: 101 })).rejects.toThrow();
    await expect(caller.planning.saveEmailPerformance({ ...valid, emailUrl: "http://example.com/email" })).rejects.toThrow();
    await expect(caller.planning.saveEmailPerformance({ ...valid, sentAt: Date.now() + 172_800_000 })).rejects.toThrow(/futuro/);
    expect(mocks.saveEmailPerformance).not.toHaveBeenCalled();
  });

  it("deletes an email performance entry without authentication", async () => {
    mocks.deleteEmailPerformance.mockResolvedValue({ deletedId: 17 });
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    await caller.planning.deleteEmailPerformance({ id: 17 });
    expect(mocks.deleteEmailPerformance).toHaveBeenCalledWith(17);
  });

  it("saves a news landing page snapshot without authentication", async () => {
    mocks.saveLeadProfileSnapshot.mockResolvedValue({ updatedAt: 990 });
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    const entry = {
      periodStartAt: Date.UTC(2026, 8, 1, 12), periodEndAt: Date.UTC(2026, 8, 4, 12), totalLeads: 100, newLeads: 20,
      sessions: null, dmSessions: null, formStarts: null, dmConversions: null,
      firstTimeCount: 50, attended2026Count: 30, attendedPastCount: 20,
      nutritionAestheticsCount: 55, sportsNutritionCount: 50, sportsPhysioCount: 25, businessManagementCount: 20,
      physicalEducationCount: 30, bodybuildingCount: 15, otherInterestCount: 5,
      note: "Relatório filtrado da LP",
    };
    await caller.planning.saveLeadProfileSnapshot(entry);
    expect(mocks.saveLeadProfileSnapshot).toHaveBeenCalledWith(entry);
  });

  it("rejects inconsistent lead snapshots", async () => {
    const caller = appRouter.createCaller(createContext());
    const entry = {
      periodStartAt: Date.UTC(2026, 8, 1, 12), periodEndAt: Date.UTC(2026, 8, 4, 12), totalLeads: 100, newLeads: 120,
      sessions: null, dmSessions: null, formStarts: null, dmConversions: null,
      firstTimeCount: 101, attended2026Count: null, attendedPastCount: null,
      nutritionAestheticsCount: null, sportsNutritionCount: null, sportsPhysioCount: null, businessManagementCount: null,
      physicalEducationCount: null, bodybuildingCount: null, otherInterestCount: null,
      note: "",
    };
    await expect(caller.planning.saveLeadProfileSnapshot(entry)).rejects.toThrow();
    expect(mocks.saveLeadProfileSnapshot).not.toHaveBeenCalled();
  });

  it("deletes a lead profile snapshot without authentication", async () => {
    mocks.deleteLeadProfileSnapshot.mockResolvedValue({ deletedId: 18 });
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    await caller.planning.deleteLeadProfileSnapshot({ id: 18 });
    expect(mocks.deleteLeadProfileSnapshot).toHaveBeenCalledWith(18);
  });

  it("saves a masterclass landing snapshot without authentication", async () => {
    mocks.saveMasterclassLandingSnapshot.mockResolvedValue({ updatedAt: 991 });
    const ctx = createContext(); ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    const entry = {
      periodStartAt: Date.UTC(2026, 8, 1, 12), periodEndAt: Date.UTC(2026, 8, 8, 12), totalLeads: 120, newLeads: 30,
      sessions: 200, dmSessions: 40, formStarts: 50, dmConversions: 8, thankYouPageAccesses: 24,
      anaLessonStarts: 12, anaLessonCompletions: 6, andreiaLessonStarts: 10, andreiaLessonCompletions: 4,
      robertoLessonStarts: 8, robertoLessonCompletions: 3, congressHubClicks: 7, newsLpClicks: 2, salesPageClicks: null, note: "Eventos validados",
    };
    await caller.planning.saveMasterclassLandingSnapshot(entry);
    expect(mocks.saveMasterclassLandingSnapshot).toHaveBeenCalledWith(entry);
  });

  it("rejects inconsistent masterclass consumption and allows anonymous deletion", async () => {
    const caller = appRouter.createCaller(createContext());
    const entry = {
      periodStartAt: 1, periodEndAt: 2, totalLeads: 10, newLeads: 5, sessions: 20, dmSessions: 2, formStarts: 8, dmConversions: 1,
      thankYouPageAccesses: 5, anaLessonStarts: 3, anaLessonCompletions: 4, andreiaLessonStarts: null, andreiaLessonCompletions: null,
      robertoLessonStarts: null, robertoLessonCompletions: null, congressHubClicks: null, newsLpClicks: null, salesPageClicks: null, note: "",
    };
    await expect(caller.planning.saveMasterclassLandingSnapshot(entry)).rejects.toThrow();
    expect(mocks.saveMasterclassLandingSnapshot).not.toHaveBeenCalled();
    mocks.deleteMasterclassLandingSnapshot.mockResolvedValue({ deletedId: 19 });
    const anonymous = createContext(); anonymous.user = null;
    await appRouter.createCaller(anonymous).planning.deleteMasterclassLandingSnapshot({ id: 19 });
    expect(mocks.deleteMasterclassLandingSnapshot).toHaveBeenCalledWith(19);
  });

  it("allows shared reading without an authenticated user", async () => {
    const payload = { objectives: [], metrics: [], activity: [] };
    mocks.getSharedPlanningState.mockResolvedValue(payload);
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    await expect(caller.planning.getState()).resolves.toEqual(payload);
  });

  it("propagates a database save failure to the client", async () => {
    mocks.saveObjectiveProgress.mockRejectedValue(new Error("Banco temporariamente indisponível"));
    const caller = appRouter.createCaller(createContext());
    const entries = [{ key: "audiencia", target: "1000", current: "240", note: "Primeira leitura", validated: false }];
    await expect(caller.planning.saveObjectives({ entries, actorName: "Colaboradora" })).rejects.toThrow("Banco temporariamente indisponível");
  });
});
