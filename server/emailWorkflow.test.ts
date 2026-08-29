import { describe, expect, it } from "vitest";
import { emailBase, emailNurture } from "../client/src/data/planData";
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

  it("organiza os status nas oito etapas operacionais", () => {
    expect(EMAIL_STATUS_GROUPS).toEqual(["Fila", "Dependências", "Briefing", "Criação", "Aprovação", "Ajustes", "Concluído", "Envio"]);
    expect(new Set(EMAIL_STATUSES.map(status => status.id)).size).toBe(EMAIL_STATUSES.length);
    expect(EMAIL_STATUSES.some(status => status.id === "na-fila-agencia")).toBe(true);
    expect(EMAIL_STATUSES.some(status => status.id === "aguardando-pack")).toBe(true);
    expect(EMAIL_STATUSES.some(status => status.id === "email-mkt-aprovado")).toBe(true);
    expect(EMAIL_STATUSES.some(status => status.id === "enviado-gazeta")).toBe(true);
  });

  it("preserva aprovadores específicos indicados pelo cliente", () => {
    for (const name of ["Adri", "Feijó", "Cibele", "Ve", "Ci", "Cris", "Rapha", "Gazeta"]) {
      expect(EMAIL_STATUSES.some(status => status.label.includes(name))).toBe(true);
    }
  });

  it("aceita link vazio ou HTTPS e rejeita protocolos inseguros", () => {
    expect(isValidEmailPreviewUrl("")).toBe(true);
    expect(isValidEmailPreviewUrl("https://example.com/email/preview")).toBe(true);
    expect(isValidEmailPreviewUrl("http://example.com/email/preview")).toBe(false);
    expect(isValidEmailPreviewUrl("javascript:alert(1)")).toBe(false);
    expect(getEmailStatus("status-antigo").id).toBe("nao-foi-feito");
  });
});
