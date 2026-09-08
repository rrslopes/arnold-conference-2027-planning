import { useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, Cloud, CloudOff, Edit3, MailCheck, Medal, Plus, RefreshCw, Save, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  EMAIL_PERFORMANCE_WEIGHTS,
  calculateEmailPerformanceScore,
  fromStoredRate,
  isValidSentEmailUrl,
  rankEmailPerformance,
  type EmailPerformanceEntry,
  type EmailRateField,
} from "@shared/emailPerformance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FormState = {
  id?: number;
  campaignName: string;
  subject: string;
  sentDate: string;
  emailUrl: string;
  openRate: string;
  clickRate: string;
  unsubscribeRate: string;
  spamRate: string;
  deliveredCount: string;
  uniqueClicks: string;
  attributedConversions: string;
  attributedRevenue: string;
};

const blankForm: FormState = {
  campaignName: "",
  subject: "",
  sentDate: "",
  emailUrl: "",
  openRate: "",
  clickRate: "",
  unsubscribeRate: "",
  spamRate: "",
  deliveredCount: "",
  uniqueClicks: "",
  attributedConversions: "",
  attributedRevenue: "",
};

const rateFields: Array<{ key: EmailRateField; label: string; helper: string }> = [
  { key: "openRate", label: "Taxa de abertura", helper: "% sobre entregues" },
  { key: "clickRate", label: "Taxa de clique", helper: "CTR sobre entregues" },
  { key: "unsubscribeRate", label: "Descadastro", helper: "% sobre entregues" },
  { key: "spamRate", label: "Marcação de spam", helper: "% sobre entregues" },
];

