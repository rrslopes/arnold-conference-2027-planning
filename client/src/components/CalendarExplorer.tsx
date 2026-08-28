/**
 * Design philosophy: "Sala de Comando da Campanha" — calendário filtrável,
 * detalhes operacionais e CTAs apresentados no mesmo contexto de decisão.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Filter, Link2, Search, Tag } from "lucide-react";
import { calendar, keywords, phaseSummary } from "@/data/planData";

const phases = ["Todos", "Reativação", "Transição", "Captação", "Pré-venda", "Abertura", "Aceleração"];

export default function CalendarExplorer() {
  const [phase, setPhase] = useState("Todos");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(() => new URLSearchParams(window.location.search).get("story-review") || "0902");

  useEffect(() => {
    if (window.location.hash === "#calendario") {
      requestAnimationFrame(() => {
        const reviewId = new URLSearchParams(window.location.search).get("story-review");
        const target = reviewId ? document.getElementById(`calendar-${reviewId}`) : document.getElementById("calendario");
        target?.scrollIntoView();
      });
    }
  }, []);

  const filtered = useMemo(() => calendar.filter((item) => {
    const matchPhase = phase === "Todos" || item.phase === phase;
    const storyText = (item.storyCards || []).flatMap(card => [card.card, card.format, card.prompt, ...(card.answers || []), card.note || ""]).join(" ");
    const haystack = `${item.date} ${item.title} ${item.idea} ${item.optionLabel || ""} ${(item.options || []).join(" ")} ${storyText} ${item.fallback} ${item.channel} ${item.congresses.join(" ")}`.toLowerCase();
    return matchPhase && haystack.includes(query.toLowerCase());
  }), [phase, query]);

  return (
    <div className="calendar-console">
      <div className="phase-ribbon">
        {phaseSummary.map((item) => (
          <button
            type="button"
            key={item.label}
            className={phase === item.label ? "is-active" : ""}
            aria-pressed={phase === item.label}
            onClick={() => setPhase(current => current === item.label ? "Todos" : item.label)}
          >
            <span>{item.period}</span><strong>{item.label}</strong><p>{item.purpose}</p><small>{item.count}</small>
          </button>
        ))}
      </div>

      <div className="calendar-toolbar">
        <div className="phase-filters"><Filter size={17} />{phases.map((item) => <button type="button" key={item} className={phase === item ? "active" : ""} onClick={() => setPhase(item)}>{item}</button>)}</div>
        <label className="calendar-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tema, congresso ou formato" /></label>
      </div>

      <div className="calendar-body">
        <div className="calendar-list">
          <div className="results-count"><CalendarDays size={17} /><strong>{filtered.length}</strong> pautas encontradas</div>
          {filtered.map((item) => {
            const expanded = open === item.id;
            return (
              <article id={`calendar-${item.id}`} key={item.id} className={`calendar-card phase-${item.phase.toLowerCase().replace("-", "")}`}>
                <button type="button" className="calendar-card-trigger" onClick={() => setOpen(expanded ? null : item.id)} aria-expanded={expanded}>
                  <span className="calendar-date">{item.date}</span>
                  <span className="calendar-main"><small>{item.phase} · {item.channel}</small><strong>{item.title}</strong><em>{item.congresses.join(" · ")}</em>{item.storyCards ? <span className="option-count">{item.storyCards.length} Stories detalhados</span> : item.options ? <span className="option-count">{item.options.length} opções detalhadas</span> : null}</span>
                  {item.keyword ? <span className="keyword-mini"><Tag size={13} /> {item.keyword}</span> : null}
                  <ChevronDown size={19} className={expanded ? "rotate" : ""} />
                </button>
                {expanded ? (
                  <div className="calendar-detail">
                    <div className="detail-main"><span>ORIGEM / MATERIAL</span><p>{item.origin}</p><span>IDEIA ESTRATÉGICA</span><p>{item.idea}</p>
                      {item.storyCards ? <div className="story-sequence"><span className="option-list-title">ROTEIRO EXPLÍCITO DA SEQUÊNCIA</span>{item.storyCards.map((story) => <article className="story-step" key={`${item.id}-${story.card}`}><header><b>{story.card}</b><em>{story.format}</em></header><strong>{story.prompt}</strong>{story.answers ? <div className="story-answers"><span>RESPOSTAS CLICÁVEIS</span>{story.answers.map(answer => <p key={answer}>{answer}</p>)}</div> : null}{story.note ? <small>{story.note}</small> : null}</article>)}</div> : item.options ? <div className="option-list"><span className="option-list-title">{item.optionLabel || "OPÇÕES DE CONTEÚDO"}</span>{item.options.map((option, index) => <p key={option}><b>{String.fromCharCode(65 + index)}</b>{option}</p>)}</div> : null}
                    </div>
                    <div className="detail-side"><div><span>ALTERNATIVA SEGURA</span><p>{item.fallback}</p></div><div className="cta-panel"><span>CHAMADA PARA AÇÃO</span><strong>{item.cta}</strong><p><Link2 size={15} /> {item.destination}</p></div></div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <aside className="keyword-panel">
          <div className="keyword-panel-head"><Tag size={18} /><div><span>ITEM 8.2</span><strong>Palavras-chave e destinos</strong></div></div>
          <p>A automação envia um link fixo. Ela não consulta o cadastro, não segmenta o contato e não promete material inexistente.</p>
          {keywords.map((item) => <div key={item.word} className="keyword-row"><strong>{item.word}</strong><div><span>{item.use}</span><p>{item.destination}</p><small>{item.note}</small></div><ArrowUpRight size={15} /></div>)}
        </aside>
      </div>
    </div>
  );
}
