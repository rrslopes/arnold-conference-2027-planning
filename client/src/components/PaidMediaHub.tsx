import { useMemo, useState } from "react";
import { ArrowUpRight, Ban, CalendarClock, CheckCircle2, Layers3, Megaphone, PanelsTopLeft, ShieldCheck } from "lucide-react";
import { paidMediaAssets, type PaidMediaAsset } from "@/data/paidMedia";
import { launchWindow } from "@/data/planData";

type Filter = "todas" | PaidMediaAsset["category"];

const filters: Array<{ id: Filter; label: string }> = [
  { id: "todas", label: "Todas as solicitações" },
  { id: "redimensionamento", label: "Redimensionar posts" },
  { id: "exclusiva", label: "Peças exclusivas" },
];

export default function PaidMediaHub() {
  const [month, setMonth] = useState<"Setembro" | "Outubro">("Outubro");
  const [filter, setFilter] = useState<Filter>(() => {
    if (typeof window === "undefined") return "todas";
    const requested = new URLSearchParams(window.location.search).get("paid-media-filter");
    return requested === "redimensionamento" || requested === "exclusiva" ? requested : "todas";
  });
  const monthAssets = useMemo(() => paidMediaAssets.filter(item => month === "Outubro" ? item.id.includes("-oct-") : !item.id.includes("-oct-")), [month]);
  const visible = useMemo(() => monthAssets.filter(item => filter === "todas" || item.category === filter), [filter, monthAssets]);
  const resized = monthAssets.filter(item => item.category === "redimensionamento").length;
  const exclusive = monthAssets.filter(item => item.category === "exclusiva").length;
  const milestones = new Set(monthAssets.map(item => item.date.split(" · ")[0])).size;

  return (
    <div className="paid-media-hub">
      <div className="paid-media-command">
        <div><Megaphone size={28} /><span>ESCOPO JÁ PREVISTO PARA MÍDIA</span><h3>Somente packs derivados de conteúdos previstos.</h3><p>Setembro permanece como histórico. Outubro organiza preparação, anúncio, abertura, prospecção e retargeting sem autorizar nenhuma peça exclusiva nova.</p></div>
        <div className="paid-media-stats"><article><strong>{resized}</strong><span>PACKS PREVISTOS</span></article><article><strong>{milestones}</strong><span>MARCOS DO CALENDÁRIO</span></article><article><strong>{exclusive}</strong><span>PEÇAS EXCLUSIVAS APROVADAS</span></article></div>
      </div>

      <div className="paid-media-rules">
        <article><PanelsTopLeft size={21} /><div><strong>Redimensionamento previsto</strong><p>Parte de uma publicação orgânica já aprovada no calendário e segue somente os formatos explicitamente solicitados no marco.</p></div></article>
        <article><Layers3 size={21} /><div><strong>Peça exclusiva</strong><p>Nenhuma peça exclusiva foi aprovada. Novas solicitações só entrarão após análise e validação do cliente.</p></div></article>
        <article><ShieldCheck size={21} /><div><strong>Regra de ativação</strong><p>Produzir pode começar antes; veicular só quando destino, rastreamento, condição comercial e supressões estiverem validados.</p></div></article>
      </div>

      <section className="launch-window-panel" aria-labelledby="launch-window-title">
        <header><CalendarClock size={23} /><div><span>JANELA COMERCIAL CONFIRMADA</span><h3 id="launch-window-title">30/09 anuncia. 06/10 abre — somente com os gates verdes.</h3><p>As datas estão definidas, mas o anúncio e a abertura continuam condicionados a checkout, links, condições, tracking, UTMs, suporte e regras comerciais validados.</p></div></header>
        <div className="launch-window-grid">
          {launchWindow.map(item => <article key={item.moment}><b>{item.moment}</b><div><strong>{item.title}</strong><small>{item.channels}</small><p>{item.objective}</p><em>{item.gate}</em></div></article>)}
        </div>
      </section>

      <div className="plan-month-tabs" role="tablist" aria-label="Mês do plano de mídia paga"><button type="button" role="tab" aria-selected={month === "Setembro"} className={month === "Setembro" ? "active" : ""} onClick={() => setMonth("Setembro")}>Setembro · histórico</button><button type="button" role="tab" aria-selected={month === "Outubro"} className={month === "Outubro" ? "active" : ""} onClick={() => setMonth("Outubro")}>Outubro · abertura e venda</button></div>

      <div className="paid-media-filters" role="tablist" aria-label="Filtrar solicitações de mídia paga">
        {filters.map(item => <button type="button" role="tab" aria-selected={filter === item.id} className={filter === item.id ? "active" : ""} key={item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}
      </div>

      <div className="paid-media-grid">
        {visible.map(item => (
          <article className={`paid-media-card is-${item.category} status-${item.status}`} key={item.id}>
            <header><div><span>{item.date} · {item.phase}</span><h4>{item.title}</h4></div><b>{item.category === "redimensionamento" ? "REDIMENSIONAR" : "EXCLUSIVA"}</b></header>
            <p className="paid-media-source">{item.source}</p>
            <div className="paid-media-card-body"><small>OBJETIVO</small><p>{item.objective}</p><small>PÚBLICO</small><p>{item.audience}</p></div>
            <div className="paid-media-formats">{item.formats.map(format => <span key={format}>{format}</span>)}</div>
            <div className="paid-media-deliverables"><small>ENTREGAS SOLICITADAS</small>{item.deliverables.map(deliverable => <p key={deliverable}>{deliverable}</p>)}</div>
            <div className="paid-media-cta"><small>CTA</small><strong>{item.cta}</strong>{item.destination ? <a href={item.destination.url} target="_blank" rel="noreferrer">{item.destination.label}<ArrowUpRight size={14} /></a> : <span>URL COMERCIAL PENDENTE</span>}</div>
            <footer>{item.status === "liberada" ? <CheckCircle2 size={17} /> : <Ban size={17} />}<p>{item.gate}</p></footer>
          </article>
        ))}
        {!visible.length ? <div className="paid-media-empty"><Layers3 size={28} /><div><strong>Nenhuma peça exclusiva aprovada</strong><p>Esta área permanecerá vazia até que novas peças sejam analisadas e formalmente validadas pelo cliente.</p></div></div> : null}
      </div>
    </div>
  );
}
