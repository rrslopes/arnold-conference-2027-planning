export type CalendarMilestone = {
  label: string;
  tone: "masterclass" | "sales" | "lead";
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
  "0915": {
    label: "Captação para novidades",
    tone: "lead",
    description: "Primeiro marco do aquecimento sem data fixa: apresentar os seis perfis e ampliar a lista que receberá o aviso de abertura.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "A agência deve prever a peça-mãe e desdobramentos 1:1, 4:5 e 9:16, com CTA para cadastro e URL rastreável da landing page de novidades. Não citar data de vendas.",
    },
  },
  "0918": {
    label: "Comparação de públicos",
    tone: "lead",
    description: "Segundo marco de captação: ajudar o público a reconhecer seu congresso e continuar o cadastro na lista de novidades.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "A agência deve redimensionar o comparativo para 1:1, 4:5 e 9:16 e manter a landing page de novidades como destino. A segmentação deve considerar afinidade profissional, não promessa comercial.",
    },
  },
};
