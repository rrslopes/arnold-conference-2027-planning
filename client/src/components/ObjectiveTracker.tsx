/**
 * Objetivos compartilhados: todos os colaboradores autenticados leem e salvam
 * a mesma versão, com autoria e horário da atualização.
 */
import { useEffect, useMemo, useState } from "react";
import { Check, CircleDashed, Cloud, CloudOff, RefreshCw, RotateCcw, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { objectives } from "@/data/planData";
import { trpc } from "@/lib/trpc";

type ObjectiveState = Record<string, { target: string; current: string; note: string; validated: boolean }>;

const emptyState = Object.fromEntries(
  objectives.map(item => [item.id, { target: "", current: "", note: "", validated: false }]),
) as ObjectiveState;

function toEntries(state: ObjectiveState) {
  return objectives.map(item => ({ key: item.id, ...state[item.id] }));
}

export default function ObjectiveTracker({ actorName }: { actorName: string }) {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const [state, setState] = useState<ObjectiveState>(emptyState);
  const [localAvailable, setLocalAvailable] = useState(false);

  useEffect(() => {
    setLocalAvailable(Boolean(localStorage.getItem("arnold-objectives")));
  }, []);

  useEffect(() => {
    if (!planning.data) return;
    const next = structuredClone(emptyState);
    planning.data.objectives.forEach(row => {
      if (!next[row.objectiveKey]) return;
      next[row.objectiveKey] = {
        target: row.target,
        current: row.current,
        note: row.note,
        validated: row.validated,
      };
    });
    setState(next);
  }, [planning.data]);

  const saveMutation = trpc.planning.saveObjectives.useMutation({
    onSuccess: async () => {
      localStorage.removeItem("arnold-objectives");
      setLocalAvailable(false);
      await utils.planning.getState.invalidate();
      toast.success("Objetivos sincronizados com a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar: ${error.message}`),
  });

  const clearMutation = trpc.planning.clearObjectives.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      toast.success("Objetivos compartilhados foram limpos.");
    },
    onError: error => toast.error(`Não foi possível limpar: ${error.message}`),
  });

  const validated = useMemo(() => Object.values(state).filter(item => item.validated).length, [state]);
  const progress = Math.round((validated / objectives.length) * 100);
  const latest = useMemo(() => [...(planning.data?.objectives ?? [])].sort((a, b) => b.updatedAt - a.updatedAt)[0], [planning.data]);

  const update = (id: string, field: keyof ObjectiveState[string], value: string | boolean) => {
    setState(current => ({ ...current, [id]: { ...current[id], [field]: value } }));
  };

  const save = (nextState = state) => saveMutation.mutate({ entries: toEntries(nextState), actorName: actorName || undefined });

  const importLocal = () => {
    const cached = localStorage.getItem("arnold-objectives");
    if (!cached) return;
    try {
      const merged = { ...emptyState, ...JSON.parse(cached) } as ObjectiveState;
      setState(merged);
      save(merged);
    } catch {
      toast.error("Os dados locais não puderam ser importados.");
    }
  };

  const clear = () => {
    if (!window.confirm("Limpar os objetivos para todos os colaboradores?")) return;
    clearMutation.mutate({ actorName: actorName || undefined });
  };

  const busy = saveMutation.isPending || clearMutation.isPending;

  return (
    <div className="objective-console">
      <div className="objective-summary">
        <div className="progress-orbit" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{progress}%</strong><span>validado</span></div>
        </div>
        <div>
          <p className="eyebrow">PAINEL DE AVANÇO COMPARTILHADO</p>
          <h3>{validated} de {objectives.length} objetivos validados</h3>
          {planning.isError ? <p className="sync-error"><CloudOff size={13} /> Falha de sincronização. Tente atualizar.</p> : latest ? <p className="sync-meta"><Cloud size={13} /> Última atualização por {latest.updatedByName ?? "usuário da equipe"}, em {new Date(latest.updatedAt).toLocaleString("pt-BR")}</p> : <p className="sync-meta"><Cloud size={13} /> Espaço compartilhado pronto para o primeiro registro.</p>}
        </div>
        <div className="tracker-actions">
          {localAvailable ? <button type="button" className="secondary-button" onClick={importLocal} disabled={busy}><Upload size={16} /> Importar deste navegador</button> : null}
          <button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button>
          <button type="button" className="secondary-button" onClick={clear} disabled={busy}><RotateCcw size={16} /> Limpar</button>
          <button type="button" className="primary-button" onClick={() => save()} disabled={busy || planning.isLoading}><Save size={16} /> {saveMutation.isPending ? "Salvando..." : "Salvar para a equipe"}</button>
        </div>
      </div>

      <div className="objective-grid" aria-busy={planning.isLoading}>
        {objectives.map((item, index) => {
          const row = state[item.id] ?? emptyState[item.id];
          return (
            <article key={item.id} className={`objective-card ${row.validated ? "is-validated" : ""}`}>
              <div className="objective-card-head">
                <span className="phase-number">{String(index + 1).padStart(2, "0")}</span>
                <button type="button" className="validation-toggle" aria-pressed={row.validated} onClick={() => update(item.id, "validated", !row.validated)}>
                  {row.validated ? <Check size={17} /> : <CircleDashed size={17} />}{row.validated ? "Validado" : "Validar"}
                </button>
              </div>
              <h3>{item.stage}</h3><p>{item.objective}</p>
              <div className="signal-box"><span>SINAL DE AVANÇO</span>{item.signals}</div>
              <div className="objective-fields">
                <label>Meta<input value={row.target} onChange={event => update(item.id, "target", event.target.value)} placeholder="Ex.: definir após 72h" /></label>
                <label>Atual<input value={row.current} onChange={event => update(item.id, "current", event.target.value)} placeholder="Insira o resultado" /></label>
                <label className="full">Observação<textarea value={row.note} onChange={event => update(item.id, "note", event.target.value)} placeholder="Evidência, decisão ou próximo ajuste" /></label>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
