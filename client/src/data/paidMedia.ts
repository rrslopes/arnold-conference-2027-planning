import { externalDestinations } from "./planData";

export type PaidMediaAsset = {
  id: string;
  category: "redimensionamento" | "exclusiva";
  date: string;
  phase: string;
  title: string;
  source: string;
  objective: string;
  audience: string;
  formats: string[];
  deliverables: string[];
  cta: string;
  destination?: { label: string; url: string };
  gate: string;
  status: "liberada" | "condicionada";
};

export const paidMediaAssets: PaidMediaAsset[] = [
  {
    id: "resize-0908",
    category: "redimensionamento",
    date: "08/09",
    phase: "Captação",
    title: "Lançamento das três masterclasses",
    source: "Pack já previsto no marco do calendário de 08/09",
    objective: "Levar a audiência do lançamento para a landing page das três masterclasses.",
    audience: "Públicos alcançados pelo conteúdo de lançamento já previsto no calendário.",
    formats: ["1:1", "4:5", "9:16", "Estática", "Vídeo, quando aplicável"],
    deliverables: ["Peça-mãe do lançamento", "Desdobramento 1:1", "Desdobramento 4:5", "Desdobramento 9:16", "Versões estática e em vídeo, quando aplicável"],
    cta: "AULAS — acessar as três masterclasses gratuitas",
    destination: { label: "Landing page das masterclasses", url: externalDestinations.masterclasses },
    gate: "Pack previsto: usar URL rastreável e a landing page confirmada.",
    status: "liberada",
  },
  {
    id: "resize-0915",
    category: "redimensionamento",
    date: "15/09",
    phase: "Aquecimento",
    title: "Seis congressos — captação para novidades",
    source: "Reaproveitamento do pack de redimensionamento já previsto para a peça de marco",
    objective: "Apresentar os seis perfis e gerar cadastros na landing page geral de novidades, sem anunciar data de vendas.",
    audience: "Profissionais alcançados por interesse nos seis congressos e públicos semelhantes qualificados.",
    formats: ["1:1", "4:5", "9:16", "Estática", "Vídeo, quando aplicável"],
    deliverables: ["Peça-mãe dos seis perfis", "Desdobramento 1:1", "Desdobramento 4:5", "Desdobramento 9:16"],
    cta: "Quero receber as novidades",
    destination: { label: "Landing page geral de novidades", url: externalDestinations.news },
    gate: "LIBERAR somente com URL rastreável, pixel e UTMs testados. Não citar data, preço, lote ou checkout.",
    status: "liberada",
  },
  {
    id: "resize-0918",
    category: "redimensionamento",
    date: "18/09",
    phase: "Aquecimento",
    title: "O que as programações de 2027 já revelam",
    source: "Reaproveitamento do pack de peça principal já previsto, sem criação exclusiva",
    objective: "Demonstrar a profundidade das programações já recebidas e captar novos cadastros com transparência sobre as salas ainda pendentes.",
    audience: "Públicos com afinidade em Nutrição Estética e SONAFE, visitantes engajados e retargeting dos conteúdos anteriores.",
    formats: ["1:1", "4:5", "9:16", "Estática", "Vídeo"],
    deliverables: ["A mesma peça-mãe editorial de 18/09", "Desdobramento 1:1", "Desdobramento 4:5", "Desdobramento 9:16", "Alternativas estática e em vídeo"],
    cta: "Acompanhar as próximas programações",
    destination: { label: "Landing page geral de novidades", url: externalDestinations.news },
    gate: "LIBERAR somente com URL rastreável, segmentação aprovada e coerência entre anúncio e formulário.",
    status: "liberada",
  },
  {
    id: "resize-launch-window",
    category: "redimensionamento",
    date: "Janela móvel · D-7 a D0",
    phase: "Janela móvel",
    title: "Reserva operacional da abertura",
    source: "Reprogramação dos desdobramentos comerciais já previstos; não é solicitação de peça exclusiva nova",
    objective: "Preservar a capacidade de anunciar data confirmada, abertura e dúvidas reais quando todos os gates estiverem verdes.",
    audience: "Leads da lista de novidades, públicos de retargeting e alta intenção, conforme consentimentos e política de mídia.",
    formats: ["9:16", "Template adaptável"],
    deliverables: ["Template para data confirmada", "Template para vendas abertas", "Template para dúvidas reais", "Fechamento para compra ou atendimento"],
    cta: "Definir conforme o marco D-7, D-1 ou D0",
    gate: "BLOQUEADA até ticketeira contratada, checkout testado, data e horário aprovados, condições fechadas, URLs, pixel/UTMs, atendimento e supressões validados.",
    status: "condicionada",
  },
];
