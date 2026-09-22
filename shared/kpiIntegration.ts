import { calculateLpAbandonments, calculateLpConversionRate, calculateUniquePeopleConversionRate, getLatestLeadProfileSnapshot, parseNewsUnavailableMetrics } from "./leadProfile";
import { calculateAbandonments as calculateMasterclassAbandonments, calculateRate as calculateMasterclassRate, getLatestMasterclassSnapshot } from "./masterclassLanding";
import { formatCivilDateBR } from "./brasiliaTime";

export type AutomaticKpiFormat = "number" | "percent" | "currency";
export type AutomaticKpiRow = {
  key: string;
  label: string;
  description: string;
  value: number | null;
  format: AutomaticKpiFormat;
  source: string;
  period: string;
  mode: "automatic" | "calculated";
  availability?: "not_measured";
  availabilityReason?: string;
};

type SocialRow = { monthKey: string; accountsReached: number | null; views: number | null; interactions: number | null; netFollowers: number | null; metaMessagesSent: number | null };
type EmailRow = { campaignName: string; sentAt: number; openRateMilli: number | null; clickRateMilli: number | null; unsubscribeRateMilli: number | null; spamRateMilli: number | null; deliveredCount: number | null; uniqueClicks: number | null; attributedConversions: number | null; attributedRevenueCents: number | null };
type LeadRow = { periodStartAt: number; periodEndAt: number; totalLeads: number; newLeads: number; uniquePeopleInPeriod?: number | null; totalUniquePeople?: number | null; masterclassClicks?: number | null; sessions: number | null; dmSessions: number | null; formStarts: number | null; formAbandonments?: number | null; dmConversions: number | null; providerMeasurementObservation?: string | null; unavailableMetricsJson?: string | null; syncSource?: string | null; updatedAt: number };
type MasterclassLeadRow = { periodStartAt: number; periodEndAt: number; totalLeads: number; newLeads: number; uniquePeopleInPeriod?: number | null; totalUniquePeople?: number | null; sessions: number | null; dmSessions: number | null; formStarts: number | null; dmConversions: number | null; thankYouPageAccesses: number | null; anaLessonStarts: number | null; anaLessonCompletions: number | null; andreiaLessonStarts: number | null; andreiaLessonCompletions: number | null; robertoLessonStarts: number | null; robertoLessonCompletions: number | null; congressHubClicks: number | null; newsLpClicks: number | null; salesPageClicks: number | null; updatedAt: number };
type WhatsAppRow = { monthKey: string; delivered: number | null; linkClicks: number | null; replies: number | null; optOuts: number | null; attributedPurchases: number | null; humanHandoffs: number | null };
type SaleRow = { monthKey: string; sold: number };

export type KpiIntegrationState = {
  socialResults: SocialRow[];
  emailPerformanceResults: EmailRow[];
  leadProfileResults: LeadRow[];
  masterclassLandingResults: MasterclassLeadRow[];
  whatsappResults: WhatsAppRow[];
  monthlySales: SaleRow[];
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });
function latestByMonth<T extends { monthKey: string }>(rows: T[], fields: Array<keyof T>) { return [...rows].filter(row => fields.some(field => typeof row[field] === "number")).sort((a, b) => b.monthKey.localeCompare(a.monthKey))[0] ?? null; }
function rateFromMilli(value: number | null) { return value === null ? null : value / 1000; }
function periodOf(row: { periodStartAt: number; periodEndAt: number } | null) { return row ? `${formatCivilDateBR(row.periodStartAt)} a ${formatCivilDateBR(row.periodEndAt)}` : "Aguardando fotografia"; }

