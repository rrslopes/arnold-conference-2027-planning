import { describe, expect, it } from "vitest";
import { calendar, emailBase, emailOperationalGates, whatsappPlan } from "../client/src/data/planData";
import { emailCampaignBriefs } from "../client/src/data/emailBriefs";
import { paidMediaAssets } from "../client/src/data/paidMedia";

const octoberCalendar = calendar.filter(entry => Number(entry.id.slice(0, 4)) >= 928);
const octoberEmails = emailBase.filter(entry => entry.id.startsWith("email-oct-"));
const octoberWhatsApp = whatsappPlan.filter(entry => entry.date.includes("/10"));
const octoberPaid = paidMediaAssets.filter(entry => entry.id.includes("-oct-"));
const expectedIds = [
  "0928", "0929", "0930", "0930a", "1001", "1002", "1003", "1004", "1005", "1006",
  "1007", "1008", "1008a", "1009", "1010", "1011", "1012", "1013", "1014", "1015",
  "1015a", "1016", "1017", "1018", "1019", "1020", "1021", "1022a", "1023", "1024",
  "1025", "1026", "1027", "1028", "1029", "1029a", "1030", "1031",
];
const lealVideoIds = ["0929", "1005", "1007", "1008a", "1011", "1013", "1015a", "1022a", "1023", "1029a", "1030"];

function item(id: string) {
  const match = octoberCalendar.find(entry => entry.id === id);
  if (!match) throw new Error(`Item ${id} não encontrado`);
  return match;
}

