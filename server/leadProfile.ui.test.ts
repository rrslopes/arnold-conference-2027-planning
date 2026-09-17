import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const panel = readFileSync(new URL("../client/src/components/LeadProfileDashboard.tsx", import.meta.url), "utf8");
const center = readFileSync(new URL("../client/src/components/LandingPageCenter.tsx", import.meta.url), "utf8");
const masterclasses = readFileSync(new URL("../client/src/components/MasterclassLandingDashboard.tsx", import.meta.url), "utf8");
const kpis = readFileSync(new URL("../client/src/components/KpiDashboard.tsx", import.meta.url), "utf8");
const shared = readFileSync(new URL("../shared/leadProfile.ts", import.meta.url), "utf8");
const integration = readFileSync(new URL("../shared/kpiIntegration.ts", import.meta.url), "utf8");
const planData = readFileSync(new URL("../client/src/data/planData.ts", import.meta.url), "utf8");

describe("news landing page lead profile UI", () => {
  it("adds a multi-LP central without a new menu section", () => {
    expect(home).toContain("Quatro camadas, quatro perguntas diferentes");
    expect(home).toContain("Central de Landing Pages");
    expect(home).toContain("<LandingPageCenter />");
    expect(center).toContain("LP de novidades");
    expect(center).toContain("LP das masterclasses");
  });

  it("states the single source and blocks mixing other channels", () => {
    expect(shared).toContain("https://oferta.savagetgroup.com.br/conference-2027");
    expect(panel).toContain("Não inclua dados das masterclasses");
    expect(panel).toContain("Não some outras páginas");
  });

  it("explains multiple-choice interpretation and profile mappings", () => {
    expect(panel).toContain("A soma dos percentuais de interesse pode ultrapassar 100%");
    expect(panel).toContain("Mapeado para");
  });

  it("keeps affinity out and shows cities only when synchronized", () => {
    expect(panel).not.toContain("AFINIDADE DECLARADA");
    expect(panel).toContain("PRINCIPAIS CIDADES · TOP 20");
    expect(panel).not.toContain("Até cinco cidades");
  });

  it("integrates the latest LP contribution without calling it the consolidated total", () => {
    expect(integration).toContain("Conversões brutas — LP de novidades");
    expect(integration).toContain("Pessoas únicas — LP de novidades");
    expect(integration).toContain("Inscrições brutas — LP das masterclasses");
    expect(integration).toContain("Pessoas únicas — LP das masterclasses");
    expect(integration).toContain("news?.uniquePeopleInPeriod");
    expect(integration).toContain("masterclass?.uniquePeopleInPeriod");
    expect(kpis).toContain("linhas abaixo são bloqueadas contra redigitação");
    expect(planData).toContain("Leads convertidos — consolidado de todas as origens");
    expect(kpis).toContain("metric-auto-status");
    expect(home).toContain('number="04" level="CONSOLIDAÇÃO DO FUNIL"');
  });

  it("stores only aggregated profile fields", () => {
    expect(panel).not.toContain("E-mail do lead");
    expect(panel).not.toContain("Telefone do lead");
    expect(panel).not.toContain("Nome do lead");
    expect(masterclasses).not.toContain("E-mail do lead");
    expect(masterclasses).not.toContain("Telefone do lead");
  });

  it("offers a server-side manual sync without duplicating the manual form", () => {
    expect(panel).toContain("<NewsLandingSyncPanel");
    expect(panel).toContain("AVANÇO VINDO DAS MASTERCLASSES");
    expect(panel).toContain("ORIGENS DAS CONVERSÕES");
  });

  it("distingue dados não medidos de indicadores aguardando atualização", () => {
    expect(panel).toContain("Não medido");
    expect(panel).toContain("GTM/GA4");
    expect(panel).toContain("CONVERSÕES VIA WHATSAPP + INSTAGRAM DM");
    expect(panel).toContain("lead-origin-bar");
    expect(kpis).toContain('metric.availability === "not_measured"');
    expect(kpis).toContain("Não medido nesta LP");
  });
});
