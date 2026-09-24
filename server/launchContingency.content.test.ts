import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calendar, emailBase, emailNurture, launchWindow, phaseSummary, whatsappPlan } from "../client/src/data/planData";
import { paidMediaAssets } from "../client/src/data/paidMedia";

describe("abertura confirmada com gates operacionais", () => {
  const warmingCalendar = calendar.filter(item => {
    const id = Number(item.id.slice(0, 4));
    return id >= 915 && id <= 927;
  });

  it("mantém 15 a 27/09 como aquecimento, sem CTA de compra ou promessa de abertura", () => {
    expect(warmingCalendar.length).toBeGreaterThan(10);
    expect(warmingCalendar.every(item => item.phase === "Aquecimento")).toBe(true);

    for (const item of warmingCalendar) {
      const fixedContent = [
        item.title,
        item.idea,
        item.cta,
        item.destination,
        item.fallback,
        ...(item.storyCards ?? []).flatMap(card => [card.prompt, card.note ?? "", ...(card.answers ?? [])]),
      ].join(" ");
      expect(fixedContent, item.id).not.toMatch(/vendas abertas|primeiro lote|amanhã.{0,12}12h|faltam 48 horas|23\/09.{0,12}12h/i);
      expect(`${item.cta} ${item.destination}`, item.id).not.toMatch(/comprar|compra|checkout/i);
      expect(item.destination.toLocaleLowerCase("pt-BR"), item.id).not.toContain("página central de vendas");
    }
  });

  it("limita a escuta segmentada a no máximo duas enquetes por pauta", () => {
    for (const item of warmingCalendar) {
      const polls = (item.storyCards ?? []).filter(card => card.format.toLocaleLowerCase("pt-BR").includes("enquete"));
      expect(polls.length, item.id).toBeLessThanOrEqual(2);
    }
  });

  it("institui uma janela fixa completa e bloqueada por prontidão operacional", () => {
    expect(launchWindow.map(item => item.moment)).toEqual(["D-8 · 28/09", "D-6 · 30/09", "D-4 · 02/10", "D-2 · 04/10", "D-1 · 05/10", "D0 · 06/10", "D+1 a D+25"]);
    const gates = launchWindow.map(item => item.gate).join(" ").toLocaleLowerCase("pt-BR");
    expect(gates).toContain("ticketeira");
    expect(gates).toContain("checkout");
    expect(gates).toContain("data");
    expect(gates).toContain("condições");
    expect(gates).toContain("rastreamento");
    expect(gates).toContain("atendimento");
    expect(phaseSummary.slice(-3).map(item => item.label)).toEqual(["Intensificação", "Abertura", "Venda contínua"]);
  });

  it("preserva setembro em captação e ativa outubro somente nos segmentos elegíveis", () => {
    const fixedChannels = [...emailBase, ...emailNurture, ...whatsappPlan].map(item => JSON.stringify(item)).join(" ");
    expect(fixedChannels).not.toMatch(/abrem em 23\/09|23 SET|23\/09 às 12h|amanhã às 12h/i);
    const warmingDates = ["15/09", "18/09", "21/09", "22/09", "23/09", "24–25/09"];
    const warmingEmails = emailBase.filter(item => warmingDates.includes(item.date));
    expect(warmingEmails.find(item => item.date === "18/09")?.destination).toBe("Landing page geral de novidades");
    expect(warmingEmails.find(item => item.date === "21/09")?.destination).toBe("Landing page das masterclasses");
    expect(warmingEmails.find(item => item.date === "22/09")?.destination).toBe("Landing page geral de novidades");
    expect(warmingEmails.find(item => item.date === "23/09")?.destination).toBe("Landing page geral de novidades");
    expect(warmingEmails.find(item => item.date === "24–25/09")?.destination).toBe("Landing page geral de novidades");
    expect(warmingEmails.map(item => item.destination).join(" ")).not.toMatch(/vendas|checkout|compra/i);
    expect(whatsappPlan.filter(item => item.date.includes("/10"))).toHaveLength(4);
    expect(whatsappPlan.find(item => item.date === "06/10")?.segment).toContain("consentimento explícito");
  });

  it("reaproveita somente ativos previstos e mantém peças exclusivas vazias", () => {
    expect(paidMediaAssets).toHaveLength(8);
    expect(paidMediaAssets.every(item => item.category === "redimensionamento")).toBe(true);
    expect(paidMediaAssets.find(item => item.id === "resize-oct-opening")?.status).toBe("condicionada");
    expect(paidMediaAssets.filter(item => item.phase === "Aquecimento").every(item => item.destination?.url.includes("conference-2027"))).toBe(true);
  });

  it("remove a antiga data de 23/09 e exibe a abertura confirmada", () => {
    const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
    const layout = readFileSync(new URL("../client/src/components/StrategyLayout.tsx", import.meta.url), "utf8");
    expect(`${home} ${layout}`).not.toMatch(/23\.09|23 SET|ABERTURA\s*<br\s*\/>\s*ÀS 12H/i);
    expect(home).toContain("ABERTURA DE VENDAS");
    expect(home).toContain("DATA CONFIRMADA");
    expect(layout).toContain("06 OUT · 2026");
  });
});
