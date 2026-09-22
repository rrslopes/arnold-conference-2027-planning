import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const kpis = readFileSync(new URL("../client/src/components/KpiDashboard.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("Acordeão e metas sincronizadas dos Indicadores", () => {
  it("organiza as quatro camadas externas em um acordeão acessível", () => {
    expect(home.match(/<IndicatorAccordionItem id=/g)).toHaveLength(4);
    expect(home).toContain('id="lotacao" number="01"');
    expect(home).toContain('id="leads" number="02"');
    expect(home).toContain('id="social" number="03"');
    expect(home).toContain('id="funil" number="04"');
    expect(home).toContain("aria-expanded={open}");
    expect(home).toContain("aria-controls={panelId}");
    expect(home).toContain("hidden={!open}");
  });

  it("mantém uma camada aberta por vez e aceita links diretos", () => {
    expect(home).toContain('const indicatorLayerIds: IndicatorLayerId[] = ["lotacao", "leads", "social", "funil"]');
    expect(home).toContain('window.location.hash.replace("#indicadores-", "")');
    expect(home).toContain("setOpenIndicatorLayer(current => current ===");
    expect(home).toContain("Inscrições confirmadas, capacidade, ritmo de ocupação e consulta comercial separada");
    expect(home).toContain("KPIs automáticos de Social, LPs, E-mail, WhatsApp e Vendas");
  });

  it("reutiliza as metas operacionais sociais sem inventar meta para os demais indicadores", () => {
    expect(kpis).toContain('import { SOCIAL_ACCOUNT_GOALS } from "@shared/socialMetrics"');
    expect(kpis).toContain("automaticTargetByKey");
    expect(kpis).toContain("Meta operacional mensal · fonte social");
    expect(kpis).toContain("Sem meta definida");
    expect(kpis).toContain('target === null ? "Sem meta definida" : formatAutomaticKpi');
  });

  it("mantém o acordeão legível e compacto em desktop e mobile", () => {
    expect(css).toContain(".indicator-accordion-trigger");
    expect(css).toContain(".indicator-accordion-item.is-open .indicator-accordion-action svg");
    expect(css).toContain(".indicator-accordion-panel[hidden]");
    expect(css).toContain("grid-template-columns: 45px minmax(0, 1fr)");
  });
});
