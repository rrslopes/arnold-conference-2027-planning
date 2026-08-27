import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getSharedPlanningState: vi.fn(),
  saveObjectiveProgress: vi.fn(),
  saveMetricProgress: vi.fn(),
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
    await caller.planning.saveObjectives({ entries });
    expect(mocks.saveObjectiveProgress).toHaveBeenCalledWith(entries, expect.objectContaining({ id: 7, name: "Colaboradora" }));
  });

  it("saves metric entries with the authenticated actor", async () => {
    mocks.saveMetricProgress.mockResolvedValue({ updatedAt: 456, updatedByName: "Colaboradora" });
    const caller = appRouter.createCaller(createContext());
    const entries = [{ key: "conteudo::Alcance qualificado", target: "5000", actual: "1800", note: "Semana 1", done: true }];
    await caller.planning.saveMetrics({ entries });
    expect(mocks.saveMetricProgress).toHaveBeenCalledWith(entries, expect.objectContaining({ id: 7 }));
  });

  it("rejects access without an authenticated user", async () => {
    const ctx = createContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);
    await expect(caller.planning.getState()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("propagates a database save failure to the client", async () => {
    mocks.saveObjectiveProgress.mockRejectedValue(new Error("Banco temporariamente indisponível"));
    const caller = appRouter.createCaller(createContext());
    const entries = [{ key: "audiencia", target: "1000", current: "240", note: "Primeira leitura", validated: false }];
    await expect(caller.planning.saveObjectives({ entries })).rejects.toThrow("Banco temporariamente indisponível");
  });
});
