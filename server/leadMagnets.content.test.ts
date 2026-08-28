import { describe, expect, it } from "vitest";
import { leadMagnets } from "../client/src/data/planData";

describe("portfólio detalhado de iscas", () => {
  it("mantém a masterclass pronta e seus três títulos oficiais", () => {
    const masterclasses = leadMagnets.find(item => item.id === 1);
    expect(masterclasses?.status).toBe("pronto");
    expect(masterclasses?.masterclasses?.map(item => item.officialTitle)).toEqual([
      "Estratégias Nutricionais para Emagrecimento",
      "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática",
      "Academias em Alta Potência: de corpo, mente e alma",
    ]);
  });

  it("detalha dez perguntas e a entrega do Diagnóstico sem expor pesos", () => {
    const diagnostic = leadMagnets.find(item => item.id === 2);
    expect(diagnostic?.title).toBe("Diagnóstico Arnold 2027");
    expect(diagnostic?.questions).toHaveLength(10);
    expect(diagnostic?.questions?.every(question => question.criterion.length > 20)).toBe(true);
    expect(diagnostic?.questions?.every(question => question.answerExamples.length >= 4)).toBe(true);
    expect(diagnostic?.resultDelivery?.length).toBeGreaterThanOrEqual(6);
    expect(JSON.stringify(diagnostic)).not.toContain('"weight"');
    expect(JSON.stringify(diagnostic)).not.toContain('"score"');
  });

  it("aplica os nomes aprovados e evita repetir Mapa nas iscas 4 e 5", () => {
    expect(leadMagnets.find(item => item.id === 3)?.title).toBe("Mapa de Crescimento da Academia");
    expect(leadMagnets.find(item => item.id === 4)?.title).toBe("Antes de Repetir o Protocolo");
    expect(leadMagnets.find(item => item.id === 5)?.title).toBe("O Protocolo Certo no Atleta Errado");
    expect(leadMagnets.filter(item => [4, 5].includes(item.id)).every(item => !item.title.toLowerCase().includes("mapa"))).toBe(true);
  });

  it("inclui ranking e pauta detalhada nas três iscas especializadas", () => {
    for (const id of [3, 4, 5]) {
      const item = leadMagnets.find(entry => entry.id === id);
      expect(item?.sourceRanking?.length).toBeGreaterThanOrEqual(5);
      expect(item?.contentBlocks?.length).toBeGreaterThanOrEqual(8);
      expect(item?.campaignTitle?.length).toBeGreaterThan(15);
      expect(item?.campaignSubtitle?.length).toBeGreaterThan(40);
    }
  });
});
