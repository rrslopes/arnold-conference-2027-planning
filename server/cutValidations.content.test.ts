import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calendar } from "../client/src/data/planData";

// 0925 saiu de setembro: o carrossel foi publicado em 01/10 (card 1001) e outubro não exibe auditoria interna.
const auditedIds = ["0904", "0906", "0910", "0911", "0921"];

describe("auditoria dos cortes de palestras", () => {
  it("mantém as cinco pautas dependentes de acervo com evidência explícita", () => {
    const audited = calendar.filter(item => auditedIds.includes(item.id));
    expect(audited).toHaveLength(5);
    audited.forEach(item => expect(item.cutValidations?.length).toBeGreaterThan(0));
  });

  it("registra dez buscas auditadas com fonte, excerto, localização e orientação de uso", () => {
    const appearances = calendar.filter(item => auditedIds.includes(item.id)).flatMap(item => item.cutValidations ?? []);
    const cuts = [...new Map(appearances.map(cut => [cut.id, cut])).values()];
    expect(appearances).toHaveLength(13);
    expect(cuts).toHaveLength(10);
    cuts.forEach(cut => {
      expect(cut.sourceTitle.length).toBeGreaterThan(15);
      expect(cut.excerpt.length).toBeGreaterThan(35);
      expect(cut.location.length).toBeGreaterThan(12);
      expect(cut.productionNote.length).toBeGreaterThan(30);
    });
  });

  it("mantém as URLs auditadas do histórico de setembro sem misturá-las aos briefings de outubro", () => {
    const cuts = [...new Map(calendar.filter(item => auditedIds.includes(item.id)).flatMap(item => item.cutValidations ?? []).map(cut => [cut.id, cut])).values()];
    const urls = [...new Set(cuts.flatMap(cut => cut.sourceUrl ? [cut.sourceUrl] : []))];
    expect(urls.sort()).toEqual([
      "https://www.youtube.com/watch?v=asItej-OIk8",
      "https://youtu.be/8hnvXCzfd3U",
      "https://youtu.be/QSjVRVEvZMs",
      "https://youtu.be/qCvC2bwxV_0",
      "https://youtu.be/tAqcK_GgzD8",
    ].sort());
    expect(cuts.filter(cut => cut.speaker === "Ana Paula Pujol").every(cut => cut.location.toLowerCase().includes("aproxim") || cut.location.toLowerCase().includes("sem timestamp nativo"))).toBe(true);
    expect(cuts.filter(cut => cut.speaker !== "Ana Paula Pujol").every(cut => /\d{2}:\d{2}/.test(cut.location))).toBe(true);
  });

  it("não expõe auditoria interna nos posts de outubro", () => {
    const october = calendar.filter(item => Number(item.id.slice(0, 4)) >= 928);
    expect(october.every(item => !item.cutValidations?.length)).toBe(true);
  });

  it("sinaliza os dois recortes cuja formulação precisou ser alterada", () => {
    const september21 = calendar.find(item => item.id === "0921");
    const reformulated = september21?.cutValidations?.filter(cut => cut.transcriptStatus === "Tema confirmado; recorte reformulado");
    expect(reformulated?.map(cut => cut.id)).toEqual(["C09", "C10"]);
    expect(reformulated?.find(cut => cut.id === "C10")?.productionNote).toContain("custo clínico");
  });

  it("substitui as formulações genéricas de 04/09 e 10/09 por trechos localizados", () => {
    for (const id of ["0904", "0910"]) {
      const item = calendar.find(entry => entry.id === id);
      expect(item?.origin).toContain("localizadas nas transcrições");
      expect(item?.options?.join(" ")).toContain("15:18–15:35");
      expect(item?.options?.join(" ")).toContain("09:08–09:32");
      expect(item?.options?.join(" ")).not.toContain("falta de força de vontade");
    }
  });

  it("exibe material, fonte e link diretamente no briefing da agência", () => {
    const source = readFileSync(new URL("../client/src/components/CalendarExplorer.tsx", import.meta.url), "utf8");
    expect(source).toContain("ORIGEM / MATERIAL");
    expect(source).toContain("FONTE");
    expect(source).toContain("getSourceUrl(unit)");
    expect(source).not.toContain("EVIDÊNCIA DE CORTE");
    expect(source).not.toContain("MINUTAGEM");
  });
});
