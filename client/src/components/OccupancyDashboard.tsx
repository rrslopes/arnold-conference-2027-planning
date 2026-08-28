import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CalendarRange, Cloud, CloudOff, RefreshCw, Save, Users } from "lucide-react";
import { toast } from "sonner";
import { congresses } from "@/data/planData";
import { trpc } from "@/lib/trpc";
import { calculateOccupancy, OCCUPANCY_CONGRESSES, SALES_MONTHS, type OccupancyCongressKey } from "@shared/occupancy";

type OccupancyForm = Record<OccupancyCongressKey, {
  capacity: string;
  monthlySales: Record<string, string>;
}>;

function createBlankForm(): OccupancyForm {
  return Object.fromEntries(OCCUPANCY_CONGRESSES.map(congress => [congress.key, {
    capacity: "",
    monthlySales: Object.fromEntries(SALES_MONTHS.map(month => [month.key, ""])),
  }])) as OccupancyForm;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export default function OccupancyDashboard({ actorName }: { actorName: string }) {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const [form, setForm] = useState<OccupancyForm>(() => createBlankForm());
  const [openCongress, setOpenCongress] = useState<OccupancyCongressKey | null>("gestao-academias");

  useEffect(() => {
    if (!planning.data) return;
    const next = createBlankForm();
    planning.data.occupancy.forEach(row => {
      const key = row.congressKey as OccupancyCongressKey;
      if (!next[key]) return;
      next[key].capacity = row.capacity ? String(row.capacity) : "";
    });
    planning.data.monthlySales.forEach(row => {
      const key = row.congressKey as OccupancyCongressKey;
      if (!next[key] || !(row.monthKey in next[key].monthlySales)) return;
      next[key].monthlySales[row.monthKey] = row.sold ? String(row.sold) : "";
    });
    setForm(next);
  }, [planning.data]);

  const saveMutation = trpc.planning.saveOccupancy.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      toast.success("Lotação e vendas mensais sincronizadas com a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar a lotação: ${error.message}`),
  });

  const calculations = useMemo(() => Object.fromEntries(OCCUPANCY_CONGRESSES.map(congress => {
    const row = form[congress.key];
    const monthlySales = Object.fromEntries(SALES_MONTHS.map(month => [month.key, Number(row.monthlySales[month.key] || 0)]));
    return [congress.key, calculateOccupancy(row.capacity ? Number(row.capacity) : null, monthlySales)];
  })), [form]) as Record<OccupancyCongressKey, ReturnType<typeof calculateOccupancy>>;

  const summary = useMemo(() => {
    const values = Object.values(calculations);
    const known = values.filter(value => value.capacity !== null);
    const capacity = known.reduce((total, value) => total + (value.capacity ?? 0), 0);
    const soldWithCapacity = known.reduce((total, value) => total + value.sold, 0);
    return {
      knownCount: known.length,
      totalSold: values.reduce((total, value) => total + value.sold, 0),
      capacity,
      remaining: Math.max(0, capacity - soldWithCapacity),
      percentage: capacity > 0 ? (soldWithCapacity / capacity) * 100 : null,
    };
  }, [calculations]);

  const latest = useMemo(() => [...(planning.data?.occupancy ?? [])].sort((a, b) => b.updatedAt - a.updatedAt)[0], [planning.data]);

  const updateCapacity = (key: OccupancyCongressKey, value: string) => {
    const normalized = digitsOnly(value);
    setForm(current => ({ ...current, [key]: { ...current[key], capacity: normalized } }));
  };

  const updateSales = (key: OccupancyCongressKey, monthKey: string, value: string) => {
    const normalized = digitsOnly(value);
    setForm(current => ({
      ...current,
      [key]: { ...current[key], monthlySales: { ...current[key].monthlySales, [monthKey]: normalized } },
    }));
  };

  const save = () => saveMutation.mutate({
    entries: OCCUPANCY_CONGRESSES.map(congress => ({
      congressKey: congress.key,
      capacity: form[congress.key].capacity ? Number(form[congress.key].capacity) : null,
      monthlySales: SALES_MONTHS.map(month => ({
        monthKey: month.key,
        sold: Number(form[congress.key].monthlySales[month.key] || 0),
      })),
    })),
    actorName: actorName || undefined,
  });

  return (
    <div className="occupancy-console" aria-busy={planning.isLoading || saveMutation.isPending}>
      <div className="occupancy-head">
        <div>
          <span>KPI PRINCIPAL · RESULTADO COMERCIAL</span>
          <h3>Lotação das seis salas</h3>
          <p>Preencha a capacidade quando ela for confirmada. Em cada mês, registre somente as vendas realizadas naquele mês; o painel calcula o acumulado.</p>
          {planning.isError ? <small className="sync-error"><CloudOff size={13} /> Falha de sincronização.</small> : latest ? <small className="sync-meta"><Cloud size={13} /> Atualizado por {latest.updatedByName ?? "usuário da equipe"}, em {new Date(latest.updatedAt).toLocaleString("pt-BR")}</small> : <small className="sync-meta"><Cloud size={13} /> Estrutura compartilhada pronta para o primeiro lançamento.</small>}
        </div>
        <div className="occupancy-actions">
          <button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button>
          <button type="button" className="primary-button" onClick={save} disabled={planning.isLoading || saveMutation.isPending}><Save size={16} /> {saveMutation.isPending ? "Salvando..." : "Salvar lotação"}</button>
        </div>
      </div>

      <div className="occupancy-summary">
        <article><span>VENDAS ACUMULADAS</span><strong>{summary.totalSold.toLocaleString("pt-BR")}</strong><small>Somatório dos oito meses</small></article>
        <article><span>CAPACIDADES INFORMADAS</span><strong>{summary.knownCount}<small>/6</small></strong><small>{summary.knownCount === 6 ? "Todas as salas configuradas" : "Complete quando os dados chegarem"}</small></article>
        <article><span>CAPACIDADE CONHECIDA</span><strong>{summary.capacity ? summary.capacity.toLocaleString("pt-BR") : "—"}</strong><small>Somente salas configuradas</small></article>
        <article><span>VAGAS RESTANTES</span><strong>{summary.capacity ? summary.remaining.toLocaleString("pt-BR") : "—"}</strong><small>Nas capacidades informadas</small></article>
      </div>

      <div className="occupancy-overall">
        <div><span>LOTAÇÃO GERAL DAS SALAS CONFIGURADAS</span><strong>{summary.percentage === null ? "Aguardando capacidade" : `${summary.percentage.toFixed(1).replace(".", ",")}%`}</strong></div>
        <div className="occupancy-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.percentage === null ? 0 : Math.min(100, summary.percentage)}><i style={{ width: `${summary.percentage === null ? 0 : Math.min(100, summary.percentage)}%` }} /></div>
        <p>{summary.percentage === null ? "Os percentuais serão calculados automaticamente assim que a primeira capacidade for informada." : `Cálculo baseado em ${summary.knownCount} ${summary.knownCount === 1 ? "sala configurada" : "salas configuradas"}.`}</p>
      </div>

      <div className="occupancy-grid">
        {OCCUPANCY_CONGRESSES.map(congress => {
          const calculation = calculations[congress.key];
          const accent = congresses.find(item => item.name === congress.name)?.accent ?? "#CBDB2A";
          const expanded = openCongress === congress.key;
          return (
            <article className="occupancy-card" key={congress.key} style={{ "--occupancy-accent": accent } as CSSProperties}>
              <header><div><span>{congress.key === "gestao-academias" ? "GESTÃO" : congress.name.toUpperCase()}</span><h4>{congress.name}</h4></div><Users size={22} /></header>
              <label className="capacity-field"><span>CAPACIDADE DA SALA</span><input inputMode="numeric" value={form[congress.key].capacity} onChange={event => updateCapacity(congress.key, event.target.value)} placeholder="A informar" aria-label={`Capacidade da sala de ${congress.name}`} /></label>
              <div className="occupancy-card-progress">
                <div><span>PROGRESSO DE LOTAÇÃO</span><strong>{calculation.percentage === null ? "Aguardando capacidade" : `${calculation.percentage.toFixed(1).replace(".", ",")}%`}</strong></div>
                <div className="occupancy-progress" role="progressbar" aria-label={`Lotação de ${congress.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={calculation.percentage === null ? 0 : Math.min(100, calculation.percentage)}><i style={{ width: `${calculation.barPercentage}%` }} /></div>
              </div>
              <div className="occupancy-card-numbers">
                <div><span>VENDIDOS</span><strong>{calculation.sold.toLocaleString("pt-BR")}</strong></div>
                <div><span>{calculation.overCapacity > 0 ? "ACIMA DA CAPACIDADE" : "RESTANTES"}</span><strong>{calculation.overCapacity > 0 ? calculation.overCapacity.toLocaleString("pt-BR") : calculation.remaining === null ? "—" : calculation.remaining.toLocaleString("pt-BR")}</strong></div>
              </div>
              <button type="button" className="monthly-toggle" aria-expanded={expanded} onClick={() => setOpenCongress(expanded ? null : congress.key)}><CalendarRange size={16} /> {expanded ? "Fechar lançamentos mensais" : "Lançar vendas mensais"}</button>
              {expanded ? <div className="monthly-sales-grid">{SALES_MONTHS.map(month => <label key={month.key}><span>{month.label}</span><input inputMode="numeric" value={form[congress.key].monthlySales[month.key]} onChange={event => updateSales(congress.key, month.key, event.target.value)} placeholder="0" aria-label={`Vendas de ${congress.name} em ${month.fullLabel}`} /></label>)}</div> : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
