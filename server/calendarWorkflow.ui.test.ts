import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("interface colaborativa do calendário", () => {
  const editor = read("client/src/components/CalendarWorkflowEditor.tsx");
  const calendarExplorer = read("client/src/components/CalendarExplorer.tsx");
  const css = read("client/src/index.css");

  it("oferece legenda, link HTTPS, status e salvamento compartilhado", () => {
    expect(editor).toContain("Legenda do post");
    expect(editor).toContain("Link da arte para aprovação");
    expect(editor).toContain('type="url"');
    expect(editor).toContain("Status atual");
    expect(editor).toContain("saveCalendarWorkflow");
    expect(editor).toContain("Abrir arte");
  });

  it("mostra sincronização e alterações pendentes sem autoria nominal", () => {
    expect(editor).toContain("Última atualização compartilhada");
    expect(editor).toContain("Há alterações locais pendentes");
    expect(editor).toContain("Sincronizado");
    expect(editor).not.toContain("Responsável");
    expect(editor).not.toContain("actorName");
  });

  it("exibe um status resumido em todos os cards e permite buscá-lo", () => {
    expect(calendarExplorer).toContain("workflow-mini");
    expect(calendarExplorer).toContain("getEditorialStatus(workflow?.status)");
    expect(calendarExplorer).toContain("Buscar tema, congresso, status ou formato");
  });

  it("empilha campos e ações no mobile", () => {
    expect(css).toMatch(/@media \(max-width: 860px\)[\s\S]*?\.editorial-workflow-side \{ grid-template-columns: 1fr; \}/);
    expect(css).toContain(".editorial-workflow-actions a, .editorial-workflow-actions button { flex: 1 1 30%; }");
  });
});