export function buildAutomaticKpis(layerId: string, state: KpiIntegrationState): AutomaticKpiRow[] {
  if (layerId === "dm") {
    const latest = latestByMonth(state.socialResults, ["accountsReached", "views", "interactions", "netFollowers", "metaMessagesSent"]);
    const period = latest?.monthKey ?? "Aguardando fechamento"; const source = "Social · resultado mensal";
    return [
      { key: "social-reach", label: "Contas alcançadas", description: "Alcance registrado no fechamento social mais recente.", value: latest?.accountsReached ?? null, format: "number", source, period, mode: "automatic" },
      { key: "social-views", label: "Visualizações", description: "Visualizações registradas no fechamento social mais recente.", value: latest?.views ?? null, format: "number", source, period, mode: "automatic" },
      { key: "social-interactions", label: "Interações com o conteúdo", description: "Interações registradas no fechamento social mais recente.", value: latest?.interactions ?? null, format: "number", source, period, mode: "automatic" },
      { key: "social-followers", label: "Crescimento líquido de seguidores", description: "Saldo de seguidores registrado no fechamento social mais recente.", value: latest?.netFollowers ?? null, format: "number", source, period, mode: "automatic" },
      { key: "meta-messages", label: "Conversas por mensagem iniciadas — total geral", description: "Conversas iniciadas no Instagram conforme o relatório geral da Meta; sem divisão por automação ou palavra-chave.", value: latest?.metaMessagesSent ?? null, format: "number", source, period, mode: "automatic" },
    ];
  }

  if (layerId === "landing") {
    const news = getLatestLeadProfileSnapshot(state.leadProfileResults); const masterclass = getLatestMasterclassSnapshot(state.masterclassLandingResults ?? []);
    const newsPeriod = periodOf(news); const masterclassPeriod = periodOf(masterclass);
    const unavailable = parseNewsUnavailableMetrics(news?.unavailableMetricsJson);
    const availability = (field: string) => unavailable?.campos.includes(field)
      ? { availability: "not_measured" as const, availabilityReason: unavailable.observacao }
      : {};
    const newsMeasurementSource = news?.providerMeasurementObservation || "Central de LPs · Novidades";
    return [
      { key: "lp-sessions", label: "Sessões — LP de novidades", description: "Sessões registradas na página /conference-2027 no período selecionado.", value: news?.sessions ?? null, format: "number", source: newsMeasurementSource, period: newsPeriod, mode: "automatic", ...availability("sessoes_na_lp") },
      { key: "lp-dm-sessions", label: "Sessões com origem DM — LP de novidades", description: "Sessões atribuídas conjuntamente a WhatsApp e Instagram DM.", value: news?.dmSessions ?? null, format: "number", source: newsMeasurementSource, period: newsPeriod, mode: "automatic", ...availability("sessoes_origem_dm") },
      { key: "lp-form-starts", label: "Inícios de formulário — LP de novidades", description: "Inícios rastreados somente a partir da instalação da medição própria em 18/09/2026.", value: news?.formStarts ?? null, format: "number", source: newsMeasurementSource, period: newsPeriod, mode: "automatic", ...availability("inicios_de_formulario") },
      { key: "lp-leads", label: "Conversões brutas — LP de novidades", description: "Eventos de conversão no período; pode incluir recadastro do mesmo e-mail.", value: news?.newLeads ?? null, format: "number", source: "Central de LPs · Novidades", period: newsPeriod, mode: "automatic" },
      { key: "lp-unique-people", label: "Pessoas únicas — LP de novidades", description: "E-mails distintos no período, quando fornecidos pelo Lovable.", value: news?.uniquePeopleInPeriod ?? null, format: "number", source: "Central de LPs · Novidades · Lovable", period: newsPeriod, mode: "automatic" },
      { key: "lp-dm-conversions", label: "Conversões de WhatsApp + Instagram DM — LP de novidades", description: "Conversões que o endpoint atribui conjuntamente a WhatsApp e Instagram DM.", value: news?.dmConversions ?? null, format: "number", source: "Central de LPs · Novidades · Lovable", period: newsPeriod, mode: "automatic" },
      { key: "lp-conversion-rate", label: "Taxa de conversão bruta — LP de novidades", description: "Conversões brutas ÷ sessões do mesmo período.", value: news ? calculateLpConversionRate(news.newLeads, news.sessions) : null, format: "percent", source: "Cálculo da plataforma", period: newsPeriod, mode: "calculated", ...availability("taxa_de_conversao_bruta") },
      { key: "lp-unique-conversion-rate", label: "Conversão em pessoas únicas — Novidades", description: "Pessoas únicas ÷ sessões do mesmo período.", value: news ? calculateUniquePeopleConversionRate(news.uniquePeopleInPeriod, news.sessions) : null, format: "percent", source: "Cálculo da plataforma", period: newsPeriod, mode: "calculated", ...availability("taxa_de_conversao_pessoas_unicas") },
      { key: "lp-abandonments", label: "Abandonos de formulário — LP de novidades", description: "Abandonos reportados pelo rastreamento próprio; disponíveis somente a partir de 18/09/2026.", value: news ? calculateLpAbandonments(news.formStarts, news.newLeads, news.formAbandonments) : null, format: "number", source: newsMeasurementSource, period: newsPeriod, mode: "automatic", ...availability("abandonos_de_formulario") },
      { key: "lp-masterclass-clicks", label: "Cliques das masterclasses para novidades", description: "Avanços rastreados entre as duas campanhas; não são somados novamente aos leads.", value: news?.masterclassClicks ?? null, format: "number", source: "Central de LPs · Novidades · Lovable", period: newsPeriod, mode: "automatic" },
      { key: "masterclass-sessions", label: "Sessões — LP das masterclasses", description: "Sessões informadas na fotografia mais recente desta LP.", value: masterclass?.sessions ?? null, format: "number", source: "Central de LPs · Masterclasses", period: masterclassPeriod, mode: "automatic" },
      { key: "masterclass-dm-sessions", label: "Sessões com origem DM — Masterclasses", description: "Sessões com UTM agregada de DM, sem atribuição por palavra-chave.", value: masterclass?.dmSessions ?? null, format: "number", source: "Central de LPs · Masterclasses", period: masterclassPeriod, mode: "automatic" },
      { key: "masterclass-form-starts", label: "Inícios de formulário — Masterclasses", description: "Evento de início informado na fotografia desta LP.", value: masterclass?.formStarts ?? null, format: "number", source: "Central de LPs · Masterclasses", period: masterclassPeriod, mode: "automatic" },
      { key: "masterclass-leads", label: "Inscrições brutas — LP das masterclasses", description: "Eventos de inscrição do período; pode incluir recadastros do mesmo e-mail.", value: masterclass?.newLeads ?? null, format: "number", source: "Central de LPs · Masterclasses", period: masterclassPeriod, mode: "automatic" },
      { key: "masterclass-unique-people", label: "Pessoas únicas — LP das masterclasses", description: "E-mails distintos no período; métrica comparável à RD Station.", value: masterclass?.uniquePeopleInPeriod ?? null, format: "number", source: "Central de LPs · Masterclasses · Lovable", period: masterclassPeriod, mode: "automatic" },
      { key: "masterclass-dm-conversions", label: "Conversões com origem DM — Masterclasses", description: "Conversões atribuídas à origem DM por UTM agregada.", value: masterclass?.dmConversions ?? null, format: "number", source: "Central de LPs · Masterclasses", period: masterclassPeriod, mode: "automatic" },
      { key: "masterclass-conversion-rate", label: "Taxa de inscrição bruta — LP das masterclasses", description: "Eventos de inscrição ÷ sessões do mesmo período.", value: masterclass ? calculateMasterclassRate(masterclass.newLeads, masterclass.sessions) : null, format: "percent", source: "Cálculo da plataforma", period: masterclassPeriod, mode: "calculated" },
      { key: "masterclass-unique-conversion-rate", label: "Conversão em pessoas únicas — Masterclasses", description: "E-mails distintos ÷ sessões do mesmo período.", value: masterclass ? calculateMasterclassRate(masterclass.uniquePeopleInPeriod ?? null, masterclass.sessions) : null, format: "percent", source: "Cálculo da plataforma", period: masterclassPeriod, mode: "calculated" },
      { key: "masterclass-abandonments", label: "Abandonos de formulário — Masterclasses", description: "Inícios de formulário − inscrições brutas; só aparece quando os eventos são comparáveis.", value: masterclass ? calculateMasterclassAbandonments(masterclass.formStarts, masterclass.newLeads) : null, format: "number", source: "Cálculo da plataforma", period: masterclassPeriod, mode: "calculated" },
    ];
  }

  if (layerId === "recompensa") {
    const latest = getLatestMasterclassSnapshot(state.masterclassLandingResults ?? []); const period = periodOf(latest); const source = "Central de LPs · Masterclasses";
    return [
      { key: "reward-accesses", label: "Acessos à página de obrigado", description: "Acessos informados para a página que entrega as três aulas.", value: latest?.thankYouPageAccesses ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-access-rate", label: "Índice de acessos à recompensa por inscrição", description: "Eventos de acesso à página de obrigado ÷ inscrições brutas. Pode superar 100% quando uma pessoa retorna à página.", value: latest ? calculateMasterclassRate(latest.thankYouPageAccesses, latest.newLeads) : null, format: "percent", source: "Cálculo da plataforma", period, mode: "calculated" },
      { key: "reward-ana-starts", label: "Inícios · Ana Paula Pujol", description: "Reproduções iniciadas na aula de Nutrição Estética.", value: latest?.anaLessonStarts ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-ana-completions", label: "Conclusões · Ana Paula Pujol", description: "Conclusões registradas pelo player para a aula.", value: latest?.anaLessonCompletions ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-ana-rate", label: "Taxa de conclusão · Ana Paula Pujol", description: "Conclusões ÷ inícios da aula.", value: latest ? calculateMasterclassRate(latest.anaLessonCompletions, latest.anaLessonStarts) : null, format: "percent", source: "Cálculo da plataforma", period, mode: "calculated" },
      { key: "reward-andreia-starts", label: "Inícios · Andreia Naves", description: "Reproduções iniciadas na aula de Nutrição Esportiva.", value: latest?.andreiaLessonStarts ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-andreia-completions", label: "Conclusões · Andreia Naves", description: "Conclusões registradas pelo player para a aula.", value: latest?.andreiaLessonCompletions ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-andreia-rate", label: "Taxa de conclusão · Andreia Naves", description: "Conclusões ÷ inícios da aula.", value: latest ? calculateMasterclassRate(latest.andreiaLessonCompletions, latest.andreiaLessonStarts) : null, format: "percent", source: "Cálculo da plataforma", period, mode: "calculated" },
      { key: "reward-roberto-starts", label: "Inícios · Roberto Tranjan", description: "Reproduções iniciadas na aula de Gestão de Academias.", value: latest?.robertoLessonStarts ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-roberto-completions", label: "Conclusões · Roberto Tranjan", description: "Conclusões registradas pelo player para a aula.", value: latest?.robertoLessonCompletions ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-roberto-rate", label: "Taxa de conclusão · Roberto Tranjan", description: "Conclusões ÷ inícios da aula.", value: latest ? calculateMasterclassRate(latest.robertoLessonCompletions, latest.robertoLessonStarts) : null, format: "percent", source: "Cálculo da plataforma", period, mode: "calculated" },
      { key: "reward-congress-clicks", label: "Cliques para os congressos", description: "Avanços da recompensa para o hub institucional dos congressos.", value: latest?.congressHubClicks ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-news-clicks", label: "Cliques para a LP de novidades", description: "Avanços da recompensa para a captação geral de novidades.", value: latest?.newsLpClicks ?? null, format: "number", source, period, mode: "automatic" },
      { key: "reward-sales-clicks", label: "Cliques para compra", description: "Somente quando houver destino de vendas e rastreamento compatível.", value: latest?.salesPageClicks ?? null, format: "number", source, period, mode: "automatic" },
    ];
  }

  if (layerId === "email") {
    const latest = [...state.emailPerformanceResults].sort((a, b) => b.sentAt - a.sentAt)[0] ?? null; const period = latest ? `${latest.campaignName} · ${dateFormatter.format(new Date(latest.sentAt))}` : "Aguardando campanha";
    return [
      { key: "email-delivered", label: "E-mails entregues", description: "Volume informado na campanha mais recente.", value: latest?.deliveredCount ?? null, format: "number", source: "E-mail · Performance e ranking", period, mode: "automatic" },
      { key: "email-unique-clicks", label: "Cliques únicos", description: "Cliques únicos informados na campanha mais recente.", value: latest?.uniqueClicks ?? null, format: "number", source: "E-mail · Performance e ranking", period, mode: "automatic" },
      { key: "email-conversions", label: "Conversões atribuídas ao e-mail", description: "Somente quando houver atribuição rastreável.", value: latest?.attributedConversions ?? null, format: "number", source: "E-mail · Performance e ranking", period, mode: "automatic" },
      { key: "email-revenue", label: "Receita atribuída ao e-mail", description: "Valor atribuído à campanha, sem estimativa.", value: latest?.attributedRevenueCents === null || latest?.attributedRevenueCents === undefined ? null : latest.attributedRevenueCents / 100, format: "currency", source: "E-mail · Performance e ranking", period, mode: "automatic" },
      { key: "email-open-rate", label: "Taxa de abertura", description: "Taxa registrada para a campanha mais recente.", value: rateFromMilli(latest?.openRateMilli ?? null), format: "percent", source: "E-mail · Performance e ranking", period, mode: "automatic" },
      { key: "email-click-rate", label: "Taxa de clique", description: "CTR sobre entregues da campanha mais recente.", value: rateFromMilli(latest?.clickRateMilli ?? null), format: "percent", source: "E-mail · Performance e ranking", period, mode: "automatic" },
      { key: "email-unsubscribe-rate", label: "Taxa de descadastro", description: "Taxa informada na campanha mais recente.", value: rateFromMilli(latest?.unsubscribeRateMilli ?? null), format: "percent", source: "E-mail · Performance e ranking", period, mode: "automatic" },
      { key: "email-spam-rate", label: "Taxa de spam", description: "Taxa informada na campanha mais recente.", value: rateFromMilli(latest?.spamRateMilli ?? null), format: "percent", source: "E-mail · Performance e ranking", period, mode: "automatic" },
    ];
  }

  if (layerId === "whatsapp") {
    const latest = latestByMonth(state.whatsappResults, ["delivered", "linkClicks", "replies", "optOuts", "attributedPurchases", "humanHandoffs"]); const period = latest?.monthKey ?? "Aguardando fechamento";
    return [
      { key: "whatsapp-delivered", label: "Mensagens entregues", description: "Fechamento mensal mais recente do canal.", value: latest?.delivered ?? null, format: "number", source: "WhatsApp · Performance mensal", period, mode: "automatic" },
      { key: "whatsapp-clicks", label: "Cliques nos links", description: "Cliques rastreados no fechamento mensal.", value: latest?.linkClicks ?? null, format: "number", source: "WhatsApp · Performance mensal", period, mode: "automatic" },
      { key: "whatsapp-replies", label: "Respostas recebidas", description: "Respostas à campanha no mês.", value: latest?.replies ?? null, format: "number", source: "WhatsApp · Performance mensal", period, mode: "automatic" },
      { key: "whatsapp-opt-outs", label: "Pedidos de saída", description: "Solicitações de interrupção registradas no mês.", value: latest?.optOuts ?? null, format: "number", source: "WhatsApp · Performance mensal", period, mode: "automatic" },
      { key: "whatsapp-purchases", label: "Compras atribuídas ao WhatsApp", description: "Somente compras com rastreamento compatível.", value: latest?.attributedPurchases ?? null, format: "number", source: "WhatsApp · Performance mensal", period, mode: "automatic" },
      { key: "whatsapp-handoffs", label: "Atendimentos iniciados", description: "Conversas assumidas pela equipe no mês.", value: latest?.humanHandoffs ?? null, format: "number", source: "WhatsApp · Performance mensal", period, mode: "automatic" },
    ];
  }

  if (layerId === "comercial") {
    const months = Array.from(new Set(state.monthlySales.map(row => row.monthKey))).sort().reverse(); const latestMonth = months.find(month => state.monthlySales.some(row => row.monthKey === month && row.sold > 0)) ?? months[0] ?? null;
    const monthSold = latestMonth === null ? null : state.monthlySales.filter(row => row.monthKey === latestMonth).reduce((sum, row) => sum + Math.max(0, row.sold), 0); const totalSold = state.monthlySales.reduce((sum, row) => sum + Math.max(0, row.sold), 0);
    return [
      { key: "sales-monthly", label: "Inscrições confirmadas no mês", description: "Somatório das vendas mensais lançadas nas seis salas.", value: monthSold, format: "number", source: "Lotação das salas", period: latestMonth ?? "Aguardando vendas", mode: "calculated" },
      { key: "sales-cumulative", label: "Inscrições confirmadas — acumulado", description: "Somatório acumulado dos lançamentos mensais por congresso.", value: state.monthlySales.length ? totalSold : null, format: "number", source: "Lotação das salas", period: latestMonth ?? "Aguardando vendas", mode: "calculated" },
    ];
  }
  return [];
}

export function buildSourceSummary(state: KpiIntegrationState) {
  const latestSocial = latestByMonth(state.socialResults, ["accountsReached", "views", "interactions", "netFollowers"]); const latestNews = getLatestLeadProfileSnapshot(state.leadProfileResults); const latestMasterclass = getLatestMasterclassSnapshot(state.masterclassLandingResults ?? []);
  const latestEmail = [...state.emailPerformanceResults].sort((a, b) => b.sentAt - a.sentAt)[0] ?? null; const latestWhatsApp = latestByMonth(state.whatsappResults, ["delivered", "linkClicks", "replies"]); const sales = state.monthlySales.reduce((sum, row) => sum + Math.max(0, row.sold), 0);
  const newsPeople = latestNews ? latestNews.uniquePeopleInPeriod ?? latestNews.newLeads : 0;
  const newsDetail = latestNews?.uniquePeopleInPeriod !== null && latestNews?.uniquePeopleInPeriod !== undefined ? "pessoas únicas novidades" : "conversões novidades · sem deduplicação";
  const masterclassPeople = latestMasterclass ? latestMasterclass.uniquePeopleInPeriod ?? latestMasterclass.newLeads : 0;
  const masterclassDetail = latestMasterclass?.uniquePeopleInPeriod !== null && latestMasterclass?.uniquePeopleInPeriod !== undefined ? "pessoas únicas masterclasses" : "inscrições masterclasses · sem deduplicação";
  return [
    { key: "social", label: "Social", value: latestSocial?.interactions ?? null, detail: latestSocial ? `${latestSocial.monthKey} · interações` : "Aguardando fechamento" },
    { key: "landing", label: "Landing pages", value: latestNews || latestMasterclass ? newsPeople + masterclassPeople : null, detail: latestNews || latestMasterclass ? `${newsPeople} ${newsDetail} + ${masterclassPeople} ${masterclassDetail} · sem deduplicação entre LPs` : "Aguardando fotografias" },
    { key: "email", label: "E-mail", value: latestEmail ? rateFromMilli(latestEmail.clickRateMilli) : null, detail: latestEmail ? "taxa de clique mais recente" : "Aguardando campanha", format: "percent" as const },
    { key: "whatsapp", label: "WhatsApp", value: latestWhatsApp?.linkClicks ?? null, detail: latestWhatsApp ? `${latestWhatsApp.monthKey} · cliques` : "Aguardando fechamento" },
    { key: "sales", label: "Vendas", value: state.monthlySales.length ? sales : null, detail: "inscrições acumuladas" },
  ];
}

export function formatAutomaticKpi(value: number | null, format: AutomaticKpiFormat) {
  if (value === null) return "—"; if (format === "percent") return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`; if (format === "currency") return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); return value.toLocaleString("pt-BR");
}
