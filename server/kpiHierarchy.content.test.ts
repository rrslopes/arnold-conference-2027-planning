import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { kpiLayers } from "../client/src/data/planData";

describe("hierarquia didática de indicadores", () => {
  it("remove a camada genérica de conteúdo do funil integrado", () => {
    expect(kpiLayers.map(layer => layer.id)).not.toContain("conteudo");
    expect(kpiLayers.map(layer => layer.layer)).toEqual([
      "DM e automação",
      "Landing page",
      "Consumo da recompensa",
      "E-mail",
      "WhatsApp",
      "Venda",
    ]);
  });

  it("não repete métricas próprias do painel de Instagram", () => {
    const labels = kpiLayers.flatMap(layer => layer.metrics.map(metric => metric.label.toLocaleLowerCase("pt-BR")));
    expect(labels.some(label => label.includes("alcance"))).toBe(false);
    expect(labels.some(label => label.includes("visualizações"))).toBe(false);
    expect(labels.some(label => label.includes("seguidores"))).toBe(false);
    expect(labels.some(label => label.includes("compartilhamentos"))).toBe(false);
    expect(labels.some(label => label.includes("salvamentos"))).toBe(false);
  });

  it("orienta o preenchimento de todas as etapas e métricas", () => {
    kpiLayers.forEach(layer => {
      expect(layer.purpose.length).toBeGreaterThan(40);
      expect(layer.cadence.length).toBeGreaterThan(40);
      expect(layer.source.length).toBeGreaterThan(30);
      expect(layer.avoid.length).toBeGreaterThan(35);
      layer.metrics.forEach(metric => {
        expect(metric.key.length).toBeGreaterThan(2);
        expect(metric.label.length).toBeGreaterThan(4);
        expect(metric.description.length).toBeGreaterThan(35);
      });
    });
  });

  it("preserva as chaves antigas para não perder dados compartilhados", () => {
    expect(kpiLayers.find(layer => layer.id === "dm")?.metrics.map(metric => metric.key)).toContain("Gatilhos");
    expect(kpiLayers.find(layer => layer.id === "landing")?.metrics.map(metric => metric.key)).toContain("Conversões");
    expect(kpiLayers.find(layer => layer.id === "comercial")?.metrics.map(metric => metric.key)).toContain("Compras");
  });

  it("expõe as três camadas e as quatro instruções na página", () => {
    const source = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
    expect(source).toContain('title="Lotação das salas"');
    expect(source).toContain('title="Desempenho do Instagram"');
    expect(source).toContain('title="Aquisição e vendas"');
    expect(source).toContain("O QUE MEDE");
    expect(source).toContain("QUANDO PREENCHER");
    expect(source).toContain("FONTE DO DADO");
    expect(source).toContain("NÃO ENTRA AQUI");
  });
});
