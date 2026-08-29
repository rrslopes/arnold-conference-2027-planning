import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("interface de aprovação dos e-mails", () => {
  const editor = read("client/src/components/EmailWorkflowEditor.tsx");
  const home = read("client/src/pages/Home.tsx");
  const css = read("client/src/index.css");

  it("oferece link de prévia, status, abertura e salvamento compartilhado", () => {
    expect(editor).toContain("Link do e-mail para aprovação");
    expect(editor).toContain('type="url"');
    expect(editor).toContain("Status do e-mail");
    expect(editor).toContain("saveEmailWorkflow");
    expect(editor).toContain("Abrir prévia");
    expect(editor).toContain('title="Informe um link HTTPS válido"');
  });

  it("está presente nos dois fluxos de e-mail", () => {
    expect(home.match(/<EmailWorkflowEditor/g)).toHaveLength(2);
    expect(home).toContain("approvalsByEmail[item.id]");
    expect(home).toContain("email-review");
    expect(home.match(/defaultOpen=\{reviewEmailId === item\.id\}/g)).toHaveLength(2);
    expect(home).toContain("email-review-mode");
  });

  it("mostra sincronização sem nome de responsável", () => {
    expect(editor).toContain("Última atualização compartilhada");
    expect(editor).toContain("Alterações locais pendentes");
    expect(editor).not.toContain("Responsável");
    expect(editor).not.toContain("actorName");
  });

  it("empilha link, status e ações em telas pequenas", () => {
    expect(css).toMatch(/@media \(max-width: 860px\)[\s\S]*?\.email-approval-body \{ grid-template-columns: 1fr; \}/);
    expect(css).toContain(".email-approval-actions a, .email-approval-actions button { flex: 1 1 30%; }");
  });
});
