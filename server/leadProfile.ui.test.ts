import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const panel = readFileSync(new URL("../client/src/components/LeadProfileDashboard.tsx", import.meta.url), "utf8");
const kpis = readFileSync(new URL("../client/src/components/KpiDashboard.tsx", import.meta.url), "utf8");
const shared = readFileSync(new URL("../shared/leadProfile.ts", import.meta.url), "utf8");

describe("news landing page lead profile UI", () => {
  it("adds a fourth indicator layer without a new menu section", () => {
    expect(home).toContain("Quatro camadas, quatro perguntas diferentes");
    expect(home).toContain("Leads e perfil — LP de novidades");
    expect(home).toContain("<LeadProfileDashboard />");
  });

  it("states the single source and blocks mixing other channels", () => {
    expect(shared).toContain("https://oferta.savagetgroup.com.br/conference-2027");
    expect(panel).toContain("Não inclua leads de outras origens");
    expect(panel).toContain("Não some outras páginas");
  });

  it("explains multiple-choice interpretation and profile mappings", () => {
    expect(panel).toContain("A soma dos percentuais de interesse pode ultrapassar 100%");
    expect(panel).toContain("Mapeado para");
  });

  it("removes affinity and cities from the operational interface", () => {
    expect(panel).not.toContain("AFINIDADE DECLARADA");
    expect(panel).not.toContain("PRINCIPAIS CIDADES");
    expect(panel).not.toContain("Até cinco cidades");
  });

  it("integrates the latest LP contribution without calling it the consolidated total", () => {
    expect(kpis).toContain("CONTRIBUIÇÃO AUTOMÁTICA DA LP · ORIGEM IDENTIFICADA");
    expect(kpis).toContain("Use esta contribuição uma única vez no total mensal consolidado");
    expect(kpis).toContain("O total mensal de todos os canais continua separado");
    expect(home).toContain('number="04" level="DIAGNÓSTICO DO FUNIL"');
  });

  it("stores only aggregated profile fields", () => {
    expect(panel).not.toContain("E-mail do lead");
    expect(panel).not.toContain("Telefone do lead");
    expect(panel).not.toContain("Nome do lead");
  });
});
