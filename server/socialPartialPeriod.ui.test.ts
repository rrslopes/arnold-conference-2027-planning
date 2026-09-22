import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dashboard = readFileSync(new URL("../client/src/components/SocialGoalsDashboard.tsx", import.meta.url), "utf8");
const shared = readFileSync(new URL("../shared/socialMetrics.ts", import.meta.url), "utf8");

describe("partial social reporting interface", () => {
  it("separates Posts not Reels from the historical carousel baseline", () => {
    expect(dashboard).toContain("Posts não Reels");
    expect(dashboard).toContain("postsTypicalReach");
    expect(dashboard).not.toContain("Carrosséis · mediana do mês");
    expect(shared).toContain("Carrosséis · base histórica");
  });

  it("marks a partial period and suspends monthly goal comparison", () => {
    expect(dashboard).toContain("Resultado parcial do mês");
    expect(dashboard).toContain("comparação mensal suspensa");
    expect(dashboard).toContain("calculateGoalProgress(isPartial ? null : actual");
  });

  it("exposes the mLabs report and Education and Courses schedule guidance", () => {
    expect(dashboard).toContain("Relatório mLabs");
    expect(dashboard).toContain("SOCIAL_BEST_TIMES");
    expect(dashboard).toContain("BENCHMARK OPERACIONAL · EDUCAÇÃO E CURSOS");
    expect(dashboard).toContain('target="_blank"');
  });

  it("keeps Story totals without inventing unavailable navigation breakdowns", () => {
    expect(dashboard).toContain("storiesTotalViews");
    expect(dashboard).toContain("storiesAverageViews");
    expect(dashboard).toContain("Navegação permanece agregada");
    expect(shared).not.toContain('"storyForwardTaps"');
  });

  it("uses proportional cards without changing the social result fields", () => {
    expect(dashboard).toContain('metaMessagesSent: "Conversas por mensagem iniciadas — total geral"');
    expect(dashboard).toContain('"metaMessagesSent"], "Conversas iniciadas no Instagram, conforme o relatório geral da Meta. Não separar por automação ou palavra-chave.", "compact"');
    expect(dashboard).toContain('"reelsMedianSaves"], "A partir de três Reels');
    expect(dashboard).toContain('"wide")');
    expect(dashboard).toContain('"postsTypicalSaves"], "Agrupa carrosséis e imagens estáticas.');
    expect(dashboard).toContain('"storyProfileVisits"], "Informe apenas totais disponíveis.');
  });
});
