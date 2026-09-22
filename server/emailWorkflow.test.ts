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
  it("atribui identificadores únicos aos nove e-mails históricos, doze slots de outubro e sete de nutrição", () => {
    expect(emailBase).toHaveLength(21);
    expect(emailNurture).toHaveLength(7);
    const ids = [...emailBase, ...emailNurture].map(item => item.id);
    expect(new Set(ids).size).toBe(28);
    ids.forEach(id => expect(id).toMatch(/^email-(base|nurture|oct)-[a-z0-9-]+$/));
  });

  it("mantém 18/09 como prévia temática de Nutrição Estética e SONAFE", () => {
    const email = emailBase.find(item => item.id === "email-base-comparativo");
    const brief = emailCampaignBriefs["email-base-comparativo"];

    expect(email?.date).toBe("18/09");
    expect(email?.audience).toContain("Base engajada");
    expect(email?.objective).toContain("profundidade");
    expect(email?.objective).toContain("Nutrição Estética e SONAFE");
    expect(email?.destination).toBe("Landing page geral de novidades");
    expect(brief.versions).toHaveLength(1);
    expect(brief.versions[0].id).toBe("programacoes-em-profundidade");
    expect(brief.versions[0].steps).toHaveLength(4);
    expect(brief.versions[0].destinationUrl).toBe(
      "https://oferta.savagetgroup.com.br/conference-2027"
    );
    expect(brief.versions[0].steps.map(step => step.role)).toEqual([
      "Por que olhar para os temas",
      "Nutrição Estética",
      "SONAFE",
      "Continuidade da jornada",
    ]);
  });

  it("usa uma única criação por disparo e não separa peças por status de cadastro", () => {
    Object.values(emailCampaignBriefs).forEach(brief => {
      expect(brief.versions).toHaveLength(1);
      expect(brief.productionChecks.join(" ")).toContain("uma única versão");
      expect(brief.versions[0].label).toContain("Versão única");
    });

    const serialized = JSON.stringify(emailCampaignBriefs);
    expect(serialized).not.toMatch(/Versão A|Versão B|separar cadastrados e não cadastrados/i);
    expect(serialized).not.toContain("masterclassconference.savagetgroup.com.br/obrigado");
  });

  it("preserva os briefings de 18 a 25/09 e acrescenta os doze slots de outubro", () => {
    expect(Object.keys(emailCampaignBriefs).filter(id => id.startsWith("email-base-"))).toEqual([
      "email-base-comparativo",
      "email-base-48h",
      "email-base-vespera",
      "email-base-vendas-abertas",
      "email-base-recuperar-inscricao",
    ]);
    expect(Object.keys(emailCampaignBriefs).filter(id => id.startsWith("email-oct-"))).toHaveLength(12);
    Object.values(emailCampaignBriefs).forEach(brief => {
      expect(brief.decision.length).toBeGreaterThan(20);
      expect(brief.versions).toHaveLength(1);
      expect(brief.routing.length).toBeGreaterThanOrEqual(2);
      expect(brief.productionChecks.length).toBeGreaterThanOrEqual(4);
      expect(brief.versions[0].steps).toHaveLength(4);
      expect(brief.versions[0].destinationUrl).toMatch(/^https:\/\//);
      expect(brief.versions[0].cta.length).toBeGreaterThan(10);
    });
  });

  it("equilibra os CTAs sem alterar o tema de cada e-mail", () => {
    const destinations = Object.fromEntries(
      Object.entries(emailCampaignBriefs).map(([id, brief]) => [
        id,
        brief.versions[0].destinationUrl,
      ])
    );

    expect(Object.fromEntries(Object.entries(destinations).filter(([id]) => id.startsWith("email-base-")))).toEqual({
      "email-base-comparativo":
        "https://oferta.savagetgroup.com.br/conference-2027",
      "email-base-48h":
        "https://masterclassconference.savagetgroup.com.br/",
      "email-base-vespera":
        "https://oferta.savagetgroup.com.br/conference-2027",
      "email-base-vendas-abertas":
        "https://oferta.savagetgroup.com.br/conference-2027",
      "email-base-recuperar-inscricao":
        "https://oferta.savagetgroup.com.br/conference-2027",
    });
    expect(destinations["email-oct-announcement"]).toBe("https://oferta.savagetgroup.com.br/conference-2027");
    expect(destinations["email-oct-opening"]).toBe("https://arnold.savagetgroup.com.br/conference/");
    const bodybuilding = emailCampaignBriefs["email-base-vespera"].versions[0];
    expect(bodybuilding.secondaryAction).toEqual({
      label: "Assistir ao registro de 2026 com Ricardo Pannain",
      destinationLabel: "Reel do acervo Arnold Conference 2026",
      destinationUrl: "https://www.instagram.com/reel/DVZDZWEFPP3/",
      context: expect.stringContaining("02/03/2026"),
    });
  });

  it("restaura os cinco temas publicados e apenas os detalha", () => {
    expect(emailCampaignBriefs["email-base-comparativo"].decision).toMatch(
      /profundidade.*Nutrição Estética e SONAFE/i
    );
    expect(emailCampaignBriefs["email-base-48h"].decision).toContain(
      "três decisões"
    );
    expect(emailCampaignBriefs["email-base-vespera"].decision).toContain(
      "equipe multidisciplinar"
    );
    expect(emailCampaignBriefs["email-base-vendas-abertas"].decision).toContain(
      "diferentes populações e modalidades"
    );
    expect(
      emailCampaignBriefs["email-base-recuperar-inscricao"].decision
    ).toContain("quatro critérios");

    const serialized = JSON.stringify(emailCampaignBriefs);
    expect(serialized).not.toMatch(/provocação transversal|tendências rápidas|resposta automática/i);
  });

  it("entrega conteúdo no corpo do e-mail mesmo para quem já está cadastrado", () => {
    const september18 = emailCampaignBriefs["email-base-comparativo"];
    const september23 = emailCampaignBriefs["email-base-vendas-abertas"];
    const september24 = emailCampaignBriefs["email-base-recuperar-inscricao"];

    for (const brief of [september18, september23, september24]) {
      const serialized = JSON.stringify(brief);
      expect(serialized).toMatch(/não precisa (se cadastrar|preencher|refazer)/i);
      expect(brief.versions[0].steps).toHaveLength(4);
    }
    expect(
      emailCampaignBriefs["email-base-48h"].versions[0].exclusion
    ).toContain("e-mail continua útil como conteúdo");
    expect(
      emailCampaignBriefs["email-base-vespera"].rationale
    ).toContain("registro do Arnold Conference 2026");
  });

  it("contextualiza o Reel antigo de Bodybuilding e faz a ponte com 2027", () => {
    const email = emailBase.find(item => item.date === "22/09");
    const brief = emailCampaignBriefs["email-base-vespera"];
    const version = brief.versions[0];
    const serialized = JSON.stringify(brief);

    expect(email?.destination).toBe("Landing page geral de novidades");
    expect(email?.rule).toContain("referência secundária clicável");
    expect(serialized).toContain("publicado em 2 de março de 2026");
    expect(serialized).toContain("O registro pertence à edição anterior");
    expect(serialized).toContain("Acompanhe as próximas novidades da sala Bodybuilding em 2027");
    expect(version.secondaryAction?.context).toContain("data e o CTA comercial daquela edição");
    expect(brief.limits).toContain("tendência comprovada");
    expect(brief.limits).toContain("não confirma Ricardo Pannain nem esse tema em 2027");
  });

  it("usa temas centrais autorizados sem consumir o lançamento das grades", () => {
    const auditedDates = new Set([
      "18/09",
      "21/09",
      "22/09",
      "23/09",
      "24–25/09",
    ]);
    const publicFields = emailBase
      .filter(item => auditedDates.has(item.date))
      .flatMap(item => [item.objective, item.materials, item.cta]);

    expect(publicFields.join(" ")).not.toMatch(
      /horários de 2027|títulos integrais de 2027|palestrantes de 2027/i
    );
    expect(emailBase.find(item => item.date === "18/09")?.materials).toContain(
      "Temas centrais autorizados"
    );
    expect(emailBase.find(item => item.date === "23/09")?.materials).toContain(
      "Temas centrais autorizados"
    );
    expect(
      emailCampaignBriefs["email-base-vendas-abertas"].productionChecks.join(
        " "
      )
    ).toContain("Preservar títulos integrais");
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
