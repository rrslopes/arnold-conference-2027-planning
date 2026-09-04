import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  calendar,
  congresses,
  externalDestinations,
  keywords,
  leadMagnets,
  navigation,
} from "../client/src/data/planData";
import { operationalBriefs } from "../client/src/data/calendarBriefs";
import { calendarMilestones } from "../client/src/data/calendarMilestones";
import { paidMediaAssets } from "../client/src/data/paidMedia";

describe("ajustes estratégicos da plataforma em setembro", () => {
  it("trata validade internacional como diferencial central do WTTC", () => {
    const wttc = congresses.find(item => item.name === "WTTC");
    expect(`${wttc?.audience} ${wttc?.tension} ${wttc?.promise}`.toLocaleLowerCase("pt-BR")).toContain("validade internacional");
    expect(`${wttc?.audience} ${wttc?.promise}`.toLocaleLowerCase("pt-BR")).toContain("fora do brasil");
    expect(operationalBriefs["0917"].units.map(item => item.content).join(" ")).toContain("validade internacional");
  });

  it("mantém prevenção como eixo prioritário da SONAFE", () => {
    const sonafe = congresses.find(item => item.name === "SONAFE");
    expect(`${sonafe?.audience} ${sonafe?.tension} ${sonafe?.promise}`.toLocaleLowerCase("pt-BR")).toContain("preven");
    expect(operationalBriefs["0919"].units.map(item => `${item.role} ${item.content}`).join(" ").toLocaleLowerCase("pt-BR")).toContain("prevenção");
    expect(calendar.find(item => item.id === "0924")?.options?.join(" ").toLocaleLowerCase("pt-BR")).toContain("prevenção");
  });

  it("usa somente os dois destinos confirmados e sinaliza os demais", () => {
    expect(externalDestinations).toEqual({
      masterclasses: "https://masterclassconference.savagetgroup.com.br/",
      news: "https://oferta.savagetgroup.com.br/conference-2027",
    });
    expect(leadMagnets[0].destination?.url).toBe(externalDestinations.masterclasses);
    expect(keywords.filter(item => "url" in item)).toHaveLength(5);
    expect(keywords.filter(item => !("url" in item)).every(item => item.destination.includes("pendente"))).toBe(true);
  });

  it("mantém Mídia Paga somente com os quatro packs já previstos nos marcos", () => {
    expect(navigation.some(item => item.id === "midia-paga" && item.label === "Mídia paga")).toBe(true);
    expect(paidMediaAssets).toHaveLength(4);
    expect(paidMediaAssets.filter(item => item.category === "redimensionamento")).toHaveLength(4);
    expect(paidMediaAssets.filter(item => item.category === "exclusiva")).toHaveLength(0);
    expect(paidMediaAssets.map(item => item.id).sort()).toEqual(["resize-0908", "resize-0923a", "resize-0923b", "resize-0923c"]);
    expect(Object.keys(calendarMilestones).sort()).toEqual(["0908", "0923a", "0923b", "0923c"]);
    expect(paidMediaAssets.filter(item => item.status === "liberada").every(item => item.destination)).toBe(true);
    expect(paidMediaAssets.filter(item => item.phase === "Abertura").every(item => item.status === "condicionada" && !item.destination)).toBe(true);
  });

  it("não exibe coordenadores enquanto não houver confirmação oficial", () => {
    const intelligenceData = readFileSync(new URL("../client/src/data/editorialIntelligence.ts", import.meta.url), "utf8");
    const intelligenceSource = readFileSync(new URL("../client/src/components/EditorialIntelligence.tsx", import.meta.url), "utf8");
    expect(intelligenceData).not.toContain("coordination");
    expect(intelligenceSource).not.toContain("program-coordination");
    expect(intelligenceSource).not.toContain("UserRoundCheck");
  });

  it("renderiza links, bloqueios e fontes sem reintroduzir controles operacionais", () => {
    const calendarSource = readFileSync(new URL("../client/src/components/CalendarExplorer.tsx", import.meta.url), "utf8");
    const paidSource = readFileSync(new URL("../client/src/components/PaidMediaHub.tsx", import.meta.url), "utf8");
    expect(calendarSource).toContain("Abrir destino de");
    expect(paidSource).toContain("Peças exclusivas");
    expect(paidSource).toContain("URL COMERCIAL PENDENTE");
    expect(paidSource).toContain("Nenhuma peça exclusiva aprovada");
    expect(paidSource).not.toContain("<input");
    expect(paidSource).not.toContain("<select");
  });
});
