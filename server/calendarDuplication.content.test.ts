import { describe, expect, it } from "vitest";
import { operationalBriefs } from "../client/src/data/calendarBriefs";
import { paidMediaAssets } from "../client/src/data/paidMedia";
import { calendar, launchWindow } from "../client/src/data/planData";

const item = (id: string) => {
  const found = calendar.find(entry => entry.id === id);
  expect(found, `Pauta ${id} não encontrada`).toBeDefined();
  return found!;
};

describe("proteção contra duplicidades no calendário revisado", () => {
  it("mantém títulos únicos em todas as publicações fixas", () => {
    const normalizedTitles = calendar.map(entry => entry.title.trim().toLocaleLowerCase("pt-BR"));
    expect(new Set(normalizedTitles).size).toBe(normalizedTitles.length);
  });

  it("faz os conteúdos sobre os seis congressos avançarem de desafio para perfil, profundidade e critérios", () => {
    expect(item("0903").title).toContain("seis desafios");
    expect(item("0915").title).toContain("Qual conversa com seu momento");

    expect(item("0918").title).toBe("O que as programações de 2027 já revelam");
    expect(item("0918").origin).toContain("Nutrição Estética e SONAFE 2027");
    expect(item("0918").idea.toLocaleLowerCase("pt-BR")).not.toContain("seis perfis");

    expect(item("0924").title).toBe("Quatro critérios para validar sua escolha de congresso");
    expect(item("0924").options).toHaveLength(4);
    expect(item("0924").idea.toLocaleLowerCase("pt-BR")).toContain("sem repetir os seis perfis");

    expect(item("0926").title).toBe("Cinco perguntas para escolher melhor");
    expect(launchWindow.find(entry => entry.moment === "D-5")?.title).toBe("O que mudou desde o aquecimento");
    expect(launchWindow.find(entry => entry.moment === "D-5")?.objective).toContain("novas programações");
  });

  it("separa Bodybuilding entre individualização e equipe multidisciplinar", () => {
    expect(item("0913").title).toContain("Copiar preparação");
    expect(item("0922").title).toBe("A equipe que o público não vê no físico de palco");
    expect(item("0922").origin).toContain("DVZDZWEFPP3");
    expect(item("0922").origin).toContain("00:52 e 01:06");
    expect(operationalBriefs["0922"].purpose).toContain("sem repetir a pauta de 13/09");
  });

  it("separa SONAFE entre cadeia do retorno e diversidade de contextos esportivos", () => {
    expect(item("0919").title).toBe("Decisões no retorno ao esporte");
    expect(item("0923").title).toBe("Não existe um único tipo de atleta");
    expect(item("0923").options?.join(" ")).toContain("Crianças atletas");
    expect(item("0923").options?.join(" ")).toContain("Esporte paralímpico");
    expect(operationalBriefs["0923"].purpose).toContain("população, modalidade e demanda");
  });

  it("mantém o pack de 18/09 sincronizado com a pauta orgânica sem criar peça exclusiva", () => {
    const september18 = paidMediaAssets.find(asset => asset.id === "resize-0918");
    expect(september18?.title).toBe(item("0918").title);
    expect(september18?.deliverables[0]).toContain("mesma peça-mãe editorial");
    expect(paidMediaAssets.filter(asset => asset.category === "exclusiva")).toHaveLength(0);
  });
});
