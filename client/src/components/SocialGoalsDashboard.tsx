import { useEffect, useMemo, useState } from "react";
import { BarChart3, Cloud, CloudOff, History, Instagram, RefreshCw, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  SOCIAL_ACCOUNT_GOALS,
  SOCIAL_FORMAT_GOALS,
  SOCIAL_HISTORY,
  SOCIAL_MISSING_BASELINES,
  SOCIAL_MONTHS,
  SOCIAL_RESULT_FIELDS,
  SOCIAL_STORY_ACTION_GOALS,
  calculateGoalProgress,
  calculatePerHundred,
  hasAnySocialResult,
  type SocialMonthlyValues,
  type SocialResultField,
} from "@shared/socialMetrics";

type SocialMonthForm = Record<SocialResultField, string> & { note: string };
type SocialForm = Record<(typeof SOCIAL_MONTHS)[number]["key"], SocialMonthForm>;
type SocialView = "monthly" | "formats" | "history";

function getInitialView(): SocialView {
  if (typeof window === "undefined") return "monthly";
  const requested = new URLSearchParams(window.location.search).get("social-view");
  return requested === "formats" || requested === "history" ? requested : "monthly";
}

const fieldLabels: Partial<Record<SocialResultField, string>> = {
  metaMessagesSent: "Mensagens automáticas enviadas — total geral",
  reelsPublished: "Reels publicados",
  reelsMedianReach: "Alcance mediano",
  reelsMedianViews: "Visualizações medianas",
  reelsMedianInteractions: "Interações medianas",
  reelsMedianShares: "Compartilhamentos medianos",
  reelsMedianSaves: "Salvamentos medianos",
  carouselsPublished: "Carrosséis publicados",
  carouselsMedianReach: "Alcance mediano",
  carouselsMedianViews: "Visualizações medianas",
  carouselsMedianInteractions: "Interações medianas",
  carouselsMedianShares: "Compartilhamentos medianos",
  carouselsMedianSaves: "Salvamentos medianos",
  storiesPublished: "Stories publicados",
  storiesMedianReach: "Alcance mediano",
  storiesMedianViews: "Visualizações medianas",
  storyReplies: "Respostas",
  storyLinkClicks: "Cliques no link",
  storyStickerTaps: "Toques em figurinhas",
  storyProfileVisits: "Visitas ao perfil",
};

function blankMonth(): SocialMonthForm {
  return { ...Object.fromEntries(SOCIAL_RESULT_FIELDS.map(field => [field, ""])), note: "" } as SocialMonthForm;
}

function blankForm(): SocialForm {
  return Object.fromEntries(SOCIAL_MONTHS.map(month => [month.key, blankMonth()])) as SocialForm;
}

