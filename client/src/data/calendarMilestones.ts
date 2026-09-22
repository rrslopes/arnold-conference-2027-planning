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
    label: "Profundidade confirmada",
    tone: "lead",
    description: "Segundo marco de captação: mostrar o que as programações já recebidas de Nutrição Estética e SONAFE revelam, com transparência sobre as salas ainda pendentes.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "A agência deve redimensionar a mesma peça editorial de 18/09 para 1:1, 4:5 e 9:16, sem criar conteúdo exclusivo. Manter a landing page de novidades como destino e segmentar por afinidade com Nutrição Estética, SONAFE e públicos engajados.",
    },
  },
  "0930": {
    label: "Anúncio da abertura em 06/10",
    tone: "sales",
    description: "Início da intensificação pública: confirmar a data e orientar a audiência sem afirmar que as vendas já estão abertas.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "Redimensionar a mesma peça orgânica para 1:1, 4:5 e 9:16. Só veicular após validar checkout, links, condições públicas, tracking, UTMs, suporte e regras comerciais. O destino pré-abertura é a landing page de novidades.",
    },
  },
  "1006": {
    label: "Abertura das inscrições",
    tone: "sales",
    description: "Marco comercial de 06/10: seis produtos com rotas independentes e compra confirmada como verdade de ocupação.",
    paidMediaPack: {
      label: "Pack de artes para mídia paga",
      requirement: "Redimensionar a peça aprovada de abertura para 1:1, 4:5 e 9:16 e separar a distribuição por produto. Liberar somente após o gate D0, com compra-teste, URLs, condições, eventos, UTMs, atendimento e supressões validados.",
    },
  },
};
