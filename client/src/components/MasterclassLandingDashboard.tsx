import { useMemo, useState } from "react";
import { BarChart3, CircleAlert, Cloud, CloudOff, Edit3, ExternalLink, GraduationCap, PlayCircle, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  MASTERCLASS_LESSONS,
  MASTERCLASS_LP_SOURCE,
  calculateAbandonments,
  calculateRate,
  getLatestMasterclassSnapshot,
  getLessonPerformance,
  parseMasterclassTrafficOrigins,
  validateMasterclassLandingSnapshot,
  type MasterclassLandingSnapshot,
  type MasterclassLandingSnapshotDraft,
} from "@shared/masterclassLanding";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import MasterclassSyncPanel from "@/components/MasterclassSyncPanel";
import { brasiliaCivilDate, civilDateFromUtcNoon, civilDateToUtcNoon, formatCivilDateBR, formatTimestampInBrasilia } from "@shared/brasiliaTime";

type View = "performance" | "form" | "history";
const countFields = ["sessions", "dmSessions", "formStarts", "dmConversions", "thankYouPageAccesses", "anaLessonStarts", "anaLessonCompletions", "andreiaLessonStarts", "andreiaLessonCompletions", "robertoLessonStarts", "robertoLessonCompletions", "congressHubClicks", "newsLpClicks", "salesPageClicks"] as const;
type CountField = typeof countFields[number];
type FormState = { id?: number; periodStart: string; periodEnd: string; totalLeads: string; newLeads: string; note: string } & Record<CountField, string>;

function blankForm(): FormState {
  return { periodStart: "", periodEnd: "", totalLeads: "", newLeads: "", note: "", ...Object.fromEntries(countFields.map(key => [key, ""])) } as FormState;
}
function parseCount(value: string) { if (!value.trim()) return null; const parsed = Number(value); return Number.isInteger(parsed) && parsed >= 0 ? parsed : null; }
function count(value: number | null) { return value === null ? "—" : value.toLocaleString("pt-BR"); }
function percent(value: number | null) { return value === null ? "Sem dado" : `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`; }

