import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { objectives } from "../client/src/data/planData";

const source = readFileSync(new URL("../client/src/components/ObjectiveTracker.tsx", import.meta.url), "utf8");

describe("orientação operacional do painel de objetivos", () => {
  it("explica o que preencher, como obter, quando atualizar e quando validar em todos os objetivos", () => {
    expect(objectives).toHaveLength(7);
    for (const objective of objectives) {
      expect(objective.whatToFill.length).toBeGreaterThan(65);
      expect(objective.howToGet.length).toBeGreaterThan(65);
      expect(objective.whenToUpdate.length).toBeGreaterThan(35);
      expect(objective.targetExample).toMatch(/^Ex\.:/);
      expect(objective.currentExample).toMatch(/^Ex\.:/);
      expect(objective.evidenceExample).toMatch(/^Ex\.:/);
      expect(objective.validationRule.length).toBeGreaterThan(55);
    }
  });

  it("mantém as orientações coerentes com a etapa da jornada", () => {
    const attention = objectives.find(item => item.id === "atencao");
    const capture = objectives.find(item => item.id === "captacao");
    const activation = objectives.find(item => item.id === "ativacao");
    const sale = objectives.find(item => item.id === "venda");
    const expansion = objectives.find(item => item.id === "expansao");
    const experience = objectives.find(item => item.id === "experiencia");

    expect(attention?.howToGet).toContain("Instagram");
    expect(capture?.howToGet).toContain("Central de Landing Pages");
    expect(activation?.howToGet).toContain("Masterclasses");
    expect(sale?.howToGet).toContain("Lotação");
    expect(sale?.validationRule).toContain("compra confirmada");
    expect(expansion?.currentExample).toContain("não aplicável");
    expect(experience?.whenToUpdate).toContain("após o evento");
  });

  it("diferencia o painel de síntese das áreas de origem dos KPIs", () => {
    expect(source).toContain("Registre a conclusão estratégica, não replique todos os KPIs");
    expect(source).toContain("Instagram, Landing Pages, E-mail, WhatsApp e Lotação");
    expect(source).toContain("Meta + unidade + período");
    expect(source).toContain("Mesmo indicador e período");
    expect(source).toContain("Fonte do dado + data/intervalo + decisão tomada");
  });

  it("impede nova validação enquanto os três campos não estiverem preenchidos", () => {
    expect(source).toContain("const readyToValidate = completedFields === 3");
    expect(source).toContain("Preencha critério, resultado e evidência antes de validar esta etapa.");
    expect(source).toContain("aria-disabled={!row.validated && !readyToValidate}");
    expect(source).toContain("`${completedFields}/3 preenchidos`");
  });

  it("explica o efeito dos três botões operacionais sem alterar a persistência compartilhada", () => {
    expect(source).toContain("“Atualizar” busca alterações salvas por outra pessoa");
    expect(source).toContain("“Salvar para a equipe” grava suas mudanças");
    expect(source).toContain("“Limpar” apaga todos os sete registros compartilhados");
    expect(source).toContain("trpc.planning.saveObjectives.useMutation");
    expect(source).toContain("trpc.planning.clearObjectives.useMutation");
  });
});
