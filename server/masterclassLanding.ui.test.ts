import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const center = readFileSync(new URL("../client/src/components/LandingPageCenter.tsx", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../client/src/components/MasterclassLandingDashboard.tsx", import.meta.url), "utf8");
const syncPanel = readFileSync(new URL("../client/src/components/MasterclassSyncPanel.tsx", import.meta.url), "utf8");
const magnet = readFileSync(new URL("../client/src/components/LeadMagnetExplorer.tsx", import.meta.url), "utf8");
const kpis = readFileSync(new URL("../shared/kpiIntegration.ts", import.meta.url), "utf8");

describe("Central de Landing Pages e masterclasses", () => {
  it("mantém novidades e masterclasses como fontes separadas na mesma central", () => {
    expect(center).toContain("LP de novidades"); expect(center).toContain("LP das masterclasses");
    expect(center).toContain("<LeadProfileDashboard />"); expect(center).toContain("<MasterclassLandingDashboard />");
  });
  it("captura tráfego, captação, entrega, consumo e avanço somente na Central", () => {
    ["Sessões na LP", "Inscrições brutas no período", "PESSOAS ÚNICAS NO PERÍODO", "Acessos à página de obrigado", "Consumo das aulas", "Avanço no funil"].forEach(text => expect(dashboard).toContain(text));
    expect(dashboard).toContain("Campos sem rastreamento devem ficar vazios");
  });
  it("oferece sincronização manual segura e mantém a alternativa de fotografia manual", () => {
    expect(syncPanel).toContain("Sincronizar agora");
    expect(syncPanel).toContain("O token fica somente no servidor");
    expect(syncPanel).toContain("não cria outra linha");
    expect(syncPanel).toContain("Sincronização interrompida");
    expect(syncPanel).toContain("fotografia anterior permanece preservada");
    expect(dashboard).toContain("Nova fotografia manual");
    expect(dashboard).toContain("SINCRONIZADO VIA LOVABLE");
  });
  it("exibe espectadores, média assistida e origens sem novos campos manuais", () => {
    expect(dashboard).toContain("espectadores únicos");
    expect(dashboard).toContain("média assistida");
    expect(dashboard).toContain("ORIGENS DA CAPTAÇÃO");
    expect(dashboard).not.toContain("anaUniqueViewers','");
    expect(dashboard).toContain("pode superar 100%");
    expect(dashboard).toContain("Comparável à RD Station");
    expect(dashboard).toContain("Pessoas únicas: sem dado nesta fotografia");
    expect(dashboard).toContain("inscrições brutas atribuídas");
  });
  it("exibe a performance na isca sem duplicar o formulário", () => {
    expect(magnet).toContain("PERFORMANCE DA ISCA"); expect(magnet).toContain("Leitura automática da LP das masterclasses");
    expect(magnet).not.toContain("saveMasterclassLandingSnapshot");
  });
  it("alimenta Landing pages e Consumo da recompensa com a nova origem", () => {
    expect(kpis).toContain('layerId === "recompensa"'); expect(kpis).toContain("Inscrições brutas — LP das masterclasses");
    expect(kpis).toContain("Pessoas únicas — LP das masterclasses");
    expect(kpis).toContain("Central de LPs · Masterclasses");
  });
});