describe("pacote editorial de 28/09 a 31/10 de 2026", () => {
  it("segue o calendário de outubro com os vídeos da Leal (38 entradas)", () => {
    expect(octoberCalendar.map(entry => entry.id)).toEqual(expectedIds);
    expect(new Set(octoberCalendar.map(entry => entry.id)).size).toBe(38);
    expect(new Set(octoberCalendar.map(entry => entry.title.toLocaleLowerCase("pt-BR"))).size).toBe(38);
    expect(octoberCalendar.every(entry => /^\d{4}[a-c]?$/.test(entry.id))).toBe(true);
    expect(item("0928").phase).toBe("Intensificação");
    expect(item("1006").phase).toBe("Abertura");
    expect(item("1031").phase).toBe("Venda contínua");
  });

  it("preserva a progressão comercial definida no pacote", () => {
    expect(JSON.stringify(item("0928"))).not.toContain("06/10");
    expect(item("0930").title).toBe("06/10: abrem as inscrições do Arnold Conference 2027");
    expect(`${item("0930").cta} ${item("0930").destination}`.toLocaleLowerCase("pt-BR")).not.toMatch(/comprar|checkout/);
    expect(item("1004").title).toBe("Faltam 2 dias");
    expect(item("1005").title).toBe("É amanhã");
    expect(item("1006").title).toBe("Inscrições abertas. Lote 1 limitado.");
    expect(item("1006").cta).toContain("lote 1");
    expect(item("0930").milestone?.tone).toBe("sales");
    expect(item("1004").milestone?.tone).toBe("sales");
    expect(item("1006").milestone?.tone).toBe("sales");
  });

  it("mantém Nutrição Esportiva à frente nos pontos de hierarquia solicitados", () => {
    expect(item("0928").congresses).toEqual(["Nutrição Esportiva"]);
    expect(item("1007").congresses).toEqual(["Nutrição Esportiva", "Nutrição Estética"]);
    const opening = JSON.stringify(item("1006").productionBrief);
    const order = [
      "Nutrição Esportiva",
      "Nutrição Estética",
      "3º Simpósio de Fisioterapia Esportiva da SONAFE",
      "8º Congresso de Gestão de Academias",
      "Certificação Internacional em Personal Training – WTTC",
      "Bodybuilding",
    ].map(label => opening.indexOf(label));
    expect(order.every(position => position >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("mantém Gestão e a Certificação Internacional em Personal Training – WTTC independentes", () => {
    const managementIds = ["1011", "1014", "1027"];
    const certificationIds = ["1015", "1022a", "1023", "1029"];
    expect(managementIds.every(id => item(id).congresses[0] === "Gestão de Academias")).toBe(true);
    expect(certificationIds.every(id => item(id).congresses[0] === "WTTC")).toBe(true);
    expect(JSON.stringify(certificationIds.map(item))).toContain("Certificação Internacional em Personal Training – WTTC");
    expect(JSON.stringify([...managementIds, ...certificationIds].map(item))).not.toMatch(/versus/i);
  });

  it("exibe somente os cinco trechos com minutagem confirmada no pacote", () => {
    const confirmedIds = ["0928", "1001", "1012", "1014", "1020"];
    const sources = confirmedIds.flatMap(id => item(id).productionBrief?.units.filter(unit => unit.source) ?? []);
    expect(sources).toHaveLength(5);
    expect(sources.every(unit => unit.sourceUrl?.match(/^https:\/\/(youtu\.be|www\.youtube\.com)\//))).toBe(true);
    expect(sources.map(unit => unit.source).join(" ")).toMatch(/17:32 a 18:13|52:46 a 53:05|43:52 a 44:14|36:20 a 36:51|15:18 a 15:28/);
    for (const stale of ["17:36 a 18:13", "52:47 a 53:08", "45:15 a 45:22", "15:18.9 a 15:27.6"]) {
      expect(JSON.stringify(octoberCalendar), stale).not.toContain(stale);
    }
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/timecode anterior|inválid|diverg|conferência humana|player original|auditoria interna/i);
    const reelSource = (id: string) => item(id).productionBrief?.units.filter(unit => unit.source) ?? [];
    expect(reelSource("1019")).toHaveLength(1);
    expect(reelSource("1019")[0]).toMatchObject({ role: "Relato", source: "Ricardo Pannain · falas em 00:00, 00:10 e 00:50 do Reel", sourceUrl: "https://www.instagram.com/reel/DcmNMWJhMN0/" });
    expect(item("1019").agencyResearch?.request).toContain("Conferir as três falas no player do Instagram antes da edição (Reel: https://www.instagram.com/reel/DcmNMWJhMN0/). Se não for possível conferir, usar a alternativa segura.");
    for (const [id, reel] of [["1019", "https://www.instagram.com/reel/DcmNMWJhMN0/"], ["1031", "https://www.instagram.com/reel/DXXimnVFX4X/"]]) {
      expect(item(id).originUrl, id).toBe(reel);
      expect(item(id).origin, id).toContain(reel);
      expect(item(id).agencyResearch?.request, id).toContain(reel);
    }
    expect(reelSource("1031")).toHaveLength(1);
    expect(reelSource("1031")[0]).toMatchObject({ role: "Relato", source: "Ricardo Pannain · falas em 00:16 e 00:33 do Reel", sourceUrl: "https://www.instagram.com/reel/DXXimnVFX4X/" });
  });

  it("usa trechos da íntegra, e não pílulas prontas do Drive", () => {
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/pílulas? legendadas?|pílulas? finalizadas?|pasta de pílulas/i);
    const cut = item("1028").productionBrief?.units.filter(unit => unit.source) ?? [];
    expect(cut).toHaveLength(1);
    expect(cut[0].sourceUrl).toBe("https://youtu.be/8hnvXCzfd3U");
    expect(cut[0].source).toContain("Bruno Zylber · 04:33 a 05:29.");
    expect(JSON.stringify(item("1028"))).not.toMatch(/14:36|19:09|28:09/);
    expect(item("1028").origin).not.toMatch(/\[[^\]]*A INSERIR[^\]]*\]/);
  });

  it("preserva os formatos simples, histórias e provas de autoridade solicitados", () => {
    expect(item("1010").title).toBe("Inscrições abertas: 5 motivos para estar no Congresso de Nutrição Esportiva 2027");
    expect(item("1021").title).toBe("Quem é Ana Paula Pujol, que fala de bioenergética mitocondrial em 2027");
    expect(item("1027").title).toBe("O que Dudu Netto aprendeu sobre gestão antes de coordenar o congresso");
    expect(item("1016").title).toBe("Programação 2027 de Nutrição Esportiva: temas centrais");
    expect(JSON.stringify(item("1016"))).not.toMatch(/programação (completa|definitiva)/i);
    expect(JSON.stringify(item("1016"))).not.toContain("Katherine");
    expect(item("1010").productionBrief?.units.find(unit => unit.unit === "Tela 6")?.content).toContain("Em 2027");
    expect(item("1020").productionBrief?.units.find(unit => unit.unit === "Fechamento")?.content).toContain("Danielli Mello");
    expect(item("1028").productionBrief?.units.find(unit => unit.role === "Crédito e ação")?.content).toContain("Murilo Pereira");
    expect(JSON.stringify(item("1008"))).not.toMatch(/definitiva/i);
    expect(item("1029").title).toBe("O caminho de Cris Parente até o título de Melhor Personal Trainer do Mundo");
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/5 coisas sobre/);
    expect(JSON.stringify(item("1002"))).toMatch(/case real|fontes públicas|sem venda/i);
    expect(item("1003").title).toContain("ficou sem vaga");
  });

  it("mantém CTA e destino coerentes com cada fase", () => {
    for (const entry of octoberCalendar) {
      expect(entry.cta.length, entry.id).toBeGreaterThan(8);
      expect(entry.destination.length, entry.id).toBeGreaterThan(8);
    }
    expect(item("1002").destinationUrl).toBeUndefined();
    expect(item("1002").destination).toContain("sem link");
    expect(item("0928").destinationUrl).toContain("conference-2027");
    expect(item("1006").destinationUrl).toBe("https://arnold.savagetgroup.com.br/conference/");
    // 1018 (Dia do Médico) é homenagem: o briefing pede CTA sem venda direta.
    const afterOpening = octoberCalendar.filter(entry => Number(entry.id.slice(0, 4)) > 1006 && entry.id !== "1018" && entry.congresses[0] !== "Todos");
    expect(afterOpening.every(entry => entry.destinationUrl?.startsWith("https://arnold.savagetgroup.com.br/"))).toBe(true);
    expect(afterOpening.every(entry => entry.cta.toLocaleLowerCase("pt-BR").includes("lote 1"))).toBe(true);
  });

  it("aplica os vídeos da Leal, as collabs e os cards movidos", () => {
    for (const id of lealVideoIds) {
      expect(item(id).origin, id).toContain("[LINK DO VÍDEO – A RECEBER DA EQUIPE DO CLIENTE]");
    }
    for (const id of ["1008a", "1015a", "1022a", "1029a"]) {
      expect(item(id).channel, id).toContain("Reel publicado pelo Arnold, com o Conference em collab");
      expect(item(id).storyCards, id).toHaveLength(2);
    }
    for (const [id, speaker] of [["1021", "Ana Paula Pujol"], ["1027", "Dudu Netto"], ["1016", "Andréia Naves"], ["1029", "Cris Parente"]]) {
      const brief = JSON.stringify(item(id).productionBrief);
      expect(brief, id).toContain(`Publicar em collab com ${speaker}.`);
      expect(brief, id).toContain("[AUTORIZAÇÃO E HORÁRIO DA COLLAB – A COMBINAR COM O PALESTRANTE]");
    }
    expect(item("1017").productionBrief?.units.find(unit => unit.unit === "Tela 2")?.content).toBe("\"Em 2026, esgotou. Em 2027, o lote 1 é limitado.\"");
    expect(item("1017").title).toBe("Inscrições abertas: 3º Simpósio de Fisioterapia Esportiva da SONAFE");
    expect(item("1019").title).toBe("Mais exercícios na sessão não significa uma preparação melhor");
    expect(JSON.stringify(item("1025"))).toContain("[PUBLICAÇÃO CONDICIONADA – CONFIRMAR COM ADRIANA SE A ALLP FIT PODE SER DIVULGADA]");
    expect(JSON.stringify(item("0930a"))).toContain("[SUGESTÃO – ADRIANA E AGÊNCIA DE OPERAÇÃO DEFINEM A CONDUÇÃO]");
    expect(octoberCalendar.map(entry => entry.title)).not.toContain("35 países. Até onde sua carreira de personal pode ir?");
  });

  it("usa os números validados da Certificação e nunca \"35 países\"", () => {
    const everything = JSON.stringify({ calendar, emailBase, emailCampaignBriefs });
    expect(everything).not.toContain("35 países");
    expect(JSON.stringify(item("1015").productionBrief)).toContain("5 continentes e 18 países, com mais de 35 mil treinadores no mundo");
    expect(JSON.stringify(emailCampaignBriefs["email-oct-wttc"])).toContain("5 continentes e 18 países, com mais de 35 mil treinadores no mundo");
    const openingWttc = emailCampaignBriefs["email-oct-opening"].versions.find(version => version.id === "oct-opening-wttc");
    expect(JSON.stringify(openingWttc)).toContain("5 continentes e 18 países, com mais de 35 mil treinadores no mundo");
  });

  it("torna 09/10 executável sem prescrição", () => {
    const bodybuilding = JSON.stringify(item("1009").productionBrief?.units);
    expect(bodybuilding).toMatch(/Segunda:.*treino.*Quarta:.*dieta.*Sexta:.*recuperação/i);
    expect(bodybuilding).toMatch(/o que foi alterado|em que data|que resposta/i);
    expect(bodybuilding).not.toMatch(/dose|fármaco|ciclo/i);
  });

  it("segue o pacote de e-mail de outubro com dezessete envios e uma automação", () => {
    expect(octoberEmails.map(entry => [entry.id, entry.date])).toEqual([
      ["email-oct-announcement", "30/09"],
      ["email-oct-reminder", "04/10"],
      ["email-oct-opening", "06/10"],
      ["email-oct-sports", "08/10"],
      ["email-oct-aesthetic", "09/10"],
      ["email-oct-sonafe", "10/10"],
      ["email-oct-management", "13/10"],
      ["email-oct-wttc", "14/10"],
      ["email-oct-bodybuilding", "15/10"],
      ["email-oct-sports-2", "20/10"],
      ["email-oct-aesthetic-2", "21/10"],
      ["email-oct-sonafe-2", "22/10"],
      ["email-oct-management-2", "23/10"],
      ["email-oct-wttc-2", "26/10"],
      ["email-oct-bodybuilding-2", "26/10"],
      ["email-oct-consideration", "27/10"],
      ["email-oct-scarcity", "29/10"],
      ["email-oct-abandon", "Desde 06/10"],
    ]);
    expect(octoberEmails.map(entry => entry.date)).not.toContain("05/10");
    expect(emailCampaignBriefs["email-oct-recovery"]).toBeUndefined();
    for (const campaign of octoberEmails) {
      const brief = emailCampaignBriefs[campaign.id];
      expect(brief.versions).toHaveLength(campaign.id === "email-oct-opening" ? 7 : 1);
      for (const version of brief.versions) {
        expect(version.steps.length, campaign.id).toBeGreaterThanOrEqual(3);
        expect(version.destinationUrl).toMatch(/^https:\/\//);
      }
    }
    expect(JSON.stringify(emailCampaignBriefs["email-oct-abandon"])).toMatch(/1h depois do abandono e 24h depois/);
  });

  it("aplica a revisão da estratégia de e-mail de outubro", () => {
    const brief = (id: string) => JSON.stringify(emailCampaignBriefs[id]);
    const allOctober = octoberEmails.map(entry => brief(entry.id)).join(" ");
    expect(allOctober).not.toMatch(/Teste A\/B|recebe o aviso primeiro|aviso sai primeiro/);
    for (const id of ["email-oct-announcement", "email-oct-reminder"]) {
      expect(brief(id), id).toContain("Quem está na lista recebe as informações do lançamento e tem a oportunidade de concluir a inscrição com a condição especial do lote 1.");
      expect(brief(id), id).toContain("fique de olho na sua caixa de entrada");
    }
    expect(brief("email-oct-reminder")).toContain("em 2026, o Simpósio de Fisioterapia Esportiva da SONAFE esgotou");
    expect(brief("email-oct-opening")).toContain("Adriana ou Karla");
    expect(JSON.stringify(emailCampaignBriefs["email-oct-aesthetic-2"].versions[0].steps)).not.toMatch(/ferritina|lipedema|cirurgia plástica/i);
    const lastContact: Record<string, string> = { sonafe: "22/10", management: "23/10", wttc: "26/10", bodybuilding: "26/10" };
    for (const [slug, date] of Object.entries(lastContact)) {
      expect(octoberEmails.find(entry => entry.id === `email-oct-${slug}-2`)?.date, slug).toBe(date);
    }
    const preheaders = octoberEmails.map(entry => emailCampaignBriefs[entry.id].versions[0].subjectDirection.split("Pré-cabeçalho:")[1]).filter(Boolean);
    expect(new Set(preheaders).size).toBe(preheaders.length);
  });

  it("usa o benefício da feira só a partir de 06/10, nas peças de venda e com a redação pendente", () => {
    const fair = /Arnold Sports Festival/;
    const pending = "[REDAÇÃO OFICIAL DO BENEFÍCIO – CONFIRMAR COM ADRIANA OU KARLA]";
    const toNumber = (date: string) => {
      const [day, month] = date.replace("Desde ", "").slice(0, 5).split("/").map(Number);
      return month * 100 + day;
    };
    const cardsWithFair = octoberCalendar.filter(entry => fair.test(JSON.stringify(entry)));
    expect(cardsWithFair.map(entry => entry.id)).toEqual(["1006", "1008", "1010", "1011", "1015", "1017", "1030"]);
    for (const entry of cardsWithFair) {
      expect(toNumber(entry.date), entry.id).toBeGreaterThanOrEqual(1006);
      expect(JSON.stringify(entry), entry.id).toContain(pending);
    }
    const emailsWithFair = octoberEmails.filter(entry => fair.test(JSON.stringify(emailCampaignBriefs[entry.id])));
    expect(emailsWithFair.map(entry => entry.id)).toEqual(["email-oct-opening", "email-oct-consideration", "email-oct-scarcity", "email-oct-abandon"]);
    for (const entry of emailsWithFair) {
      expect(toNumber(entry.date), entry.id).toBeGreaterThanOrEqual(1006);
      for (const version of emailCampaignBriefs[entry.id].versions) {
        if (fair.test(JSON.stringify(version.steps))) expect(JSON.stringify(version.steps), version.id).toContain(pending);
      }
    }
    expect(emailCampaignBriefs["email-oct-opening"].versions.every(version => fair.test(JSON.stringify(version.steps)))).toBe(true);
    for (const id of ["1004", "1005"]) expect(JSON.stringify(item(id)), id).not.toMatch(/feira/i);
    expect(JSON.stringify(item("1006").storyCards)).not.toMatch(fair);
  });

  it("segmenta 06/10 por interesse e manda o hub só para a versão Geral", () => {
    const opening = emailCampaignBriefs["email-oct-opening"];
    expect(opening.versions.map(version => version.destinationUrl)).toEqual([
      "https://arnold.savagetgroup.com.br/conference2/nutricao-esportiva/",
      "https://arnold.savagetgroup.com.br/conference2/nutricao-estetica/",
      "https://arnold.savagetgroup.com.br/2-simposio-de-fisioterapia-esportiva-sonafe/",
      "https://arnold.savagetgroup.com.br/gestao-de-academias/",
      "https://arnold.savagetgroup.com.br/certificacao-internacional-em-personal-training-wttc/",
      "https://arnold.savagetgroup.com.br/conference2/bodybuilding/",
      "https://arnold.savagetgroup.com.br/conference/",
    ]);
    expect(opening.versions.every(version => version.steps.length === 4)).toBe(true);
    expect(opening.rationale).not.toContain("único envio");
  });

  it("aplica as regras novas de escassez, base inteira em 04/10 e gates", () => {
    const serialized = JSON.stringify(octoberEmails.map(entry => emailCampaignBriefs[entry.id]));
    expect(serialized).toContain("lote 1 é limitado");
    expect(serialized).not.toMatch(/R\$|virada em|vira em/i);
    expect(octoberEmails.find(entry => entry.id === "email-oct-reminder")?.audience).toBe("Base consentida inteira. Aplicar supressões.");
    expect(JSON.stringify(emailCampaignBriefs["email-oct-reminder"])).not.toMatch(/Não ampliar|clicaram no e-mail de 30\/09/);
    const gates = Object.fromEntries(emailOperationalGates.map(gate => [gate.id, gate]));
    expect(JSON.stringify(gates.d6)).not.toMatch(/sem escassez/i);
    expect(gates.d2.evidence).toBe("LP de novidades e links com UTM testados, e supressões aplicadas.");
    expect(JSON.stringify(emailOperationalGates)).not.toMatch(/\bGO\b|NO-GO|D-6|D-2|D0/);
    expect(gates.d0.evidence).toContain("Compra-teste real em desktop e mobile");
  });

  it("explicita pesquisa somente onde o pacote pede apuração", () => {
    const researched = octoberCalendar.filter(entry => entry.agencyResearch);
    expect(researched.map(entry => entry.id)).toEqual([
      "1002", "1003", "1008", "1010", "1016", "1017", "1019", "1021", "1024",
      "1025", "1026", "1027", "1029", "1031",
    ]);
    for (const entry of researched) {
      expect(entry.agencyResearch?.request.length, entry.id).toBeGreaterThan(20);
      expect(entry.agencyResearch?.deliverables.length, entry.id).toBeGreaterThanOrEqual(1);
      expect(entry.agencyResearch?.validation.length, entry.id).toBeGreaterThan(20);
      expect(entry.agencyResearch?.fallback.length, entry.id).toBeGreaterThan(20);
    }
  });

  it("mantém WhatsApp e mídia paga fora da substituição editorial", () => {
    expect(octoberWhatsApp.map(action => action.date)).toEqual(["06/10", "13/10", "20/10", "27/10"]);
    expect(JSON.stringify(octoberWhatsApp)).toMatch(/consentimento explícito|evento recente verificável/i);
    expect(octoberPaid).toHaveLength(5);
    expect(octoberPaid.every(asset => asset.category === "redimensionamento")).toBe(true);
    expect(octoberPaid.every(asset => asset.status === "condicionada")).toBe(true);
  });
});
