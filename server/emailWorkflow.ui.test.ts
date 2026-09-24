import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("plano de e-mail estratégico simplificado", () => {
  const home = read("client/src/pages/Home.tsx");
  const brief = read("client/src/components/EmailCampaignBriefDetail.tsx");

  it("não renderiza link de prévia, status ou editor de aprovação", () => {
    expect(home).not.toContain("EmailWorkflowEditor");
    expect(home).not.toContain("approvalsByEmail");
    expect(home).not.toContain("email-review");
    expect(home).not.toContain("Link do e-mail para aprovação");
    expect(home).not.toContain("Status do e-mail");
    expect(
      existsSync(
        resolve(process.cwd(), "client/src/components/EmailWorkflowEditor.tsx")
      )
    ).toBe(false);
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
    expect(home).toContain(
      "A plataforma define a lógica da régua; a produção e a aprovação ficam na planilha operacional"
    );
    expect(home).toContain("Copy final, link da prévia, ajustes e status");
    expect(home).toContain("GATES DE LIBERAÇÃO · ACESSO DA AGÊNCIA");
    expect(home).toContain("Requisito escrito não significa status verde");
    expect(home).toContain("emailOperationalGates.map");
  });

  it("renderiza os detalhamentos de 18 a 25/09 com CTA, exemplos e regra de distribuição", () => {
    expect(home).toContain("EmailCampaignBriefDetail");
    expect(home).toContain("email-focus");
    expect(home).toContain("Um CTA principal");
    expect(brief).toContain("DECISÃO SOBRE O CTA");
    expect(brief).toContain("EXEMPLO DE DIREÇÃO");
    expect(brief).toContain("CTA PRINCIPAL DESTE ENVIO");
    expect(brief).toContain("REGRA DE DISTRIBUIÇÃO");
    expect(brief).toContain("Quem priorizar sem criar novas versões");
    expect(brief).toContain("REGRA DE ENVIO");
    expect(brief).toContain("REFERÊNCIA SECUNDÁRIA · ACERVO CONTEXTUALIZADO");
    expect(brief).toContain("version.secondaryAction");
    expect(brief).toContain("FONTES E PONTOS DE BUSCA");
    expect(brief).toContain("brief.sourceLinks");
  });

  it("abre 18/09 por padrão e permite abrir diretamente os demais e-mails", () => {
    expect(brief).toContain('emailId === "email-base-comparativo"');
    expect(brief).toContain('get("email-focus")');
    expect(brief).toContain("open={startsOpen}");
  });
});
