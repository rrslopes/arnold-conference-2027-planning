import { describe, expect, it, vi } from "vitest";
import { diagnoseNewsContractIssues, fetchLovableNewsMetrics, fetchLovableNewsOfficialSeries, formatNewsContractError, lovableNewsMetricsSchema, mapLovableNewsMetricsToSnapshot } from "./integrations/lovableNewsMetrics";

const areas = [
  ["Nutrição Esportiva", 7, 43.8], ["Nutrição Estética", 6, 37.5], ["Gestão de Negócios", 6, 37.5],
  ["Fisioterapia Esportiva", 4, 25], ["Educação Física e Personal Training", 3, 18.8], ["Bodybuilding", 2, 12.5], ["Outra área", 2, 12.5],
] as const;

const measurementObservation = "Sessões de 04/09 a 17/09/2026 vêm do Google Analytics; a partir de 18/09/2026 vêm da medição própria via GTM.";

const fixture = {
  origem: "LP de Novidades 2027",
  url: "https://oferta.savagetgroup.com.br/conference-2027",
  periodo: { inicio: "2026-09-09", fim: "2026-09-10", fuso: "America/Sao_Paulo" },
  atualizado_em: "2026-09-11T04:22:59.020Z",
  captacao: {
    conversoes_no_periodo: 16,
    pessoas_unicas_no_periodo: 16,
    conversoes_origem_dm: 1,
    total_acumulado_conversoes: 120,
    total_acumulado_pessoas_unicas: 120,
    sessoes_na_lp: 300,
    sessoes_origem_dm: 0,
    sessoes_por_origem: [
      { canal: "whatsapp", sessoes: 0 },
      { canal: "instagram_ads", sessoes: 0 },
      { canal: "instagram_dm", sessoes: 0 },
      { canal: "email", sessoes: 226 },
      { canal: "direto", sessoes: 4 },
      { canal: "sem_origem", sessoes: 0 },
      { canal: "outros", sessoes: 70 },
    ],
    inicios_de_formulario: 0,
    abandonos_de_formulario: 0,
    taxa_de_conversao_bruta: 5.3,
    taxa_de_conversao_pessoas_unicas: 5.3,
  },
  metricas_indisponiveis: {
    campos: [],
    observacao: "Inícios de formulário só existem a partir de 18/09/2026.",
  },
  base_historica_ga4: { inicio: "2026-09-04", fim: "2026-09-17", sessoes: 300, aplicada_no_periodo: true },
  observacao_medicao: measurementObservation,
  avanco_no_funil: { cliques_vindos_da_masterclass: 31, origens_dos_cliques: [{ canal: "instagram_ads", cliques: 13 }] },
  origens: [
    { canal: "whatsapp", conversoes: 1, sessoes: null },
    { canal: "instagram_ads", conversoes: 2, sessoes: null },
    { canal: "instagram_dm", conversoes: 0, sessoes: null },
    { canal: "email", conversoes: 8, sessoes: null },
    { canal: "direto", conversoes: 1, sessoes: null },
    { canal: "sem_origem", conversoes: 3, sessoes: null },
    { canal: "outros", conversoes: 1, sessoes: null },
  ],
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
    expect(mapped).toMatchObject({ totalLeads: 120, newLeads: 16, uniquePeopleInPeriod: 16, totalUniquePeople: 120, profileBaseCount: 16, sessions: 300, dmSessions: 0, formStarts: 0, formAbandonments: 0, dmConversions: 1, sportsNutritionCount: 7, nutritionAestheticsCount: 6, attended2026Count: 8, firstTimeCount: 7, attendedPastCount: 1, masterclassClicks: 31, syncSource: "lovable-api-rollup" });
    expect(JSON.parse(mapped.unavailableMetricsJson)).toEqual(fixture.metricas_indisponiveis);
    expect(JSON.parse(mapped.sessionsByOriginJson)).toHaveLength(7);
    expect(JSON.parse(mapped.ga4HistoricalBaseJson)).toEqual(fixture.base_historica_ga4);
    expect(mapped.providerMeasurementObservation).toBe(measurementObservation);
    expect(mapLovableNewsMetricsToSnapshot(payload, "daily").syncSource).toBe("lovable-api-daily");
    expect(JSON.parse(mapped.topCitiesJson)).toEqual([{ opcao: "São Paulo", pessoas: 4, percentual: 25 }]);
    expect(mapped).not.toHaveProperty("email");
    expect(mapped).not.toHaveProperty("telefone");
  });

  it("ignora campos novos e continua rejeitando rankings divergentes", () => {
    expect(lovableNewsMetricsSchema.safeParse({ ...fixture, versao_futura: { campo: null } }).success).toBe(true);
    expect(lovableNewsMetricsSchema.safeParse({ ...fixture, areas_de_interesse: fixture.areas_de_interesse.slice(1) }).success).toBe(false);
  });

  it("aceita números ou nulos e recusa conversão DM acima do total do período", () => {
    expect(lovableNewsMetricsSchema.safeParse({
      ...fixture,
      captacao: {
        ...fixture.captacao,
        sessoes_na_lp: null,
        sessoes_origem_dm: null,
        sessoes_por_origem: null,
        inicios_de_formulario: null,
        abandonos_de_formulario: null,
        taxa_de_conversao_bruta: null,
        taxa_de_conversao_pessoas_unicas: null,
      },
    }).success).toBe(true);
    expect(lovableNewsMetricsSchema.safeParse({
      ...fixture,
      captacao: { ...fixture.captacao, conversoes_origem_dm: 17 },
    }).success).toBe(false);
  });

  it("usa as conversões do período quando o acumulado vier nulo", () => {
    const payload = lovableNewsMetricsSchema.parse({
      ...fixture,
      captacao: { ...fixture.captacao, total_acumulado_conversoes: null },
    });
    expect(mapLovableNewsMetricsToSnapshot(payload).totalLeads).toBe(16);
  });

  it("aceita base histórica do GA4 nula em meses medidos inteiramente pelo sistema próprio", () => {
    const payload = lovableNewsMetricsSchema.parse({ ...fixture, base_historica_ga4: null, campo_novo: null });
    expect(mapLovableNewsMetricsToSnapshot(payload).ga4HistoricalBaseJson).toBeNull();
  });

  it("aceita recadastros quando a base do perfil corresponde às respostas brutas do período", () => {
    const withRegistrations = {
      ...fixture,
      captacao: {
        ...fixture.captacao,
        conversoes_no_periodo: 130,
        pessoas_unicas_no_periodo: 127,
        total_acumulado_conversoes: 130,
        total_acumulado_pessoas_unicas: 127,
      },
      campos_personalizados: {
        ...fixture.campos_personalizados,
        base_de_calculo: 130,
      },
    };

    expect(lovableNewsMetricsSchema.safeParse(withRegistrations).success).toBe(true);
    expect(lovableNewsMetricsSchema.safeParse({
      ...withRegistrations,
      campos_personalizados: { ...withRegistrations.campos_personalizados, base_de_calculo: 129 },
    }).success).toBe(false);
  });

  it("aceita histórico com lista variável e ignora opções não mapeadas", () => {
    const history = Array.from({ length: 13 }, (_, index) => ({
      opcao: index === 0 ? "Sim! Estive em 2026" : `Resposta adicional ${index}`,
      pessoas: 1,
      percentual: 0.7,
    }));
    const result = lovableNewsMetricsSchema.safeParse({
      ...fixture,
      campos_personalizados: { ...fixture.campos_personalizados, historico_no_arnold: history },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(mapLovableNewsMetricsToSnapshot(result.data).attended2026Count).toBe(1);
  });

  it("informa campo, valor e regra exatos quando uma relação contratual falha", () => {
    const invalid = {
      ...fixture,
      captacao: { ...fixture.captacao, pessoas_unicas_no_periodo: 17 },
    };
    const parsed = lovableNewsMetricsSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    const issues = diagnoseNewsContractIssues(invalid, parsed.error.issues);
    expect(issues).toContainEqual({
      field: "captacao.pessoas_unicas_no_periodo",
      value: "17",
      reason: "Pessoas únicas não podem superar conversões brutas.",
    });
    expect(formatNewsContractError(issues)).toContain("Nenhuma fotografia foi alterada");
  });

  it("repete falhas transitórias de rede sem repetir respostas contratuais inválidas", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new TypeError("network unavailable"))
      .mockResolvedValueOnce(new Response(JSON.stringify(fixture), {
        status: 200,
        headers: { "content-type": "application/json" },
      }));
    await expect(fetchLovableNewsMetrics("2026-09-09", "2026-09-10")).resolves.toMatchObject({ origem: "LP de Novidades 2027" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    fetchMock.mockRestore();
  });

  it("consulta dias em série para não sobrecarregar o endpoint externo", async () => {
    let activeRequests = 0;
    let peakRequests = 0;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      activeRequests += 1;
      peakRequests = Math.max(peakRequests, activeRequests);
      await new Promise(resolve => setTimeout(resolve, 5));
      const url = new URL(String(input));
      const from = url.searchParams.get("from") || "";
      const to = url.searchParams.get("to") || "";
      const isDaily = from === to;
      const conversions = isDaily ? 8 : 16;
      const payload = {
        ...fixture,
        periodo: { ...fixture.periodo, inicio: from, fim: to },
        captacao: {
          ...fixture.captacao,
          conversoes_no_periodo: conversions,
          pessoas_unicas_no_periodo: conversions,
          total_acumulado_conversoes: 120,
          total_acumulado_pessoas_unicas: 120,
        },
        campos_personalizados: { ...fixture.campos_personalizados, base_de_calculo: conversions },
      };
      activeRequests -= 1;
      return new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } });
    });
    const result = await fetchLovableNewsOfficialSeries("2026-09-09", "2026-09-10");
    expect(result.daily).toHaveLength(2);
    expect(peakRequests).toBe(1);
    fetchMock.mockRestore();
  });

  it("reutiliza dias históricos e consulta somente dias recentes mais o consolidado", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      const url = new URL(String(input));
      const from = url.searchParams.get("from") || "";
      const to = url.searchParams.get("to") || "";
      const isDaily = from === to;
      const conversions = isDaily ? 8 : 16;
      return new Response(JSON.stringify({
        ...fixture,
        periodo: { ...fixture.periodo, inicio: from, fim: to },
        captacao: {
          ...fixture.captacao,
          conversoes_no_periodo: conversions,
          pessoas_unicas_no_periodo: conversions,
          total_acumulado_conversoes: 120,
          total_acumulado_pessoas_unicas: 120,
        },
        campos_personalizados: { ...fixture.campos_personalizados, base_de_calculo: conversions },
      }), { status: 200, headers: { "content-type": "application/json" } });
    });

    const result = await fetchLovableNewsOfficialSeries("2026-09-09", "2026-09-10", {
      existingDaily: [{ date: "2026-09-09", conversions: 8, sessions: 0 }],
      refreshRecentDays: 1,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.daily).toHaveLength(1);
    expect(result).toMatchObject({ totalDailyCount: 2, fetchedDailyCount: 1, reusedDailyCount: 1 });
    fetchMock.mockRestore();
  });

  it("revisa toda a série quando o consolidado diverge dos dias reutilizados", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      const url = new URL(String(input));
      const from = url.searchParams.get("from") || "";
      const to = url.searchParams.get("to") || "";
      const isDaily = from === to;
      const conversions = isDaily ? 8 : 16;
      return new Response(JSON.stringify({
        ...fixture,
        periodo: { ...fixture.periodo, inicio: from, fim: to },
        captacao: {
          ...fixture.captacao,
          conversoes_no_periodo: conversions,
          pessoas_unicas_no_periodo: conversions,
          total_acumulado_conversoes: 120,
          total_acumulado_pessoas_unicas: 120,
        },
        campos_personalizados: { ...fixture.campos_personalizados, base_de_calculo: conversions },
      }), { status: 200, headers: { "content-type": "application/json" } });
    });

    const result = await fetchLovableNewsOfficialSeries("2026-09-09", "2026-09-10", {
      existingDaily: [{ date: "2026-09-09", conversions: 7, sessions: 0 }],
      refreshRecentDays: 1,
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.daily).toHaveLength(2);
    expect(result).toMatchObject({ totalDailyCount: 2, fetchedDailyCount: 2, reusedDailyCount: 0 });
    fetchMock.mockRestore();
  });
});
