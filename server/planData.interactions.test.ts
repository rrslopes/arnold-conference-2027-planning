import { describe, expect, it } from "vitest";
import { calendar } from "../client/src/data/planData";

const detailedStoryIds = ["0902", "0905", "0907", "0909", "0912", "0916", "0918", "0919", "0920", "0923a", "0923c", "0926"];

describe("interações detalhadas do calendário", () => {
  it("mantém todas as pautas interativas mapeadas como sequências explícitas", () => {
    for (const id of detailedStoryIds) {
      const item = calendar.find(entry => entry.id === id);
      expect(item, `Pauta ${id} não encontrada`).toBeDefined();
      expect(item?.storyCards?.length, `Pauta ${id} sem Stories detalhados`).toBeGreaterThan(0);
    }
  });

  it("explica pergunta e respostas clicáveis em todas as enquetes", () => {
    const storyCards = calendar.flatMap(item => item.storyCards ?? []);
    const polls = storyCards.filter(card => card.format.toLowerCase().includes("enquete"));

    expect(polls.length).toBeGreaterThan(0);
    for (const poll of polls) {
      expect(poll.prompt.trim().length).toBeGreaterThan(12);
      expect(poll.answers).toHaveLength(2);
      expect(poll.answers?.every(answer => answer.trim().length > 2)).toBe(true);
    }
  });

  it("identifica caixas abertas sem apresentá-las como respostas da enquete", () => {
    const storyCards = calendar.flatMap(item => item.storyCards ?? []);
    const questionBoxes = storyCards.filter(card => card.format.toLowerCase().includes("caixa"));

    expect(questionBoxes.length).toBeGreaterThan(0);
    for (const card of questionBoxes) {
      expect(card.answers).toBeUndefined();
      expect(card.note?.toLowerCase()).toContain("resposta aberta");
    }
  });
});
