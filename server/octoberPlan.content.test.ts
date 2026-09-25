import { describe, expect, it } from "vitest";
import { calendar, emailBase, whatsappPlan } from "../client/src/data/planData";
import { emailCampaignBriefs } from "../client/src/data/emailBriefs";
import { paidMediaAssets } from "../client/src/data/paidMedia";

const octoberCalendar = calendar.filter(entry => Number(entry.id.slice(0, 4)) >= 928);
const octoberEmails = emailBase.filter(entry => entry.id.startsWith("email-oct-"));
const octoberWhatsApp = whatsappPlan.filter(entry => entry.date.includes("/10"));
const octoberPaid = paidMediaAssets.filter(entry => entry.id.includes("-oct-"));
const expectedIds = [
  "0928", "0930", "1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008",
  "1009", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1018", "1020",
  "1021", "1022", "1024", "1026", "1027", "1028", "1029", "1030", "1031",
];

function item(id: string) {
  const match = octoberCalendar.find(entry => entry.id === id);
  if (!match) throw new Error(`Item ${id} não encontrado`);
  return match;
}

describe("pacote editorial de 28/09 a 31/10 de 2026", () => {
  it("substitui integralmente outubro pelos 29 IDs recebidos", () => {
    expect(octoberCalendar.map(entry => entry.id)).toEqual(expectedIds);
    expect(new Set(octoberCalendar.map(entry => entry.id)).size).toBe(29);
    expect(new Set(octoberCalendar.map(entry => entry.title.toLocaleLowerCase("pt-BR"))).size).toBe(29);
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
    expect(item("1007").congresses).toEqual(["Nutrição Esportiva"]);
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
    const certificationIds = ["1015", "1022", "1029"];
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
    expect(sources.map(unit => unit.source).join(" ")).toMatch(/17:36 a 18:13|52:47 a 53:08|43:52 a 44:14|36:20 a 36:51|15:18\.9 a 15:27\.6/);
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/timecode anterior|inválid|diverg|conferência humana|player original|auditoria interna/i);
    const reelSource = (id: string) => item(id).productionBrief?.units.filter(unit => unit.source) ?? [];
    expect(reelSource("1018")).toHaveLength(1);
    expect(reelSource("1018")[0]).toMatchObject({ role: "Relato", source: "Ricardo Pannain · falas em 00:00, 00:10 e 00:50 do Reel", sourceUrl: "https://www.instagram.com/reel/DcmNMWJhMN0/" });
    expect(item("1018").agencyResearch?.request).toContain("Conferir as três falas no player do Instagram antes da edição. Se não for possível conferir, usar a alternativa segura.");
    expect(reelSource("1031")).toHaveLength(1);
    expect(reelSource("1031")[0]).toMatchObject({ role: "Relato", source: "Ricardo Pannain · falas em 00:16 e 00:33 do Reel", sourceUrl: "https://www.instagram.com/reel/DXXimnVFX4X/" });
  });

  it("usa trechos da íntegra, e não pílulas prontas do Drive", () => {
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/pílulas? legendadas?|pílulas? finalizadas?|pasta de pílulas/i);
    const cut = item("1016").productionBrief?.units.filter(unit => unit.source) ?? [];
    expect(cut).toHaveLength(1);
    expect(cut[0].sourceUrl).toBe("https://youtu.be/8hnvXCzfd3U");
    expect(cut[0].source).toContain("19:09.5 a 20:04.2 no YouTube (transcrição validada 04:33.5 a 05:28.2 + 14:36)");
    expect(item("1016").origin).not.toMatch(/\[[^\]]*A INSERIR[^\]]*\]/);
  });

  it("preserva os formatos simples, histórias e provas de autoridade solicitados", () => {
    expect(item("1010").title).toBe("5 motivos para estar no Congresso de Nutrição Esportiva 2027");
    expect(item("1021").title).toBe("5 coisas sobre Ana Paula Pujol");
    expect(item("1027").title).toBe("5 fatos da trajetória de Dudu Netto");
    expect(item("1028").title).toBe("5 coisas sobre Andréia Naves");
    expect(item("1029").title).toBe("5 coisas sobre Cris Parente");
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
    const afterOpening = octoberCalendar.filter(entry => Number(entry.id) > 1006 && entry.congresses[0] !== "Todos");
    expect(afterOpening.every(entry => entry.destinationUrl?.startsWith("https://arnold.savagetgroup.com.br/"))).toBe(true);
    expect(afterOpening.every(entry => entry.cta.toLocaleLowerCase("pt-BR").includes("lote 1"))).toBe(true);
  });

  it("torna 09/10 executável sem prescrição", () => {
    const bodybuilding = JSON.stringify(item("1009").productionBrief?.units);
    expect(bodybuilding).toMatch(/Segunda:.*treino.*Quarta:.*dieta.*Sexta:.*recuperação/i);
    expect(bodybuilding).toMatch(/o que foi alterado|em que data|que resposta/i);
    expect(bodybuilding).not.toMatch(/dose|fármaco|ciclo/i);
  });

  it("mantém onze slots de e-mail sem alterações nesta rodada", () => {
    expect(octoberEmails).toHaveLength(11);
    expect(Object.keys(emailCampaignBriefs).filter(id => id.startsWith("email-oct-"))).toHaveLength(11);
    expect(octoberEmails.map(entry => entry.date)).not.toContain("02/10");
    expect(octoberEmails.map(entry => entry.date)).not.toContain("05/10");
    expect(octoberEmails.find(entry => entry.id === "email-oct-reminder")?.date).toBe("04/10");
    for (const campaign of octoberEmails) {
      const brief = emailCampaignBriefs[campaign.id];
      expect(brief.versions).toHaveLength(1);
      expect(brief.versions[0].steps).toHaveLength(4);
      expect(brief.versions[0].destinationUrl).toMatch(/^https:\/\//);
    }
  });

  it("explicita pesquisa somente onde o pacote pede apuração", () => {
    const researched = octoberCalendar.filter(entry => entry.agencyResearch);
    expect(researched.map(entry => entry.id)).toEqual([
      "1002", "1003", "1007", "1008", "1010", "1011", "1013", "1015", "1018",
      "1021", "1022", "1024", "1026", "1027", "1028", "1029", "1031",
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
