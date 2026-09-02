import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("calendário estratégico simplificado", () => {
  const calendarExplorer = read("client/src/components/CalendarExplorer.tsx");

  it("não renderiza legenda, link de arte ou status de aprovação", () => {
    expect(calendarExplorer).not.toContain("CalendarWorkflowEditor");
    expect(calendarExplorer).not.toContain("getEditorialStatus");
    expect(calendarExplorer).not.toContain("workflow-mini");
    expect(calendarExplorer).not.toContain("workflowByItem");
    expect(calendarExplorer).not.toContain("Legenda do post");
    expect(calendarExplorer).not.toContain("Link da arte para aprovação");
    expect(existsSync(resolve(process.cwd(), "client/src/components/CalendarWorkflowEditor.tsx"))).toBe(false);
  });

  it("preserva pauta, briefing, CTA, marcos e alternativas", () => {
    expect(calendarExplorer).toContain("IDEIA ESTRATÉGICA");
    expect(calendarExplorer).toContain("BRIEFING OPERACIONAL DA PEÇA");
    expect(calendarExplorer).toContain("CHAMADA PARA AÇÃO");
    expect(calendarExplorer).toContain("GRANDE MARCO DA CAMPANHA");
    expect(calendarExplorer).toContain("ALTERNATIVA SEGURA");
  });

  it("orienta a operação diária para a planilha compartilhada", () => {
    expect(calendarExplorer).toContain("A operação diária será organizada na planilha compartilhada com as agências");
    expect(calendarExplorer).toContain("Inserções extras de feed, legendas, links de arte e aprovações");
    expect(calendarExplorer).toContain("Buscar tema, congresso ou formato");
  });
});
