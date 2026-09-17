import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, CircleAlert, Cloud, CloudOff, Edit3, ExternalLink, MapPin, MousePointerClick, Plus, RefreshCw, Save, Trash2, UserRoundCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  INTEREST_FIELDS,
  NEWS_LP_SOURCE,
  PARTICIPATION_FIELDS,
  calculateLpAbandonments,
  calculateLpConversionRate,
  getLeadProfileSnapshotKind,
  getLatestLeadProfileSnapshot,
  parseNewsUnavailableMetrics,
  percentageOfLeads,
  profilePercentageBase,
  sortInterestProfile,
  validateLeadProfileSnapshot,
  type LeadProfileCountField,
  type LeadProfileSnapshot,
  type LeadProfileSnapshotDraft,
} from "@shared/leadProfile";
import { formatTimestampInBrasilia } from "@shared/brasiliaTime";
import NewsLandingSyncPanel from "./NewsLandingSyncPanel";
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

type View = "profile" | "form" | "history";
type FormState = {
  id?: number;
  periodStart: string;
  periodEnd: string;
  totalLeads: string;
  newLeads: string;
  sessions: string;
  dmSessions: string;
  formStarts: string;
  dmConversions: string;
  note: string;
} & Record<LeadProfileCountField, string>;

const countKeys: LeadProfileCountField[] = [
  ...PARTICIPATION_FIELDS.map(field => field.key),
  ...INTEREST_FIELDS.map(field => field.key),
];

function createBlankForm(): FormState {
  return {
    periodStart: "",
    periodEnd: "",
    totalLeads: "",
    newLeads: "",
    sessions: "",
    dmSessions: "",
    formStarts: "",
    dmConversions: "",
    note: "",
    ...Object.fromEntries(countKeys.map(key => [key, ""])),
  } as FormState;
}

