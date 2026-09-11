import { describe, expect, it } from "vitest";
import { lovableMasterclassMetricsSchema, mapLovableMetricsToSnapshot } from "./integrations/lovableMasterclassMetrics";

const payload = {
  origem: "LP das Masterclasses" as const,
  periodo: { inicio: "2026-09-01", fim: "2026-09-11" },
  atualizado_em: "2026-09-11T12:00:00.000Z",
  trafego_e_captacao: {
    sessoes_na_lp: 353,
    inicios_de_formulario: 120,
    acessos_pagina_obrigado: 46,
    novos_leads_no_periodo: 91,
    total_acumulado_de_leads: 91,
    conversao_sessao_lead: 0.2578,
  },
  consumo_das_aulas: [
    { slug: "nutricao-esportiva" as const, palestrante: "Andreia Naves", area: "Nutrição Esportiva", inicios: 45, conclusoes: 12, espectadores: 38, percentual_medio_assistido: 42 },
    { slug: "nutricao-estetica" as const, palestrante: "Ana Paula Pujol", area: "Nutrição Estética", inicios: 38, conclusoes: 9, espectadores: 31, percentual_medio_assistido: 38 },
    { slug: "gestao-de-academias" as const, palestrante: "Roberto Tranjan", area: "Gestão de Academias", inicios: 29, conclusoes: 6, espectadores: 24, percentual_medio_assistido: 35 },
  ],
  avanco_no_funil: { cliques_para_lp_de_novidades: 16, cliques_para_os_congressos: 0, cliques_para_compra: 0 },
  origens: [
    { canal: "instagram_ads", sessoes: 130, leads: 34 },
    { canal: "instagram_dm", sessoes: 13, leads: 2 },
  ],
};

describe("contrato Lovable das masterclasses", () => {
  it("valida as três aulas e rejeita campos pessoais inesperados", () => {
    expect(lovableMasterclassMetricsSchema.safeParse(payload).success).toBe(true);
    expect(lovableMasterclassMetricsSchema.safeParse({ ...payload, email: "lead@example.com" }).success).toBe(false);
  });

  it("mapeia cada aula pelo slug, não pela posição no array", () => {
    const snapshot = mapLovableMetricsToSnapshot({ ...payload, consumo_das_aulas: [...payload.consumo_das_aulas].reverse() });
    expect(snapshot.andreiaLessonStarts).toBe(45);
    expect(snapshot.anaLessonStarts).toBe(38);
    expect(snapshot.robertoLessonStarts).toBe(29);
    expect(snapshot.anaUniqueViewers).toBe(31);
    expect(snapshot.andreiaAverageWatchPercent).toBe(42);
  });

  it("mapeia Instagram DM, origens e avanço sem usar a taxa pronta", () => {
    const snapshot = mapLovableMetricsToSnapshot(payload);
    expect(snapshot.dmSessions).toBe(13);
    expect(snapshot.dmConversions).toBe(2);
    expect(snapshot.newsLpClicks).toBe(16);
    expect(JSON.parse(snapshot.originsJson)).toEqual([
      { channel: "instagram_ads", sessions: 130, leads: 34 },
      { channel: "instagram_dm", sessions: 13, leads: 2 },
    ]);
    expect(snapshot).not.toHaveProperty("conversionRate");
  });

  it("rejeita aulas duplicadas ou conclusão acima dos inícios", () => {
    const duplicate = { ...payload, consumo_das_aulas: [payload.consumo_das_aulas[0], payload.consumo_das_aulas[0], payload.consumo_das_aulas[2]] };
    expect(lovableMasterclassMetricsSchema.safeParse(duplicate).success).toBe(false);
    const invalidCompletion = { ...payload, consumo_das_aulas: payload.consumo_das_aulas.map((item, index) => index === 0 ? { ...item, conclusoes: item.inicios + 1 } : item) };
    expect(lovableMasterclassMetricsSchema.safeParse(invalidCompletion).success).toBe(false);
  });
});
