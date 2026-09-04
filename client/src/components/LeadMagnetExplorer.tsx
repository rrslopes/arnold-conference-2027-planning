/**
 * Design philosophy: "Sala de Comando da Campanha" — as seis iscas aparecem
 * como entregas estratégicas conectadas, não como uma coleção genérica de downloads.
 */
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock3, FileWarning, PackageOpen, X } from "lucide-react";
import { brandAssets, leadMagnets, type LeadMagnet } from "@/data/planData";

const statusMeta = {
  pronto: { label: "Ativo disponível", icon: CheckCircle2 },
  planejado: { label: "Produção planejada", icon: Clock3 },
  dependente: { label: "Depende de materiais", icon: FileWarning },
};

export default function LeadMagnetExplorer() {
  const [selected, setSelected] = useState<LeadMagnet | null>(() => {
    if (typeof window === "undefined") return leadMagnets[0];
    const reviewId = Number(new URLSearchParams(window.location.search).get("isca-review"));
    return leadMagnets.find(item => item.id === reviewId) ?? leadMagnets[0];
  });

  useEffect(() => {
    if (!selected || typeof window === "undefined") return;
    const reviewId = Number(new URLSearchParams(window.location.search).get("isca-review"));
    if (reviewId !== selected.id) return;
    window.requestAnimationFrame(() => document.getElementById(`isca-${selected.id}`)?.scrollIntoView({ block: "start" }));
  }, [selected]);

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
        <div className="magnet-detail" id={`isca-${selected.id}`} key={selected.id}>
          <div className="magnet-detail-head">
            <div><p className="eyebrow">ISCA {String(selected.id).padStart(2, "0")} · {selected.period}</p><h3>{selected.title}</h3><p>{selected.summary}</p></div>
            <button type="button" aria-label="Fechar detalhe" onClick={() => setSelected(null)}><X size={20} /></button>
          </div>
          {selected.campaignTitle ? (
            <div className="campaign-positioning">
              <span>TÍTULO DE CAMPANHA</span>
              <h4>{selected.campaignTitle}</h4>
              {selected.campaignSubtitle ? <p>{selected.campaignSubtitle}</p> : null}
            </div>
          ) : null}
          <div className="detail-stripe"><PackageOpen size={18} /><strong>{selected.format}</strong></div>
          {selected.masterclasses ? (
            <div className="masterclass-grid">
              {selected.masterclasses.map((lesson) => (
                <article key={lesson.speaker}>
                  <span>{lesson.relation}</span>
                  <p className="masterclass-speaker">{lesson.speaker}</p>
                  <h4>{lesson.officialTitle}</h4>
                  {lesson.editorialSubtitle ? <strong>{lesson.editorialSubtitle}</strong> : null}
                  <p className="masterclass-theme">{lesson.theme}</p>
                  <p className="masterclass-problem"><b>Questão central</b>{lesson.problem}</p>
                </article>
              ))}
            </div>
          ) : null}
          {selected.questions ? (
            <section className="magnet-deep-dive diagnostic-blueprint">
              <div className="magnet-section-intro">
                <span>COMO VAI FUNCIONAR</span>
                <h4>10 perguntas que qualificam sem mostrar o peso do score</h4>
                <p>Cada resposta alimenta uma matriz interna por afinidade. A plataforma explica o critério observado, mas os pesos e a regra de desempate ficam no documento operacional.</p>
              </div>
              <div className="diagnostic-question-grid">
                {selected.questions.map((question, index) => (
                  <article className="diagnostic-question" key={question.prompt}>
                    <div className="question-number">{String(index + 1).padStart(2, "0")}</div>
                    <div>
                      <h5>{question.prompt}</h5>
                      <p><b>Critério de qualificação</b>{question.criterion}</p>
                      <div className="answer-chips">{question.answerExamples.map(answer => <span key={answer}>{answer}</span>)}</div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {selected.resultDelivery ? (
            <section className="magnet-deep-dive result-blueprint">
              <div className="magnet-section-intro">
                <span>ENTREGA DO RESULTADO</span>
                <h4>O participante entende o porquê da recomendação</h4>
                <p>O resultado não exibe nota numérica. Ele transforma as respostas em orientação clara, congresso principal, caminhos complementares e próximo passo.</p>
              </div>
              <div className="result-delivery-grid">
                {selected.resultDelivery.map((result, index) => (
                  <article key={result.title}><span>{String(index + 1).padStart(2, "0")}</span><h5>{result.title}</h5><p>{result.detail}</p></article>
                ))}
              </div>
            </section>
          ) : null}
          {selected.sourceRanking ? (
            <section className="magnet-deep-dive source-blueprint">
              <div className="magnet-section-intro">
                <span>RANKING QUE ORIENTA A PRODUÇÃO</span>
                <h4>Fontes prioritárias e papel de cada íntegra</h4>
                <p>A posição organiza a ordem de extração editorial. O conteúdo de vídeos ainda não transcritos permanece como hipótese até a conferência da íntegra.</p>
              </div>
              <div className="source-ranking">
                {selected.sourceRanking.map(source => (
                  <article key={`${source.rank}-${source.source}`}>
                    <strong>{String(source.rank).padStart(2, "0")}</strong>
                    <div><h5>{source.source}</h5><p>{source.use}</p></div>
                    <span data-status={source.status}>{source.status}</span>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {selected.contentBlocks ? (
            <section className="magnet-deep-dive content-blueprint">
              <div className="magnet-section-intro">
                <span>PAUTA DE PRODUÇÃO</span>
                <h4>O que o material precisa entregar, bloco por bloco</h4>
              </div>
              <div className="content-block-grid">
                {selected.contentBlocks.map((block, index) => (
                  <article key={block.title}>
                    <span>MÓDULO {String(index + 1).padStart(2, "0")}</span>
                    <h5>{block.title}</h5>
                    <p><b>Ferramenta ou saída</b>{block.outcome}</p>
                    <small>Fonte: {block.source}</small>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          <div className="detail-columns">
            <div><h4>Conteúdo e entrega</h4><ul>{selected.content.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h4>Materiais necessários</h4><ul>{selected.materials.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h4>Como produzir</h4><ol>{selected.production.map((item) => <li key={item}>{item}</li>)}</ol></div>
          </div>
          <div className="magnet-rule"><div><span>CTA PRINCIPAL</span><strong>{selected.cta}</strong>{selected.destination ? <a href={selected.destination.url} target="_blank" rel="noreferrer">{selected.destination.label}<ArrowUpRight size={15} /></a> : <small>Destino ainda não definido para esta entrega.</small>}</div><p><FileWarning size={17} /> {selected.limit}</p></div>
        </div>
      ) : null}
    </div>
  );
}
