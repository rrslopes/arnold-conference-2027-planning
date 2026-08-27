/**
 * Design philosophy: "Sala de Comando da Campanha" — as seis iscas aparecem
 * como entregas estratégicas conectadas, não como uma coleção genérica de downloads.
 */
import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, FileWarning, PackageOpen, X } from "lucide-react";
import { brandAssets, leadMagnets, type LeadMagnet } from "@/data/planData";

const statusMeta = {
  pronto: { label: "Ativo disponível", icon: CheckCircle2 },
  planejado: { label: "Produção planejada", icon: Clock3 },
  dependente: { label: "Depende de materiais", icon: FileWarning },
};

export default function LeadMagnetExplorer() {
  const [selected, setSelected] = useState<LeadMagnet | null>(leadMagnets[0]);

  return (
    <div className="lead-magnet-layout">
      <div className="lead-magnet-visual">
        <img src={brandAssets.leadMagnets} alt="Representação abstrata das seis iscas digitais" />
        <div className="lead-magnet-counter"><strong>06</strong><span>ENTREGAS<br />CONTRATADAS</span></div>
      </div>
      <div className="magnet-list">
        {leadMagnets.map((item) => {
          const meta = statusMeta[item.status];
          const Icon = meta.icon;
          return (
            <button type="button" key={item.id} className={selected?.id === item.id ? "selected" : ""} onClick={() => setSelected(item)}>
              <span className="magnet-id">{String(item.id).padStart(2, "0")}</span>
              <span className="magnet-copy"><small>{item.period} · {item.coverage}</small><strong>{item.title}</strong><em><Icon size={14} /> {meta.label}</em></span>
              <ArrowRight size={18} />
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="magnet-detail" key={selected.id}>
          <div className="magnet-detail-head">
            <div><p className="eyebrow">ISCA {String(selected.id).padStart(2, "0")} · {selected.period}</p><h3>{selected.title}</h3><p>{selected.summary}</p></div>
            <button type="button" aria-label="Fechar detalhe" onClick={() => setSelected(null)}><X size={20} /></button>
          </div>
          <div className="detail-stripe"><PackageOpen size={18} /><strong>{selected.format}</strong></div>
          {selected.masterclasses ? (
            <div className="masterclass-grid">
              {selected.masterclasses.map((lesson) => (
                <article key={lesson.speaker}><span>{lesson.relation}</span><h4>{lesson.speaker}</h4><strong>{lesson.theme}</strong><p>{lesson.problem}</p></article>
              ))}
            </div>
          ) : null}
          <div className="detail-columns">
            <div><h4>Conteúdo e entrega</h4><ul>{selected.content.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h4>Materiais necessários</h4><ul>{selected.materials.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h4>Como produzir</h4><ol>{selected.production.map((item) => <li key={item}>{item}</li>)}</ol></div>
          </div>
          <div className="magnet-rule"><div><span>CTA PRINCIPAL</span><strong>{selected.cta}</strong></div><p><FileWarning size={17} /> {selected.limit}</p></div>
        </div>
      ) : null}
    </div>
  );
}
