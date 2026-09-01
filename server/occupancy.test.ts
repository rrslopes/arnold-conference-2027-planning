import { describe, expect, it } from "vitest";
import { calculateOccupancy, getActiveCapacity, getExpansionStatus, OCCUPANCY_CONGRESSES, SALES_MONTHS } from "../shared/occupancy";

describe("cálculos de lotação", () => {
  it("mantém o percentual indefinido enquanto a capacidade não existe", () => {
    expect(calculateOccupancy(null, { "2026-09": 35 })).toEqual({
      sold: 35,
      capacity: null,
      remaining: null,
      percentage: null,
      barPercentage: 0,
      overCapacity: 0,
    });
  });

  it("soma vendas mensais e calcula progresso e vagas restantes", () => {
    const result = calculateOccupancy(600, { "2026-09": 120, "2026-10": 180, "2026-11": 60 });
    expect(result.sold).toBe(360);
    expect(result.remaining).toBe(240);
    expect(result.percentage).toBe(60);
    expect(result.barPercentage).toBe(60);
  });

  it("limita a barra em 100% e informa vendas acima da capacidade", () => {
    const result = calculateOccupancy(100, { "2026-09": 80, "2026-10": 35 });
    expect(result.percentage).toBeCloseTo(115, 8);
    expect(result.barPercentage).toBe(100);
    expect(result.remaining).toBe(0);
    expect(result.overCapacity).toBe(15);
  });

  it("ignora valores negativos ou inválidos no acumulado", () => {
    const result = calculateOccupancy(200, { "2026-09": 50, "2026-10": -8, "2026-11": Number.NaN });
    expect(result.sold).toBe(50);
    expect(result.percentage).toBe(25);
  });

  it("mantém seis congressos e oito competências mensais até abril de 2027", () => {
    expect(OCCUPANCY_CONGRESSES).toHaveLength(6);
    expect(SALES_MONTHS).toHaveLength(8);
    expect(SALES_MONTHS[0].key).toBe("2026-09");
    expect(SALES_MONTHS.at(-1)?.key).toBe("2027-04");
  });

  it("mantém 162 como meta vigente até a expansão ser confirmada", () => {
    expect(getActiveCapacity(162, 240, false)).toBe(162);
    expect(getActiveCapacity(162, 240, true)).toBe(240);
  });

  it("sinaliza a faixa de decisão a partir de 80% e a necessidade ao atingir 162", () => {
    expect(getExpansionStatus(162, 129, false)).toBe("inactive");
    expect(getExpansionStatus(162, 130, false)).toBe("decision");
    expect(getExpansionStatus(162, 162, false)).toBe("required");
    expect(getExpansionStatus(162, 162, true)).toBe("active");
  });
});
