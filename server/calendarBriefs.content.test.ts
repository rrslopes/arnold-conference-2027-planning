import { describe, expect, it } from "vitest";
import { calendar } from "../client/src/data/planData";

describe("briefings operacionais do calendário", () => {
  it("cobre todas as 28 pautas com sequência explícita ou aprovação prévia", () => {
    expect(calendar).toHaveLength(28);
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
      "Continuidade",
    ]);
    expect(item?.optionMode).toBe("inputs");
  });

  it("oferece acesso direto ao Reel usado como referência em 22/09", () => {
    const item = calendar.find(entry => entry.id === "0922");
    const reelUrl = "https://www.instagram.com/reel/DVZDZWEFPP3/";
    expect(item?.originUrl).toBe(reelUrl);
    expect(item?.originLinkLabel).toBe("Abrir Reel de referência no Instagram");
    expect(item?.productionBrief?.units.filter(unit => unit.sourceUrl)).toHaveLength(2);
    expect(item?.productionBrief?.units.filter(unit => unit.sourceUrl).every(unit => unit.sourceUrl === reelUrl)).toBe(true);
  });

  it("transforma 25/09 em um único carrossel de seis cards ancorado em 2026", () => {
    const item = calendar.find(entry => entry.id === "0925");
    expect(item?.productionBrief?.units).toHaveLength(6);
    expect(JSON.stringify(item?.productionBrief)).toContain("2026");
    expect(item?.productionBrief?.note).toContain("Não afirmar");
    expect(item?.optionMode).toBe("inputs");
  });

  it("torna 24/09 um checklist didático com quatro decisões e exemplos de aplicação", () => {
    const item = calendar.find(entry => entry.id === "0924");
    expect(item?.title).toBe("Antes de escolher seu congresso, responda a estas 4 perguntas");
    expect(item?.productionBrief?.units).toHaveLength(6);
    expect(item?.productionBrief?.units.map(unit => unit.role)).toEqual([
      "Por que usar o checklist",
      "1. Momento profissional",
      "2. Desafio prioritário",
      "3. Profundidade esperada",
      "4. Aplicação desejada",
      "Síntese e próximo passo",
    ]);
    expect(item?.productionBrief?.units[2]?.content).toContain("Exemplos possíveis");
    expect(item?.productionBrief?.note).toContain("não é um comparativo");
    expect(item?.optionMode).toBe("inputs");
  });

  it("torna 27/09 um teste de cenários executável com a íntegra de Gláucia", () => {
    const item = calendar.find(entry => entry.id === "0927");
    expect(item?.title).toBe("Sua academia resiste a um cenário que você não projetou?");
    expect(item?.channel).toBe("Reel + carrossel");
    expect(item?.congresses).toEqual(["Gestão de Academias"]);
    expect(item?.productionBrief?.units).toHaveLength(6);
    expect(item?.productionBrief?.units.map(unit => unit.role)).toEqual([
      "A tensão do gestor",
      "O que cenários fazem",
      "Escolha uma incerteza",
      "Desenhe dois cenários",
      "Teste a estratégia",
      "Aprofundamento na masterclass",
    ]);
    expect(item?.cutValidations?.[0]?.speaker).toBe("Gláucia Guarcello");
    expect(item?.cutValidations?.[0]?.location).toContain("41:38.1–42:04.0");
    expect(item?.fallback).toContain("carrossel gráfico de seis cards");
    expect(item?.keyword).toBe("AULAS");
    expect(item?.destination).toBe("Landing page das masterclasses");
    expect(item?.cta).toContain("Academias em Alta Potência");
    expect(item?.productionBrief?.units[5]?.content).toContain("Roberto Tranjan");
    expect(item?.productionBrief?.note).toContain("Não misturar as falas");
    expect(item?.productionBrief?.note).toContain("não atribuir a Roberto o método de cenários");
    expect(item?.productionBrief?.note).toContain("substitui integralmente qualquer menção a bastidores");
    expect(item?.optionMode).toBe("inputs");
  });

  it("distingue insumos da sequência e alternativas excludentes", () => {
    expect(calendar.find(item => item.id === "0904")?.optionMode).toBe("alternatives");
    expect(calendar.find(item => item.id === "0915")?.optionMode).toBe("inputs");
    expect(calendar.find(item => item.id === "0923")?.optionMode).toBe("inputs");
    expect(calendar.find(item => item.id === "0903")?.optionMode).toBe("inputs");
    expect(calendar.find(item => item.id === "0921")?.optionMode).toBe("inputs");
    expect(calendar.find(item => item.id === "0925")?.optionMode).toBe("inputs");
    expect(calendar.find(item => item.id === "0927")?.optionMode).toBe("inputs");
  });

  it("mantém 23/09 como uma única pauta multiformato de aquecimento", () => {
    const september23 = calendar.filter(item => item.date.startsWith("23/09"));
    expect(september23).toHaveLength(1);
    expect(september23[0]?.id).toBe("0923");
    expect(september23[0]?.productionBrief?.units).toHaveLength(6);
    expect(september23[0]?.storyCards).toHaveLength(3);
    expect(september23[0]?.idea).toContain("uma única pauta central");
  });
});
