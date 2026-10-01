import { describe, expect, it } from "vitest";
import { calendar, emailBase, emailOperationalGates, whatsappPlan, keywords } from "../client/src/data/planData";
import { emailCampaignBriefs } from "../client/src/data/emailBriefs";
import { paidMediaAssets } from "../client/src/data/paidMedia";

const octoberCalendar = calendar.filter(entry => Number(entry.id.slice(0, 4)) >= 928);
const octoberEmails = emailBase.filter(entry => entry.id.startsWith("email-oct-"));
const octoberWhatsApp = whatsappPlan.filter(entry => entry.date.includes("/10"));
const octoberPaid = paidMediaAssets.filter(entry => entry.id.includes("-oct-"));
const expectedIds = [
  "0928", "0929", "0930", "1001", "1001a", "1002", "1003", "1004", "1005", "1006",
  "1007", "1008", "1008a", "1009", "1010", "1011", "1012", "1013", "1014", "1015",
  "1016", "1017", "1018", "1019", "1020", "1021", "1022", "1023", "1024", "1025",
  "1026", "1027", "1028", "1029", "1030", "1031", "1031a",
];
const lealVideoIds = ["0928", "1006", "1007", "1008a", "1012", "1015", "1019", "1022", "1026", "1030"];

function item(id: string) {
  const match = octoberCalendar.find(entry => entry.id === id);
  if (!match) throw new Error(`Item ${id} não encontrado`);
  return match;
}

