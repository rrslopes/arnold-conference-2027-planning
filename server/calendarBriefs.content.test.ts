import { describe, expect, it } from "vitest";
import { calendar } from "../client/src/data/planData";

describe("briefings operacionais do calendário", () => {
  it("cobre as 28 pautas históricas e as 23 entradas da nova fase com sequência explícita ou aprovação prévia", () => {
    expect(calendar).toHaveLength(51);
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
    expect(item?.productionBrief?.units.filter(unit => unit.sourceUrl)).toHaveLength(3);
    expect(item?.productionBrief?.units.filter(unit => unit.sourceUrl).every(unit => unit.sourceUrl === reelUrl)).toBe(true);
  });

  it("vincula somente os materiais com correspondência inequívoca às pautas", () => {
    const linkedItems = calendar.filter(item => item.materialLinks?.length).map(item => item.id);
    expect(linkedItems).toEqual(["0904", "0906", "0908", "0910", "0911", "0918", "0919", "0921", "0923", "0925", "1002", "1021", "1024"]);

    const links = calendar.flatMap(item => item.materialLinks ?? []);
    expect(new Set(links.map(link => link.url))).toEqual(new Set([
      "https://www.youtube.com/watch?v=asItej-OIk8",
      "https://youtu.be/tAqcK_GgzD8",
      "https://youtu.be/QSjVRVEvZMs",
      "https://youtu.be/8hnvXCzfd3U",
      "https://youtu.be/qCvC2bwxV_0",
      "https://youtu.be/nze1GDIzj9c",
      "https://www.instagram.com/reels/DYfnzGHP81D/",
      "https://www.instagram.com/p/DTnBm0Qlo0Q/",
      "https://docs.google.com/spreadsheets/d/1P6EooZAA6mVkYVMC-hVUfbBvGfxxCx-8/edit?gid=656380718#gid=656380718",
      "https://drive.google.com/drive/folders/1Ku_LPpWtnt8nji762YzGQnjopbWj2md2",
      "https://drive.google.com/drive/folders/1a_jJtOn4Pux1oUpMLgXfFkvpLLnRcnZ9?usp=sharing",
      "https://drive.google.com/drive/folders/12OxnbkavM9TcW0rRhKh6RTVI8pVJ3pUp?usp=drive_link",
      "https://drive.google.com/drive/folders/1B_q9pMY_4TLs2_1g2qvl6oKi2vtm14DM?usp=drive_link",
    ]));

    expect(calendar.find(item => item.id === "0925")?.materialLinks?.map(link => link.label).join(" ")).not.toContain("Luisa");
    expect(calendar.find(item => item.id === "0927")?.materialLinks).toBeUndefined();
  });

  it("explicita pesquisa, entregas, validação e fallback quando a agência precisa buscar prova", () => {
    const researchItems = calendar.filter(item => item.agencyResearch);
    expect(researchItems.map(item => item.id)).toEqual(["0928", "1001", "1002", "1003", "1008", "1010", "1012", "1013", "1014", "1016", "1018", "1020", "1021", "1024", "1027", "1029", "1031"]);
    for (const item of researchItems) {
      expect(item.agencyResearch?.owner.length, item.id).toBeGreaterThan(10);
      expect(item.agencyResearch?.deliverables.length, item.id).toBeGreaterThanOrEqual(4);
      expect(item.agencyResearch?.validation.length, item.id).toBeGreaterThan(20);
      expect(item.agencyResearch?.fallback.length, item.id).toBeGreaterThan(20);
    }
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
