import { describe, expect, it } from "vitest";
import { calendar } from "../client/src/data/planData";

describe("briefings operacionais do calendário", () => {
  it("cobre todas as 30 pautas com sequência explícita ou aprovação prévia", () => {
    expect(calendar).toHaveLength(30);
    for (const item of calendar) {
      const hasExplicitSequence = Boolean(item.productionBrief?.units.length || item.storyCards?.length);
      const isPreviouslyApproved = item.id === "0831";
      expect(hasExplicitSequence || isPreviouslyApproved, `${item.date} — ${item.title}`).toBe(true);
    }
  });

  it("detalha card a card todas as peças que incluem carrossel", () => {
    const carouselItems = calendar.filter(item => item.channel.toLowerCase().includes("carrossel"));
    expect(carouselItems.length).toBeGreaterThan(8);
    for (const item of carouselItems) {
      expect(item.productionBrief?.format.toLowerCase(), item.id).toContain("carrossel");
      expect(item.productionBrief?.units.length, item.id).toBeGreaterThanOrEqual(5);
    }
  });

  it("transforma 21/09 em um único carrossel de seis cards", () => {
    const item = calendar.find(entry => entry.id === "0921");
    expect(item?.productionBrief?.units).toHaveLength(6);
    expect(item?.productionBrief?.units.map(unit => unit.role)).toEqual([
      "Contexto",
      "Evidência versus moda",
      "Estratégia individual versus receita pronta",
      "Desempenho imediato versus saúde sustentável",
      "Síntese",
      "Lembrete",
    ]);
    expect(item?.optionMode).toBe("inputs");
  });

  it("transforma 25/09 em um único carrossel de seis cards ancorado em 2026", () => {
    const item = calendar.find(entry => entry.id === "0925");
    expect(item?.productionBrief?.units).toHaveLength(6);
    expect(JSON.stringify(item?.productionBrief)).toContain("2026");
    expect(item?.productionBrief?.note).toContain("Não afirmar");
    expect(item?.optionMode).toBe("inputs");
  });

  it("distingue insumos da sequência e alternativas excludentes", () => {
    expect(calendar.find(item => item.id === "0904")?.optionMode).toBe("alternatives");
    expect(calendar.find(item => item.id === "0915")?.optionMode).toBe("alternatives");
    expect(calendar.find(item => item.id === "0923b")?.optionMode).toBe("alternatives");
    expect(calendar.find(item => item.id === "0903")?.optionMode).toBe("inputs");
    expect(calendar.find(item => item.id === "0921")?.optionMode).toBe("inputs");
    expect(calendar.find(item => item.id === "0925")?.optionMode).toBe("inputs");
  });
});
