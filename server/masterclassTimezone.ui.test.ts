import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const syncPanel = readFileSync(new URL("../client/src/components/MasterclassSyncPanel.tsx", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../client/src/components/MasterclassLandingDashboard.tsx", import.meta.url), "utf8");

describe("fuso da Central de Landing Pages", () => {
  it("usa a data civil de Brasília no período padrão e nos limites dos formulários", () => {
    expect(syncPanel).toContain("brasiliaCivilDate");
    expect(syncPanel).toContain("today.slice(0, 7)");
    expect(dashboard).toContain("todayInBrasilia");
    expect(syncPanel).not.toContain("date.getFullYear()");
  });

  it("formata timestamps absolutos explicitamente em Brasília", () => {
    expect(dashboard).toContain("formatTimestampInBrasilia(latest.updatedAt)");
    expect(dashboard).toContain("formatTimestampInBrasilia(latest.providerUpdatedAt)");
    expect(dashboard).toContain("· Brasília");
  });
});