describe("pacote editorial de 28/09 a 31/10 de 2026", () => {
  it("segue o calendário de outubro com os vídeos da Leal (37 entradas)", () => {
    expect(octoberCalendar.map(entry => entry.id)).toEqual(expectedIds);
    expect(new Set(octoberCalendar.map(entry => entry.id)).size).toBe(37);
    expect(new Set(octoberCalendar.map(entry => entry.title.toLocaleLowerCase("pt-BR"))).size).toBe(37);
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
    // De 28/09 a 09/10 o calendário espelha o cronograma do cliente: 28/09 é o vídeo da Leal sobre a mudança do Conference.
    expect(item("0928").congresses).toEqual(["Todos"]);
    expect(item("1002").congresses).toEqual(["Nutrição Esportiva"]);
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
    const managementIds = ["1015", "1017", "1019", "1027", "1031"];
    const certificationIds = ["1016", "1022", "1026"];
    expect(managementIds.every(id => item(id).congresses[0] === "Gestão de Academias")).toBe(true);
    expect(certificationIds.every(id => item(id).congresses[0] === "WTTC")).toBe(true);
    expect(JSON.stringify(certificationIds.map(item))).toContain("Certificação Internacional em Personal Training – WTTC");
    expect(JSON.stringify([...managementIds, ...certificationIds].map(item))).not.toMatch(/versus/i);
  });

  it("exibe somente os quatro trechos com minutagem confirmada no pacote", () => {
    const confirmedIds = ["1002", "1011", "1017", "1028"];
    const sources = confirmedIds.flatMap(id => item(id).productionBrief?.units.filter(unit => unit.source) ?? []);
    expect(sources).toHaveLength(4);
    expect(sources.every(unit => unit.sourceUrl?.match(/^https:\/\/(youtu\.be|www\.youtube\.com)\//))).toBe(true);
    expect(sources.map(unit => unit.source).join(" ")).toMatch(/17:32 a 18:13|52:46 a 53:05|43:52 a 44:14|36:20 a 36:51|15:18 a 15:28/);
    for (const stale of ["17:36 a 18:13", "52:47 a 53:08", "45:15 a 45:22", "15:18.9 a 15:27.6"]) {
      expect(JSON.stringify(octoberCalendar), stale).not.toContain(stale);
    }
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/timecode anterior|inválid|diverg|conferência humana|player original|auditoria interna/i);
    // Os Reels de Ricardo Pannain (antigos 1019 e 1031) foram para o backlog de novembro na grade de 10 a 31/10.
    const reelSource = (id: string) => item(id).productionBrief?.units.filter(unit => unit.source) ?? [];
    expect(reelSource("1018")).toHaveLength(0);
    expect(item("1011").productionBrief?.units.find(unit => unit.source)?.source).toContain("de \"E a mensagem que eu deixo aqui hoje para vocês\" até \"para além da balança\"");
  });

  it("monta a grade de 10 a 31/10 com funil, pendências e cortes conferidos", () => {
    const grade = octoberCalendar.filter(entry => entry.id >= "1010");
    expect(grade.every(entry => ["Topo", "Meio", "Fundo", "Meio/Fundo"].includes(entry.funnel ?? ""))).toBe(true);
    for (const id of ["1014", "1016", "1020", "1027", "1029"]) {
      const card = JSON.stringify(item(id));
      expect(card, id).toContain("[OPÇÃO A OU B – CLIENTE E AGÊNCIA DEFINEM NA VALIDAÇÃO]");
      expect(card, id).toContain("[PÁGINA DO CONGRESSO COM A PROGRAMAÇÃO 2027 – PREVISTA PARA 06/10, RECONFERIR EM 07/10]");
      expect(item(id).productionBrief?.units.some(unit => unit.unit === "Opção B"), id).toBe(true);
      expect(card, id).toContain("[AUTORIZAÇÃO E HORÁRIO DA COLLAB – A COMBINAR COM O PALESTRANTE]");
      // "Em breve" só aparece na observação que lista o que fica de fora, nunca nas telas.
      expect(JSON.stringify(item(id).productionBrief?.units), id).not.toMatch(/Em breve/);
    }
    expect(item("1014").title).not.toMatch(/completa/i);
    expect(item("1020").title).toBe("Programação completa: 3º Simpósio de Fisioterapia Esportiva da SONAFE");
    expect(JSON.stringify(item("1020"))).toContain("[MINI-BIO DA KATHERINE FERRO – AGUARDANDO APROVAÇÃO]");
    expect(JSON.stringify(item("1020"))).toContain("Fabricio Rapello");
    expect(JSON.stringify(item("1020"))).not.toMatch(/Rapelo\b/);
    expect(JSON.stringify(item("1010"))).toContain("[SÓ PUBLICAR SE AS PÁGINAS ESTIVEREM COM A PROGRAMAÇÃO – RECONFERIR EM 07/10]");
    expect(JSON.stringify(item("1010"))).toContain("[AUTOMAÇÃO 'COMENTE PROGRAMAÇÃO' – DEFINIR QUEM CONFIGURA]");
    expect(JSON.stringify(item("1023"))).toContain("[COLLAB COM O ARNOLD – CLIENTE DEFINE; O ARNOLD TERÁ O PRÓPRIO 'FALTAM 6 MESES']");
    expect(JSON.stringify(item("1023"))).toContain("antes das 7h");
    expect(JSON.stringify(item("1018"))).toContain("[OPCIONAL – SÓ SE HOUVER FOLGA DA AGÊNCIA]");
    expect(JSON.stringify(item("1030"))).toContain("[STATUS DO LOTE 1 – CONFIRMAR COM O CLIENTE ANTES]");
    expect(JSON.stringify(item("1031"))).toContain("[COLLAB COM CRIS PARENTE – SE A PATRÍCIA CONSEGUIR, SUBSTITUI ESTE CARD]");
    expect(item("1031a").date).toBe("Sem data");
    expect(JSON.stringify(item("1031a"))).toContain("[PUBLICAÇÃO CONDICIONADA – CONTRATO AINDA NÃO ASSINADO; QUANDO LIBERADO, SUBSTITUI UMA PÍLULA DE FIM DE SEMANA]");
    expect(item("1018").origin).toContain("26_Pannain C5 - É preciso ter conduta para ter resultados.mp4");
    expect(item("1024").origin).toContain("26_Luisa Wolpe  C2 - A importância da ética no trabalho.mp4");
    expect(JSON.stringify(item("1024"))).toContain("Não usar o C3 (bioestimulador)");
    expect(item("1025").originUrl).toContain("1d0QcD67JF4iS3si56g361aiNlbx4w5e1");
    expect(item("1031").origin).toContain("26_O que um colaborador espera PODCASTROBERTOTRANJAN_CORTE4.mp4");
    expect(item("1013").originUrl).toContain("1QEMDWzSGWCjl4dlaj_UBG0WD5eHaTXtH");
    expect(JSON.stringify(item("1029"))).not.toMatch(/Ozempic|Mounjaro/i);
    expect(JSON.stringify(item("1016"))).toContain("Top of the Rock");
    expect(JSON.stringify(item("1016"))).toContain("1Rsuw_eSkvvn6JV2nkOiJUbMO4EgxU7Ru");
    expect(JSON.stringify(grade)).not.toMatch(/R\$|quanto custa/i);
    const withPhrase = grade.filter(entry => JSON.stringify(entry).includes("Comente PROGRAMAÇÃO e receba"));
    expect(withPhrase.every(entry => entry.keyword === "PROGRAMAÇÃO")).toBe(true);
    for (const entry of withPhrase) {
      const text = JSON.stringify(entry);
      if (entry.id === "1020") expect(text).toContain("Comente PROGRAMAÇÃO e receba a programação completa do seu congresso no direct.");
      else expect(text, entry.id).not.toMatch(/programação completa do seu congresso/);
    }
    expect(keywords.find(word => word.word === "PROGRAMAÇÃO")?.destination).toContain("pendente");
  });

  it("mantém o registro dos Reels de Pannain apenas no backlog", () => {
    const reelSource = (id: string) => item(id).productionBrief?.units.filter(unit => unit.source) ?? [];
    expect(reelSource("1019")).toHaveLength(0);
    expect(JSON.stringify(octoberCalendar)).not.toContain("DcmNMWJhMN0");
  });

  it("usa trechos da íntegra, e não pílulas prontas do Drive", () => {
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/pílulas? legendadas?|pílulas? finalizadas?|pasta de pílulas/i);
    const cut = item("1021").productionBrief?.units.filter(unit => unit.source) ?? [];
    expect(cut).toHaveLength(1);
    expect(cut[0].sourceUrl).toBe("https://youtu.be/8hnvXCzfd3U");
    expect(cut[0].source).toContain("Bruno Zylber · 04:33 a 05:29.");
    expect(JSON.stringify(item("1021"))).not.toMatch(/14:36|19:09|28:09/);
    expect(item("1021").origin).not.toMatch(/\[[^\]]*A INSERIR[^\]]*\]/);
  });

  it("preserva os formatos simples, histórias e provas de autoridade solicitados", () => {
    expect(item("1010").title).toBe("A programação dos congressos do Arnold Conference 2027 está no ar.");
    expect(item("1014").title).toBe("Programação 2027: Congresso de Nutrição Esportiva");
    expect(JSON.stringify(item("1014"))).not.toMatch(/programação (completa|definitiva)/i);
    expect(item("1014").productionBrief?.units.find(unit => unit.unit === "Tela 2")?.content).toContain("Dois dias inteiros");
    expect(item("1028").productionBrief?.units.find(unit => unit.unit === "Fechamento")?.content).toContain("Danielli Mello");
    expect(item("1021").productionBrief?.units.find(unit => unit.role === "Crédito e ação")?.content).toContain("Murilo Pereira");
    expect(JSON.stringify(item("1008"))).not.toMatch(/definitiva/i);
    expect(item("1029").title).toBe("Programação 2027: Congresso de Nutrição Estética");
    expect(JSON.stringify(octoberCalendar)).not.toMatch(/5 coisas sobre/);
    expect(item("1003").title).toBe("Público sobre o Conference");
    expect(item("1009").title).toBe("Muitos profissionais passam horas fazendo com que o paciente desaprenda certas coisas");
  });

  it("mantém CTA e destino coerentes com cada fase", () => {
    for (const entry of octoberCalendar) {
      expect(entry.cta.length, entry.id).toBeGreaterThan(8);
      expect(entry.destination.length, entry.id).toBeGreaterThan(8);
    }
    expect(item("1002").destinationUrl).toContain("conference-2027");
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
    for (const id of ["1008a", "1015", "1022"]) {
      expect(item(id).channel, id).toContain("Reel publicado pelo Arnold, com o Conference em collab");
      expect(item(id).storyCards, id).toHaveLength(2);
    }
    expect(JSON.stringify(item("1013").productionBrief)).toContain("Publicar em collab com Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo");
    expect(item("1020").productionBrief?.units.find(unit => unit.unit === "Tela 2")?.content).toBe("\"Em 2026, esgotou. Em 2027, o lote 1 é limitado.\"");
    expect(item("1001a").title).toBe("Migração do @arnold_congressos para o @arnold_conference");
    expect(JSON.stringify(item("1001a"))).not.toContain("[SUGESTÃO");
    expect(item("1005").channel).toBe("arte estática no feed + Stories");
    // "Menor valor" é argumento de escassez do lote 1, não preço (regra de 01/10).
    expect(JSON.stringify(item("1005"))).not.toMatch(/R\$|quanto custa/i);
    expect(item("1006").productionBrief?.units[0]).toMatchObject({ unit: "Vídeo", role: "Abertura no feed" });
    expect(item("1008a").idea).toContain("(roteiro 'Academia Luxo')");
    for (const id of ["0928", "0929", "1001", "1001a", "1002", "1003", "1005", "1006", "1008a", "1009"]) {
      expect(item(id).idea, id).toContain("Registro do cronograma do cliente (aba Conference, lido em 01/10)");
    }
    expect(octoberCalendar.map(entry => entry.title)).not.toContain("35 países. Até onde sua carreira de personal pode ir?");
  });

  it("usa os números validados da Certificação e nunca \"35 países\"", () => {
    const everything = JSON.stringify({ calendar, emailBase, emailCampaignBriefs });
    expect(everything).not.toContain("35 países");
    expect(JSON.stringify(item("1016").productionBrief)).toContain("5 continentes e 18 países, com mais de 35 mil treinadores no mundo");
    expect(JSON.stringify(emailCampaignBriefs["email-oct-wttc-program"])).toContain("5 continentes e 18 países, com mais de 35 mil treinadores no mundo");
    const openingWttc = emailCampaignBriefs["email-oct-opening"].versions.find(version => version.id === "oct-opening-wttc");
    expect(JSON.stringify(openingWttc)).toContain("5 continentes e 18 países, com mais de 35 mil treinadores no mundo");
  });

  it("torna 09/10 um respiro de Bodybuilding com corte pronto, sem prescrição", () => {
    const bodybuilding = JSON.stringify(item("1009"));
    expect(item("1009").channel).toContain("Podcast Quinn");
    expect(item("1009").origin).toContain("26_Quinn C1");
    expect(item("1009").productionBrief?.note).toContain("confere no player quem fala");
    expect(bodybuilding).not.toMatch(/dose|fármaco|ciclo/i);
  });

  it("segue o pacote de e-mail de outubro com treze envios e uma automação", () => {
    expect(octoberEmails.map(entry => [entry.id, entry.date])).toEqual([
      ["email-oct-announcement", "30/09"],
      ["email-oct-reminder", "04/10"],
      ["email-oct-opening", "06/10"],
      ["email-oct-sports", "08/10"],
      ["email-oct-aesthetic", "09/10"],
      ["email-oct-sonafe", "10/10"],
      ["email-oct-program-launch", "13/10"],
      ["email-oct-sports-program", "14/10"],
      ["email-oct-wttc-program", "16/10"],
      ["email-oct-six-months", "23/10"],
      ["email-oct-management-program", "27/10"],
      ["email-oct-aesthetic-program", "29/10"],
      ["email-oct-included", "30/10"],
      ["email-oct-abandon", "Desde 06/10"],
    ]);
    // Regra de 01/10: no máximo cerca de 2 e-mails de campanha por semana e nunca dois no mesmo dia.
    const campaignDates = octoberEmails.filter(entry => !entry.date.startsWith("Desde")).map(entry => entry.date);
    expect(new Set(campaignDates).size).toBe(campaignDates.length);
    expect(JSON.stringify(emailCampaignBriefs["email-oct-included"])).toContain("[DEPENDE DA REDAÇÃO OFICIAL DO BENEFÍCIO DA FEIRA; SE NÃO HOUVER, O FOCO PASSA A SER 'TUDO O QUE VOCÊ VIVE NO ARNOLD CONFERENCE 2027', COM OS PILARES, OS CONGRESSOS E O LOTE 1]");
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
    // E-mail geral para toda a base a cada 7 a 10 dias (13, 23 e 30/10).
    for (const id of ["email-oct-program-launch", "email-oct-six-months", "email-oct-included"]) {
      expect(octoberEmails.find(entry => entry.id === id)?.audience, id).toMatch(/toda a base|Base consentida inteira/i);
    }
    expect(JSON.stringify(emailCampaignBriefs["email-oct-sports-program"])).not.toMatch(/programação completa/i);
    const posts = new Map(octoberCalendar.map(entry => [entry.title, entry.date]));
    for (const entry of octoberEmails) {
      expect(entry.relatedPost, entry.id).toBeTruthy();
      if (entry.relatedPost === "E-mail sem post relacionado") {
        expect(entry.title, entry.id).toBeUndefined();
      } else {
        const [date] = entry.relatedPost.split(" · ");
        const post = octoberCalendar.find(card => card.date === date && entry.relatedPost.includes(card.title));
        expect(post, entry.id).toBeDefined();
        if (posts.has(entry.title ?? "")) expect(entry.relatedPost, entry.id).toBe(`${posts.get(entry.title ?? "")} · ${entry.title}`);
      }
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
    expect(cardsWithFair.map(entry => entry.id)).toEqual(["1006", "1008", "1014", "1016", "1019", "1020", "1030"]);
    for (const entry of cardsWithFair) {
      expect(toNumber(entry.date), entry.id).toBeGreaterThanOrEqual(1006);
      expect(JSON.stringify(entry), entry.id).toContain(pending);
    }
    const emailsWithFair = octoberEmails.filter(entry => fair.test(JSON.stringify(emailCampaignBriefs[entry.id])));
    expect(emailsWithFair.map(entry => entry.id)).toEqual(["email-oct-opening", "email-oct-included", "email-oct-abandon"]);
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
      "1008", "1014", "1016", "1020", "1027", "1029", "1031a",
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
