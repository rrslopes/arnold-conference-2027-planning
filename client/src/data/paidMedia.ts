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
    id: "resize-0923a",
    category: "redimensionamento",
    date: "23/09 · 9h",
    phase: "Abertura",
    title: "Agenda do dia e contagem regressiva",
    source: "Pack já previsto no marco do calendário de 23/09 às 9h",
    objective: "Preparar a audiência para a abertura, anunciar quando as vendas estiverem disponíveis e orientar quem ainda precisa escolher.",
    audience: "Audiência dos Stories de cobertura do dia da abertura.",
    formats: ["9:16"],
    deliverables: ["Contagem regressiva", "Vendas abertas", "Orientação para quem ainda precisa escolher"],
    cta: "Acessar as vendas",
    gate: "BLOQUEADA até confirmação do horário, das condições e da URL de vendas.",
    status: "condicionada",
  },
  {
    id: "resize-0923b",
    category: "redimensionamento",
    date: "23/09 · 12h",
    phase: "Abertura",
    title: "Vendas abertas — peça principal",
    source: "Pack já previsto no marco do calendário de 23/09 às 12h",
    objective: "Desdobrar a peça principal de abertura e conduzir diretamente para a compra dos seis congressos.",
    audience: "Audiência alcançada pelo conteúdo principal de abertura já previsto no calendário.",
    formats: ["1:1", "4:5", "9:16", "Estática", "Vídeo"],
    deliverables: ["Peça-mãe de vendas abertas", "Desdobramento 1:1", "Desdobramento 4:5", "Desdobramento 9:16", "Alternativas estática e em vídeo"],
    cta: "LOTE — escolher o congresso e fazer a inscrição",
    gate: "BLOQUEADA até checkout testado, condições aprovadas e URL rastreável disponível.",
    status: "condicionada",
  },
  {
    id: "resize-0923c",
    category: "redimensionamento",
    date: "23/09 · 19h",
    phase: "Abertura",
    title: "Dúvidas reais das primeiras horas",
    source: "Pack já previsto no marco do calendário de 23/09 às 19h",
    objective: "Adaptar as perguntas realmente recebidas para orientar a retomada da inscrição sem inventar objeções.",
    audience: "Audiência dos Stories de sustentação do marco de abertura.",
    formats: ["9:16", "Template adaptável"],
    deliverables: ["Templates verticais adaptáveis", "Resposta com informação oficial", "Fechamento para compra ou atendimento"],
    cta: "Retomar a inscrição ou acessar o atendimento",
    gate: "BLOQUEADA até existirem URL de vendas, atendimento oficial e dúvidas reais validadas.",
    status: "condicionada",
  },
];
