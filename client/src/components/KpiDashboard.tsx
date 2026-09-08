/** Indicadores secundários compartilhados entre todos os colaboradores com acesso ao link. */
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Cloud, CloudOff, Download, ExternalLink, RefreshCw, Save, Trash2, TriangleAlert, Upload } from "lucide-react";
import { toast } from "sonner";
import { kpiLayers } from "@/data/planData";
import { trpc } from "@/lib/trpc";
import { NEWS_LP_SOURCE } from "@shared/leadProfile";
import { buildAutomaticKpis, buildSourceSummary, formatAutomaticKpi, type KpiIntegrationState } from "@shared/kpiIntegration";

type MetricState = Record<string, { target: string; actual: string; note: string; done: boolean }>;

const blankState = Object.fromEntries(
  kpiLayers.flatMap(layer => layer.metrics.map(metric => [`${layer.id}::${metric.key}`, { target: "", actual: "", note: "", done: false }])),
) as MetricState;

function toEntries(state: MetricState) {
  return Object.entries(state).map(([key, value]) => ({ key, ...value }));
}

export default function KpiDashboard() {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const [state, setState] = useState<MetricState>(blankState);
  const reviewLayer = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("funnel-review") : null;
  const [active, setActive] = useState(kpiLayers.some(layer => layer.id === reviewLayer) ? reviewLayer! : kpiLayers[0].id);
  const [localAvailable, setLocalAvailable] = useState(false);

  useEffect(() => setLocalAvailable(Boolean(localStorage.getItem("arnold-kpis"))), []);
  useEffect(() => {
    if (!planning.data) return;
    const next = structuredClone(blankState);
    planning.data.metrics.forEach(row => {
      if (!next[row.metricKey]) return;
      next[row.metricKey] = { target: row.target, actual: row.actual, note: row.note, done: row.done };
    });
    setState(next);
  }, [planning.data]);

  const saveMutation = trpc.planning.saveMetrics.useMutation({
    onSuccess: async () => {
      localStorage.removeItem("arnold-kpis");
      setLocalAvailable(false);
      await utils.planning.getState.invalidate();
      toast.success("Indicadores sincronizados com a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar: ${error.message}`),
  });
  const clearMutation = trpc.planning.clearMetrics.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      toast.success("Indicadores compartilhados foram limpos.");
    },
    onError: error => toast.error(`Não foi possível limpar: ${error.message}`),
  });

  const currentLayer = kpiLayers.find(item => item.id === active) ?? kpiLayers[0];
  const completed = useMemo(() => Object.values(state).filter(item => item.done).length, [state]);
  const total = Object.keys(blankState).length;
  const latest = useMemo(() => [...(planning.data?.metrics ?? [])].sort((a, b) => b.updatedAt - a.updatedAt)[0], [planning.data]);
  const integrationState = useMemo<KpiIntegrationState | null>(() => planning.data ? {
    socialResults: planning.data.socialResults,
    emailPerformanceResults: planning.data.emailPerformanceResults,
    leadProfileResults: planning.data.leadProfileResults,
    whatsappResults: planning.data.whatsappResults,
    monthlySales: planning.data.monthlySales,
  } : null, [planning.data]);
  const automaticRows = useMemo(() => integrationState ? buildAutomaticKpis(currentLayer.id, integrationState) : [], [currentLayer.id, integrationState]);
  const sourceSummary = useMemo(() => integrationState ? buildSourceSummary(integrationState) : [], [integrationState]);

  const update = (key: string, field: keyof MetricState[string], value: string | boolean) => setState(current => ({ ...current, [key]: { ...current[key], [field]: value } }));
  const save = (nextState = state) => saveMutation.mutate({ entries: toEntries(nextState) });
  const clear = () => {
    if (!window.confirm("Limpar os indicadores para todos os colaboradores?")) return;
    clearMutation.mutate({});
  };
  const importLocal = () => {
    const cached = localStorage.getItem("arnold-kpis");
    if (!cached) return;
    try {
      const merged = { ...blankState, ...JSON.parse(cached) } as MetricState;
      setState(merged);
      save(merged);
    } catch {
      toast.error("Os indicadores locais não puderam ser importados.");
    }
  };
  const exportData = () => {
    const rows = [["Camada", "Métrica", "Meta", "Atual", "Status", "Observação"]];
    kpiLayers.forEach(layer => {
      if (integrationState) buildAutomaticKpis(layer.id, integrationState).forEach(metric => rows.push([layer.layer, metric.label, "—", formatAutomaticKpi(metric.value, metric.format), metric.mode === "automatic" ? "Automático" : "Calculado", `${metric.source}; ${metric.period}`]));
      layer.metrics.forEach(metric => {
        const row = state[`${layer.id}::${metric.key}`];
        rows.push([layer.layer, metric.label, row.target, row.actual, row.done ? "Validado" : "Em aberto", row.note]);
      });
    });
    const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = "indicadores-arnold-conference-2027.csv"; link.click(); URL.revokeObjectURL(link.href);
  };
  const busy = saveMutation.isPending || clearMutation.isPending;

  return (
    <div className="kpi-console">
      <div className="kpi-summary">
        <div><span>MÉTRICAS MANUAIS VALIDADAS</span><strong>{completed}<small>/{total}</small></strong>{planning.isError ? <p className="sync-error"><CloudOff size={13} /> Falha de sincronização.</p> : latest ? <p className="sync-meta"><Cloud size={13} /> Atualizado em {new Date(latest.updatedAt).toLocaleString("pt-BR")}</p> : <p className="sync-meta"><Cloud size={13} /> Indicadores automáticos independem deste contador.</p>}</div>
        <div className="kpi-summary-actions">
          {localAvailable ? <button type="button" className="secondary-button" onClick={importLocal} disabled={busy}><Upload size={16} /> Importar deste navegador</button> : null}
          <button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button>
          <button type="button" className="secondary-button" onClick={clear} disabled={busy}><Trash2 size={16} /> Limpar</button>
          <button type="button" className="secondary-button" onClick={exportData}><Download size={16} /> Exportar CSV</button>
          <button type="button" className="primary-button" onClick={() => save()} disabled={busy || planning.isLoading}><Save size={16} /> {saveMutation.isPending ? "Salvando..." : "Salvar para a equipe"}</button>
        </div>
      </div>
      <div className="kpi-source-summary" aria-label="Resumo das fontes conectadas">{sourceSummary.map(item => <article key={item.key}><span>{item.label}</span><strong>{formatAutomaticKpi(item.value, item.format ?? "number")}</strong><small>{item.detail}</small></article>)}</div>
      <div className="kpi-tabs" role="tablist">{kpiLayers.map(item => <button type="button" role="tab" aria-selected={active === item.id} key={item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}>{item.layer}</button>)}</div>
      <div className="kpi-layer-guide">
        <div><span>O QUE ESTA ETAPA MEDE</span><p>{currentLayer.purpose}</p></div>
        <div><span>QUANDO PREENCHER</span><p>{currentLayer.cadence}</p></div>
        <div><span>FONTE DO DADO</span><p>{currentLayer.source}</p></div>
        <div><span>NÃO REGISTRAR AQUI</span><p>{currentLayer.avoid}</p></div>
      </div>
      {"constraint" in currentLayer && currentLayer.constraint ? <div className="kpi-source-constraint"><TriangleAlert size={19} /><p>{currentLayer.constraint}</p></div> : null}
      <div className="kpi-lead-source-reference"><div><span>{automaticRows.length ? "FONTE ESPECÍFICA CONECTADA" : "PREENCHIMENTO MANUAL JUSTIFICADO"}</span><strong>{automaticRows.length ? `${automaticRows.length} ${automaticRows.length === 1 ? "indicador sincronizado" : "indicadores sincronizados ou calculados"}` : "Ainda não existe fonte interna para esta etapa"}</strong><p>{automaticRows.length ? "Preencha estes dados somente na área de origem. As linhas abaixo são bloqueadas contra redigitação." : "Registre manualmente apenas quando houver relatório confiável e informe período e fonte na observação."}</p></div>{currentLayer.id === "landing" ? <a href={NEWS_LP_SOURCE.url} target="_blank" rel="noreferrer">Abrir origem <ExternalLink size={13} /></a> : null}</div>
      <div className="metric-table" aria-busy={planning.isLoading}>
        <div className="metric-table-head"><span>Métrica</span><span>Meta</span><span>Valor atual</span><span>Observação</span><span>Status</span></div>
        {automaticRows.map(metric => <div className="metric-row metric-row-automatic" key={metric.key} aria-label={`${metric.label} ${metric.mode === "automatic" ? "automático" : "calculado"}`}>
          <div className="metric-name"><strong>{metric.label}</strong><small>{metric.description}</small></div>
          <div className="metric-readonly-field"><small>Meta</small><strong>—</strong></div>
          <div className="metric-readonly-field metric-readonly-value"><small>Valor atual</small><strong>{formatAutomaticKpi(metric.value, metric.format)}</strong></div>
          <div className="metric-readonly-field"><small>Período e origem</small><strong>{metric.period}</strong><span>{metric.source}</span></div>
          <div className={`metric-auto-status ${metric.value === null ? "waiting" : "ready"}`}>{metric.value === null ? <RefreshCw size={17} /> : <CheckCircle2 size={17} />}{metric.value === null ? "Aguardando" : metric.mode === "automatic" ? "Automático" : "Calculado"}</div>
        </div>)}
        {currentLayer.metrics.map(metric => {
          const key = `${currentLayer.id}::${metric.key}`;
          const row = state[key] ?? blankState[key];
          return <div key={metric.key} className={`metric-row ${row.done ? "done" : ""}`}><div className="metric-name"><strong>{metric.label}</strong><small>{metric.description}</small></div><input value={row.target} onChange={event => update(key, "target", event.target.value)} placeholder="Definir" aria-label={`Meta de ${metric.label}`} /><input value={row.actual} onChange={event => update(key, "actual", event.target.value)} placeholder="Registrar" aria-label={`Valor atual de ${metric.label}`} /><input value={row.note} onChange={event => update(key, "note", event.target.value)} placeholder="Período, fonte ou decisão" aria-label={`Observação de ${metric.label}`} /><button type="button" onClick={() => update(key, "done", !row.done)} aria-pressed={row.done}>{row.done ? <CheckCircle2 size={18} /> : <span />}{row.done ? "Validado" : "Validar"}</button></div>;
        })}
      </div>
    </div>
  );
}
