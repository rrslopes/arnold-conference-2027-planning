import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calendar, congresses, keywords, WTTC_PUBLIC_NAME } from "../client/src/data/planData";
import { operationalBriefs } from "../client/src/data/calendarBriefs";
import { conferencePrograms2027 } from "../client/src/data/editorialIntelligence";
import { INTEREST_FIELDS } from "../shared/leadProfile";

describe("política editorial de Gestão de Academias e Certificação Internacional em Personal Training – WTTC", () => {
  it("mantém o nome público completo e a sigla apenas como chave interna ou palavra-chave", () => {
    expect(WTTC_PUBLIC_NAME).toBe("Certificação Internacional em Personal Training – WTTC");
    expect(congresses.find(item => item.name === "WTTC")?.displayName).toBe(WTTC_PUBLIC_NAME);
    expect(INTEREST_FIELDS.find(item => item.key === "physicalEducationCount")?.congress).toBe(WTTC_PUBLIC_NAME);
    expect(conferencePrograms2027.find(item => item.id === "wttc")?.congress).toBe(WTTC_PUBLIC_NAME);

    const keyword = keywords.find(item => item.word === "WTTC");
    expect(keyword?.use).toContain(WTTC_PUBLIC_NAME);
    expect(keyword?.note).toContain("nome completo antes da sigla");
  });

  it("apresenta 17/09 como pauta independente da certificação, sem versus ou Gestão de Academias", () => {
    const item = calendar.find(entry => entry.id === "0917");
    const calendarText = [item?.title, item?.idea, item?.optionLabel, ...(item?.options ?? []), item?.fallback].join(" ");
    const brief = operationalBriefs["0917"];
    const briefText = [brief.purpose, brief.note, ...brief.units.flatMap(unit => [unit.role, unit.content])].join(" ");

    expect(item?.congresses).toEqual(["WTTC"]);
    expect(calendarText).toContain(WTTC_PUBLIC_NAME);
    expect(calendarText.toLocaleLowerCase("pt-BR")).not.toMatch(/versus|comparativ|gestão de academias/);
    expect(briefText).toContain(WTTC_PUBLIC_NAME);
    expect(briefText.toLocaleLowerCase("pt-BR")).not.toMatch(/versus|comparativ|prioridade gestão|complementaridade/);
    expect(brief.units.map(unit => unit.role)).toEqual(["Abertura", "Nome completo", "Público", "Diferencial", "Alcance", "Próximo passo"]);
  });

  it("não usa 18/09 para comparar Gestão de Academias e a certificação", () => {
    const item = calendar.find(entry => entry.id === "0918");
    expect(item?.channel).toBe("Carrossel");
    expect(item?.storyCards).toBeUndefined();
    expect(operationalBriefs["0918"].format).toBe("Carrossel de 8 cards");
    expect(operationalBriefs["0918"].units.some(unit => unit.unit === "Stories")).toBe(false);
    expect(operationalBriefs["0918"].note.toLocaleLowerCase("pt-BR")).toContain("não usar");
  });

  it("usa o nome completo nas superfícies visíveis sem renomear chaves persistidas", () => {
    const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
    const calendarSource = readFileSync(new URL("../client/src/components/CalendarExplorer.tsx", import.meta.url), "utf8");
    const occupancySource = readFileSync(new URL("../client/src/components/OccupancyDashboard.tsx", import.meta.url), "utf8");

    expect(homeSource).toContain("getCongressDisplayName(item.name)");
    expect(homeSource).toContain("WTTC_PUBLIC_NAME.toUpperCase()");
    expect(calendarSource).toContain("item.congresses.map(getCongressDisplayName)");
    expect(occupancySource).toContain("getCongressDisplayName(congress.name)");
    expect(congresses.find(item => item.name === "WTTC")?.name).toBe("WTTC");
  });
});
