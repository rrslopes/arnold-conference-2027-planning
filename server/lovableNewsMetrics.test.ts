import { describe, expect, it } from "vitest";
import { lovableNewsMetricsSchema, mapLovableNewsMetricsToSnapshot } from "./integrations/lovableNewsMetrics";

const areas = [
  ["Nutrição Esportiva", 7, 43.8], ["Nutrição Estética", 6, 37.5], ["Gestão de Negócios", 6, 37.5],
  ["Fisioterapia Esportiva", 4, 25], ["Educação Física e Personal Training", 3, 18.8], ["Bodybuilding", 2, 12.5], ["Outra área", 2, 12.5],
] as const;

const fixture = {
  origem: "LP de Novidades 2027",
  url: "https://oferta.savagetgroup.com.br/conference-2027",
  periodo: { inicio: "2026-09-09", fim: "2026-09-10", fuso: "America/Sao_Paulo" },
  atualizado_em: "2026-09-11T04:22:59.020Z",
  captacao: { conversoes_no_periodo: 16, pessoas_unicas_no_periodo: 16, total_acumulado_conversoes: 120, total_acumulado_pessoas_unicas: 120 },
  avanco_no_funil: { cliques_vindos_da_masterclass: 31, origens_dos_cliques: [{ canal: "instagram_ads", cliques: 13 }] },
  origens: [{ canal: "instagram_dm", conversoes: 3 }, { canal: "sem_origem", conversoes: 13 }],
  areas_de_interesse: areas.map(([area, pessoas, percentual]) => ({ area, pessoas, percentual })),
  campos_personalizados: {
    base_de_calculo: 16,
    areas_de_interesse: areas.map(([opcao, pessoas, percentual]) => ({ opcao, pessoas, percentual })),
    historico_no_arnold: [
      { opcao: "Sim! Estive em 2026", pessoas: 8, percentual: 50 },
      { opcao: "Nunca! Será a primeira vez", pessoas: 7, percentual: 43.8 },
      { opcao: "Sim! Estive em outra(s) edição(es), mas não em 2026", pessoas: 1, percentual: 6.3 },
    ],
    observacao: "Áreas de interesse permitem múltipla escolha.",
    cidades: [{ opcao: "São Paulo", pessoas: 4, percentual: 25 }],
  },
} as const;

describe("contrato agregado da LP de novidades", () => {
  it("aceita o contrato real e mapeia somente dados agregados", () => {
    const payload = lovableNewsMetricsSchema.parse(fixture);
    const mapped = mapLovableNewsMetricsToSnapshot(payload);
    expect(mapped).toMatchObject({ totalLeads: 120, newLeads: 16, uniquePeopleInPeriod: 16, totalUniquePeople: 120, profileBaseCount: 16, dmConversions: 3, sportsNutritionCount: 7, nutritionAestheticsCount: 6, attended2026Count: 8, firstTimeCount: 7, attendedPastCount: 1, masterclassClicks: 31, syncSource: "lovable-api" });
    expect(JSON.parse(mapped.topCitiesJson)).toEqual([{ opcao: "São Paulo", pessoas: 4, percentual: 25 }]);
    expect(mapped).not.toHaveProperty("email");
    expect(mapped).not.toHaveProperty("telefone");
  });

  it("rejeita campos inesperados e rankings divergentes", () => {
    expect(lovableNewsMetricsSchema.safeParse({ ...fixture, email: "nao@deve.existir" }).success).toBe(false);
    expect(lovableNewsMetricsSchema.safeParse({ ...fixture, areas_de_interesse: fixture.areas_de_interesse.slice(1) }).success).toBe(false);
  });
});
