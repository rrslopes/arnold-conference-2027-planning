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
    source: "Derivada do Reel e do carrossel orgânicos de 08/09",
    objective: "Converter audiência interessada em Gestão, Nutrição Estética e Nutrição Esportiva em leads identificados.",
    audience: "Públicos frios e engajados das três áreas cobertas pelas aulas.",
    formats: ["1:1", "4:5", "9:16", "Vídeo de 15 s", "Vídeo de 6 s"],
    deliverables: ["Peça-mãe com as três aulas", "Três variações, uma por dor profissional", "Versão vertical com CTA direto", "Versão curta para retargeting"],
    cta: "Acessar as três masterclasses gratuitas",
    destination: { label: "Landing page das masterclasses", url: externalDestinations.masterclasses },
    gate: "Liberada: landing page confirmada e acessível.",
    status: "liberada",
  },
  {
    id: "exclusive-masterclass-acquisition",
    category: "exclusiva",
    date: "Primeira campanha",
    phase: "Captação",
    title: "Aquisição por dor — variações exclusivas",
    source: "Peças criadas para mídia paga; não precisam ser publicadas no feed",
    objective: "Testar separadamente os territórios de platô e reganho, estratégia de carboidratos e crescimento da academia.",
    audience: "Conjuntos de interesse específicos para Nutrição Estética, Nutrição Esportiva e Gestão de Academias.",
    formats: ["4:5 estático", "9:16 estático", "9:16 em vídeo"],
    deliverables: ["Variação Ana Paula Pujol", "Variação Andreia Naves", "Variação Roberto Tranjan", "Versão neutra com as três aulas"],
    cta: "Acessar gratuitamente",
    destination: { label: "Landing page das masterclasses", url: externalDestinations.masterclasses },
    gate: "Liberada: usar apenas títulos oficiais e dores validadas das aulas.",
    status: "liberada",
  },
  {
    id: "exclusive-masterclass-retargeting",
    category: "exclusiva",
    date: "Enquanto a LP estiver ativa",
    phase: "Captação",
    title: "Retargeting de visitantes sem conversão",
    source: "Peça exclusiva para audiência da landing page; não precisa ir ao feed",
    objective: "Relembrar a entrega e reduzir abandono de pessoas que visitaram a página sem concluir o cadastro.",
    audience: "Visitantes identificados pelo pixel que não alcançaram a conversão do formulário.",
    formats: ["4:5 estático", "9:16 estático", "Vídeo de 6 s"],
    deliverables: ["Lembrete da gratuidade", "Resumo das três aulas", "Variação de retomada sem pressão comercial"],
    cta: "Concluir meu acesso",
    destination: { label: "Landing page das masterclasses", url: externalDestinations.masterclasses },
    gate: "Condicionada à configuração e validação do pixel e do evento de conversão.",
    status: "condicionada",
  },
  {
    id: "exclusive-six-congresses",
    category: "exclusiva",
    date: "Pré-venda",
    phase: "Descoberta",
    title: "Seis congressos — reconhecimento por perfil",
    source: "Peças exclusivas de descoberta; não precisam ser publicadas no feed",
    objective: "Fazer cada público reconhecer o congresso relacionado ao seu desafio antes da comunicação de venda.",
    audience: "Seis segmentos profissionais, respeitando os públicos e as promessas validadas de cada congresso.",
    formats: ["6 peças 4:5", "6 peças 9:16", "Carrossel publicitário"],
    deliverables: ["Gestão: negócio e operação", "WTTC: validade internacional e carreira", "SONAFE: prevenção ao retorno", "Três variações para Nutrições e Bodybuilding"],
    cta: "Conhecer o Arnold Conference 2027",
    destination: { label: "Landing page geral de novidades", url: externalDestinations.news },
    gate: "Liberada para captação de novidades; não incluir preço, lote ou programação não confirmada.",
    status: "liberada",
  },
  {
    id: "resize-0923a",
    category: "redimensionamento",
    date: "23/09 · cobertura",
    phase: "Abertura",
    title: "Agenda do dia e contagem regressiva",
    source: "Derivada dos Stories orgânicos de 23/09 às 9h",
    objective: "Preparar a audiência e direcionar para a abertura somente quando o fluxo comercial estiver confirmado.",
    audience: "Públicos engajados, leads e visitantes das páginas da campanha.",
    formats: ["9:16 estático", "9:16 animado"],
    deliverables: ["Contagem regressiva", "Vendas abertas", "Ainda não escolheu?"],
    cta: "Acessar as vendas",
    gate: "BLOQUEADA até confirmação da data, da ticketeira, do checkout e da URL de vendas.",
    status: "condicionada",
  },
  {
    id: "resize-0923b",
    category: "redimensionamento",
    date: "23/09 · abertura",
    phase: "Abertura",
    title: "Vendas abertas — peça principal",
    source: "Derivada do Reel, carrossel e Stories orgânicos de 23/09 às 12h",
    objective: "Converter públicos preparados para a página central de vendas.",
    audience: "Leads, audiência engajada, visitantes e públicos semelhantes aprovados pela agência de mídia.",
    formats: ["1:1", "4:5", "9:16", "Vídeo de 15 s", "Vídeo de 6 s"],
    deliverables: ["Peça-mãe de vendas abertas", "Versões por congresso", "Alternativa estática", "Alternativa em vídeo"],
    cta: "Escolher o congresso e fazer a inscrição",
    gate: "BLOQUEADA até checkout testado, condições aprovadas e URL rastreável disponível.",
    status: "condicionada",
  },
  {
    id: "resize-0923c",
    category: "redimensionamento",
    date: "23/09 · sustentação",
    phase: "Abertura",
    title: "Dúvidas reais das primeiras horas",
    source: "Derivada dos Stories orgânicos de 23/09 às 19h",
    objective: "Retomar pessoas que demonstraram intenção, respondendo apenas objeções realmente recebidas.",
    audience: "Visitantes da página de vendas e pessoas que iniciaram a jornada sem concluir a compra.",
    formats: ["9:16 estático", "9:16 com apresentador"],
    deliverables: ["Templates adaptáveis", "Resposta com informação oficial", "Fechamento para compra ou atendimento"],
    cta: "Retomar a inscrição",
    gate: "BLOQUEADA até existirem URL de vendas, atendimento oficial e dúvidas reais validadas.",
    status: "condicionada",
  },
  {
    id: "exclusive-sales-retargeting",
    category: "exclusiva",
    date: "Pós-abertura",
    phase: "Conversão",
    title: "Retargeting de alta intenção",
    source: "Peça exclusiva para mídia; não será publicada no feed",
    objective: "Retomar visitantes do checkout e da página de vendas sem fabricar urgência ou escassez.",
    audience: "Visitantes da venda e iniciadores de checkout sem compra confirmada.",
    formats: ["4:5 estático", "9:16 estático", "Vídeo de 6 s"],
    deliverables: ["Retomada geral", "Variação por congresso", "Variação por objeção real"],
    cta: "Retomar minha inscrição",
    gate: "BLOQUEADA até a ticketeira permitir audiência, supressão de compradores e link direto confiável.",
    status: "condicionada",
  },
];
