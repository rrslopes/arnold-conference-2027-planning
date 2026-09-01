import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getSharedPlanningState: vi.fn(),
  saveObjectiveProgress: vi.fn(),
  saveMetricProgress: vi.fn(),
  saveOccupancyProgress: vi.fn(),
  saveCalendarWorkflow: vi.fn(),
  saveEmailWorkflow: vi.fn(),
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
