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
  const [filter, setFilter] = useState<Filter>("todas");
  const visible = useMemo(() => paidMediaAssets.filter(item => filter === "todas" || item.category === filter), [filter]);
  const resized = paidMediaAssets.filter(item => item.category === "redimensionamento").length;
  const exclusive = paidMediaAssets.filter(item => item.category === "exclusiva").length;
  const available = paidMediaAssets.filter(item => item.status === "liberada").length;

  return (
    <div className="paid-media-hub">
      <div className="paid-media-command">
        <div><Megaphone size={28} /><span>ESCOPO DE PRODUÇÃO PARA MÍDIA</span><h3>Orgânico alimenta a mídia.<br />Mídia também pede peças próprias.</h3><p>Este módulo não controla aprovação nem tráfego. Ele especifica o que precisa ser redimensionado e o que deve ser produzido exclusivamente para campanhas pagas.</p></div>
        <div className="paid-media-stats"><article><strong>{resized}</strong><span>REDIMENSIONAMENTOS</span></article><article><strong>{exclusive}</strong><span>PEÇAS EXCLUSIVAS</span></article><article><strong>{available}</strong><span>LIBERADAS AGORA</span></article></div>
      </div>

      <div className="paid-media-rules">
        <article><PanelsTopLeft size={21} /><div><strong>Redimensionamento</strong><p>Parte de uma publicação orgânica já prevista e adapta mensagem, enquadramento e duração aos formatos da campanha.</p></div></article>
        <article><Layers3 size={21} /><div><strong>Peça exclusiva</strong><p>Nasce para segmentação, retargeting ou teste de variação e não precisa ser publicada no feed.</p></div></article>
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
      </div>
    </div>
  );
}
