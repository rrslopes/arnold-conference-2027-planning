import { describe, expect, it } from "vitest";
import { calendar } from "../client/src/data/planData";

describe("grandes marcos do calendário", () => {
  const milestones = calendar.filter(item => item.milestone);

  it("destaca os marcos de setembro, o anúncio e a abertura de outubro", () => {
    expect(milestones.map(item => item.id)).toEqual(["0908", "0915", "0918", "0930", "1006"]);
    expect(milestones.find(item => item.id === "0908")?.milestone?.label).toBe("Lançamento das masterclasses");
    expect(milestones.find(item => item.id === "0915")?.milestone?.label).toBe("Captação para novidades");
    expect(milestones.find(item => item.id === "0918")?.milestone?.label).toBe("Profundidade confirmada");
  });

  it("atribui uma cor semântica distinta a cada tipo de marco", () => {
    expect(milestones.find(item => item.id === "0908")?.milestone?.tone).toBe("masterclass");
    expect(milestones.filter(item => item.id === "0915" || item.id === "0918").every(item => item.milestone?.tone === "lead")).toBe(true);
    expect(milestones.filter(item => item.id === "0930" || item.id === "1006").every(item => item.milestone?.tone === "sales")).toBe(true);
  });

  it("exige pack de mídia paga em todos os conteúdos dos marcos", () => {
    for (const item of milestones) {
      expect(item.milestone?.paidMediaPack.label).toBe("Pack de artes para mídia paga");
      expect(item.milestone?.paidMediaPack.requirement.length).toBeGreaterThan(80);
    }
  });

  it("informa formatos e rastreamento sem prescrever direção criativa", () => {
    const requirements = milestones.map(item => item.milestone?.paidMediaPack.requirement).join(" ");
    expect(requirements).toContain("1:1");
    expect(requirements).toContain("4:5");
    expect(requirements).toContain("9:16");
    expect(requirements).toMatch(/rastreáve|URLs aprovados/);
    expect(requirements).not.toMatch(/cor da arte|tipografia|layout obrigatório/i);
  });
});