function parseCount(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function toDateInput(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

function formatPercent(value: number | null) {
  return value === null ? "Sem dado" : `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

function countValue(value: number | null) {
  return value === null ? "—" : value.toLocaleString("pt-BR");
}

function parseList<T>(value: string | null | undefined): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LeadProfileDashboard() {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const reviewView = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("lead-profile-review") : null;
  const [view, setView] = useState<View>(reviewView === "form" || reviewView === "history" ? reviewView : "profile");
  const [form, setForm] = useState<FormState>(() => createBlankForm());
  const [deleteCandidate, setDeleteCandidate] = useState<LeadProfileSnapshot | null>(null);

  const snapshots = useMemo<LeadProfileSnapshot[]>(() => (planning.data?.leadProfileResults ?? []).map(row => ({
    ...row,
    sourceKey: NEWS_LP_SOURCE.key,
  })), [planning.data?.leadProfileResults]);
  const latest = useMemo(() => getLatestLeadProfileSnapshot(snapshots), [snapshots]);
  const historySnapshots = useMemo(() => [...snapshots].sort((a, b) => b.periodEndAt - a.periodEndAt || (getLeadProfileSnapshotKind(b) === "rollup" ? 1 : 0) - (getLeadProfileSnapshotKind(a) === "rollup" ? 1 : 0) || b.updatedAt - a.updatedAt), [snapshots]);
  const interests = useMemo(() => latest ? sortInterestProfile(latest) : [], [latest]);
  const conversionRate = latest ? calculateLpConversionRate(latest.newLeads, latest.sessions) : null;
  const abandonments = latest ? calculateLpAbandonments(latest.formStarts, latest.newLeads) : null;
  const profileBase = latest ? profilePercentageBase(latest) : 0;
  const cities = useMemo(() => parseList<{ opcao: string; pessoas: number; percentual: number }>(latest?.topCitiesJson), [latest?.topCitiesJson]);
  const unavailableMetrics = useMemo(() => parseNewsUnavailableMetrics(latest?.unavailableMetricsJson), [latest?.unavailableMetricsJson]);
  const origins = useMemo(() => parseList<{ canal: string; conversoes: number; sessoes?: number | null }>(latest?.originsJson).sort((a, b) => b.conversoes - a.conversoes), [latest?.originsJson]);
  const masterclassClickOrigins = useMemo(() => parseList<{ canal: string; cliques: number }>(latest?.masterclassClickOriginsJson), [latest?.masterclassClickOriginsJson]);
  const isUnavailable = (field: string) => unavailableMetrics?.campos.includes(field) === true;

  const saveMutation = trpc.planning.saveLeadProfileSnapshot.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      setForm(createBlankForm());
      setView("profile");
      toast.success("Fotografia da LP sincronizada com a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar a fotografia: ${error.message}`),
  });
  const deleteMutation = trpc.planning.deleteLeadProfileSnapshot.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      setDeleteCandidate(null);
      toast.success("Fotografia removida do histórico.");
    },
    onError: error => toast.error(`Não foi possível excluir a fotografia: ${error.message}`),
  });

  const update = (key: keyof FormState, value: string) => setForm(current => ({ ...current, [key]: value.replace(/\D/g, "") }));

  const draft = (): LeadProfileSnapshotDraft => ({
    id: form.id,
    periodStartAt: Date.parse(`${form.periodStart}T12:00:00.000Z`),
    periodEndAt: Date.parse(`${form.periodEnd}T12:00:00.000Z`),
    totalLeads: parseCount(form.totalLeads) ?? -1,
    newLeads: parseCount(form.newLeads) ?? -1,
    sessions: parseCount(form.sessions),
    dmSessions: parseCount(form.dmSessions),
    formStarts: parseCount(form.formStarts),
    dmConversions: parseCount(form.dmConversions),
    ...Object.fromEntries(countKeys.map(key => [key, parseCount(form[key])])),
    note: form.note.trim(),
  }) as LeadProfileSnapshotDraft;

  const save = () => {
    if (!form.periodStart || !form.periodEnd || !form.totalLeads || !form.newLeads) {
      toast.error("Preencha período, total acumulado e novos leads.");
      return;
    }
    const next = draft();
    const issues = validateLeadProfileSnapshot(next);
    if (issues.length) {
      toast.error(issues[0].message);
      return;
    }
    saveMutation.mutate(next);
  };

  const edit = (snapshot: LeadProfileSnapshot) => {
    setForm({
      id: snapshot.id,
      periodStart: toDateInput(snapshot.periodStartAt),
      periodEnd: toDateInput(snapshot.periodEndAt),
      totalLeads: String(snapshot.totalLeads),
      newLeads: String(snapshot.newLeads),
      sessions: snapshot.sessions === null ? "" : String(snapshot.sessions),
      dmSessions: snapshot.dmSessions === null ? "" : String(snapshot.dmSessions),
      formStarts: snapshot.formStarts === null ? "" : String(snapshot.formStarts),
      dmConversions: snapshot.dmConversions === null ? "" : String(snapshot.dmConversions),
      note: snapshot.note,
      ...Object.fromEntries(countKeys.map(key => [key, snapshot[key] === null ? "" : String(snapshot[key])])),
    } as FormState);
    setView("form");
  };

  return (
    <div className="lead-profile-console" aria-busy={planning.isLoading || saveMutation.isPending || deleteMutation.isPending}>
      <header className="lead-profile-head">
        <div><Users size={28} /><span>FONTE EXCLUSIVA · QUALIFICAÇÃO DE AUDIÊNCIA</span><h3>Leads e perfil — LP de novidades</h3><p>Série diária de conversões e consolidado oficial com pessoas únicas, histórico de participação e áreas de interesse desta página. Não inclua dados das masterclasses.</p><a href={NEWS_LP_SOURCE.url} target="_blank" rel="noreferrer">Abrir LP de origem <ExternalLink size={13} /></a>{planning.isError ? <small className="sync-error"><CloudOff size={13} /> Falha de sincronização.</small> : latest ? <small><Cloud size={13} /> {latest.providerUpdatedAt ? `Origem atualizada em ${formatTimestampInBrasilia(latest.providerUpdatedAt)} · Brasília` : `Atualizado em ${new Date(latest.updatedAt).toLocaleString("pt-BR")}`}</small> : <small><Cloud size={13} /> Pronto para a primeira fotografia.</small>}</div>
        <button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button>
      </header>

      {!planning.isLoading ? <NewsLandingSyncPanel /> : null}

      <div className="lead-profile-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={view === "profile"} className={view === "profile" ? "active" : ""} onClick={() => setView("profile")}>Perfil atual</button>
        <button type="button" role="tab" aria-selected={view === "form"} className={view === "form" ? "active" : ""} onClick={() => setView("form")}>{form.id ? "Editar fotografia" : "Nova fotografia"}</button>
        <button type="button" role="tab" aria-selected={view === "history"} className={view === "history" ? "active" : ""} onClick={() => setView("history")}>Histórico ({snapshots.length})</button>
      </div>

      {view === "profile" ? latest ? <div className="lead-profile-current">
        <div className="lead-profile-current-kind"><CheckCircle2 size={15} /> CONSOLIDADO OFICIAL · SÉRIE DIÁRIA DISPONÍVEL NO HISTÓRICO</div>
        <div className="lead-profile-summary lead-profile-summary-six">
          <article><strong>{latest.totalLeads.toLocaleString("pt-BR")}</strong><span>CONVERSÕES BRUTAS ACUMULADAS</span></article>
          <article><strong>+{latest.newLeads.toLocaleString("pt-BR")}</strong><span>CONVERSÕES BRUTAS NO PERÍODO</span></article>
          <article><strong>{countValue(latest.totalUniquePeople)}</strong><span>PESSOAS ÚNICAS ACUMULADAS</span></article>
          <article><strong>{countValue(latest.uniquePeopleInPeriod)}</strong><span>PESSOAS ÚNICAS NO PERÍODO</span></article>
          <article><strong>{formatDate(latest.periodStartAt)}</strong><span>INÍCIO DO PERÍODO</span></article>
          <article><strong>{formatDate(latest.periodEndAt)}</strong><span>DATA DE REFERÊNCIA</span></article>
        </div>
        <div className="lead-performance-summary lead-performance-summary-five">
          <article className={isUnavailable("sessoes_na_lp") ? "is-not-measured" : ""}><strong>{isUnavailable("sessoes_na_lp") ? "Não medido" : countValue(latest.sessions)}</strong><span>SESSÕES NESTA LP</span><small>{isUnavailable("sessoes_na_lp") ? "A RD Station não envia este evento" : "Informado no fechamento"}</small></article>
          <article className={isUnavailable("taxa_de_conversao_bruta") ? "is-not-measured" : ""}><strong>{isUnavailable("taxa_de_conversao_bruta") ? "Não medido" : formatPercent(conversionRate)}</strong><span>TAXA DE CONVERSÃO</span><small>{isUnavailable("taxa_de_conversao_bruta") ? "Sem sessões, não há denominador" : "Novos leads ÷ sessões"}</small></article>
          <article><strong>{countValue(latest.dmConversions)}</strong><span>CONVERSÕES VIA WHATSAPP + INSTAGRAM DM</span><small>Valor agregado enviado pelo Lovable</small></article>
          <article className={isUnavailable("inicios_de_formulario") ? "is-not-measured" : ""}><strong>{isUnavailable("inicios_de_formulario") ? "Não medido" : countValue(latest.formStarts)}</strong><span>INÍCIOS DE FORMULÁRIO</span><small>{isUnavailable("inicios_de_formulario") ? "O webhook registra só a conversão" : "Evento de início"}</small></article>
          <article className={isUnavailable("abandonos_de_formulario") ? "is-not-measured" : ""}><strong>{isUnavailable("abandonos_de_formulario") ? "Não medido" : countValue(abandonments)}</strong><span>ABANDONOS DE FORMULÁRIO</span><small>{isUnavailable("abandonos_de_formulario") ? "Sem inícios, não há cálculo" : "Inícios − novos leads"}</small></article>
        </div>
        {unavailableMetrics ? <div className="lead-unavailable-note"><CircleAlert size={20} /><p><strong>Não medido nesta LP:</strong> {unavailableMetrics.motivo} Para medir sessões e inícios no futuro, será necessário instrumentar a página da RD Station com GTM/GA4.</p></div> : null}
        <div className="lead-profile-notice"><CircleAlert size={20} /><p><strong>Leitura correta:</strong> {latest.providerObservation || "as áreas permitem múltiplas escolhas. A soma dos percentuais de interesse pode ultrapassar 100% e representa menções, não pessoas únicas."} Base deste perfil: {profileBase.toLocaleString("pt-BR")} respostas do período. Quando há recadastros, essa base pode ser maior que o número de pessoas únicas.</p></div>
        <div className="lead-profile-grid">
          <section className="lead-interest-panel"><header><BarChart3 size={20} /><div><span>RANKING DE INTERESSES</span><p>Opção do formulário → congresso relacionado</p></div></header><div>{interests.map(item => <article key={item.key}><div><strong>{item.label}</strong><small>{item.congress !== item.label ? `Leitura: ${item.congress}` : item.congress}</small></div><div className="lead-interest-value"><b>{countValue(item.count)}</b><span>{formatPercent(item.percentage)}</span></div><div className="lead-interest-bar"><i style={{ width: `${Math.min(item.percentage ?? 0, 100)}%` }} /></div></article>)}</div></section>
          <div className="lead-profile-side">
            <section><header><UserRoundCheck size={19} /><span>HISTÓRICO NO ARNOLD</span></header>{PARTICIPATION_FIELDS.map(field => <article key={field.key}><div><strong>{field.label}</strong><small>{field.sourceLabel}</small></div><b>{countValue(latest[field.key])}<small>{formatPercent(percentageOfLeads(latest[field.key], profileBase))}</small></b></article>)}</section>
            {cities.length ? <section><header><MapPin size={19} /><span>PRINCIPAIS CIDADES · TOP 20</span></header>{cities.map(city => <article key={city.opcao}><div><strong>{city.opcao}</strong><small>Residência declarada</small></div><b>{city.pessoas.toLocaleString("pt-BR")}<small>{formatPercent(city.percentual)}</small></b></article>)}</section> : null}
          </div>
        </div>
        {origins.length ? <section className="lead-profile-origins"><header><BarChart3 size={19} /><div><span>ORIGENS DAS CONVERSÕES</span><p>Todas as origens previstas, inclusive as que tiveram zero conversão. Sessões por origem não são medidas nesta LP.</p></div></header><div>{origins.map(origin => { const share = latest.newLeads > 0 ? Math.min(100, origin.conversoes / latest.newLeads * 100) : 0; return <article key={origin.canal}><strong>{origin.canal.replaceAll("_", " ")}</strong><span>{origin.conversoes.toLocaleString("pt-BR")} {origin.conversoes === 1 ? "conversão" : "conversões"}</span><div className="lead-origin-bar"><i style={{ width: `${share}%` }} /></div></article>; })}</div></section> : null}
        {latest.masterclassClicks !== null ? <section className="lead-profile-referral"><header><MousePointerClick size={19} /><div><span>AVANÇO VINDO DAS MASTERCLASSES</span><p>Cliques que chegaram à LP de novidades; não são somados novamente às pessoas únicas.</p></div></header><strong>{latest.masterclassClicks.toLocaleString("pt-BR")}</strong><div>{masterclassClickOrigins.map(origin => <span key={origin.canal}>{origin.canal.replaceAll("_", " ")} · {origin.cliques.toLocaleString("pt-BR")}</span>)}</div></section> : null}
        {latest.note ? <div className="lead-profile-note"><strong>NOTA DO FECHAMENTO</strong><p>{latest.note}</p></div> : null}
      </div> : <div className="lead-profile-empty"><Users size={34} /><div><strong>Nenhuma fotografia registrada</strong><p>Faça o primeiro fechamento agregado da LP de novidades. Nenhum dado pessoal deve ser inserido.</p><button type="button" className="primary-button" onClick={() => setView("form")}><Plus size={16} /> Registrar primeira fotografia</button></div></div> : null}

      {view === "form" ? <section className="lead-profile-form">
        <header><div><Plus size={20} /><span>{form.id ? "EDITAR FOTOGRAFIA" : "NOVA FOTOGRAFIA DA LP"}</span></div>{form.id ? <button type="button" onClick={() => { setForm(createBlankForm()); setView("profile"); }}>Cancelar edição</button> : null}</header>
        <div className="lead-form-source"><strong>ORIGEM FIXA</strong><span>{NEWS_LP_SOURCE.label}</span><p>Use o relatório filtrado desta conversão. Não some outras páginas.</p></div>
        <div className="lead-form-core">
          <label><span>Início do período</span><input type="date" max={new Date().toISOString().slice(0, 10)} value={form.periodStart} onChange={event => setForm(current => ({ ...current, periodStart: event.target.value }))} /></label>
          <label><span>Data de referência</span><input type="date" max={new Date().toISOString().slice(0, 10)} value={form.periodEnd} onChange={event => setForm(current => ({ ...current, periodEnd: event.target.value }))} /></label>
          <label><span>Total acumulado de leads</span><input inputMode="numeric" value={form.totalLeads} onChange={event => update("totalLeads", event.target.value)} placeholder="Obrigatório" /></label>
          <label><span>Novos leads no período</span><input inputMode="numeric" value={form.newLeads} onChange={event => update("newLeads", event.target.value)} placeholder="Obrigatório" /></label>
          <label><span>Sessões nesta LP</span><input inputMode="numeric" value={form.sessions} onChange={event => update("sessions", event.target.value)} placeholder="Opcional" /><small>Mesmo período dos novos leads</small></label>
          <label><span>Sessões com origem DM</span><input inputMode="numeric" value={form.dmSessions} onChange={event => update("dmSessions", event.target.value)} placeholder="Opcional" /><small>UTM agregada, sem palavra-chave</small></label>
          <label><span>Inícios de formulário</span><input inputMode="numeric" value={form.formStarts} onChange={event => update("formStarts", event.target.value)} placeholder="Opcional" /><small>Somente com evento configurado</small></label>
          <label><span>Conversões com origem DM</span><input inputMode="numeric" value={form.dmConversions} onChange={event => update("dmConversions", event.target.value)} placeholder="Opcional" /><small>UTM agregada, sem automação individual</small></label>
        </div>
        <div className="lead-form-groups">
          <fieldset><legend>Histórico de participação</legend>{PARTICIPATION_FIELDS.map(field => <label key={field.key}><span>{field.label}<small>{field.sourceLabel}</small></span><input inputMode="numeric" value={form[field.key]} onChange={event => update(field.key, event.target.value)} placeholder="—" /></label>)}</fieldset>
          <fieldset className="lead-form-interests"><legend>Áreas de interesse</legend>{INTEREST_FIELDS.map(field => <label key={field.key}><span>{field.label}<small>{field.congress !== field.label ? `Mapeado para ${field.congress}` : field.congress}</small></span><input inputMode="numeric" value={form[field.key]} onChange={event => update(field.key, event.target.value)} placeholder="—" /></label>)}</fieldset>
        </div>
        <label className="lead-form-note"><span>Nota do fechamento</span><textarea value={form.note} onChange={event => setForm(current => ({ ...current, note: event.target.value.slice(0, 2000) }))} placeholder="Critério do relatório, filtros aplicados ou ressalvas de leitura" /></label>
        <footer><p>Histórico e interesses podem ficar vazios até o relatório permitir a consolidação. Não estime dados ausentes.</p><button type="button" className="primary-button" onClick={save} disabled={saveMutation.isPending}>{saveMutation.isPending ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}{form.id ? "Salvar alterações" : "Adicionar fotografia"}</button></footer>
      </section> : null}

      {view === "history" ? <section className="lead-profile-history"><header><span>SÉRIE OFICIAL DA MESMA ORIGEM</span><p>O consolidado sustenta o perfil atual e os KPIs; cada dia mostra a evolução. Não some manualmente as linhas.</p></header>{historySnapshots.length ? historySnapshots.map(snapshot => { const kind = getLeadProfileSnapshotKind(snapshot); return <article key={snapshot.id}><div><small>{formatDate(snapshot.periodStartAt)} — {formatDate(snapshot.periodEndAt)} · <b className={`lead-profile-history-kind ${kind}`}>{kind === "rollup" ? "CONSOLIDADO" : kind === "daily" ? "DIA OFICIAL" : "MANUAL"}</b></small><strong>{kind === "daily" ? `${snapshot.newLeads.toLocaleString("pt-BR")} conversões brutas no dia` : `${snapshot.newLeads.toLocaleString("pt-BR")} conversões brutas no recorte`}</strong><span>{kind === "daily" ? `${snapshot.uniquePeopleInPeriod?.toLocaleString("pt-BR") ?? "—"} pessoas únicas no dia · total acumulado não é reconstruído pela série` : `${snapshot.totalLeads.toLocaleString("pt-BR")} conversões acumuladas · ${snapshot.uniquePeopleInPeriod === null ? "pessoas únicas: sem dado" : `${snapshot.uniquePeopleInPeriod.toLocaleString("pt-BR")} pessoas únicas no recorte`}`}</span></div><div>{kind === "manual" ? <><button type="button" onClick={() => edit(snapshot)} aria-label={`Editar fotografia de ${formatDate(snapshot.periodEndAt)}`}><Edit3 size={15} /></button><button type="button" onClick={() => setDeleteCandidate(snapshot)} aria-label={`Excluir fotografia de ${formatDate(snapshot.periodEndAt)}`}><Trash2 size={15} /></button></> : <small className="lead-profile-sync-lock"><Cloud size={12} /> sincronizado</small>}</div></article>; }) : <p className="lead-profile-missing">Nenhuma fotografia registrada.</p>}</section> : null}

      <AlertDialog open={Boolean(deleteCandidate)} onOpenChange={open => !open && setDeleteCandidate(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir fotografia da LP?</AlertDialogTitle><AlertDialogDescription>O fechamento de {deleteCandidate ? formatDate(deleteCandidate.periodEndAt) : ""} será removido para toda a equipe. Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => deleteCandidate && deleteMutation.mutate({ id: deleteCandidate.id })}>Excluir fotografia</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