function parseNumber(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeNumber(value: string, allowNegative = false) {
  const sign = allowNegative && value.trim().startsWith("-") ? "-" : "";
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits ? `${sign}${digits}` : sign;
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function levelLabel(actual: number | null, minimum: number, operational: number, stretch: number) {
  if (actual === null) return "Aguardando lançamento";
  if (actual >= stretch) return "Faixa de superação";
  if (actual >= operational) return "Meta operacional atingida";
  if (actual >= minimum) return "Mínimo aceitável atingido";
  return "Abaixo da referência mínima";
}

export default function SocialGoalsDashboard() {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const [form, setForm] = useState<SocialForm>(() => blankForm());
  const [activeMonth, setActiveMonth] = useState<(typeof SOCIAL_MONTHS)[number]["key"]>("2026-09");
  const [activeView, setActiveView] = useState<SocialView>(() => getInitialView());

  useEffect(() => {
    if (!planning.data) return;
    const next = blankForm();
    planning.data.socialResults.forEach(row => {
      const month = SOCIAL_MONTHS.find(item => item.key === row.monthKey);
      if (!month) return;
      SOCIAL_RESULT_FIELDS.forEach(field => {
        next[month.key][field] = row[field] === null ? "" : String(row[field]);
      });
      next[month.key].note = row.note;
    });
    setForm(next);
  }, [planning.data]);

  const saveMutation = trpc.planning.saveSocialResults.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      toast.success("Resultados de Instagram sincronizados com a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar os resultados sociais: ${error.message}`),
  });

  const activeConfig = SOCIAL_MONTHS.find(month => month.key === activeMonth) ?? SOCIAL_MONTHS[0];
  const activeValues = useMemo(() => Object.fromEntries(
    SOCIAL_RESULT_FIELDS.map(field => [field, parseNumber(form[activeMonth][field])]),
  ) as SocialMonthlyValues, [activeMonth, form]);
  const hasResult = hasAnySocialResult(activeValues);
  const latest = useMemo(() => [...(planning.data?.socialResults ?? [])].sort((a, b) => b.updatedAt - a.updatedAt)[0], [planning.data]);

  const updateField = (field: SocialResultField, value: string) => {
    setForm(current => ({
      ...current,
      [activeMonth]: { ...current[activeMonth], [field]: normalizeNumber(value, field === "netFollowers") },
    }));
  };

  const updateNote = (value: string) => setForm(current => ({
    ...current,
    [activeMonth]: { ...current[activeMonth], note: value.slice(0, 2000) },
  }));

  const save = () => saveMutation.mutate({
    entries: SOCIAL_MONTHS.map(month => {
      const values = Object.fromEntries(
        SOCIAL_RESULT_FIELDS.map(field => [field, parseNumber(form[month.key][field])]),
      ) as SocialMonthlyValues;
      return { monthKey: month.key, ...values, note: form[month.key].note };
    }),
  });

  const storyActionActuals = {
    repliesPer100: calculatePerHundred(activeValues.storyReplies, activeValues.storiesPublished),
    linkClicksPer100: calculatePerHundred(activeValues.storyLinkClicks, activeValues.storiesPublished),
    profileVisitsPer100: calculatePerHundred(activeValues.storyProfileVisits, activeValues.storiesPublished),
  };

  const renderFormatInputs = (title: string, fields: SocialResultField[]) => (
    <article className="social-input-card">
      <h5>{title}</h5>
      <div>{fields.map(field => <label key={field}><span>{fieldLabels[field]}</span><input inputMode="numeric" value={form[activeMonth][field]} onChange={event => updateField(field, event.target.value)} placeholder="—" aria-label={`${fieldLabels[field]} em ${activeConfig.fullLabel}`} /></label>)}</div>
    </article>
  );

  return (
    <div className="social-goals-console" aria-busy={planning.isLoading || saveMutation.isPending}>
      <header className="social-goals-head">
        <div>
          <span>REFERÊNCIA DE GESTÃO · INSTAGRAM</span>
          <h3>Metas sociais e resultado mensal</h3>
          <p>Compare os resultados reais com faixas históricas. As metas orientam decisões de conteúdo; não representam previsão garantida de alcance ou vendas.</p>
          {planning.isError ? <small className="sync-error"><CloudOff size={13} /> Falha de sincronização.</small> : latest ? <small><Cloud size={13} /> Atualizado em {new Date(latest.updatedAt).toLocaleString("pt-BR")}</small> : <small><Cloud size={13} /> Espaço compartilhado pronto para o primeiro lançamento.</small>}
        </div>
        <div className="social-goals-actions">
          <button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button>
          <button type="button" className="primary-button" onClick={save} disabled={planning.isLoading || saveMutation.isPending}><Save size={16} /> {saveMutation.isPending ? "Salvando..." : "Salvar resultados"}</button>
        </div>
      </header>

      <div className="social-month-strip" role="tablist" aria-label="Mês de acompanhamento">
        {SOCIAL_MONTHS.map(month => <button type="button" role="tab" aria-selected={activeMonth === month.key} className={activeMonth === month.key ? "active" : ""} key={month.key} onClick={() => setActiveMonth(month.key)}><strong>{month.label}</strong><small>{hasAnySocialResult(Object.fromEntries(SOCIAL_RESULT_FIELDS.map(field => [field, parseNumber(form[month.key][field])])) as SocialMonthlyValues) ? "Com dados" : "Aguardando"}</small></button>)}
      </div>

      <div className="social-period-context">
        <div><span>MÊS EM ANÁLISE</span><strong>{activeConfig.fullLabel}</strong><small>{activeConfig.phase}</small></div>
        <p>{hasResult ? "Os percentuais abaixo comparam o resultado informado à meta operacional." : "Ainda não há resultado lançado. As referências continuam visíveis para orientar a operação."}</p>
      </div>

      <div className="social-view-tabs" role="tablist" aria-label="Visões do painel social">
        <button type="button" role="tab" aria-selected={activeView === "monthly"} className={activeView === "monthly" ? "active" : ""} onClick={() => setActiveView("monthly")}><BarChart3 size={15} /> Resultado mensal</button>
        <button type="button" role="tab" aria-selected={activeView === "formats"} className={activeView === "formats" ? "active" : ""} onClick={() => setActiveView("formats")}><Instagram size={15} /> Referências por formato</button>
        <button type="button" role="tab" aria-selected={activeView === "history"} className={activeView === "history" ? "active" : ""} onClick={() => setActiveView("history")}><History size={15} /> Histórico e limites</button>
      </div>

      {activeView === "monthly" ? (
        <div className="social-view-panel">
          <div className="social-account-grid">
            {SOCIAL_ACCOUNT_GOALS.map(goal => {
              const actual = activeValues[goal.key];
              const progress = calculateGoalProgress(actual, goal.operational);
              return <article className="social-goal-card" key={goal.key}>
                <header><span>{goal.label}</span><strong>{actual === null ? "—" : formatNumber(actual)}</strong></header>
                <label><span>RESULTADO REAL DO MÊS</span><input inputMode="numeric" value={form[activeMonth][goal.key]} onChange={event => updateField(goal.key, event.target.value)} placeholder="Lançar" aria-label={`${goal.label} em ${activeConfig.fullLabel}`} /></label>
                <div className="social-goal-levels"><span>MIN. <b>{formatNumber(goal.minimum)}</b></span><span>OPERACIONAL <b>{formatNumber(goal.operational)}</b></span><span>SUPERAÇÃO <b>{formatNumber(goal.stretch)}</b></span></div>
                <div className="social-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.barPercentage}><i style={{ width: `${progress.barPercentage}%` }} /></div>
                <footer><span>{levelLabel(actual, goal.minimum, goal.operational, goal.stretch)}</span><b>{progress.percentage === null ? "Sem cálculo" : `${progress.percentage.toFixed(1).replace(".", ",")}% da operacional`}</b></footer>
                <small>Linha de base de agosto: {formatNumber(goal.baseline)}</small>
              </article>;
            })}
          </div>

          <div className="social-detail-grid">
            {renderFormatInputs("Mensagens da Meta · relatório geral", ["metaMessagesSent"])}
            {renderFormatInputs("Reels · mediana do mês", ["reelsPublished", "reelsMedianReach", "reelsMedianViews", "reelsMedianInteractions", "reelsMedianShares", "reelsMedianSaves"])}
            {renderFormatInputs("Carrosséis · mediana do mês", ["carouselsPublished", "carouselsMedianReach", "carouselsMedianViews", "carouselsMedianInteractions", "carouselsMedianShares", "carouselsMedianSaves"])}
            {renderFormatInputs("Stories · alcance e ações", ["storiesPublished", "storiesMedianReach", "storiesMedianViews", "storyReplies", "storyLinkClicks", "storyStickerTaps", "storyProfileVisits"])}
          </div>
          <label className="social-note-field"><span>CONTEXTO DO MÊS</span><textarea value={form[activeMonth].note} onChange={event => updateNote(event.target.value)} placeholder="Registre mudanças de cadência, mídia paga, campanha, conteúdos fora da curva ou fatores que afetaram a leitura." /></label>
        </div>
      ) : null}

      {activeView === "formats" ? (
        <div className="social-view-panel social-format-view">
          {SOCIAL_FORMAT_GOALS.map(format => <section className="social-format-section" key={format.key}>
            <header><div><span>MEDIANA DO MÊS</span><h4>{format.label}</h4></div><p>{format.basis}</p></header>
            <div className="social-reference-table">
              <div className="social-reference-head"><span>Indicador</span><span>Mínimo</span><span>Operacional</span><span>Superação</span><span>Realizado</span><span>Atingimento</span></div>
              {format.metrics.map(metric => {
                const actual = activeValues[metric.field];
                const progress = calculateGoalProgress(actual, metric.operational);
                return <div className="social-reference-row" key={metric.field}><strong>{metric.label}</strong><span>{formatNumber(metric.minimum)}</span><span>{formatNumber(metric.operational)}</span><span>{formatNumber(metric.stretch)}</span><b>{actual === null ? "—" : formatNumber(actual)}</b><div><div className="social-progress"><i style={{ width: `${progress.barPercentage}%` }} /></div><small>{progress.percentage === null ? "Aguardando" : `${progress.percentage.toFixed(0)}%`}</small></div></div>;
              })}
            </div>
            <small>{format.sampleNote}</small>
          </section>)}

          <section className="social-format-section">
            <header><div><span>AÇÕES NORMALIZADAS</span><h4>Stories</h4></div><p>O resultado é calculado a cada 100 Stories publicados, reduzindo a distorção causada por volumes mensais diferentes.</p></header>
            <div className="social-reference-table">
              <div className="social-reference-head"><span>Indicador</span><span>Mínimo</span><span>Operacional</span><span>Superação</span><span>Realizado</span><span>Atingimento</span></div>
              {SOCIAL_STORY_ACTION_GOALS.map(goal => {
                const actual = storyActionActuals[goal.key];
                const progress = calculateGoalProgress(actual, goal.operational);
                return <div className="social-reference-row" key={goal.key}><strong>{goal.label}<small>{goal.basis}</small></strong><span>{formatNumber(goal.minimum)}</span><span>{formatNumber(goal.operational)}</span><span>{formatNumber(goal.stretch)}</span><b>{actual === null ? "—" : formatNumber(actual)}</b><div><div className="social-progress"><i style={{ width: `${progress.barPercentage}%` }} /></div><small>{progress.percentage === null ? "Informe volume e ações" : `${progress.percentage.toFixed(0)}%`}</small></div></div>;
              })}
            </div>
          </section>
        </div>
      ) : null}

      {activeView === "history" ? (
        <div className="social-view-panel social-history-view">
          <div className="social-history-grid">{SOCIAL_HISTORY.map(period => <article key={period.key}><header><span>BASE REAL DE 2026</span><h4>{period.label}</h4><p>{period.context}</p></header><div className="social-history-formats"><div><strong>REELS · N={period.reels.sample}</strong><span>Alcance mediano <b>{formatNumber(period.reels.reach)}</b></span><span>Views medianas <b>{formatNumber(period.reels.views)}</b></span><span>Interações medianas <b>{formatNumber(period.reels.interactions)}</b></span><span>Compart. / salvos <b>{formatNumber(period.reels.shares)} / {formatNumber(period.reels.saves)}</b></span></div><div><strong>CARROSSÉIS · N={period.carousels.sample}</strong><span>Alcance mediano <b>{formatNumber(period.carousels.reach)}</b></span><span>Views medianas <b>{formatNumber(period.carousels.views)}</b></span><span>Interações medianas <b>{formatNumber(period.carousels.interactions)}</b></span><span>Compart. / salvos <b>{formatNumber(period.carousels.shares)} / {formatNumber(period.carousels.saves)}</b></span></div><div><strong>STORIES · N={period.stories.sample}</strong><span>Alcance mediano <b>{formatNumber(period.stories.reach)}</b></span><span>Views medianas <b>{formatNumber(period.stories.views)}</b></span><span>Respostas / cliques <b>{formatNumber(period.stories.replies)} / {formatNumber(period.stories.linkClicks)}</b></span><span>Figurinhas / perfil <b>{formatNumber(period.stories.stickerTaps)} / {formatNumber(period.stories.profileVisits)}</b></span></div></div></article>)}</div>
          <aside className="social-missing-box"><ShieldAlert size={23} /><div><span>SEM LINHA DE BASE · NÃO ESTIMAR</span><h4>O painel não inventa o que a exportação não informa</h4><ul>{SOCIAL_MISSING_BASELINES.map(item => <li key={item}>{item}</li>)}</ul><p>Esses indicadores poderão receber metas somente quando houver exportação comparável ou rastreamento por UTM.</p></div></aside>
        </div>
      ) : null}
    </div>
  );
}
