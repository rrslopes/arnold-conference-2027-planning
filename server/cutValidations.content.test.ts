import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calendar } from "../client/src/data/planData";

const auditedIds = ["0904", "0906", "0910", "0911", "0921", "0925"];

describe("auditoria dos cortes de palestras", () => {
  it("mantém as seis pautas dependentes de acervo com evidência explícita", () => {
    const audited = calendar.filter(item => auditedIds.includes(item.id));
    expect(audited).toHaveLength(6);
    audited.forEach(item => expect(item.cutValidations?.length).toBeGreaterThan(0));
  });

  it("registra treze buscas auditadas com fonte, excerto, localização e orientação de uso", () => {
    const appearances = calendar.filter(item => auditedIds.includes(item.id)).flatMap(item => item.cutValidations ?? []);
    const cuts = [...new Map(appearances.map(cut => [cut.id, cut])).values()];
    expect(appearances).toHaveLength(16);
    expect(cuts).toHaveLength(13);
    cuts.forEach(cut => {
      expect(cut.sourceTitle.length).toBeGreaterThan(15);
      expect(cut.excerpt.length).toBeGreaterThan(35);
      expect(cut.location.length).toBeGreaterThan(12);
      expect(cut.productionNote.length).toBeGreaterThan(30);
    });
  });

  it("informa a íntegra e a minutagem sem inventar precisão ou URL", () => {
    const cuts = [...new Map(calendar.flatMap(item => item.cutValidations ?? []).map(cut => [cut.id, cut])).values()];
    const urls = [...new Set(cuts.flatMap(cut => cut.sourceUrl ? [cut.sourceUrl] : []))];
    expect(urls.sort()).toEqual([
      "https://www.youtube.com/watch?v=asItej-OIk8",
      "https://youtu.be/7nACkId-GGw",
      "https://youtu.be/8hnvXCzfd3U",
      "https://youtu.be/A3so_9sBi0M",
      "https://youtu.be/QSjVRVEvZMs",
      "https://youtu.be/Z9ZiclgTjG8",
      "https://youtu.be/iJLL-3OZmrE",
      "https://youtu.be/nze1GDIzj9c",
      "https://youtu.be/qCvC2bwxV_0",
      "https://youtu.be/tAqcK_GgzD8",
      "https://youtu.be/v0BaKxCH-2A",
    ].sort());
    expect(cuts.filter(cut => cut.speaker === "Ana Paula Pujol").every(cut => cut.location.toLowerCase().includes("aproxim") || cut.location.toLowerCase().includes("sem timestamp nativo"))).toBe(true);
    expect(cuts.filter(cut => cut.speaker !== "Ana Paula Pujol").every(cut => /\d{2}:\d{2}/.test(cut.location))).toBe(true);
  });

  it("nunca apresenta confirmação textual como aprovação final do vídeo", () => {
    const cuts = calendar.flatMap(item => item.cutValidations ?? []);
    cuts.forEach(cut => expect(cut.videoStatus).toBe("Conferência no vídeo original pendente"));
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

  it("exibe título da íntegra, minutagem e link somente quando disponível", () => {
    const source = readFileSync(new URL("../client/src/components/CalendarExplorer.tsx", import.meta.url), "utf8");
    expect(source).toContain("ÍNTEGRA 2026");
    expect(source).toContain("MINUTAGEM");
    expect(source).toContain("cut.sourceUrl ?");
  });
});
