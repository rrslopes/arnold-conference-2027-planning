/**
 * Design philosophy: "Sala de Comando da Campanha" — calendário filtrável,
 * detalhes operacionais e CTAs apresentados no mesmo contexto de decisão.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Filter, Flag, Link2, Megaphone, Search, ShieldCheck, Tag, Video } from "lucide-react";
import { calendar, externalDestinations, getCongressDisplayName, keywords, phaseSummary } from "@/data/planData";

type PlanMonth = "Setembro" | "Outubro";

const monthPhases: Record<PlanMonth, string[]> = {
  Setembro: ["Todos", "Reativação", "Transição", "Captação", "Aquecimento"],
  Outubro: ["Todos", "Intensificação", "Abertura", "Venda contínua"],
};

function getPlanMonth(id: string): PlanMonth {
  return Number(id.slice(0, 4)) >= 928 ? "Outubro" : "Setembro";
}

function getInitialMonth(): PlanMonth {
  if (typeof window === "undefined") return "Outubro";
  const requestedMonth = new URLSearchParams(window.location.search).get("calendar-month");
  if (requestedMonth === "setembro") return "Setembro";
  if (requestedMonth === "outubro") return "Outubro";
  const reviewId = new URLSearchParams(window.location.search).get("story-review");
  const hashId = window.location.hash.startsWith("#calendar-") ? window.location.hash.replace("#calendar-", "") : null;
  const requestedId = reviewId ?? hashId;
  return requestedId ? getPlanMonth(requestedId) : "Outubro";
}

function getDestinationUrl(destination: string, explicitUrl?: string) {
  if (explicitUrl) return explicitUrl;
  if (destination.toLowerCase().includes("masterclass")) return externalDestinations.masterclasses;
  if (destination.toLowerCase().includes("landing page geral")) return externalDestinations.news;
  return undefined;
}

function getSourceUrl(unit: { source?: string; sourceUrl?: string }) {
  return unit.sourceUrl;
}

export default function CalendarExplorer() {
  const [month, setMonth] = useState<PlanMonth>(() => getInitialMonth());
  const [phase, setPhase] = useState("Todos");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(() => new URLSearchParams(window.location.search).get("story-review") || (getInitialMonth() === "Outubro" ? "0928" : "0902"));

  useEffect(() => {
    const reviewId = new URLSearchParams(window.location.search).get("story-review");
    const directCardId = window.location.hash.startsWith("#calendar-") ? window.location.hash.slice(1) : null;
    if (window.location.hash !== "#calendario" && !directCardId) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = directCardId
          ? document.getElementById(directCardId)
          : reviewId
            ? document.getElementById(`calendar-${reviewId}`)
            : document.getElementById("calendario");
        target?.scrollIntoView();
      });
    });
  }, []);

  const phases = monthPhases[month];
  const visiblePhaseSummary = phaseSummary.filter(item => month === "Setembro"
    ? ["Reativação", "Transição", "Captação", "Aquecimento"].includes(item.label)
    : ["Intensificação", "Abertura", "Venda contínua"].includes(item.label));

  const filtered = useMemo(() => calendar.filter((item) => {
    const matchMonth = getPlanMonth(item.id) === month;
    const matchPhase = phase === "Todos" || item.phase === phase;
    const storyText = (item.storyCards || []).flatMap(card => [card.card, card.format, card.prompt, ...(card.answers || []), card.note || ""]).join(" ");
    const briefText = item.productionBrief ? [item.productionBrief.format, item.productionBrief.purpose, item.productionBrief.note, ...item.productionBrief.units.flatMap(unit => [unit.unit, unit.role, unit.content, unit.source || ""])].join(" ") : "";
    const cutText = (item.cutValidations || []).flatMap(cut => [cut.id, cut.speaker, cut.sourceTitle, cut.sourceUrl || "", cut.transcriptStatus, cut.excerpt, cut.location, cut.productionNote, cut.videoStatus]).join(" ");
    const milestoneText = item.milestone ? `${item.milestone.label} ${item.milestone.description} ${item.milestone.paidMediaPack.label} ${item.milestone.paidMediaPack.requirement}` : "";
    const haystack = `${item.date} ${item.title} ${item.idea} ${item.optionLabel || ""} ${(item.options || []).join(" ")} ${storyText} ${briefText} ${cutText} ${milestoneText} ${item.fallback} ${item.channel} ${item.congresses.join(" ")}`.toLowerCase();
    return matchMonth && matchPhase && haystack.includes(query.toLowerCase());
  }), [month, phase, query]);

  return (
    <div className="calendar-console">
      <div className="plan-month-tabs" role="tablist" aria-label="Mês do calendário editorial">
        {(["Setembro", "Outubro"] as PlanMonth[]).map(item => <button type="button" role="tab" aria-selected={month === item} className={month === item ? "active" : ""} key={item} onClick={() => { setMonth(item); setPhase("Todos"); setOpen(item === "Outubro" ? "0928" : "0902"); }}>{item}{item === "Setembro" ? " · histórico e produção" : " · abertura e venda"}</button>)}
      </div>
      <div className="phase-ribbon">
        {visiblePhaseSummary.map((item) => (
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

      <div className="external-operation-note"><CalendarDays size={19} /><div><span>PLANEJAMENTO ESTRATÉGICO</span><strong>A operação diária será organizada na planilha compartilhada com as agências</strong><p>Aqui permanecem pauta, formato, CTA, briefing, marcos e alternativas. Inserções extras de feed, legendas, links de arte e aprovações devem ser controlados na planilha operacional.</p></div></div>

      <div className="calendar-toolbar">
        <div className="phase-filters"><Filter size={17} />{phases.map((item) => <button type="button" key={item} className={phase === item ? "active" : ""} onClick={() => setPhase(item)}>{item}</button>)}</div>
        <label className="calendar-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tema, congresso ou formato" /></label>
      </div>

      <div className="calendar-body">
        <div className="calendar-list">
          <div className="results-count"><CalendarDays size={17} /><strong>{filtered.length}</strong> pautas encontradas</div>
          {filtered.map((item) => {
            const expanded = open === item.id;
            const materialLinks = item.originUrl
              ? [{ label: item.originLinkLabel || "Abrir material de referência", url: item.originUrl, kind: "video" as const }, ...(item.materialLinks || [])]
              : item.materialLinks || [];
            return (
              <article id={`calendar-${item.id}`} key={item.id} className={`calendar-card phase-${item.phase.toLowerCase().replace("-", "")} ${item.milestone ? `is-milestone milestone-${item.milestone.tone}` : ""}`}>
                <button type="button" className="calendar-card-trigger" onClick={() => setOpen(expanded ? null : item.id)} aria-expanded={expanded}>
                  <span className="calendar-date">{item.date}</span>
                  <span className="calendar-main"><small>{item.phase} · {item.channel}</small><strong>{item.title}</strong><em>{item.congresses.map(getCongressDisplayName).join(" · ")}</em>{item.milestone ? <span className="milestone-badges"><b><Flag size={12} /> {item.milestone.tone === "lead" ? "Captação prioritária" : "Grande marco"}</b><b><Megaphone size={12} /> Mídia paga</b></span> : null}{item.storyCards ? <span className="option-count">{item.storyCards.length} Stories detalhados</span> : item.productionBrief ? <span className="option-count">{item.productionBrief.units.length} unidades detalhadas</span> : item.options ? <span className="option-count">{item.options.length} opções detalhadas</span> : null}{item.cutValidations ? <span className="cut-count"><ShieldCheck size={12} /> {item.cutValidations.length} {item.cutValidations.length === 1 ? "evidência de corte" : "evidências de corte"}</span> : null}</span>
                  <span className="calendar-card-flags">{item.keyword ? <span className="keyword-mini"><Tag size={13} /> {item.keyword}</span> : null}</span>
                  <ChevronDown size={19} className={expanded ? "rotate" : ""} />
                </button>
                {expanded ? (
                  <div className="calendar-detail">
                    <div className="detail-main"><span>ORIGEM / MATERIAL</span><p>{item.origin}</p>{materialLinks.length ? <div className="calendar-origin-links">{materialLinks.map(link => <a className="calendar-origin-link" href={link.url} target="_blank" rel="noreferrer" key={`${item.id}-${link.url}-${link.label}`}>{link.kind === "video" ? <Video size={15} /> : <Link2 size={15} />} {link.label}<ArrowUpRight size={13} /></a>)}</div> : null}<span>IDEIA ESTRATÉGICA</span><p>{item.idea}</p>
                      {item.milestone ? <div className={`milestone-operation milestone-operation-${item.milestone.tone}`}><header><Flag size={18} /><div><span>{item.milestone.tone === "lead" ? "CAPTAÇÃO PRIORITÁRIA" : "GRANDE MARCO DA CAMPANHA"}</span><strong>{item.milestone.label}</strong><p>{item.milestone.description}</p></div></header><div className="paid-media-alert"><Megaphone size={18} /><div><span>{item.milestone.paidMediaPack.label}</span><p>{item.milestone.paidMediaPack.requirement}</p></div></div></div> : null}
                      {item.productionBrief ? <div className="production-sequence"><div className="production-sequence-head"><span className="option-list-title">BRIEFING OPERACIONAL DA PEÇA</span><strong>{item.productionBrief.format}</strong><p>{item.productionBrief.purpose}</p></div><div className="production-step-grid">{item.productionBrief.units.map(unit => <article className="production-step" key={`${item.id}-${unit.unit}-${unit.role}`}><header><b>{unit.unit}</b><em>{unit.role}</em></header><strong>{unit.content}</strong>{unit.source ? <small><span>FONTE</span>{getSourceUrl(unit) ? <a href={getSourceUrl(unit)} target="_blank" rel="noreferrer">{unit.source}<ArrowUpRight size={10} /></a> : unit.source}</small> : null}</article>)}</div><p className="production-note"><b>LIMITE DO BRIEFING</b>{item.productionBrief.note}</p></div> : null}
                      {item.cutValidations ? <div className="cut-validation"><div className="cut-validation-head"><ShieldCheck size={18} /><div><span>EVIDÊNCIA DOS CORTES</span><strong>Localizado na transcrição não significa corte aprovado</strong><p>Trecho, síntese e minutagem servem para busca. Antes de editar, a equipe ainda precisa abrir a íntegra e conferir áudio, imagem, literalidade, começo, fim e legenda.</p></div></div><div className="cut-validation-grid">{item.cutValidations.map(cut => <article key={`${item.id}-${cut.id}`} className={cut.transcriptStatus.includes("reformulado") ? "is-reformulated" : ""}><header><b>{cut.id}</b><span>{cut.transcriptStatus}</span></header><h4>{cut.speaker}</h4><div className="cut-source"><div><span>ÍNTEGRA 2026</span><strong>{cut.sourceTitle}</strong></div>{cut.sourceUrl ? <a href={cut.sourceUrl} target="_blank" rel="noreferrer">Abrir íntegra <ArrowUpRight size={12} /></a> : null}</div><blockquote>{cut.excerpt}</blockquote><p><strong>MINUTAGEM</strong>{cut.location}</p><p><strong>USO SEGURO</strong>{cut.productionNote}</p><small><Video size={13} /> {cut.videoStatus}</small></article>)}</div></div> : null}
                      {item.storyCards ? <div className="story-sequence"><span className="option-list-title">ROTEIRO EXPLÍCITO DA SEQUÊNCIA</span>{item.storyCards.map((story) => <article className="story-step" key={`${item.id}-${story.card}`}><header><b>{story.card}</b><em>{story.format}</em></header><strong>{story.prompt}</strong>{story.answers ? <div className="story-answers"><span>RESPOSTAS CLICÁVEIS</span>{story.answers.map(answer => <p key={answer}>{answer}</p>)}</div> : null}{story.note ? <small>{story.note}</small> : null}</article>)}</div> : null}
                      {item.options ? <div className={`option-list option-${item.optionMode || "alternatives"}`}><span className="option-list-title">{item.optionLabel || "OPÇÕES DE CONTEÚDO"}</span><p className="option-mode-note">{item.optionMode === "inputs" ? "Estas referências alimentam a sequência principal acima; não são opções excludentes nem respostas de enquete." : "Escolher apenas uma alternativa. O briefing acima desenvolve a recomendação principal ou a estrutura comum."}</p>{item.options.map((option, index) => <p key={option}><b>{String.fromCharCode(65 + index)}</b>{option}</p>)}</div> : null}
                    </div>
                    <div className="detail-side"><div><span>ALTERNATIVA SEGURA</span><p>{item.fallback}</p></div><div className="cta-panel"><span>CHAMADA PARA AÇÃO</span><strong>{item.cta}</strong>{getDestinationUrl(item.destination, item.destinationUrl) ? <a href={getDestinationUrl(item.destination, item.destinationUrl)} target="_blank" rel="noreferrer"><Link2 size={15} /> {item.destination}<ArrowUpRight size={14} /></a> : <p><Link2 size={15} /> {item.destination}</p>}</div></div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <aside className="keyword-panel">
          <div className="keyword-panel-head"><Tag size={18} /><div><span>ITEM 8.2</span><strong>Palavras-chave e destinos</strong></div></div>
          <p>A automação envia um link fixo. Ela não consulta o cadastro, não segmenta o contato e não promete material inexistente.</p>
          {keywords.map((item) => <div key={item.word} className={`keyword-row ${item.url ? "has-link" : "is-pending"}`}><strong>{item.word}</strong><div><span>{item.use}</span><p>{item.destination}</p><small>{item.note}</small></div>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Abrir destino de ${item.word}`}><ArrowUpRight size={15} /></a> : <span className="destination-pending">PENDENTE</span>}</div>)}
        </aside>
      </div>
    </div>
  );
}
