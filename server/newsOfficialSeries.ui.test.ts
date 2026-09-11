import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const syncPanel = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/NewsLandingSyncPanel.tsx"), "utf8");
const dashboard = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/LeadProfileDashboard.tsx"), "utf8");

describe("série oficial da LP de novidades na interface", () => {
  it("fixa o início em 04/09 e explica a importação de dias mais consolidado", () => {
    expect(syncPanel).toContain('const OFFICIAL_SERIES_START = "2026-09-04"');
    expect(syncPanel).toContain("cada dia desde 04/09");
    expect(syncPanel).toContain("datas são civis de Brasília");
    expect(syncPanel).toContain("Sincronização interrompida");
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