function parseRate(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatRate(value: number | null) {
  return value === null ? "—" : `${value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}%`;
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

function toDateInput(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

function normalizeRateInput(value: string) {
  return value.replace(/[^\d,.]/g, "").replace(/(,|\.)/g, (match, _separator, offset, whole) => {
    const firstComma = whole.search(/[,\.]/);
    return firstComma === offset ? match : "";
  }).slice(0, 8);
}

function normalizeCountInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 9);
}

function parseCount(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function parseCurrencyToCents(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : null;
}

export default function EmailPerformanceDashboard() {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const [form, setForm] = useState<FormState>(blankForm);
  const [deleteCandidate, setDeleteCandidate] = useState<EmailPerformanceEntry | null>(null);

  const entries = useMemo<EmailPerformanceEntry[]>(() => (planning.data?.emailPerformanceResults ?? []).map(row => ({
    id: row.id,
    campaignName: row.campaignName,
    subject: row.subject,
    sentAt: row.sentAt,
    emailUrl: row.emailUrl,
    openRate: fromStoredRate(row.openRateMilli),
    clickRate: fromStoredRate(row.clickRateMilli),
    unsubscribeRate: fromStoredRate(row.unsubscribeRateMilli),
    spamRate: fromStoredRate(row.spamRateMilli),
    deliveredCount: row.deliveredCount,
    uniqueClicks: row.uniqueClicks,
    attributedConversions: row.attributedConversions,
    attributedRevenueCents: row.attributedRevenueCents,
    updatedAt: row.updatedAt,
  })), [planning.data?.emailPerformanceResults]);
  const ranked = useMemo(() => rankEmailPerformance(entries), [entries]);
  const rankedCount = ranked.filter(item => item.position !== null).length;
  const bestClick = entries.reduce<number | null>((best, item) => item.clickRate === null ? best : best === null ? item.clickRate : Math.max(best, item.clickRate), null);
  const latest = entries.reduce<EmailPerformanceEntry | null>((current, item) => !current || item.updatedAt > current.updatedAt ? item : current, null);

  const draftRates = {
    openRate: parseRate(form.openRate),
    clickRate: parseRate(form.clickRate),
    unsubscribeRate: parseRate(form.unsubscribeRate),
    spamRate: parseRate(form.spamRate),
  };
  const previewScore = calculateEmailPerformanceScore(draftRates);

  const saveMutation = trpc.planning.saveEmailPerformance.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      setForm(blankForm);
      toast.success("Performance do e-mail sincronizada com a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar a campanha: ${error.message}`),
  });

  const deleteMutation = trpc.planning.deleteEmailPerformance.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      setDeleteCandidate(null);
      toast.success("Campanha removida do ranking.");
    },
    onError: error => toast.error(`Não foi possível excluir a campanha: ${error.message}`),
  });

  const update = (key: keyof FormState, value: string) => setForm(current => ({
    ...current,
    [key]: rateFields.some(field => field.key === key)
      ? normalizeRateInput(value)
      : ["deliveredCount", "uniqueClicks", "attributedConversions"].includes(key)
        ? normalizeCountInput(value)
        : value,
  }));

  const edit = (entry: EmailPerformanceEntry) => {
    setForm({
      id: entry.id,
      campaignName: entry.campaignName,
      subject: entry.subject,
      sentDate: toDateInput(entry.sentAt),
      emailUrl: entry.emailUrl,
      openRate: entry.openRate === null ? "" : String(entry.openRate).replace(".", ","),
      clickRate: entry.clickRate === null ? "" : String(entry.clickRate).replace(".", ","),
      unsubscribeRate: entry.unsubscribeRate === null ? "" : String(entry.unsubscribeRate).replace(".", ","),
      spamRate: entry.spamRate === null ? "" : String(entry.spamRate).replace(".", ","),
      deliveredCount: entry.deliveredCount === null ? "" : String(entry.deliveredCount),
      uniqueClicks: entry.uniqueClicks === null ? "" : String(entry.uniqueClicks),
      attributedConversions: entry.attributedConversions === null ? "" : String(entry.attributedConversions),
      attributedRevenue: entry.attributedRevenueCents === null ? "" : (entry.attributedRevenueCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    });
    document.getElementById("email-performance-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const save = () => {
    if (!form.campaignName.trim() || !form.subject.trim() || !form.sentDate || !form.emailUrl.trim()) {
      toast.error("Preencha campanha, assunto, data de envio e link do e-mail.");
      return;
    }
    if (!isValidSentEmailUrl(form.emailUrl.trim())) {
      toast.error("Informe um link HTTPS válido para o e-mail enviado.");
      return;
    }
    const invalidRate = rateFields.some(field => {
      const value = parseRate(form[field.key]);
      return value !== null && (value < 0 || value > 100);
    });
    if (invalidRate) {
      toast.error("As taxas devem ficar entre 0% e 100%.");
      return;
    }
    saveMutation.mutate({
      id: form.id,
      campaignName: form.campaignName.trim(),
      subject: form.subject.trim(),
      sentAt: Date.parse(`${form.sentDate}T12:00:00.000Z`),
      emailUrl: form.emailUrl.trim(),
      deliveredCount: parseCount(form.deliveredCount),
      uniqueClicks: parseCount(form.uniqueClicks),
      attributedConversions: parseCount(form.attributedConversions),
      attributedRevenueCents: parseCurrencyToCents(form.attributedRevenue),
      ...draftRates,
    });
  };

  return (
    <div className="email-performance-console" aria-busy={planning.isLoading || saveMutation.isPending || deleteMutation.isPending}>
      <header className="email-performance-head">
        <div><MailCheck size={27} /><span>RESULTADOS REAIS · E-MAIL MARKETING</span><h3>Performance por campanha disparada</h3><p>Registre cada envio e complete as taxas quando o relatório consolidar. O ranking compara somente campanhas com as quatro métricas preenchidas.</p>{planning.isError ? <small className="sync-error"><CloudOff size={13} /> Falha de sincronização.</small> : latest ? <small><Cloud size={13} /> Última atualização em {new Date(latest.updatedAt).toLocaleString("pt-BR")}</small> : <small><Cloud size={13} /> Espaço compartilhado pronto para o primeiro disparo.</small>}</div>
        <button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button>
      </header>

      <div className="email-performance-summary">
        <article><strong>{entries.length}</strong><span>CAMPANHAS REGISTRADAS</span></article>
        <article><strong>{rankedCount}</strong><span>COM SCORE COMPLETO</span></article>
        <article><strong>{formatRate(bestClick)}</strong><span>MELHOR TAXA DE CLIQUE</span></article>
      </div>

      <div className="email-score-method">
        <BarChart3 size={22} />
        <div><span>COMO O RANKING É CALCULADO</span><strong>30% abertura + 70% clique − 2× descadastro − 20× spam</strong><p>Cliques recebem o maior peso. Descadastros e spam reduzem o score, mas as taxas brutas continuam visíveis. Use CTR sobre e-mails entregues, não clique sobre aberturas.</p></div>
      </div>

      <section id="email-performance-form" className="email-performance-form">
        <header><div><Plus size={20} /><span>{form.id ? "EDITAR CAMPANHA" : "REGISTRAR NOVO DISPARO"}</span></div>{form.id ? <button type="button" onClick={() => setForm(blankForm)}>Cancelar edição</button> : null}</header>
        <div className="email-performance-fields">
          <label><span>Nome da campanha</span><input value={form.campaignName} onChange={event => update("campaignName", event.target.value.slice(0, 180))} placeholder="Ex.: Masterclasses · entrega imediata" /></label>
          <label><span>Data confirmada de envio</span><input type="date" max={new Date().toISOString().slice(0, 10)} value={form.sentDate} onChange={event => update("sentDate", event.target.value)} /></label>
          <label className="wide"><span>Assunto usado</span><input value={form.subject} onChange={event => update("subject", event.target.value.slice(0, 255))} placeholder="Assunto exatamente como foi disparado" /></label>
          <label className="wide"><span>Link do e-mail enviado</span><input type="url" value={form.emailUrl} onChange={event => update("emailUrl", event.target.value.slice(0, 2048))} placeholder="https://..." /></label>
        </div>
        <div className="email-rate-fields">{rateFields.map(field => <label key={field.key}><span>{field.label}</span><div><input inputMode="decimal" min="0" max="100" step="0.001" value={form[field.key]} onChange={event => update(field.key, event.target.value)} placeholder="—" /><b>%</b></div><small>{field.helper}</small></label>)}</div>
        <div className="email-volume-fields">
          <label><span>E-mails entregues</span><input inputMode="numeric" value={form.deliveredCount} onChange={event => update("deliveredCount", event.target.value)} placeholder="—" /><small>Total aceito pelos provedores</small></label>
          <label><span>Cliques únicos</span><input inputMode="numeric" value={form.uniqueClicks} onChange={event => update("uniqueClicks", event.target.value)} placeholder="—" /><small>Pessoas que clicaram</small></label>
          <label><span>Conversões atribuídas</span><input inputMode="numeric" value={form.attributedConversions} onChange={event => update("attributedConversions", event.target.value)} placeholder="—" /><small>Somente com rastreamento</small></label>
          <label><span>Receita atribuída</span><input inputMode="decimal" value={form.attributedRevenue} onChange={event => update("attributedRevenue", event.target.value.replace(/[^\d,.]/g, "").slice(0, 16))} placeholder="0,00" /><small>R$ · somente com atribuição</small></label>
        </div>
        <footer><div>{previewScore === null ? <><ShieldAlert size={17} /><span>Score pendente até preencher as quatro taxas.</span></> : <><Medal size={17} /><span>Prévia do score: <strong>{previewScore.toLocaleString("pt-BR")}</strong></span></>}</div><button type="button" className="primary-button" onClick={save} disabled={saveMutation.isPending}>{saveMutation.isPending ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}{form.id ? "Salvar alterações" : "Adicionar campanha"}</button></footer>
      </section>

      <section className="email-ranking-section">
        <header><div><Medal size={22} /><span>RANKING DE ENGAJAMENTO</span></div><p>Campanhas incompletas aparecem após as ranqueadas e não recebem posição.</p></header>
        {!ranked.length ? <div className="email-ranking-empty"><MailCheck size={30} /><div><strong>Nenhum disparo registrado</strong><p>Adicione o primeiro e-mail após o envio. As métricas podem ser completadas quando o relatório estiver disponível.</p></div></div> : <div className="email-ranking-list">{ranked.map(entry => <article key={entry.id} className={entry.position ? "is-ranked" : "is-pending"}>
          <div className="email-rank-position"><strong>{entry.position ? String(entry.position).padStart(2, "0") : "—"}</strong><span>{entry.position ? "POSIÇÃO" : "PENDENTE"}</span></div>
          <div className="email-rank-main"><small>{formatDate(entry.sentAt)}</small><h4>{entry.campaignName}</h4><p>{entry.subject}</p><a href={entry.emailUrl} target="_blank" rel="noreferrer">Abrir e-mail enviado <ArrowUpRight size={13} /></a></div>
          <div className="email-rank-rates">{rateFields.map(field => <span key={field.key}><small>{field.label.replace("Taxa de ", "")}</small><strong>{formatRate(entry[field.key])}</strong></span>)}</div>
          <div className="email-rank-score"><small>SCORE</small><strong>{entry.score === null ? "—" : entry.score.toLocaleString("pt-BR")}</strong><span>{entry.score === null ? "Aguardando taxas" : `Clique pesa ${EMAIL_PERFORMANCE_WEIGHTS.clickRate * 100}%`}</span><small>{entry.deliveredCount === null ? "Volumes ainda não informados" : `${entry.deliveredCount.toLocaleString("pt-BR")} entregues · ${(entry.uniqueClicks ?? 0).toLocaleString("pt-BR")} cliques`}</small></div>
          <div className="email-rank-actions"><button type="button" onClick={() => edit(entry)} aria-label={`Editar ${entry.campaignName}`}><Edit3 size={15} /></button><button type="button" onClick={() => setDeleteCandidate(entry)} aria-label={`Excluir ${entry.campaignName}`}><Trash2 size={15} /></button></div>
        </article>)}</div>}
      </section>

      <AlertDialog open={Boolean(deleteCandidate)} onOpenChange={open => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Excluir campanha do ranking?</AlertDialogTitle><AlertDialogDescription>O registro de “{deleteCandidate?.campaignName}” será removido para toda a equipe. Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => deleteCandidate && deleteMutation.mutate({ id: deleteCandidate.id })}>Excluir campanha</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
