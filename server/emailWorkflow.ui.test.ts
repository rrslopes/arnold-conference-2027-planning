import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("plano de e-mail estratégico simplificado", () => {
  const home = read("client/src/pages/Home.tsx");

  it("não renderiza link de prévia, status ou editor de aprovação", () => {
    expect(home).not.toContain("EmailWorkflowEditor");
    expect(home).not.toContain("approvalsByEmail");
    expect(home).not.toContain("email-review");
    expect(home).not.toContain("Link do e-mail para aprovação");
    expect(home).not.toContain("Status do e-mail");
    expect(existsSync(resolve(process.cwd(), "client/src/components/EmailWorkflowEditor.tsx"))).toBe(false);
  });

  it("preserva público, objetivo, materiais, CTA, destino e regra", () => {
    expect(home).toContain("PÚBLICO");
    expect(home).toContain("OBJETIVO");
    expect(home).toContain("item.materials");
    expect(home).toContain("item.cta");
    expect(home).toContain("item.destination");
    expect(home).toContain("item.rule");
  });

  it("orienta produção e aprovação para a planilha operacional", () => {
    expect(home).toContain("A plataforma define a lógica da régua; a produção e a aprovação ficam na planilha operacional");
    expect(home).toContain("Copy final, link da prévia, ajustes e status");
  });
});
