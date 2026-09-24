import { describe, expect, it } from "vitest";
import { calendar, emailBase, whatsappPlan } from "../client/src/data/planData";
import { emailCampaignBriefs } from "../client/src/data/emailBriefs";
import { paidMediaAssets } from "../client/src/data/paidMedia";

const octoberCalendar = calendar.filter(item => Number(item.id.slice(0, 4)) >= 928);
const octoberEmails = emailBase.filter(item => item.id.startsWith("email-oct-"));
const octoberWhatsApp = whatsappPlan.filter(item => item.date.includes("/10"));
const octoberPaid = paidMediaAssets.filter(item => item.id.includes("-oct-"));

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
    expect(item("1001").title).toContain("gestor");
    expect(item("1004").title).toContain("Faltam dois dias");
    expect(item("1010").title).toContain("perda muscular");
    expect(item("1021").title).toContain("peso caiu");
  });

  it("mantém Gestão e Certificação Internacional em Personal Training – WTTC como produtos independentes", () => {
    expect(item("1002").congresses).toEqual(["WTTC"]);
    expect(item("1013").congresses).toEqual(["WTTC"]);
    expect(JSON.stringify([item("1002"), item("1013")])).toContain("Certificação Internacional em Personal Training – WTTC");
    expect(JSON.stringify([item("1002"), item("1013")])).not.toMatch(/versus/i);
    expect(item("1002").congresses).not.toContain("Gestão de Academias");
  });

  it("registra seis pontos de busca de novas íntegras sem tratá-los como cortes aprovados", () => {
    const cutItems = octoberCalendar.filter(entry => entry.cutValidations?.length);
    expect(cutItems.map(entry => entry.id)).toEqual(["1001", "1008", "1010", "1014", "1021", "1024"]);
    const cuts = cutItems.flatMap(entry => entry.cutValidations ?? []);
    expect(cuts).toHaveLength(6);
    for (const cut of cuts) {
      expect(cut.sourceUrl).toMatch(/^https:\/\/youtu\.be\//);
      expect(cut.location).toMatch(/\d{2}:\d{2}/);
      expect(cut.transcriptStatus).toBe("Tema localizado na transcrição automática");
      expect(cut.videoStatus).toBe("Conferência no vídeo original pendente");
    }
  });

  it("atribui URL direta e um único CTA a todas as entradas de outubro", () => {
    for (const entry of octoberCalendar) {
      expect(entry.destinationUrl, entry.id).toMatch(/^https:\/\//);
      expect(entry.cta.length, entry.id).toBeGreaterThan(12);
      expect(entry.destination.length, entry.id).toBeGreaterThan(10);
    }
  });

  it("mantém dez slots de e-mail segmentados, sem envios redundantes em 02 e 05/10", () => {
    expect(octoberEmails).toHaveLength(10);
    expect(Object.keys(emailCampaignBriefs).filter(id => id.startsWith("email-oct-"))).toHaveLength(10);
    expect(octoberEmails.map(item => item.date)).not.toContain("02/10");
    expect(octoberEmails.map(item => item.date)).not.toContain("05/10");
    for (const campaign of octoberEmails) {
      const brief = emailCampaignBriefs[campaign.id];
      expect(brief.versions).toHaveLength(1);
      expect(brief.versions[0].steps).toHaveLength(4);
      expect(brief.versions[0].destinationUrl).toMatch(/^https:\/\//);
      expect(`${brief.versions[0].exclusion} ${brief.productionChecks.join(" ")}`).toMatch(/excluir|suprimir|cancelar|uma única versão/i);
    }
  });

  it("transforma pesquisa, direitos e validação em obrigação explícita da agência", () => {
    const researched = octoberCalendar.filter(entry => entry.agencyResearch);
    expect(researched.length).toBeGreaterThanOrEqual(12);
    expect(JSON.stringify(researched)).toMatch(/fonte|direitos|autoriza/i);
    expect(item("1003").agencyResearch?.deliverables.join(" ")).toMatch(/licença|autorização/i);
    expect(item("1027").agencyResearch?.validation).toMatch(/palestrantes|cliente/i);
    expect(item("1031").agencyResearch?.fallback).toMatch(/cancelar/i);
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
