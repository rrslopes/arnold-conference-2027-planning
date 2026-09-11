import { afterEach, describe, expect, it, vi } from "vitest";
import { brasiliaCivilDate, civilDateFromUtcNoon, civilDateToUtcNoon, firstDayOfBrasiliaMonth, formatTimestampInBrasilia } from "../shared/brasiliaTime";
import { masterclassSyncPeriod } from "./routers/planning";

afterEach(() => vi.useRealTimers());

describe("datas operacionais em Brasília", () => {
  it("mantém 10/09 às 23h40 de Brasília quando o relógio UTC já está em 11/09", () => {
    const instant = new Date("2026-09-11T02:40:00.000Z");
    expect(brasiliaCivilDate(instant)).toBe("2026-09-10");
    expect(firstDayOfBrasiliaMonth(instant)).toBe("2026-09-01");
    expect(formatTimestampInBrasilia(instant.getTime())).toContain("10/09/2026");
    expect(formatTimestampInBrasilia(instant.getTime())).toContain("23:40:00");
  });

  it("preserva a data civil ao persistir no meio-dia UTC", () => {
    const stored = civilDateToUtcNoon("2026-09-10");
    expect(civilDateFromUtcNoon(stored)).toBe("2026-09-10");
  });

  it("bloqueia 11/09 no servidor enquanto Brasília ainda está em 10/09", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-11T02:40:00.000Z"));
    expect(masterclassSyncPeriod.safeParse({ from: "2026-09-01", to: "2026-09-10" }).success).toBe(true);
    expect(masterclassSyncPeriod.safeParse({ from: "2026-09-01", to: "2026-09-11" }).success).toBe(false);
  });
});
