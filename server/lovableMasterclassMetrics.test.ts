import { describe, expect, it } from "vitest";
import { diagnoseMasterclassContractIssues, formatMasterclassContractError, lovableMasterclassMetricsSchema, mapLovableMetricsToSnapshot } from "./integrations/lovableMasterclassMetrics";

const payload = {
  origem: "LP das Masterclasses" as const,
  periodo: { inicio: "2026-09-01", fim: "2026-09-11" },
  atualizado_em: "2026-09-11T12:00:00.000Z",
  trafego_e_captacao: {
    sessoes_na_lp: 353,
    inicios_de_formulario: 120,
    acessos_pagina_obrigado: 46,
    novos_leads_no_periodo: 91,
    pessoas_unicas_no_periodo: 84,
    total_acumulado_de_leads: 91,
    total_acumulado_pessoas_unicas: 84,
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
  it("aceita campos desconhecidos sem transportá-los para o contrato interno", () => {
    const result = lovableMasterclassMetricsSchema.safeParse({
      ...payload,
      campo_futuro: null,
      trafego_e_captacao: { ...payload.trafego_e_captacao, detalhe_novo: null },
      consumo_das_aulas: payload.consumo_das_aulas.map(item => ({ ...item, metrica_nova: null })),
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).not.toHaveProperty("campo_futuro");
    expect(result.data.trafego_e_captacao).not.toHaveProperty("detalhe_novo");
    expect(result.data.consumo_das_aulas[0]).not.toHaveProperty("metrica_nova");
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
    expect(snapshot.uniquePeopleInPeriod).toBe(84);
    expect(snapshot.totalUniquePeople).toBe(84);
    expect(snapshot.dmSessions).toBe(13);
    expect(snapshot.dmConversions).toBe(2);
    expect(snapshot.newsLpClicks).toBe(16);
    expect(JSON.parse(snapshot.originsJson)).toEqual([
      { channel: "instagram_ads", sessions: 130, leads: 34 },
      { channel: "instagram_dm", sessions: 13, leads: 2 },
    ]);
    expect(snapshot).not.toHaveProperty("conversionRate");
  });

  it("aceita listas variáveis, ignora aulas novas e mantém ausências como sem dado", () => {
    const variable = lovableMasterclassMetricsSchema.parse({
      ...payload,
      consumo_das_aulas: [
        payload.consumo_das_aulas[0],
        { slug: "nova-aula", palestrante: "Nova Pessoa", area: "Nova área", inicios: 5, conclusoes: 1, espectadores: 4, percentual_medio_assistido: 20 },
      ],
      origens: [],
    });
    const snapshot = mapLovableMetricsToSnapshot(variable);
    expect(snapshot.andreiaLessonStarts).toBe(45);
    expect(snapshot.anaLessonStarts).toBeNull();
    expect(snapshot.robertoLessonStarts).toBeNull();
    expect(snapshot.dmSessions).toBeNull();
    expect(JSON.parse(snapshot.originsJson)).toEqual([]);
  });

  it("aceita métricas ainda não apuradas como null em aulas novas", () => {
    const parsed = lovableMasterclassMetricsSchema.parse({
      ...payload,
      consumo_das_aulas: [...payload.consumo_das_aulas, { slug: "aula-extra", palestrante: "Convidado", area: "Nova área", inicios: null, conclusoes: null, espectadores: null, percentual_medio_assistido: null }],
    });
    expect(mapLovableMetricsToSnapshot(parsed).anaLessonStarts).toBe(38);
  });

  it("aceita espectadores acima dos inícios porque são eventos independentes no contrato oficial", () => {
    const currentEndpointCase = {
      ...payload,
      consumo_das_aulas: payload.consumo_das_aulas.map((item, index) => index === 1 ? { ...item, inicios: 14, espectadores: 15 } : item),
    };
    expect(lovableMasterclassMetricsSchema.safeParse(currentEndpointCase).success).toBe(true);
  });

  it("aceita conversão nula sem sessões e rejeita taxa acima de 100%", () => {
    const withoutSessions = {
      ...payload,
      trafego_e_captacao: { ...payload.trafego_e_captacao, sessoes_na_lp: 0, conversao_sessao_lead: null },
    };
    expect(lovableMasterclassMetricsSchema.safeParse(withoutSessions).success).toBe(true);
    expect(lovableMasterclassMetricsSchema.safeParse({
      ...payload,
      trafego_e_captacao: { ...payload.trafego_e_captacao, conversao_sessao_lead: 1.01 },
    }).success).toBe(false);
  });

  it("rejeita aulas duplicadas ou conclusão acima dos inícios", () => {
    const duplicate = { ...payload, consumo_das_aulas: [payload.consumo_das_aulas[0], payload.consumo_das_aulas[0], payload.consumo_das_aulas[2]] };
    expect(lovableMasterclassMetricsSchema.safeParse(duplicate).success).toBe(false);
    const invalidCompletion = { ...payload, consumo_das_aulas: payload.consumo_das_aulas.map((item, index) => index === 0 ? { ...item, conclusoes: item.inicios + 1 } : item) };
    expect(lovableMasterclassMetricsSchema.safeParse(invalidCompletion).success).toBe(false);
  });

  it("rejeita pessoas únicas acima das inscrições brutas", () => {
    const invalidPeriod = { ...payload, trafego_e_captacao: { ...payload.trafego_e_captacao, pessoas_unicas_no_periodo: 92 } };
    const invalidCumulative = { ...payload, trafego_e_captacao: { ...payload.trafego_e_captacao, total_acumulado_pessoas_unicas: 92 } };
    expect(lovableMasterclassMetricsSchema.safeParse(invalidPeriod).success).toBe(false);
    expect(lovableMasterclassMetricsSchema.safeParse(invalidCumulative).success).toBe(false);
  });

  it("informa caminho, valor e motivo exatos quando um campo usado é rejeitado", () => {
    const invalid = {
      ...payload,
      consumo_das_aulas: payload.consumo_das_aulas.map((item, index) => index === 1 ? { ...item, conclusoes: 39 } : item),
    };
    const parsed = lovableMasterclassMetricsSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    const fields = diagnoseMasterclassContractIssues(invalid, parsed.error.issues);
    expect(fields).toContainEqual({
      field: "consumo_das_aulas[nutricao-estetica].conclusoes",
      value: "39",
      reason: "Conclusões não podem ultrapassar inícios.",
    });
    expect(formatMasterclassContractError(fields)).toContain("Nenhuma fotografia foi alterada.");
  });
});
