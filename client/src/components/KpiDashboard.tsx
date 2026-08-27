/**
 * Design philosophy: "Sala de Comando da Campanha" — o painel não inventa metas;
 * ele oferece um espaço disciplinado para registrar linha de base, meta e resultado.
 */
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, Save, Trash2 } from "lucide-react";
import { kpiLayers } from "@/data/planData";

type MetricState = Record<string, { target: string; actual: string; note: string; done: boolean }>;

const blankState = Object.fromEntries(
  kpiLayers.flatMap((layer) => layer.metrics.map((metric) => [`${layer.id}::${metric}`, { target: "", actual: "", note: "", done: false }])),
) as MetricState;

export default function KpiDashboard() {
  const [state, setState] = useState<MetricState>(blankState);
  const [active, setActive] = useState(kpiLayers[0].id);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("arnold-kpis");
    if (cached) {
      try { setState({ ...blankState, ...JSON.parse(cached) }); } catch { /* use blank state */ }
    }
  }, []);

  const currentLayer = kpiLayers.find((item) => item.id === active) ?? kpiLayers[0];
  const completed = useMemo(() => Object.values(state).filter((item) => item.done).length, [state]);
  const total = Object.keys(blankState).length;

  const update = (key: string, field: keyof MetricState[string], value: string | boolean) => {
    setState((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
    setSaved(false);
  };
  const save = () => {
    localStorage.setItem("arnold-kpis", JSON.stringify(state));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };
  const clear = () => {
    setState(blankState);
    localStorage.removeItem("arnold-kpis");
  };
  const exportData = () => {
    const rows = [["Camada", "Métrica", "Meta", "Atual", "Status", "Observação"]];
    kpiLayers.forEach((layer) => layer.metrics.forEach((metric) => {
      const row = state[`${layer.id}::${metric}`];
      rows.push([layer.layer, metric, row.target, row.actual, row.done ? "Validado" : "Em aberto", row.note]);
    }));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "indicadores-arnold-conference-2027.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="kpi-console">
      <div className="kpi-summary">
        <div><span>MÉTRICAS VALIDADAS</span><strong>{completed}<small>/{total}</small></strong><p>Comece pela linha de base. Nenhuma meta é considerada aprovada antes do registro da equipe.</p></div>
        <div className="kpi-summary-actions">
          <button type="button" className="secondary-button" onClick={clear}><Trash2 size={16} /> Limpar</button>
          <button type="button" className="secondary-button" onClick={exportData}><Download size={16} /> Exportar CSV</button>
          <button type="button" className="primary-button" onClick={save}><Save size={16} /> {saved ? "Salvo" : "Salvar painel"}</button>
        </div>
      </div>
      <div className="kpi-tabs" role="tablist">
        {kpiLayers.map((item) => <button type="button" role="tab" aria-selected={active === item.id} key={item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}>{item.layer}</button>)}
      </div>
      <div className="metric-table">
        <div className="metric-table-head"><span>Métrica</span><span>Meta</span><span>Valor atual</span><span>Observação</span><span>Status</span></div>
        {currentLayer.metrics.map((metric) => {
          const key = `${currentLayer.id}::${metric}`;
          const row = state[key] ?? blankState[key];
          return <div key={metric} className={`metric-row ${row.done ? "done" : ""}`}>
            <strong>{metric}</strong>
            <input value={row.target} onChange={(event) => update(key, "target", event.target.value)} placeholder="Definir" />
            <input value={row.actual} onChange={(event) => update(key, "actual", event.target.value)} placeholder="Registrar" />
            <input value={row.note} onChange={(event) => update(key, "note", event.target.value)} placeholder="Contexto ou decisão" />
            <button type="button" onClick={() => update(key, "done", !row.done)} aria-pressed={row.done}>{row.done ? <CheckCircle2 size={18} /> : <span />}{row.done ? "Validado" : "Validar"}</button>
          </div>;
        })}
      </div>
    </div>
  );
}
