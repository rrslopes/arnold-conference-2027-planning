import { useState } from "react";
import { Archive, CalendarDays, CheckCircle2, CircleAlert, FileVideo2, ListChecks, Radar, UserRoundCheck, UsersRound } from "lucide-react";
import {
  audienceAttractionAxes,
  conferencePrograms2027,
  nutritionAesthetic2026Priorities,
  speakerContentRequests,
} from "@/data/editorialIntelligence";

type View = "programas" | "eixos" | "materia-prima";

export default function EditorialIntelligence() {
  const reviewView = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("intelligence-review");
  const initialView: View = reviewView === "eixos" || reviewView === "materia-prima" ? reviewView : "programas";
  const [view, setView] = useState<View>(initialView);
  const [programId, setProgramId] = useState("nutricao-estetica");
  const selectedProgram = conferencePrograms2027.find(item => item.id === programId) ?? conferencePrograms2027[0];

  return (
    <div className="intelligence-hub">
      <div className="intelligence-tabs" role="tablist" aria-label="Visões da inteligência editorial">
        <button type="button" className={view === "programas" ? "active" : ""} onClick={() => setView("programas")}><CalendarDays size={17} /> Programações</button>
        <button type="button" className={view === "eixos" ? "active" : ""} onClick={() => setView("eixos")}><Radar size={17} /> Eixos de atração</button>
        <button type="button" className={view === "materia-prima" ? "active" : ""} onClick={() => setView("materia-prima")}><ListChecks size={17} /> Matéria-prima</button>
      </div>

      {view === "programas" ? (
        <div className="program-view">
          <div className="program-selector" aria-label="Selecionar congresso">
            {conferencePrograms2027.map(item => (
              <button type="button" className={item.id === selectedProgram.id ? "active" : ""} key={item.id} onClick={() => setProgramId(item.id)}>
                <span className={`program-dot ${item.status}`} />
                <strong>{item.congress}</strong>
                <small>{item.status === "recebida" ? `${item.sessions.length} sessões` : "2027 pendente"}</small>
              </button>
            ))}
          </div>

          <div className="program-detail" key={selectedProgram.id}>
            <div className="program-detail-head">
              <div><span className={`program-status ${selectedProgram.status}`}>{selectedProgram.statusLabel}</span><h3>{selectedProgram.congress}</h3></div>
              <div className="program-meta"><span>{selectedProgram.date ?? "Data a confirmar"}</span><span>{selectedProgram.room ?? "Sala a confirmar"}</span></div>
            </div>
            <div className="program-source"><FileVideo2 size={17} /><div><strong>FONTE ATUAL</strong><p>{selectedProgram.source}</p></div></div>
            {selectedProgram.coordination ? <div className="program-coordination"><UserRoundCheck size={19} /><div><strong>{selectedProgram.coordination.statusLabel}</strong><h4>{selectedProgram.coordination.names.join(" · ")}</h4><p>{selectedProgram.coordination.source}</p></div></div> : null}
            {selectedProgram.sessions.length ? (
              <div className="program-sessions">
                {selectedProgram.sessions.map(session => (
                  <article key={`${session.time}-${session.title}`}><time>{session.time}</time><div><strong>{session.speakers}</strong><p>{session.title}</p></div></article>
                ))}
              </div>
            ) : (
              <div className="program-empty"><CircleAlert size={28} /><div><strong>Não preencher com a grade de 2026</strong><p>O histórico serve para pesquisa e conteúdo, mas a programação publicada aqui deve refletir somente informações recebidas para 2027.</p></div></div>
            )}
            <p className="program-note"><CheckCircle2 size={16} /> {selectedProgram.note}</p>
          </div>
        </div>
      ) : null}

      {view === "eixos" ? (
        <div className="axes-view">
          <div className="intelligence-rule"><UsersRound size={23} /><p><strong>O público nasce da programação.</strong> Estes eixos já podem orientar segmentação, perguntas e distribuição. A profundidade técnica depende de ementas, referências e falas validadas.</p></div>
          <div className="axes-grid">
            {audienceAttractionAxes.map((axis, index) => (
              <article key={axis.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{axis.title}</h3><small>TENSÃO DE ATRAÇÃO</small><p>{axis.tension}</p><small>PÚBLICO A MOBILIZAR</small><p>{axis.audience}</p><em>{axis.sessions}</em></article>
            ))}
          </div>
        </div>
      ) : null}

      {view === "materia-prima" ? (
        <div className="materials-view">
          <div className="speaker-request-panel">
            <div className="material-column-head"><ListChecks size={24} /><div><span>SOLICITAR AOS PALESTRANTES</span><h3>Um pacote mínimo para produzir sem adivinhar</h3></div></div>
            <div className="speaker-request-list">
              {speakerContentRequests.map((request, index) => <article key={request.stage}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{request.stage}</small><strong>{request.item}</strong><p>{request.purpose}</p></div></article>)}
            </div>
          </div>

          <div className="archive-priority-panel">
            <div className="material-column-head"><Archive size={24} /><div><span>ACERVO DE 2026 × PROGRAMAÇÃO 2027</span><h3>Não transcrever tudo com a mesma urgência</h3></div></div>
            <p className="archive-intro">As oito íntegras editoriais podem ser aproveitadas, mas a ordem deve seguir a capacidade de vender os temas confirmados de 2027. “Íntegra disponível” não significa “corte aprovado”: todo Reel ainda exige transcrição e conferência no vídeo.</p>
            <div className="archive-priority-list">
              {nutritionAesthetic2026Priorities.map(item => <article key={item.title} className={`archive-${item.tone}`}><div className="archive-card-head"><span>{item.priority}</span><small>{item.transcript}</small></div><h4>{item.title}</h4><p><strong>Ponte com 2027:</strong> {item.bridge}</p><p>{item.nextUse}</p></article>)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
