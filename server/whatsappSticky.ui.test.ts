import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("limite do sticky na seção de WhatsApp", () => {
  it("mantém lettering, fluxo e regra dentro de um contêiner anterior ao formulário", () => {
    const strategyStart = homeSource.indexOf('className="whatsapp-strategy-grid"');
    const strategyEnd = homeSource.indexOf("</div>\n      <WhatsAppPerformanceDashboard", strategyStart);
    const performance = homeSource.indexOf("<WhatsAppPerformanceDashboard />", strategyStart);

    expect(strategyStart).toBeGreaterThan(-1);
    expect(strategyEnd).toBeGreaterThan(strategyStart);
    expect(performance).toBeGreaterThan(strategyEnd);
  });

  it("aplica sticky somente ao heading contido na grade estratégica", () => {
    expect(cssSource).toContain(".whatsapp-strategy-grid { position: relative; isolation: isolate; display: grid;");
    expect(cssSource).toContain(".whatsapp-heading { position: sticky; top: 80px;");
    expect(cssSource).toContain(".whatsapp-section { background: var(--purple); color: white; }");
    expect(cssSource).not.toContain(".whatsapp-section { background: var(--purple); color: white; display: grid;");
  });

  it("desativa o sticky e empilha a nova grade em telas menores", () => {
    expect(cssSource).toContain(".executive-summary, .whatsapp-strategy-grid { grid-template-columns: 1fr; }");
    expect(cssSource).toContain(".whatsapp-heading { position: static; }");
  });
});
