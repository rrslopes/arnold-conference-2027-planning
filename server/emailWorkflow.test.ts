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

  it("detalha 18/09 como um único envio direto para a isca, sem antecipar informações internas", () => {
    const email = emailBase.find(item => item.id === "email-base-comparativo");
    const brief = emailCampaignBriefs["email-base-comparativo"];

    expect(email?.date).toBe("18/09");
    expect(email?.audience).toContain("ainda não liberaram as aulas");
    expect(email?.destination).toBe("Landing page das masterclasses");
    expect(brief.versions).toHaveLength(1);
    expect(brief.versions.map(version => version.id)).toEqual(["masterclasses"]);
    expect(brief.versions.every(version => version.steps.length === 4)).toBe(
      true
    );
    expect(brief.versions[0].destinationUrl).toBe(
      "https://masterclassconference.savagetgroup.com.br/"
    );
    const publicFacingDirections = [
      brief.versions[0].objective,
      brief.versions[0].subjectDirection,
      ...brief.versions[0].steps.map(step => step.example),
    ].join(" ");
    expect(publicFacingDirections).not.toMatch(/programaç|sessões confirmadas|palestrantes de 2027/i);
    expect(publicFacingDirections).not.toMatch(/provocação transversal|tendências rápidas|resposta automática/i);
  });

  it("não repete formulário para convertidos nem associa as masterclasses a públicos sem aula", () => {
    const brief = emailCampaignBriefs["email-base-comparativo"];
    const serialized = JSON.stringify(brief);

    expect(serialized).toContain("ainda não se cadastrou");
    expect(serialized).toContain("Excluir deste disparo");
    expect(brief.versions.some(version => version.id === "sonafe")).toBe(false);
    expect(brief.routing.at(-1)?.reason).toContain("não representam essas áreas");
    expect(brief.productionChecks.join(" ")).toContain("Não incluir programação");
  });

  it("abre briefings operacionais para todos os envios de 18 a 25/09", () => {
    expect(Object.keys(emailCampaignBriefs)).toEqual([
      "email-base-comparativo",
      "email-base-48h",
      "email-base-vespera",
      "email-base-vendas-abertas",
      "email-base-recuperar-inscricao",
    ]);
    Object.values(emailCampaignBriefs).forEach(brief => {
      expect(brief.decision.length).toBeGreaterThan(20);
      expect(brief.versions.length).toBeGreaterThan(0);
      expect(brief.routing.length).toBeGreaterThanOrEqual(2);
      expect(brief.productionChecks.length).toBeGreaterThanOrEqual(4);
      brief.versions.forEach(version => {
        expect(version.steps).toHaveLength(4);
        expect(version.destinationUrl).toMatch(/^https:\/\//);
        expect(version.cta.length).toBeGreaterThan(10);
      });
    });
  });

  it("equilibra conteúdo, isca e cadastro conforme a etapa da pessoa", () => {
    const email21 = emailCampaignBriefs["email-base-48h"];
    const email22 = emailCampaignBriefs["email-base-vespera"];
    const email23 = emailCampaignBriefs["email-base-vendas-abertas"];
    const email24 = emailCampaignBriefs["email-base-recuperar-inscricao"];

    expect(email21.versions.map(version => version.destinationUrl)).toEqual([
      "https://masterclassconference.savagetgroup.com.br/",
      "https://masterclassconference.savagetgroup.com.br/obrigado",
    ]);
    expect(email22.versions.map(version => version.destinationUrl)).toEqual([
      "https://www.instagram.com/reel/DVZDZWEFPP3/",
      "https://oferta.savagetgroup.com.br/conference-2027",
    ]);
    expect(email23.versions.map(version => version.destinationUrl)).toEqual([
      "https://www.instagram.com/p/DTnBm0Qlo0Q/?stkn=MW0wbmNwN2c2bmwwMw%3D%3D",
      "https://oferta.savagetgroup.com.br/conference-2027",
    ]);
    expect(email24.versions).toHaveLength(1);
    expect(email24.versions[0].destinationUrl).toBe("https://oferta.savagetgroup.com.br/conference-2027");
  });

  it("usa linguagem direta e uma única pauta concreta em cada envio", () => {
    const serialized = JSON.stringify(emailCampaignBriefs);
    expect(serialized).not.toMatch(/provocação transversal|tendências rápidas|resposta automática|três tensões/i);
    expect(emailCampaignBriefs["email-base-48h"].decision).toContain("Andreia Naves");
    expect(emailCampaignBriefs["email-base-vespera"].decision).toContain("equipe");
    expect(emailCampaignBriefs["email-base-vendas-abertas"].decision).toMatch(/recovery.*prevenção/i);
    expect(emailCampaignBriefs["email-base-recuperar-inscricao"].decision).toContain("área de interesse");
  });

  it("mantém a programação interna fora dos e-mails públicos de 18 a 25/09", () => {
    const auditedDates = new Set(["18/09", "21/09", "22/09", "23/09", "24–25/09"]);
    const publicFields = emailBase
      .filter(item => auditedDates.has(item.date))
      .flatMap(item => [item.objective, item.materials, item.cta]);

    expect(publicFields.join(" ")).not.toMatch(/programaç|grade confirmada|sessões confirmadas/i);
    expect(emailBase.find(item => item.date === "23/09")?.materials).toContain("Carrossel público da SONAFE");
    expect(emailBase.find(item => item.date === "24–25/09")?.cta).toBe("Escolher minha área de interesse");
    Object.values(emailCampaignBriefs).forEach(brief => {
      const publicFacing = brief.versions.flatMap(version => [version.objective, version.subjectDirection, ...version.steps.map(step => step.example)]);
      expect(publicFacing.join(" ")).not.toMatch(/grade|sessões confirmadas|palestrantes de 2027/i);
    });
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
