import { describe, expect, it } from "vitest";
import { calendar, emailBase, whatsappPlan } from "../client/src/data/planData";
import { emailCampaignBriefs } from "../client/src/data/emailBriefs";
import { paidMediaAssets } from "../client/src/data/paidMedia";

const octoberCalendar = calendar.filter(item => Number(item.id.slice(0, 4)) >= 928);
const octoberEmails = emailBase.filter(item => item.id.startsWith("email-oct-"));
const octoberWhatsApp = whatsappPlan.filter(item => item.date.includes("/10"));
const octoberPaid = paidMediaAssets.filter(item => item.id.includes("-oct-"));
const preferredOrder = [
  "Nutrição Esportiva",
  "Nutrição Estética",
  "SONAFE",
  "Gestão de Academias",
  "WTTC",
  "Bodybuilding",
];

function item(id: string) {
  const match = octoberCalendar.find(entry => entry.id === id);
  if (!match) throw new Error(`Item ${id} não encontrado`);
  return match;
}

describe("plano multicanal de outubro de 2026", () => {
  it("começa em 28/09 e organiza vinte e três entradas únicas entre preparação, anúncio, abertura e venda contínua", () => {
    expect(octoberCalendar).toHaveLength(23);
    expect(new Set(octoberCalendar.map(entry => entry.id)).size).toBe(23);
    expect(new Set(octoberCalendar.map(entry => entry.title.toLocaleLowerCase("pt-BR"))).size).toBe(23);
    expect(item("0928").phase).toBe("Intensificação");
    expect(item("0930").phase).toBe("Intensificação");
    expect(item("1006").phase).toBe("Abertura");
    expect(item("1031").phase).toBe("Venda contínua");
  });

  it("anuncia 06/10 em 30/09 e só chama para compra a partir da abertura", () => {
    expect(JSON.stringify(item("0928"))).not.toContain("06/10");
    expect(item("0930").title).toBe("As inscrições do Arnold Conference 2027 abrem em 06/10");
    expect(`${item("0930").cta} ${item("0930").destination}`.toLocaleLowerCase("pt-BR")).not.toMatch(/comprar|compra|checkout/);
    expect(item("1006").title).toBe("Inscrições abertas para o Arnold Conference 2027");
    expect(item("1006").cta).toContain("fazer a inscrição");
    expect(item("0930").milestone?.tone).toBe("sales");
    expect(item("1004").milestone?.tone).toBe("sales");
    expect(item("1006").milestone?.tone).toBe("sales");
  });

  it("usa linguagem direta e evita os títulos genéricos rejeitados", () => {
    const publicFields = octoberCalendar.flatMap(entry => [entry.title, entry.idea, entry.cta]);
    expect(publicFields.join(" ")).not.toMatch(/tensão profissional|mais do que uma resposta pronta|provocação transversal/i);
    expect(item("0928").title).toContain("perda muscular");
    expect(item("1003").title).toContain("academia");
    expect(item("1004").title).toContain("Faltam dois dias");
    expect(item("1012").title).toContain("peso caiu");
  });

  it("mantém Gestão e Certificação Internacional em Personal Training – WTTC como produtos independentes", () => {
    const management = [item("1003"), item("1014"), item("1027")];
    const certification = [item("1008"), item("1016"), item("1029")];
    expect(management.every(entry => entry.congresses.length === 1 && entry.congresses[0] === "Gestão de Academias")).toBe(true);
    expect(certification.every(entry => entry.congresses.length === 1 && entry.congresses[0] === "WTTC")).toBe(true);
    expect(JSON.stringify(certification)).toContain("Certificação Internacional em Personal Training – WTTC");
    expect(JSON.stringify([...management, ...certification])).not.toMatch(/versus/i);
  });

  it("coloca fonte, link e minutagem útil dentro do briefing, sem notas internas de auditoria", () => {
    const sourceItems = ["0928", "1001", "1003", "1012", "1014", "1018", "1020", "1031"].map(item);
    expect(sourceItems.every(entry => !entry.cutValidations?.length)).toBe(true);
    const sources = sourceItems.flatMap(entry => entry.productionBrief?.units.filter(unit => unit.source) ?? []);
    expect(sources).toHaveLength(8);
    expect(sources.every(unit => unit.sourceUrl?.match(/^https:\/\/(youtu\.be|www\.instagram\.com)\//))).toBe(true);
    expect(sources.map(unit => unit.source).join(" ")).toMatch(/17:30–18:13|53:05–53:25|08:56–09:18|43:52–44:16|36:20–36:51|00:00|15:18\.9–15:27\.6|00:16/i);
    expect(JSON.stringify(sourceItems)).not.toMatch(/inválid|diverg|conferência humana|player original|timecode anterior/i);
  });

  it("inclui formatos simples pedidos pelo cliente sem inventar fatos ou depoimentos", () => {
    expect(item("1010").title).toBe("5 motivos para participar do Congresso de Nutrição Esportiva");
    expect(item("1013").title).toBe("6 motivos para fisioterapeutas esportivos participarem do SONAFE");
    expect(item("1027").title).toContain("5 fatos da trajetória de Dudu Netto");
    expect(item("1027").agencyResearch?.deliverables.join(" ")).toContain("Uma referência para cada fato");
    expect(item("1022").title).toBe("Qual aprendizado do Arnold Conference você já levou para a prática?");
    expect(JSON.stringify(item("1022"))).toMatch(/autorização|autorizada/i);
    expect(JSON.stringify(item("1022"))).not.toMatch(/inscrição travou|dados financeiros/i);
  });

  it("organiza dezoito pautas temáticas em três ciclos iguais iniciados por Nutrição Esportiva", () => {
    const thematic = octoberCalendar.filter(entry => entry.congresses.length === 1 && entry.congresses[0] !== "Todos");
    expect(thematic).toHaveLength(18);
    expect(thematic.map(entry => entry.congresses[0])).toEqual([...preferredOrder, ...preferredOrder, ...preferredOrder]);
    for (const congress of preferredOrder) {
      const congressEntries = thematic.filter(entry => entry.congresses[0] === congress);
      expect(congressEntries).toHaveLength(3);
      expect(congressEntries.every(entry => entry.channel !== "Stories"), congress).toBe(true);
    }
    expect(thematic[0].id).toBe("0928");
    expect(thematic[0].congresses).toEqual(["Nutrição Esportiva"]);
    expect(thematic[5].congresses).toEqual(["Bodybuilding"]);
  });

  it("aplica a mesma ordem aos seis cards da abertura e aos e-mails de produto", () => {
    const opening = JSON.stringify(item("1006"));
    const positions = [
      opening.indexOf("Nutrição Esportiva"),
      opening.indexOf("Nutrição Estética"),
      opening.indexOf("SONAFE"),
      opening.indexOf("Gestão de Academias"),
      opening.indexOf("Certificação Internacional em Personal Training – WTTC"),
      opening.indexOf("Bodybuilding"),
    ];
    expect(positions.every(position => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);

    const productEmails = octoberEmails.filter(campaign => ["08/10", "09/10", "10/10", "13/10", "14/10", "15/10"].includes(campaign.date));
    expect(productEmails.map(campaign => campaign.id)).toEqual([
      "email-oct-sports",
      "email-oct-aesthetic",
      "email-oct-sonafe",
      "email-oct-management",
      "email-oct-wttc",
      "email-oct-bodybuilding",
    ]);
  });

  it("atribui URL direta e um único CTA a todas as entradas de outubro", () => {
    for (const entry of octoberCalendar) {
      expect(entry.destinationUrl, entry.id).toMatch(/^https:\/\//);
      expect(entry.cta.length, entry.id).toBeGreaterThan(12);
      expect(entry.destination.length, entry.id).toBeGreaterThan(10);
    }
  });

  it("faz cada CTA avançar para o destino correto da fase e do congresso", () => {
    expect(item("0928").destination).toBe("Landing page geral de novidades");
    expect(item("0930").destination).toBe("Landing page geral de novidades");
    expect(item("1006").destination).toBe("Hub oficial do Arnold Conference");

    const expectedDestination: Record<string, string> = {
      "Nutrição Esportiva": "Página oficial de Nutrição Esportiva",
      "Nutrição Estética": "Página oficial de Nutrição Estética",
      SONAFE: "Página oficial do SONAFE",
      "Gestão de Academias": "Página oficial de Gestão de Academias",
      WTTC: "Página oficial da Certificação Internacional em Personal Training – WTTC",
      Bodybuilding: "Página oficial de Bodybuilding",
    };

    const postOpening = octoberCalendar.filter(entry => Number(entry.id.slice(0, 4)) > 1006 && entry.congresses.length === 1 && entry.congresses[0] !== "Todos");
    for (const entry of postOpening) {
      expect(entry.destination, entry.id).toBe(expectedDestination[entry.congresses[0]]);
      expect(entry.cta.toLocaleLowerCase("pt-BR"), entry.id).toContain("inscrição");
    }
  });

  it("mantém temas diferentes nos três ciclos e torna 09/10 explicitamente executável", () => {
    const thematic = octoberCalendar.filter(entry => entry.congresses.length === 1 && entry.congresses[0] !== "Todos");
    for (const congress of preferredOrder) {
      const entries = thematic.filter(entry => entry.congresses[0] === congress);
      expect(new Set(entries.map(entry => entry.title)).size, congress).toBe(3);
      expect(new Set(entries.map(entry => entry.idea)).size, congress).toBe(3);
    }

    const bodybuildingExample = JSON.stringify(item("1009").productionBrief);
    expect(bodybuildingExample).toMatch(/segunda-feira|quarta|sexta/i);
    expect(bodybuildingExample).toMatch(/o que foi alterado|em qual data|qual resposta/i);
  });

  it("mantém onze slots de e-mail, com lembrete segmentado em 04/10 e sem envio redundante em 02 ou 05/10", () => {
    expect(octoberEmails).toHaveLength(11);
    expect(Object.keys(emailCampaignBriefs).filter(id => id.startsWith("email-oct-"))).toHaveLength(11);
    expect(octoberEmails.map(item => item.date)).not.toContain("02/10");
    expect(octoberEmails.map(item => item.date)).not.toContain("05/10");
    expect(octoberEmails.find(item => item.id === "email-oct-reminder")?.date).toBe("04/10");
    expect(emailCampaignBriefs["email-oct-reminder"].versions[0].audience).toMatch(/clicaram|visitaram/i);
    for (const campaign of octoberEmails) {
      const brief = emailCampaignBriefs[campaign.id];
      expect(brief.versions).toHaveLength(1);
      expect(brief.versions[0].steps).toHaveLength(4);
      expect(brief.versions[0].destinationUrl).toMatch(/^https:\/\//);
      expect(`${brief.versions[0].exclusion} ${brief.productionChecks.join(" ")}`).toMatch(/excluir|suprimir|cancelar|uma única versão/i);
    }
  });

  it("torna os e-mails questionados específicos, auditáveis e compatíveis com a operação disponível", () => {
    const aesthetic = emailCampaignBriefs["email-oct-aesthetic"];
    const sonafe = emailCampaignBriefs["email-oct-sonafe"];
    const management = emailCampaignBriefs["email-oct-management"];
    const wttc = emailCampaignBriefs["email-oct-wttc"];
    const bodybuilding = emailCampaignBriefs["email-oct-bodybuilding"];
    const recovery = emailCampaignBriefs["email-oct-recovery"];
    const help = emailCampaignBriefs["email-oct-consideration"];

    expect(JSON.stringify(aesthetic)).toMatch(/queda capilar|ferritina|inflamação|GLP-1/i);
    expect(JSON.stringify(sonafe)).toMatch(/quem é o atleta|modalidade|fase|objetivo|retorno ao esporte/i);
    expect(management.sourceLinks?.[0]).toMatchObject({ url: "https://youtu.be/7nACkId-GGw" });
    expect(JSON.stringify(management)).toContain("36:20–36:51");
    expect(JSON.stringify(wttc)).toMatch(/Cris Parente|quatro verificações|divergência pública/i);
    expect(`${bodybuilding.versions[0].objective} ${bodybuilding.versions[0].subjectDirection}`).not.toMatch(/equipe multidisciplinar/i);
    expect(JSON.stringify(bodybuilding)).toMatch(/sem repetir.*equipe multidisciplinar/i);
    expect(recovery.versions[0].audience).toMatch(/sem personalizar|rota universal/i);
    expect(recovery.versions[0].subjectDirection).not.toMatch(/congresso específico|produto específico/i);
    expect(help.versions[0].subjectDirection).toContain("Como podemos te ajudar a concluir sua inscrição?");
    expect(JSON.stringify(help)).toMatch(/FAQ|congresso@savagetgroup.com.br|WhatsApp/i);
  });

  it("entrega à agência somente materiais e fontes necessários para a produção", () => {
    const researched = octoberCalendar.filter(entry => entry.agencyResearch);
    expect(researched.length).toBeGreaterThanOrEqual(12);
    expect(JSON.stringify(researched)).toMatch(/fonte|mini-bio|trecho|foto/i);
    expect(item("1002").agencyResearch?.deliverables.join(" ")).toMatch(/licença|autorização/i);
    expect(item("1021").agencyResearch?.deliverables.join(" ")).toMatch(/mini-bios oficiais|fotos e créditos/i);
    expect(item("1027").agencyResearch?.deliverables.join(" ")).toMatch(/mini-bio oficial|referência para cada fato/i);
    expect(item("1029").agencyResearch?.deliverables.join(" ")).toMatch(/mini-bio oficial|fontes dos cargos/i);
  });

  it("limita WhatsApp a uma janela semanal e exige consentimento ou evento verificável", () => {
    expect(octoberWhatsApp.map(action => action.date)).toEqual(["06/10", "13/10", "20/10", "27/10"]);
    expect(JSON.stringify(octoberWhatsApp)).toMatch(/consentimento explícito/i);
    expect(JSON.stringify(octoberWhatsApp)).toMatch(/evento recente verificável|checkout iniciado/i);
    expect(JSON.stringify(octoberWhatsApp)).toMatch(/compra|opt-out/i);
  });

  it("organiza cinco frentes de mídia somente por redimensionamento", () => {
    expect(octoberPaid).toHaveLength(5);
    expect(octoberPaid.every(asset => asset.category === "redimensionamento")).toBe(true);
    expect(octoberPaid.every(asset => asset.status === "condicionada")).toBe(true);
    expect(octoberPaid.find(asset => asset.id === "resize-oct-opening")?.gate).toContain("gate D0");
    expect(octoberPaid.find(asset => asset.id === "resize-oct-prospecting")?.gate).toContain("Não criar");
  });

  it("mantém lotação e compra confirmada acima de métricas intermediárias", () => {
    const serialized = JSON.stringify([...octoberPaid, ...octoberWhatsApp, ...octoberEmails]);
    expect(serialized).toMatch(/compra confirmada|compradores|fazer a inscrição/i);
    expect(JSON.stringify(octoberPaid)).toContain("ocupação");
    expect(JSON.stringify(octoberPaid)).toContain("não por clique isolado");
  });
});
