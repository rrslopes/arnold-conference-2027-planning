import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("menu lateral simplificado", () => {
  const layout = read("client/src/components/StrategyLayout.tsx");
  const home = read("client/src/pages/Home.tsx");
  const css = read("client/src/index.css");

  it("não exibe nem propaga o nome do responsável", () => {
    expect(layout).not.toContain('id="collaborator-name"');
    expect(layout).not.toContain('htmlFor="collaborator-name"');
    expect(layout).not.toContain('placeholder="Seu nome');
    expect(layout).not.toContain("Responsável");
    expect(home).not.toContain("collaboratorName");
    expect(home).not.toContain("onNameChange");
  });

  it("mantém a gravação dos três painéis sem actorName", () => {
    for (const component of ["ObjectiveTracker", "KpiDashboard", "OccupancyDashboard"]) {
      expect(read(`client/src/components/${component}.tsx`)).not.toContain("actorName");
    }
  });

  it("oferece recolhimento e expansão acessíveis no desktop", () => {
    expect(layout).toContain("desktop-sidebar-toggle");
    expect(layout).toContain("Expandir menu lateral");
    expect(layout).toContain("Recolher menu lateral");
    expect(layout).toContain("aria-label={item.label}");
    expect(css).toContain(".strategy-shell.is-sidebar-collapsed .sidebar { width: 74px; }");
  });

  it("preserva o breakpoint móvel sem o controle desktop", () => {
    expect(css).toMatch(/@media \(max-width: 860px\)[\s\S]*?\.desktop-sidebar-toggle \{ display: none; \}/);
    expect(layout).toContain('aria-label="Abrir menu"');
  });
});
