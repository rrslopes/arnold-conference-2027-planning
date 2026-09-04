import { useMemo, useState } from "react";
import { ArrowUpRight, Ban, CheckCircle2, Layers3, Megaphone, PanelsTopLeft, ShieldCheck } from "lucide-react";
import { paidMediaAssets, type PaidMediaAsset } from "@/data/paidMedia";

type Filter = "todas" | PaidMediaAsset["category"];

const filters: Array<{ id: Filter; label: string }> = [
  { id: "todas", label: "Todas as solicitações" },
  { id: "redimensionamento", label: "Redimensionar posts" },
  { id: "exclusiva", label: "Peças exclusivas" },
];

export default function PaidMediaHub() {
  const [filter, setFilter] = useState<Filter>(() => {
    if (typeof window === "undefined") return "todas";
    const requested = new URLSearchParams(window.location.search).get("paid-media-filter");
    return requested === "redimensionamento" || requested === "exclusiva" ? requested : "todas";
  });
  const visible = useMemo(() => paidMediaAssets.filter(item => filter === "todas" || item.category === filter), [filter]);
  const resized = paidMediaAssets.filter(item => item.category === "redimensionamento").length;
  const exclusive = paidMediaAssets.filter(item => item.category === "exclusiva").length;
  const milestones = new Set(paidMediaAssets.map(item => item.date.split(" · ")[0])).size;

  return (
    <div className="paid-media-hub">
      <div className="paid-media-command">
        <div><Megaphone size={28} /><span>ESCOPO JÁ PREVISTO PARA MÍDIA</span><h3>Somente os packs já solicitados no calendário.</h3><p>Este módulo não cria novas peças. Ele reúne exclusivamente os desdobramentos de mídia paga já previstos para os grandes marcos de 08/09 e 23/09.</p></div>
        <div className="paid-media-stats"><article><strong>{resized}</strong><span>PACKS PREVISTOS</span></article><article><strong>{milestones}</strong><span>MARCOS DO CALENDÁRIO</span></article><article><strong>{exclusive}</strong><span>PEÇAS EXCLUSIVAS APROVADAS</span></article></div>
      </div>

      <div className="paid-media-rules">
        <article><PanelsTopLeft size={21} /><div><strong>Redimensionamento previsto</strong><p>Parte de uma publicação orgânica já aprovada no calendário e segue somente os formatos explicitamente solicitados no marco.</p></div></article>
        <article><Layers3 size={21} /><div><strong>Peça exclusiva</strong><p>Nenhuma peça exclusiva foi aprovada. Novas solicitações só entrarão após análise e validação do cliente.</p></div></article>
        <article><ShieldCheck size={21} /><div><strong>Regra de ativação</strong><p>Produzir pode começar antes; veicular só quando destino, rastreamento, condição comercial e supressões estiverem validados.</p></div></article>
      </div>

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
