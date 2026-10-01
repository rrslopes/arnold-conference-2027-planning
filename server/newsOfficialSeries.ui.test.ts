import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const syncPanel = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/NewsLandingSyncPanel.tsx"), "utf8");
const dashboard = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/LeadProfileDashboard.tsx"), "utf8");

describe("blocos oficiais da LP de novidades na interface", () => {
  it("consulta somente o mês em Brasília e mantém meses fechados protegidos", () => {
    expect(syncPanel).toContain("brasiliaCivilDate");
    expect(syncPanel).toContain('`${today.slice(0, 7)}-01`');
    expect(syncPanel).toContain("fecha o mês anterior completo");
    expect(syncPanel).toContain("não há base histórica do GA4 aplicada");
    expect(syncPanel).toContain("Sincronização interrompida");
    expect(syncPanel).toContain('role="alert"');
    expect(syncPanel).toContain("{lastError}");
  });

  it("distingue consolidado, dia oficial e registro manual no histórico", () => {
    expect(dashboard).toContain("CONSOLIDADO OFICIAL");
    expect(dashboard).toContain("DIA OFICIAL");
    expect(dashboard).toContain("O consolidado sustenta o perfil atual e os KPIs");
    expect(dashboard).toContain("total acumulado não é reconstruído pela série");
    expect(dashboard).toContain("respostas do período");
    expect(dashboard).toContain("maior que o número de pessoas únicas");
    expect(dashboard).toContain("sincronizado");
  });
});
