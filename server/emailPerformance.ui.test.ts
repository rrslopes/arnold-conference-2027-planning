import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const panel = readFileSync(new URL("../client/src/components/EmailPerformanceDashboard.tsx", import.meta.url), "utf8");

describe("email performance UI", () => {
  it("keeps results separate from the operational approval workflow", () => {
    expect(home).toContain("Performance e ranking");
    expect(home).toContain("<EmailPerformanceDashboard />");
    expect(panel).not.toContain("aprovar-texto");
    expect(panel).not.toContain("status de aprovação");
  });

  it("renders all requested metadata and rates", () => {
    ["Nome da campanha", "Data confirmada de envio", "Assunto usado", "Link do e-mail enviado", "Taxa de abertura", "Taxa de clique", "Descadastro", "Marcação de spam"].forEach(label => expect(panel).toContain(label));
  });

  it("explains the score and supports progressive completion", () => {
    expect(panel).toContain("30% abertura + 70% clique − 2× descadastro − 20× spam");
    expect(panel).toContain("Score pendente até preencher as quatro taxas");
    expect(panel).toContain("CTR sobre entregues");
  });

  it("supports edit, HTTPS opening and confirmed deletion", () => {
    expect(panel).toContain("Editar");
    expect(panel).toContain("Abrir e-mail enviado");
    expect(panel).toContain("Excluir campanha do ranking?");
  });
});