export default function MasterclassLandingDashboard() {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const reviewView = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("masterclass-lp-review") : null;
  const [view, setView] = useState<View>(reviewView === "form" || reviewView === "history" ? reviewView : "performance");
  const [form, setForm] = useState<FormState>(() => blankForm());
  const [deleteCandidate, setDeleteCandidate] = useState<MasterclassLandingSnapshot | null>(null);
  const snapshots = useMemo<MasterclassLandingSnapshot[]>(() => planning.data?.masterclassLandingResults ?? [], [planning.data?.masterclassLandingResults]);
  const latest = useMemo(() => getLatestMasterclassSnapshot(snapshots), [snapshots]);
  const lessons = useMemo(() => latest ? getLessonPerformance(latest) : [], [latest]);
  const trafficOrigins = useMemo(() => parseMasterclassTrafficOrigins(latest?.originsJson), [latest?.originsJson]);
  const todayInBrasilia = useMemo(() => brasiliaCivilDate(), []);
  const conversionRate = latest ? calculateRate(latest.newLeads, latest.sessions) : null;
  const accessRate = latest ? calculateRate(latest.thankYouPageAccesses, latest.newLeads) : null;
  const abandonments = latest ? calculateAbandonments(latest.formStarts, latest.newLeads) : null;

  const saveMutation = trpc.planning.saveMasterclassLandingSnapshot.useMutation({
    onSuccess: async () => { await utils.planning.getState.invalidate(); setForm(blankForm()); setView("performance"); toast.success("Fotografia das masterclasses sincronizada."); },
    onError: error => toast.error(`Não foi possível salvar: ${error.message}`),
  });
  const deleteMutation = trpc.planning.deleteMasterclassLandingSnapshot.useMutation({
    onSuccess: async () => { await utils.planning.getState.invalidate(); setDeleteCandidate(null); toast.success("Fotografia removida do histórico."); },
    onError: error => toast.error(`Não foi possível excluir: ${error.message}`),
  });

  const updateCount = (key: CountField | "totalLeads" | "newLeads", value: string) => setForm(current => ({ ...current, [key]: value.replace(/\D/g, "") }));
  const draft = (): MasterclassLandingSnapshotDraft => ({
    id: form.id,
    periodStartAt: civilDateToUtcNoon(form.periodStart), periodEndAt: civilDateToUtcNoon(form.periodEnd),
    totalLeads: parseCount(form.totalLeads) ?? -1, newLeads: parseCount(form.newLeads) ?? -1,
    ...Object.fromEntries(countFields.map(key => [key, parseCount(form[key])])), note: form.note.trim(),
  }) as MasterclassLandingSnapshotDraft;
  const save = () => {
    if (!form.periodStart || !form.periodEnd || !form.totalLeads || !form.newLeads) return toast.error("Preencha período, total acumulado e novos leads.");
    const next = draft(); const issues = validateMasterclassLandingSnapshot(next); if (issues.length) return toast.error(issues[0].message); saveMutation.mutate(next);
  };
  const edit = (snapshot: MasterclassLandingSnapshot) => {
    setForm({ id: snapshot.id, periodStart: civilDateFromUtcNoon(snapshot.periodStartAt), periodEnd: civilDateFromUtcNoon(snapshot.periodEndAt), totalLeads: String(snapshot.totalLeads), newLeads: String(snapshot.newLeads), note: snapshot.note, ...Object.fromEntries(countFields.map(key => [key, snapshot[key] === null ? "" : String(snapshot[key])])) } as FormState); setView("form");
  };

  return <div className="masterclass-lp-console" aria-busy={planning.isLoading || saveMutation.isPending || deleteMutation.isPending}>
    <header className="masterclass-lp-head"><div><GraduationCap size={28} /><span>FONTE EXCLUSIVA · ISCA DIGITAL</span><h3>Performance — LP das masterclasses</h3><p>Tráfego, captação, entrega e consumo das três aulas. Preencha somente eventos disponíveis no relatório ou no player.</p><div className="masterclass-lp-links"><a href={MASTERCLASS_LP_SOURCE.url} target="_blank" rel="noreferrer">Abrir LP <ExternalLink size={13} /></a><a href={MASTERCLASS_LP_SOURCE.thankYouUrl} target="_blank" rel="noreferrer">Abrir página de obrigado <ExternalLink size={13} /></a></div>{planning.isError ? <small className="sync-error"><CloudOff size={13} /> Falha de sincronização.</small> : latest ? <small><Cloud size={13} /> Atualizado em {formatTimestampInBrasilia(latest.updatedAt)} · Brasília</small> : <small><Cloud size={13} /> Pronto para a primeira fotografia.</small>}</div><button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button></header>
    <MasterclassSyncPanel />
    <div className="masterclass-lp-tabs" role="tablist"><button type="button" role="tab" aria-selected={view === "performance"} className={view === "performance" ? "active" : ""} onClick={() => setView("performance")}>Performance atual</button><button type="button" role="tab" aria-selected={view === "form"} className={view === "form" ? "active" : ""} onClick={() => setView("form")}>{form.id ? "Editar fotografia" : "Nova fotografia manual"}</button><button type="button" role="tab" aria-selected={view === "history"} className={view === "history" ? "active" : ""} onClick={() => setView("history")}>Histórico ({snapshots.length})</button></div>

    {view === "performance" ? latest ? <div className="masterclass-lp-current">
      <div className="masterclass-sync-provenance"><strong>{latest.syncSource === "lovable-api" ? "SINCRONIZADO VIA LOVABLE" : "REGISTRO MANUAL"}</strong><span>Período: {formatCivilDateBR(latest.periodStartAt)} a {formatCivilDateBR(latest.periodEndAt)}</span>{latest.providerUpdatedAt ? <span>Origem atualizada em {formatTimestampInBrasilia(latest.providerUpdatedAt)} · Brasília</span> : null}</div>
      <div className="masterclass-lp-summary"><article><strong>{latest.totalLeads.toLocaleString("pt-BR")}</strong><span>LEADS ACUMULADOS</span></article><article><strong>+{latest.newLeads.toLocaleString("pt-BR")}</strong><span>NOVOS NO PERÍODO</span></article><article><strong>{formatCivilDateBR(latest.periodStartAt)}</strong><span>INÍCIO</span></article><article><strong>{formatCivilDateBR(latest.periodEndAt)}</strong><span>FECHAMENTO</span></article></div>
      <div className="masterclass-lp-funnel"><article><strong>{count(latest.sessions)}</strong><span>SESSÕES NA LP</span></article><article><strong>{percent(conversionRate)}</strong><span>CONVERSÃO DA LP</span><small>Novos leads ÷ sessões</small></article><article><strong>{count(latest.thankYouPageAccesses)}</strong><span>ACESSOS À RECOMPENSA</span></article><article><strong>{percent(accessRate)}</strong><span>ÍNDICE ACESSOS / LEADS</span><small>Eventos ÷ novos leads; pode superar 100%</small></article><article><strong>{count(latest.formStarts)}</strong><span>INÍCIOS DE FORMULÁRIO</span></article><article><strong>{count(abandonments)}</strong><span>ABANDONOS CALCULADOS</span></article></div>
      <section className="masterclass-lesson-performance"><header><PlayCircle size={20} /><div><span>CONSUMO POR AULA</span><p>Somente eventos reais do player; campos vazios permanecem sem dado.</p></div></header><div>{lessons.map(lesson => <article key={lesson.key}><small>{lesson.congress}</small><h4>{lesson.speaker}</h4><div><span><b>{count(lesson.starts)}</b> inícios</span><span><b>{count(lesson.viewers)}</b> espectadores únicos</span><span><b>{count(lesson.completions)}</b> conclusões</span><span><b>{percent(lesson.completionRate)}</b> conclusão</span><span><b>{percent(lesson.averageWatchPercent)}</b> média assistida</span></div></article>)}</div></section>
      {trafficOrigins.length ? <section className="masterclass-origins"><header><BarChart3 size={19} /><div><span>ORIGENS DA CAPTAÇÃO</span><p>Sessões e leads atribuídos pelo endpoint da LP no mesmo período da fotografia.</p></div></header><div>{trafficOrigins.map(origin => <article key={origin.channel}><strong>{origin.channel.replaceAll("_", " ")}</strong><span>{origin.sessions.toLocaleString("pt-BR")} sessões</span><span>{origin.leads.toLocaleString("pt-BR")} leads</span><small>{percent(calculateRate(origin.leads, origin.sessions))} conversão</small></article>)}</div></section> : null}
      <section className="masterclass-advance"><header><BarChart3 size={19} /><span>AVANÇO APÓS A RECOMPENSA</span></header><div><article><strong>{count(latest.congressHubClicks)}</strong><span>Cliques para os congressos</span></article><article><strong>{count(latest.newsLpClicks)}</strong><span>Cliques para novidades</span></article><article><strong>{count(latest.salesPageClicks)}</strong><span>Cliques para compra</span></article></div></section>
      <div className="masterclass-tracking-note"><CircleAlert size={20} /><p><strong>Sem estimativas:</strong> não preencha reproduções, conclusão ou avanço com base em visitas. Use somente eventos efetivamente configurados e disponíveis.</p></div>
      {latest.note ? <div className="lead-profile-note"><strong>NOTA DO FECHAMENTO</strong><p>{latest.note}</p></div> : null}
    </div> : <div className="lead-profile-empty"><GraduationCap size={34} /><div><strong>Nenhuma fotografia registrada</strong><p>Registre o primeiro fechamento agregado da LP das masterclasses. Os KPIs e a isca serão atualizados automaticamente.</p><button type="button" className="primary-button" onClick={() => setView("form")}><Plus size={16} /> Registrar primeira fotografia</button></div></div> : null}

    {view === "form" ? <section className="masterclass-lp-form"><header><div><Plus size={20} /><span>{form.id ? "EDITAR FOTOGRAFIA" : "NOVA FOTOGRAFIA DAS MASTERCLASSES"}</span></div>{form.id ? <button type="button" onClick={() => { setForm(blankForm()); setView("performance"); }}>Cancelar edição</button> : null}</header><div className="lead-form-source"><strong>ORIGEM FIXA</strong><span>{MASTERCLASS_LP_SOURCE.label}</span><p>Use o mesmo período em tráfego, conversão, página de obrigado e player.</p></div>
      <div className="masterclass-form-core"><label><span>Início do período</span><input type="date" max={todayInBrasilia} value={form.periodStart} onChange={event => setForm(current => ({ ...current, periodStart: event.target.value }))} /></label><label><span>Data de fechamento</span><input type="date" max={todayInBrasilia} value={form.periodEnd} onChange={event => setForm(current => ({ ...current, periodEnd: event.target.value }))} /></label><label><span>Total acumulado de leads</span><input inputMode="numeric" value={form.totalLeads} onChange={event => updateCount("totalLeads", event.target.value)} placeholder="Obrigatório" /></label><label><span>Novos leads no período</span><input inputMode="numeric" value={form.newLeads} onChange={event => updateCount("newLeads", event.target.value)} placeholder="Obrigatório" /></label></div>
      <div className="masterclass-form-groups"><fieldset><legend>Tráfego e captação</legend>{([['sessions','Sessões na LP'],['dmSessions','Sessões com origem DM'],['formStarts','Inícios de formulário'],['dmConversions','Conversões com origem DM'],['thankYouPageAccesses','Acessos à página de obrigado']] as const).map(([key,label]) => <label key={key}><span>{label}</span><input inputMode="numeric" value={form[key]} onChange={event => updateCount(key, event.target.value)} placeholder="—" /></label>)}</fieldset><fieldset><legend>Consumo das aulas</legend>{MASTERCLASS_LESSONS.flatMap(lesson => [[`${lesson.key}LessonStarts`, `Inícios · ${lesson.speaker}`],[`${lesson.key}LessonCompletions`, `Conclusões · ${lesson.speaker}`]] as Array<[CountField,string]>).map(([key,label]) => <label key={key}><span>{label}</span><input inputMode="numeric" value={form[key]} onChange={event => updateCount(key, event.target.value)} placeholder="—" /></label>)}</fieldset><fieldset><legend>Avanço no funil</legend>{([['congressHubClicks','Cliques para os congressos'],['newsLpClicks','Cliques para a LP de novidades'],['salesPageClicks','Cliques para compra']] as const).map(([key,label]) => <label key={key}><span>{label}</span><input inputMode="numeric" value={form[key]} onChange={event => updateCount(key, event.target.value)} placeholder="—" /></label>)}</fieldset></div>
      <label className="lead-form-note"><span>Nota do fechamento</span><textarea value={form.note} onChange={event => setForm(current => ({ ...current, note: event.target.value.slice(0, 2000) }))} placeholder="Fontes, eventos configurados ou ressalvas de leitura" /></label><footer><p>Campos sem rastreamento devem ficar vazios. A plataforma não estima consumo.</p><button type="button" className="primary-button" onClick={save} disabled={saveMutation.isPending}>{saveMutation.isPending ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}{form.id ? "Salvar alterações" : "Adicionar fotografia"}</button></footer></section> : null}

    {view === "history" ? <section className="lead-profile-history"><header><span>FOTOGRAFIAS DA LP DAS MASTERCLASSES</span><p>Compare fechamentos sem somar as linhas: cada registro representa um período e um acumulado.</p></header>{snapshots.length ? snapshots.map(snapshot => <article key={snapshot.id}><div><small>{formatCivilDateBR(snapshot.periodStartAt)} — {formatCivilDateBR(snapshot.periodEndAt)} · {snapshot.syncSource === "lovable-api" ? "Lovable" : "Manual"}</small><strong>{snapshot.totalLeads.toLocaleString("pt-BR")} leads acumulados</strong><span>+{snapshot.newLeads.toLocaleString("pt-BR")} no período</span></div><div><button type="button" onClick={() => edit(snapshot)} aria-label={`Editar fotografia de ${formatCivilDateBR(snapshot.periodEndAt)}`}><Edit3 size={15} /></button><button type="button" onClick={() => setDeleteCandidate(snapshot)} aria-label={`Excluir fotografia de ${formatCivilDateBR(snapshot.periodEndAt)}`}><Trash2 size={15} /></button></div></article>) : <p className="lead-profile-missing">Nenhuma fotografia registrada.</p>}</section> : null}
    <AlertDialog open={Boolean(deleteCandidate)} onOpenChange={open => !open && setDeleteCandidate(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir fotografia das masterclasses?</AlertDialogTitle><AlertDialogDescription>O fechamento de {deleteCandidate ? formatCivilDateBR(deleteCandidate.periodEndAt) : ""} será removido para toda a equipe.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => deleteCandidate && deleteMutation.mutate({ id: deleteCandidate.id })}>Excluir fotografia</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}
