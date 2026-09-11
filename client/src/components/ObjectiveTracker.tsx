/**
 * Objetivos compartilhados: todos com acesso ao link leem e salvam
 * a mesma versão, com horário da atualização.
 */
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, CircleDashed, ClipboardCheck, Cloud, CloudOff, Database, RefreshCw, RotateCcw, Save, Upload } from "lucide-react";
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

export default function ObjectiveTracker() {
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

  const toggleValidation = (id: string) => {
    const row = state[id] ?? emptyState[id];
    if (row.validated) {
      update(id, "validated", false);
      return;
    }
    if (!row.target.trim() || !row.current.trim() || !row.note.trim()) {
      toast.info("Preencha critério, resultado e evidência antes de validar esta etapa.");
      return;
    }
    update(id, "validated", true);
  };

  const save = (nextState = state) => saveMutation.mutate({ entries: toEntries(nextState) });

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
    clearMutation.mutate({});
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
          {planning.isError ? <p className="sync-error"><CloudOff size={13} /> Falha de sincronização. Tente atualizar.</p> : latest ? <p className="sync-meta"><Cloud size={13} /> Última atualização em {new Date(latest.updatedAt).toLocaleString("pt-BR")}</p> : <p className="sync-meta"><Cloud size={13} /> Espaço compartilhado pronto para o primeiro registro.</p>}
        </div>
        <div className="tracker-actions">
          {localAvailable ? <button type="button" className="secondary-button" onClick={importLocal} disabled={busy}><Upload size={16} /> Importar deste navegador</button> : null}
          <button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button>
          <button type="button" className="secondary-button" onClick={clear} disabled={busy}><RotateCcw size={16} /> Limpar</button>
          <button type="button" className="primary-button" onClick={() => save()} disabled={busy || planning.isLoading}><Save size={16} /> {saveMutation.isPending ? "Salvando..." : "Salvar para a equipe"}</button>
        </div>
      </div>

      <section className="objective-guide" aria-labelledby="objective-guide-title">
        <div className="objective-guide-intro">
          <p className="eyebrow">COMO PREENCHER ESTE PAINEL</p>
          <h3 id="objective-guide-title">Registre a conclusão estratégica, não replique todos os KPIs</h3>
          <p>Os números detalhados continuam nas áreas de origem — Instagram, Landing Pages, E-mail, WhatsApp e Lotação. Aqui, cada card recebe apenas o <strong>critério usado para decidir</strong>, o <strong>resultado mais recente</strong> e a <strong>evidência com período e fonte</strong>.</p>
        </div>
        <div className="objective-guide-steps">
          <div><ClipboardCheck size={19} /><span>1</span><strong>Defina o critério</strong><p>Escreva o que precisa acontecer para considerar a etapa bem-sucedida, com métrica, unidade e período.</p></div>
          <div><Database size={19} /><span>2</span><strong>Traga o resultado</strong><p>Copie o dado consolidado da área de origem. Use o mesmo indicador e o mesmo período da meta.</p></div>
          <div><CalendarClock size={19} /><span>3</span><strong>Registre a evidência</strong><p>Informe fonte, intervalo analisado e decisão ou próximo ajuste. Não use “foi bom” sem dado.</p></div>
          <div><Check size={19} /><span>4</span><strong>Valide e salve</strong><p>Marque como validado somente quando o critério tiver sido atingido e a evidência estiver registrada.</p></div>
        </div>
        <div className="objective-guide-note"><strong>Importante:</strong> “Atualizar” busca alterações salvas por outra pessoa; “Salvar para a equipe” grava suas mudanças; “Limpar” apaga todos os sete registros compartilhados e deve ser usado somente para reiniciar o painel.</div>
      </section>

      <div className="objective-grid" aria-busy={planning.isLoading}>
        {objectives.map((item, index) => {
          const row = state[item.id] ?? emptyState[item.id];
          const completedFields = [row.target, row.current, row.note].filter(value => value.trim()).length;
          const readyToValidate = completedFields === 3;
          return (
            <article key={item.id} className={`objective-card ${row.validated ? "is-validated" : ""}`}>
              <div className="objective-card-head">
                <span className="phase-number">{String(index + 1).padStart(2, "0")}</span>
                <button type="button" className="validation-toggle" aria-pressed={row.validated} aria-disabled={!row.validated && !readyToValidate} onClick={() => toggleValidation(item.id)}>
                  {row.validated ? <Check size={17} /> : <CircleDashed size={17} />}{row.validated ? "Validado" : readyToValidate ? "Validar etapa" : `${completedFields}/3 preenchidos`}
                </button>
              </div>
              <h3>{item.stage}</h3><p>{item.objective}</p>
              <div className="signal-box"><span>SINAL DE AVANÇO</span>{item.signals}</div>
              <div className="objective-fill-guide">
                <div><span>O QUE PREENCHER</span><p>{item.whatToFill}</p></div>
                <div><span>COMO OBTER</span><p>{item.howToGet}</p></div>
                <div><span>QUANDO ATUALIZAR</span><p>{item.whenToUpdate}</p></div>
              </div>
              <div className="objective-fields">
                <label>1. Critério de sucesso<span className="field-help">Meta + unidade + período</span><input value={row.target} onChange={event => update(item.id, "target", event.target.value)} placeholder={item.targetExample} /></label>
                <label>2. Resultado observado<span className="field-help">Mesmo indicador e período</span><input value={row.current} onChange={event => update(item.id, "current", event.target.value)} placeholder={item.currentExample} /></label>
                <label className="full">3. Evidência, período e próximo ajuste<span className="field-help">Fonte do dado + data/intervalo + decisão tomada</span><textarea value={row.note} onChange={event => update(item.id, "note", event.target.value)} placeholder={item.evidenceExample} /></label>
              </div>
              <div className={`objective-validation-rule ${readyToValidate ? "is-ready" : ""}`}><strong>QUANDO MARCAR “VALIDADO”</strong><p>{item.validationRule}</p></div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
