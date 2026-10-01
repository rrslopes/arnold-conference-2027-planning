import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { civilDateToUtcNoon } from "../shared/brasiliaTime";

const storage = vi.hoisted(() => ({
  rows: new Map<string, { sourceKey: string; monthKey: string; status: "open" | "closed"; snapshotId: number; end: number }>(),
  requests: [] as Array<{ source: string; from: string; to: string }>,
  failFrom: "" as string,
  serial: 0,
}));
vi.mock("./db", () => ({
  getLandingMonthlyBlocks: vi.fn(async (source: string) => [...storage.rows.values()].filter(row => row.sourceKey === source)),
  saveLandingMonthlyBlock: vi.fn(async (source: string, month: string, entry: { periodEndAt: number }, status: "open" | "closed", allowClosed = false) => {
    const key = `${source}:${month}`;
    const old = storage.rows.get(key);
    if (old?.status === "closed" && !allowClosed) throw new Error("closed");
    const id = old?.snapshotId ?? ++storage.serial;
    storage.rows.set(key, { sourceKey: source, monthKey: month, status, snapshotId: id, end: entry.periodEndAt });
    return { id, action: old ? "updated" : "created", monthKey: month, status, updatedAt: Date.now() };
  }),
}));
vi.mock("./integrations/lovableMasterclassMetrics", () => ({
  fetchLovableMasterclassMetrics: vi.fn(async (from: string, to: string) => {
    storage.requests.push({ source: "masterclass-lp", from, to });
    if (storage.failFrom === from) throw new Error("endpoint indisponível");
    return { periodo: { inicio: from, fim: to } };
  }),
  mapLovableMetricsToSnapshot: (payload: { periodo: { fim: string } }) => ({ periodEndAt: civilDateToUtcNoon(payload.periodo.fim) }),
}));
vi.mock("./integrations/lovableNewsMetrics", () => ({
  fetchLovableNewsMetrics: vi.fn(async (from: string, to: string) => {
    storage.requests.push({ source: "conference-news-lp", from, to });
    if (storage.failFrom === from) throw new Error("endpoint indisponível");
    return { periodo: { inicio: from, fim: to } };
  }),
  mapLovableNewsMetricsToSnapshot: (payload: { periodo: { fim: string } }) => ({ periodEndAt: civilDateToUtcNoon(payload.periodo.fim) }),
}));
import { syncCurrentLandingMonth, syncLandingMonth } from "./landingMonthlySync";

beforeEach(() => { storage.rows.clear(); storage.requests.length = 0; storage.serial = 0; storage.failFrom = ""; vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-01T20:00:00Z")); });
afterEach(() => vi.useRealTimers());

describe("sincronização mensal das landing pages", () => {
  it("fecha setembro completo e abre outubro de maneira independente nas duas origens", async () => {
    for (const source of ["masterclass-lp", "conference-news-lp"] as const) {
      const result = await syncCurrentLandingMonth(source);
      expect(result).toMatchObject({ closed: ["2026-09"], from: "2026-10-01", to: "2026-10-01", status: "open" });
      expect(storage.rows.get(`${source}:2026-09`)?.status).toBe("closed");
      expect(storage.rows.get(`${source}:2026-10`)?.status).toBe("open");
      expect(storage.requests.filter(request => request.source === source).map(request => [request.from, request.to])).toEqual([
        ["2026-09-01", "2026-09-30"], ["2026-10-01", "2026-10-01"],
      ]);
    }
  });

  it("atualiza o mesmo bloco em outubro sem tocar em setembro", async () => {
    await syncCurrentLandingMonth("masterclass-lp");
    const september = storage.rows.get("masterclass-lp:2026-09")!;
    const october = storage.rows.get("masterclass-lp:2026-10")!;
    vi.setSystemTime(new Date("2026-10-02T20:00:00Z"));
    const result = await syncCurrentLandingMonth("masterclass-lp");
    expect(result).toMatchObject({ action: "updated", closed: [], to: "2026-10-02", id: october.snapshotId });
    expect(storage.rows.get("masterclass-lp:2026-09")).toEqual(september);
    expect(storage.rows.get("masterclass-lp:2026-10")?.snapshotId).toBe(october.snapshotId);
    expect(storage.requests.at(-1)).toMatchObject({ from: "2026-10-01", to: "2026-10-02" });
  });

  it("fecha outubro inteiro antes de abrir novembro; em erro não abre o novo mês", async () => {
    await syncCurrentLandingMonth("conference-news-lp");
    vi.setSystemTime(new Date("2026-11-01T14:00:00Z"));
    storage.failFrom = "2026-10-01";
    await expect(syncCurrentLandingMonth("conference-news-lp")).rejects.toThrow("endpoint indisponível");
    expect(storage.rows.has("conference-news-lp:2026-11")).toBe(false);
    storage.failFrom = "";
    await syncCurrentLandingMonth("conference-news-lp");
    expect(storage.requests.slice(-2).map(request => [request.from, request.to])).toEqual([
      ["2026-10-01", "2026-10-31"], ["2026-11-01", "2026-11-01"],
    ]);
    expect(storage.rows.get("conference-news-lp:2026-10")?.status).toBe("closed");
    expect(storage.rows.get("conference-news-lp:2026-11")?.status).toBe("open");
  });

  it("impede ressincronizar setembro fechado no fluxo normal antes de chamar o endpoint", async () => {
    await syncCurrentLandingMonth("masterclass-lp");
    const before = storage.requests.length;
    await expect(syncLandingMonth("masterclass-lp", "2026-09", "2026-09-30", true)).rejects.toThrow("fechado");
    expect(storage.requests).toHaveLength(before);
  });
});
