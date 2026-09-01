import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync("client/src/components/OccupancyDashboard.tsx", "utf8");
const styles = readFileSync("client/src/index.css", "utf8");

describe("cenário ampliável de Nutrição Estética", () => {
  it("mostra capacidade-base, capacidade em auditório e confirmação operacional separadas", () => {
    expect(component).toContain("CENÁRIO DE EXPANSÃO");
    expect(component).toContain("CAPACIDADE EM AUDITÓRIO");
    expect(component).toContain("Mudança para auditório confirmada pela operação");
    expect(component).toContain("Usar 240 lugares no cálculo da lotação");
  });

  it("bloqueia a ativação enquanto a operação não confirmou a mudança", () => {
    expect(component).toContain("disabled={!form[congress.key].expansionConfirmed}");
    expect(component).toContain("expansionActive: expansionConfirmed ? current[key].expansionActive : false");
  });

  it("empilha os controles no breakpoint móvel", () => {
    expect(styles).toContain(".capacity-expansion-controls { grid-template-columns: 1fr; }");
  });
});
