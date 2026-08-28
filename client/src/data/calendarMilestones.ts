export type CalendarMilestone = {
  label: string;
  tone: "masterclass" | "sales";
  description: string;
  paidMediaPack: {
    label: string;
    requirement: string;
  };
};

export const calendarMilestones: Record<string, CalendarMilestone> = {
  "0908": {
    label: "Lançamento das masterclasses",
    tone: "masterclass",
    description: "Primeiro grande marco de captação: a landing page e as três aulas completas passam a estar disponíveis.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "A agência deve prever a peça-mãe do lançamento e desdobramentos 1:1, 4:5 e 9:16, com versões estática e em vídeo quando aplicável, CTA AULAS e URL rastreável para a landing page.",
    },
  },
  "0923a": {
    label: "Abertura das vendas",
    tone: "sales",
    description: "Cobertura do dia da abertura: preparar a audiência antes das 12h, anunciar a abertura e orientar quem ainda precisa escolher.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "A agência deve prever peças verticais 9:16 para contagem regressiva, vendas abertas e orientação de escolha, usando somente horários, condições e URLs aprovados.",
    },
  },
  "0923b": {
    label: "Abertura das vendas",
    tone: "sales",
    description: "Peça principal do segundo grande marco: anunciar a abertura e conduzir diretamente para a compra dos seis congressos.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "A agência deve prever a peça-mãe de vendas abertas e desdobramentos 1:1, 4:5 e 9:16, com alternativas estática e em vídeo, CTA LOTE e URLs de compra rastreáveis.",
    },
  },
  "0923c": {
    label: "Abertura das vendas",
    tone: "sales",
    description: "Conteúdo de sustentação do marco: transformar dúvidas reais das primeiras horas em orientação para retomada da inscrição.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "A agência deve prever templates verticais adaptáveis às perguntas realmente recebidas, com fechamento para compra ou atendimento e sem inventar objeções, preços ou condições.",
    },
  },
};
