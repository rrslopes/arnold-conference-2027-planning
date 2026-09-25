import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  calendar,
  congresses,
  externalDestinations,
  keywords,
  leadMagnets,
  launchWindow,
  navigation,
} from "../client/src/data/planData";
import { operationalBriefs } from "../client/src/data/calendarBriefs";
import { calendarMilestones } from "../client/src/data/calendarMilestones";
import { paidMediaAssets } from "../client/src/data/paidMedia";
import { conferenceCoordinators } from "../client/src/data/editorialIntelligence";

describe("ajustes estratégicos da plataforma em setembro", () => {
  it("trata a atuação internacional como diferencial central da certificação", () => {
    const wttc = congresses.find(item => item.name === "WTTC");
    expect(wttc?.displayName).toBe("Certificação Internacional em Personal Training – WTTC");
    expect(`${wttc?.audience} ${wttc?.promise}`.toLocaleLowerCase("pt-BR")).toContain("atuação profissional internacional");
    expect(wttc?.promise.toLocaleLowerCase("pt-BR")).toContain("5 continentes e 18 países, com mais de 35 mil treinadores");
    expect(wttc?.promise.toLocaleLowerCase("pt-BR")).toContain("chancela wttc");
    expect(operationalBriefs["0917"].units.map(item => item.content).join(" ")).toContain("5 continentes e 18 países, com mais de 35 mil treinadores");
  });

  it("mantém prevenção como eixo prioritário da SONAFE", () => {
    const sonafe = congresses.find(item => item.name === "SONAFE");
    expect(`${sonafe?.audience} ${sonafe?.tension} ${sonafe?.promise}`.toLocaleLowerCase("pt-BR")).toContain("preven");
    expect(operationalBriefs["0919"].units.map(item => `${item.role} ${item.content}`).join(" ").toLocaleLowerCase("pt-BR")).toContain("prevenção");
    expect(calendar.find(item => item.id === "0919")?.options?.join(" ").toLocaleLowerCase("pt-BR")).toContain("prevenção");
  });

  it("usa somente os dois destinos confirmados e sinaliza os demais", () => {
    expect(externalDestinations).toEqual({
      masterclasses: "https://masterclassconference.savagetgroup.com.br/",
      news: "https://oferta.savagetgroup.com.br/conference-2027",
    });
    expect(leadMagnets[0].destination?.url).toBe(externalDestinations.masterclasses);
    expect(keywords.filter(item => "url" in item)).toHaveLength(7);
    expect(keywords.filter(item => !("url" in item)).every(item => item.destination.includes("pendente"))).toBe(true);
  });

  it("mantém os três packs históricos de setembro e separa as frentes condicionadas de outubro", () => {
    expect(navigation.some(item => item.id === "midia-paga" && item.label === "Mídia paga")).toBe(true);
    expect(paidMediaAssets.filter(item => !item.id.includes("-oct-"))).toHaveLength(3);
    expect(paidMediaAssets.filter(item => item.id.includes("-oct-"))).toHaveLength(5);
    expect(paidMediaAssets.filter(item => item.category === "redimensionamento")).toHaveLength(8);
    expect(paidMediaAssets.filter(item => item.category === "exclusiva")).toHaveLength(0);
    expect(paidMediaAssets.filter(item => !item.id.includes("-oct-")).map(item => item.id).sort()).toEqual(["resize-0908", "resize-0915", "resize-0918"]);
    expect(Object.keys(calendarMilestones).sort()).toEqual(["0908", "0915", "0918", "0930", "1004", "1006"]);
    expect(paidMediaAssets.filter(item => item.status === "liberada").every(item => item.destination)).toBe(true);
    expect(paidMediaAssets.filter(item => item.id.includes("-oct-")).every(item => item.status === "condicionada")).toBe(true);
    expect(launchWindow.map(item => item.moment)).toEqual(["D-8 · 28/09", "D-6 · 30/09", "D-4 · 02/10", "D-2 · 04/10", "D-1 · 05/10", "D0 · 06/10", "D+1 a D+25"]);
  });

  it("exibe somente os coordenadores confirmados no arquivo recebido", () => {
    const intelligenceSource = readFileSync(new URL("../client/src/components/EditorialIntelligence.tsx", import.meta.url), "utf8");
    expect(conferenceCoordinators.map(item => item.name)).toEqual([
      "Andréia Naves",
      "Luisa Wolpe",
      "Dudu Netto",
      "Cris Parente",
      "Leonardo Luiz Barretti Secchi",
      "Rafael Fernandes Temoteo",
      "Ricardo Pannain",
    ]);
    expect(intelligenceSource).toContain("Mini-CV não fornecido no arquivo recebido");
    expect(intelligenceSource).toContain("Mini_Bio_Fotos_Coordenadores_Conference.xlsx");
  });

  it("renderiza links, bloqueios e fontes sem reintroduzir controles operacionais", () => {
    const calendarSource = readFileSync(new URL("../client/src/components/CalendarExplorer.tsx", import.meta.url), "utf8");
    const paidSource = readFileSync(new URL("../client/src/components/PaidMediaHub.tsx", import.meta.url), "utf8");
    expect(calendarSource).toContain("Abrir destino de");
    expect(calendarSource).toContain("calendar-origin-link");
    expect(calendarSource).toContain("calendar-origin-links");
    expect(calendarSource).toContain("item.materialLinks");
    expect(calendarSource).toContain('link.kind === "video"');
    expect(calendarSource).toContain("unit.sourceUrl");
    expect(paidSource).toContain("Peças exclusivas");
    expect(paidSource).toContain("URL COMERCIAL PENDENTE");
    expect(paidSource).toContain("Nenhuma peça exclusiva aprovada");
    expect(paidSource).not.toContain("<input");
    expect(paidSource).not.toContain("<select");
  });
});
