import { describe, expect, it } from "vitest";
import { emailBase, emailNurture } from "../client/src/data/planData";
import { emailCampaignBriefs } from "../client/src/data/emailBriefs";
import {
  EMAIL_STATUSES,
  EMAIL_STATUS_GROUPS,
  getEmailStatus,
  isValidEmailPreviewUrl,
} from "../shared/emailWorkflow";

describe("fluxo específico de aprovação dos e-mails", () => {
  it("atribui identificadores únicos aos nove e-mails de base e sete de nutrição", () => {
    expect(emailBase).toHaveLength(9);
    expect(emailNurture).toHaveLength(7);
    const ids = [...emailBase, ...emailNurture].map(item => item.id);
    expect(new Set(ids).size).toBe(16);
    ids.forEach(id => expect(id).toMatch(/^email-(base|nurture)-[a-z0-9-]+$/));
  });

  it("detalha 18/09 em duas versões segmentadas com um CTA coerente por público", () => {
    const email = emailBase.find(item => item.id === "email-base-comparativo");
    const brief = emailCampaignBriefs["email-base-comparativo"];

    expect(email?.date).toBe("18/09");
    expect(email?.audience).toContain("Duas segmentações");
    expect(brief.versions).toHaveLength(2);
    expect(brief.versions.map(version => version.id)).toEqual([
      "nutricao-estetica",
      "sonafe",
    ]);
    expect(brief.versions.every(version => version.steps.length === 4)).toBe(
      true
    );
    expect(
      brief.versions.find(version => version.id === "nutricao-estetica")
        ?.destinationUrl
    ).toBe("https://masterclassconference.savagetgroup.com.br/");
    expect(
      brief.versions.find(version => version.id === "sonafe")?.destinationUrl
    ).toBe("https://oferta.savagetgroup.com.br/conference-2027");
  });

  it("não repete formulário para convertidos nem associa as masterclasses ao SONAFE", () => {
    const brief = emailCampaignBriefs["email-base-comparativo"];
    const serialized = JSON.stringify(brief);
    const sonafe = brief.versions.find(version => version.id === "sonafe");

    expect(serialized).toContain("não converteu");
    expect(serialized).toContain("Não reenviar");
    expect(JSON.stringify(sonafe)).toContain(
      "não existe uma isca específica"
    );
    expect(sonafe?.cta).toBe("Quero acompanhar as novidades do SONAFE");
    expect(brief.productionChecks.join(" ")).toContain("programação antiga");
  });

  it("organiza os status nas oito etapas operacionais", () => {
    expect(EMAIL_STATUS_GROUPS).toEqual([
      "Fila",
      "Dependências",
      "Briefing",
      "Criação",
      "Aprovação",
      "Ajustes",
      "Concluído",
      "Envio",
    ]);
    expect(new Set(EMAIL_STATUSES.map(status => status.id)).size).toBe(
      EMAIL_STATUSES.length
    );
    expect(EMAIL_STATUSES.some(status => status.id === "na-fila-agencia")).toBe(
      true
    );
    expect(EMAIL_STATUSES.some(status => status.id === "aguardando-pack")).toBe(
      true
    );
    expect(
      EMAIL_STATUSES.some(status => status.id === "email-mkt-aprovado")
    ).toBe(true);
    expect(EMAIL_STATUSES.some(status => status.id === "enviado-gazeta")).toBe(
      true
    );
  });

  it("preserva aprovadores específicos indicados pelo cliente", () => {
    for (const name of [
      "Adri",
      "Feijó",
      "Cibele",
      "Ve",
      "Ci",
      "Cris",
      "Rapha",
      "Gazeta",
    ]) {
      expect(EMAIL_STATUSES.some(status => status.label.includes(name))).toBe(
        true
      );
    }
  });

  it("aceita link vazio ou HTTPS e rejeita protocolos inseguros", () => {
    expect(isValidEmailPreviewUrl("")).toBe(true);
    expect(isValidEmailPreviewUrl("https://example.com/email/preview")).toBe(
      true
    );
    expect(isValidEmailPreviewUrl("http://example.com/email/preview")).toBe(
      false
    );
    expect(isValidEmailPreviewUrl("javascript:alert(1)")).toBe(false);
    expect(getEmailStatus("status-antigo").id).toBe("nao-foi-feito");
  });
});
