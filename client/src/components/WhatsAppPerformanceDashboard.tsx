import { useEffect, useMemo, useState } from "react";
import { Cloud, CloudOff, MessageCircleMore, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { WHATSAPP_MONTHS, WHATSAPP_RESULT_FIELDS, type WhatsAppResultField } from "@shared/whatsappPerformance";

type MonthForm = Record<WhatsAppResultField, string> & { note: string };
type FormState = Record<(typeof WHATSAPP_MONTHS)[number]["key"], MonthForm>;

const fieldLabels: Record<WhatsAppResultField, { label: string; helper: string }> = {
  delivered: { label: "Mensagens entregues", helper: "Plataforma oficial de disparo" },
  linkClicks: { label: "Cliques nos links", helper: "Links rastreados" },
  replies: { label: "Respostas recebidas", helper: "Respostas à campanha" },
  optOuts: { label: "Pedidos de saída", helper: "Solicitações de interrupção" },
  attributedPurchases: { label: "Compras atribuídas", helper: "Somente com rastreamento" },
  humanHandoffs: { label: "Atendimentos iniciados", helper: "Conversas assumidas pela equipe" },
};

function blankMonth(): MonthForm {
  return { ...Object.fromEntries(WHATSAPP_RESULT_FIELDS.map(field => [field, ""])), note: "" } as MonthForm;
}

function blankForm(): FormState {
  return Object.fromEntries(WHATSAPP_MONTHS.map(month => [month.key, blankMonth()])) as FormState;
}

function parseCount(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export default function WhatsAppPerformanceDashboard() {
  const utils = trpc.useUtils();
  const planning = trpc.planning.getState.useQuery(undefined, { refetchOnWindowFocus: true, retry: 1 });
  const [monthKey, setMonthKey] = useState<(typeof WHATSAPP_MONTHS)[number]["key"]>("2026-09");
  const [form, setForm] = useState<FormState>(() => blankForm());

  useEffect(() => {
    if (!planning.data) return;
    const next = blankForm();
    planning.data.whatsappResults.forEach(row => {
      if (!(row.monthKey in next)) return;
      const key = row.monthKey as keyof FormState;
      WHATSAPP_RESULT_FIELDS.forEach(field => { next[key][field] = row[field] === null ? "" : String(row[field]); });
      next[key].note = row.note;
    });
    setForm(next);
  }, [planning.data]);

  const active = form[monthKey];
  const latest = useMemo(() => [...(planning.data?.whatsappResults ?? [])].sort((a, b) => b.monthKey.localeCompare(a.monthKey))[0], [planning.data?.whatsappResults]);
  const saveMutation = trpc.planning.saveWhatsAppResults.useMutation({
    onSuccess: async () => {
      await utils.planning.getState.invalidate();
      toast.success("Resultados de WhatsApp sincronizados com a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar os resultados: ${error.message}`),
  });

  const update = (field: WhatsAppResultField, value: string) => setForm(current => ({
    ...current,
    [monthKey]: { ...current[monthKey], [field]: value.replace(/\D/g, "").slice(0, 9) },
  }));

  const save = () => saveMutation.mutate({
    entries: WHATSAPP_MONTHS.map(month => ({
      monthKey: month.key,
      ...Object.fromEntries(WHATSAPP_RESULT_FIELDS.map(field => [field, parseCount(form[month.key][field])])),
      note: form[month.key].note,
    })) as Parameters<typeof saveMutation.mutate>[0]["entries"],
  });

  return <div className="whatsapp-performance-console" aria-busy={planning.isLoading || saveMutation.isPending}>
    <header><div><MessageCircleMore size={24} /><span>RESULTADOS MENSAIS · FONTE DO KPI</span><h3>Performance de WhatsApp</h3><p>Preencha uma vez nesta área. O funil consolida automaticamente o mês mais recente com dados.</p>{planning.isError ? <small className="sync-error"><CloudOff size={13} /> Falha de sincronização.</small> : latest ? <small><Cloud size={13} /> Atualizado em {new Date(latest.updatedAt).toLocaleString("pt-BR")}</small> : <small><Cloud size={13} /> Aguardando primeiro fechamento.</small>}</div><button type="button" className="secondary-button" onClick={() => planning.refetch()} disabled={planning.isFetching}><RefreshCw size={16} className={planning.isFetching ? "spin" : ""} /> Atualizar</button></header>
    <div className="whatsapp-month-tabs" role="tablist">{WHATSAPP_MONTHS.map(month => <button type="button" role="tab" aria-selected={monthKey === month.key} className={monthKey === month.key ? "active" : ""} key={month.key} onClick={() => setMonthKey(month.key)}>{month.label}</button>)}</div>
    <div className="whatsapp-performance-fields">{WHATSAPP_RESULT_FIELDS.map(field => <label key={field}><span>{fieldLabels[field].label}</span><input inputMode="numeric" value={active[field]} onChange={event => update(field, event.target.value)} placeholder="—" /><small>{fieldLabels[field].helper}</small></label>)}</div>
    <label className="whatsapp-performance-note"><span>Contexto do mês</span><textarea value={active.note} onChange={event => setForm(current => ({ ...current, [monthKey]: { ...current[monthKey], note: event.target.value.slice(0, 2000) } }))} placeholder="Segmento, disparo, origem do relatório ou ressalva de atribuição" /></label>
    <footer><p>Não estime compras, cliques ou respostas sem relatório compatível.</p><button type="button" className="primary-button" onClick={save} disabled={saveMutation.isPending}>{saveMutation.isPending ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}{saveMutation.isPending ? "Salvando..." : "Salvar fechamento"}</button></footer>
  </div>;
}
