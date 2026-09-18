import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  audienceAttractionAxes,
  conferenceCoordinators,
  conferencePrograms2027,
  confirmedProgramPublicationPolicy,
  nutritionAesthetic2026Priorities,
  speakerContentRequests,
} from "../client/src/data/editorialIntelligence";
import { navigation } from "../client/src/data/planData";

describe("inteligência editorial por programação", () => {
  it("organiza os seis congressos sem tratar grades de 2026 como programação de 2027", () => {
    expect(conferencePrograms2027).toHaveLength(6);
    expect(conferencePrograms2027.filter(item => item.status === "recebida")).toHaveLength(2);
    expect(conferencePrograms2027.filter(item => item.status === "aguardando")).toHaveLength(4);
    expect(conferencePrograms2027.filter(item => item.status === "aguardando").every(item => item.sessions.length === 0)).toBe(true);
    expect(navigation.some(item => item.id === "inteligencia" && item.label === "Programação & conteúdo")).toBe(true);
  });

  it("reproduz as dez sessões confirmadas de Nutrição Estética 2027", () => {
    const program = conferencePrograms2027.find(item => item.id === "nutricao-estetica");
    expect(program?.date).toBe("23 de abril de 2027");
    expect(program?.sessions).toHaveLength(10);
    expect(program?.sessions[0]).toMatchObject({ time: "9h00", speakers: "Marília Lacerda" });
    expect(program?.sessions.at(-1)?.title).toContain("Performance Feminina");
    expect(program?.source).toContain("Programação_Conference_NutriçãoEstética_2027.xlsx");
    expect(program?.source).toContain("18/09/2026");
    expect(program?.assetSourceUrl).toContain("1cbpsKRniKhToysrglTtyyCpQwPeHffcs");
    expect(program?.note).toContain("dez sessões");
    expect(program?.statusLabel).toContain("definitiva");
    expect(program?.note).toContain("temas centrais podem ser divulgados seletivamente");
    expect(program?.note).toContain("15 dos 17 palestrantes");
    expect(program?.sessions.every(item => item.materialStatus)).toBe(true);
    expect(program?.sessions.find(item => item.time === "16h00")?.speakers).toBe("Andréia Naves");
  });

  it("associa somente as dez fotos inequivocamente identificadas e mantém as lacunas visíveis", () => {
    const program = conferencePrograms2027.find(item => item.id === "nutricao-estetica");
    const assets = program?.sessions.flatMap(item => item.speakerAssets ?? []) ?? [];
    const photoNames = assets.filter(item => item.photo).map(item => item.name);

    expect(photoNames).toEqual([
      "Marília Lacerda",
      "Gabriel Ximenes",
      "Luísa Wolpe",
      "Luísa Wolpe",
      "Suellen Becher",
      "Dr. Vinicius Ortiz",
      "Ana Paula Pujol",
      "Andréia Naves",
      "Faruk Kalil",
      "Vanessa Erthal",
      "Alessandra Pinheiro",
    ]);
    expect(assets.filter(item => item.photo).every(item => item.photo?.startsWith("/manus-storage/"))).toBe(true);
    expect(new Set(photoNames).size).toBe(10);
    expect(assets.find(item => item.name === "Diogo Viana")?.photo).toBeUndefined();
    expect(assets.find(item => item.name === "Diogo Viana")?.materialUrl).toContain("1FSxtY4fM");
    expect(assets.find(item => item.name === "Diogo Viana")?.note).toContain("imagem ainda não exibida");
    expect(assets.find(item => item.name === "Pedro Perim")?.note).toContain("pendentes");
    expect(assets.find(item => item.name === "Dr. Leandro Lucerna")?.note).toContain("pendentes");
    expect(new Set(assets.filter(item => item.materialUrl).map(item => item.name)).size).toBe(15);
    expect(program?.sessions.find(item => item.time === "17h20")?.speakerAssets).toHaveLength(3);
  });

  it("reproduz as doze sessões confirmadas de SONAFE 2027 e preserva os co-palestrantes", () => {
    const program = conferencePrograms2027.find(item => item.id === "sonafe");
    expect(program?.date).toBe("24 de abril de 2027");
    expect(program?.sessions).toHaveLength(12);
    expect(program?.sessions.find(item => item.time === "10h00")?.speakers).toBe("Leonardo Luiz Barretti Secchi e Priscila Alvarenga");
    expect(program?.sessions.find(item => item.time === "10h30")?.speakers).toBe("Paulo Ricardo Celestino Leite e Mariana Vido Corassini");
    expect(program?.sessions.find(item => item.time === "11h00")?.speakers).toBe("Marco Antônio Ferreira Alves e Cristina Alcantara");
    expect(program?.sessions.find(item => item.time === "16h00")?.speakers).toBe("Maria Eugênia Ortiz (Gegê) e Klever Shinji");
    expect(program?.sessions.find(item => item.time === "16h30")?.speakers).toBe("André Fujita e Bárbara Pocceschi");
    expect(program?.sessions.at(-1)?.speakers).toContain("Moderação: Bruno Baroni");
    expect(program?.sourceUrl).toContain("1P6EooZAA6mVkYVMC-hVUfbBvGfxxCx-8");
    expect(program?.source).toContain("18/09/2026");
    expect(program?.note).toContain("numeração oficial");
    expect(program?.note).toContain("15 dos 20 palestrantes");
    expect(program?.statusLabel).toContain("definitiva");
    expect(program?.note).toContain("sem revelar a grade completa");
    const assets = program?.sessions.flatMap(item => item.speakerAssets ?? []) ?? [];
    expect(new Set(assets.filter(item => item.materialUrl).map(item => item.name)).size).toBe(15);
    expect(assets.filter(item => item.note?.includes("pendentes")).map(item => item.name)).toEqual([
      "Larissa Pechincha",
      "Giovana Steiner",
      "Bruno Baroni",
      "Katherine Ferro",
      "Fabricio Rapelo",
    ]);
  });

  it("autoriza temas centrais sem tornar seu uso obrigatório nem antecipar a grade completa", () => {
    expect(confirmedProgramPublicationPolicy.congresses).toEqual([
      "Nutrição Estética",
      "SONAFE — Simpósio de Fisioterapia Esportiva",
    ]);
    expect(confirmedProgramPublicationPolicy.allowed).toContain("quando melhorarem a jornada");
    expect(confirmedProgramPublicationPolicy.reserved).toContain("grade completa");
    expect(confirmedProgramPublicationPolicy.reserved).toContain("palestrantes");
    expect(confirmedProgramPublicationPolicy.criterion).toContain("não cria obrigação editorial");
  });

  it("mantém eixos e solicitações operacionais completos", () => {
    expect(audienceAttractionAxes).toHaveLength(10);
    expect(audienceAttractionAxes.every(item => item.tension && item.audience && item.sessions && item.congress)).toBe(true);
    expect(audienceAttractionAxes.filter(item => item.congress === "SONAFE")).toHaveLength(4);
    expect(speakerContentRequests).toHaveLength(7);
    expect(speakerContentRequests.some(item => item.item.includes("Ementa"))).toBe(true);
    expect(speakerContentRequests.some(item => item.stage === "Governança")).toBe(true);
  });

  it("mantém os sete coordenadores confirmados e duas coordenações para SONAFE", () => {
    expect(conferenceCoordinators).toHaveLength(7);
    expect(conferenceCoordinators.filter(item => item.congressId === "sonafe")).toHaveLength(2);
    expect(conferenceCoordinators.every(item => item.name && item.photo.startsWith("/manus-storage/") && item.social.length > 0)).toBe(true);
    expect(conferenceCoordinators.find(item => item.name === "Ricardo Pannain")?.bio).toBeUndefined();
  });

  it("classifica todas as oito íntegras de Nutrição Estética 2026 e prioriza as pontes diretas", () => {
    expect(nutritionAesthetic2026Priorities).toHaveLength(8);
    const firstWave = nutritionAesthetic2026Priorities.filter(item => item.priority === "Transcrever primeiro");
    expect(firstWave.map(item => item.title)).toEqual([
      "Alessandra Feltre — GLP-1 e o Novo Rosto do Emagrecimento em Mulheres 40+",
      "Alessandra Pinheiro — Glúteo: Dieta e Treino para Hipertrofia e Definição",
    ]);
    expect(nutritionAesthetic2026Priorities.filter(item => item.transcript.includes("disponível"))).toHaveLength(8);
    expect(nutritionAesthetic2026Priorities.every(item => item.bridge.includes("2027") || item.bridge.length > 20)).toBe(true);
  });

  it("apresenta as três visões em um único componente responsivo", () => {
    const component = readFileSync(new URL("../client/src/components/EditorialIntelligence.tsx", import.meta.url), "utf8");
    const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");
    expect(component).toContain("Programações");
    expect(component).toContain("Eixos de atração");
    expect(component).toContain("Matéria-prima");
    expect(component).toContain("Não transcrever tudo com a mesma urgência");
    expect(component).toContain("COORDENAÇÃO CIENTÍFICA CONFIRMADA");
    expect(component).toContain("coordinator-grid");
    expect(component).toContain("program-review");
    expect(component).toContain("confirmedProgramPublicationPolicy");
    expect(component).toContain("Abrir planilha");
    expect(component).toContain("Abrir pasta de fotos");
    expect(component).toContain("Abrir material");
    expect(component).toContain("program-speaker-assets");
    expect(component).toContain("intelligence-review");
    expect(home).toContain("isIntelligenceReview");
    expect(styles).toContain(".intelligence-tabs");
    expect(styles).toContain(".program-sessions");
    expect(styles).toContain(".program-speaker-asset");
    expect(styles).toContain(".program-speaker-material");
    expect(styles).toContain(".coordinator-panel");
    expect(styles).toContain("@media (max-width: 860px)");
  });
});
