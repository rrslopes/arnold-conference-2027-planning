import { describe, expect, it } from "vitest";
import { calculateAbandonments, calculateRate, getLatestMasterclassSnapshot, getLessonPerformance, validateMasterclassLandingSnapshot, type MasterclassLandingSnapshot } from "../shared/masterclassLanding";

const base = {
  periodStartAt: 1, periodEndAt: 2, totalLeads: 100, newLeads: 20, sessions: 200, dmSessions: 20, formStarts: 30, dmConversions: 4,
  thankYouPageAccesses: 16, anaLessonStarts: 10, anaLessonCompletions: 5, andreiaLessonStarts: null, andreiaLessonCompletions: null,
  robertoLessonStarts: 4, robertoLessonCompletions: 1, congressHubClicks: 5, newsLpClicks: 2, salesPageClicks: null, note: "",
};

describe("fotografia da LP das masterclasses", () => {
  it("calcula somente taxas com denominador disponível", () => {
    expect(calculateRate(20, 200)).toBe(10);
    expect(calculateRate(null, 200)).toBeNull();
    expect(calculateRate(5, 0)).toBeNull();
  });
  it("calcula abandono sem gerar valor negativo", () => {
    expect(calculateAbandonments(30, 20)).toBe(10);
    expect(calculateAbandonments(null, 20)).toBeNull();
    expect(calculateAbandonments(10, 20)).toBeNull();
  });
  it("mantém as três aulas separadas e não estima consumo ausente", () => {
    const lessons = getLessonPerformance(base);
    expect(lessons.map(item => item.speaker)).toEqual(["Ana Paula Pujol", "Andreia Naves", "Roberto Tranjan"]);
    expect(lessons[0].completionRate).toBe(50);
    expect(lessons[1].completionRate).toBeNull();
  });
  it("rejeita conclusões superiores aos inícios", () => {
    expect(validateMasterclassLandingSnapshot({ ...base, anaLessonCompletions: 11 })[0]?.field).toBe("anaLessonCompletions");
  });
  it("seleciona a fotografia mais recente sem somar acumulados", () => {
    const rows = [{ ...base, id: 1, updatedAt: 3 }, { ...base, id: 2, periodEndAt: 5, totalLeads: 140, updatedAt: 6 }] as MasterclassLandingSnapshot[];
    expect(getLatestMasterclassSnapshot(rows)?.id).toBe(2);
  });
});
