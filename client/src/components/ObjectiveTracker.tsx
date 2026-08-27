/**
 * Design philosophy: "Sala de Comando da Campanha" — objetivos convertidos em
 * instrumentos de validação, com progresso visível e edição direta.
 */
import { useEffect, useMemo, useState } from "react";
import { Check, CircleDashed, RotateCcw, Save } from "lucide-react";
import { objectives } from "@/data/planData";

type ObjectiveState = Record<string, { target: string; current: string; note: string; validated: boolean }>;

const emptyState = Object.fromEntries(
  objectives.map((item) => [item.id, { target: "", current: "", note: "", validated: false }]),
) as ObjectiveState;

export default function ObjectiveTracker() {
  const [state, setState] = useState<ObjectiveState>(emptyState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("arnold-objectives");
    if (cached) {
      try { setState({ ...emptyState, ...JSON.parse(cached) }); } catch { /* keep blank state */ }
    }
  }, []);

  const validated = useMemo(() => Object.values(state).filter((item) => item.validated).length, [state]);
  const progress = Math.round((validated / objectives.length) * 100);

  const update = (id: string, field: keyof ObjectiveState[string], value: string | boolean) => {
    setState((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
    setSaved(false);
  };

  const persist = () => {
    localStorage.setItem("arnold-objectives", JSON.stringify(state));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const clear = () => {
    setState(emptyState);
    localStorage.removeItem("arnold-objectives");
  };

  return (
    <div className="objective-console">
      <div className="objective-summary">
        <div className="progress-orbit" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{progress}%</strong><span>validado</span></div>
        </div>
        <div>
          <p className="eyebrow">PAINEL DE AVANÇO</p>
          <h3>{validated} de {objectives.length} objetivos validados</h3>
          <p>Defina metas depois da linha de base e use o checkbox somente quando houver evidência de avanço.</p>
        </div>
        <div className="tracker-actions">
          <button type="button" className="secondary-button" onClick={clear}><RotateCcw size={16} /> Limpar</button>
          <button type="button" className="primary-button" onClick={persist}><Save size={16} /> {saved ? "Salvo" : "Salvar avanço"}</button>
        </div>
      </div>

      <div className="objective-grid">
        {objectives.map((item, index) => {
          const row = state[item.id] ?? emptyState[item.id];
          return (
            <article key={item.id} className={`objective-card ${row.validated ? "is-validated" : ""}`}>
              <div className="objective-card-head">
                <span className="phase-number">{String(index + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  className="validation-toggle"
                  aria-pressed={row.validated}
                  onClick={() => update(item.id, "validated", !row.validated)}
                >
                  {row.validated ? <Check size={17} /> : <CircleDashed size={17} />}
                  {row.validated ? "Validado" : "Validar"}
                </button>
              </div>
              <h3>{item.stage}</h3>
              <p>{item.objective}</p>
              <div className="signal-box"><span>SINAL DE AVANÇO</span>{item.signals}</div>
              <div className="objective-fields">
                <label>Meta<input value={row.target} onChange={(event) => update(item.id, "target", event.target.value)} placeholder="Ex.: definir após 72h" /></label>
                <label>Atual<input value={row.current} onChange={(event) => update(item.id, "current", event.target.value)} placeholder="Insira o resultado" /></label>
                <label className="full">Observação<textarea value={row.note} onChange={(event) => update(item.id, "note", event.target.value)} placeholder="Evidência, decisão ou próximo ajuste" /></label>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
