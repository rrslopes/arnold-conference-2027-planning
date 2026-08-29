import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Cloud, ExternalLink, Link2, RefreshCw, Save, Workflow } from "lucide-react";
import { toast } from "sonner";
import {
  EDITORIAL_STATUSES,
  EDITORIAL_STATUS_GROUPS,
  getEditorialStatus,
  isValidArtworkUrl,
  type EditorialStatusId,
} from "../../../shared/editorialWorkflow";
import { trpc } from "@/lib/trpc";

type WorkflowRow = {
  calendarItemId: string;
  caption: string;
  artworkUrl: string;
  status: string;
  updatedAt: number;
};

type CalendarWorkflowEditorProps = {
  calendarItemId: string;
  row?: WorkflowRow;
};

const emptyForm = {
  caption: "",
  artworkUrl: "",
  status: "nao-iniciado" as EditorialStatusId,
};

export default function CalendarWorkflowEditor({ calendarItemId, row }: CalendarWorkflowEditorProps) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState(emptyForm);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm({
      caption: row?.caption ?? "",
      artworkUrl: row?.artworkUrl ?? "",
      status: getEditorialStatus(row?.status).id,
    });
    setDirty(false);
  }, [calendarItemId, row?.caption, row?.artworkUrl, row?.status, row?.updatedAt]);

  const status = getEditorialStatus(form.status);
  const validArtworkUrl = isValidArtworkUrl(form.artworkUrl);
  const hasContent = Boolean(form.caption.trim() || form.artworkUrl.trim() || form.status !== "nao-iniciado");
  const remainingCaption = 5000 - form.caption.length;

  const statusesByGroup = useMemo(() => EDITORIAL_STATUS_GROUPS.map(group => ({
    group,
    statuses: EDITORIAL_STATUSES.filter(item => item.group === group),
  })), []);

  const saveMutation = trpc.planning.saveCalendarWorkflow.useMutation({
    onSuccess: async () => {
      setDirty(false);
      await utils.planning.getState.invalidate();
      toast.success("Legenda, arte e status salvos para a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar: ${error.message}`),
  });

  const update = <Field extends keyof typeof form>(field: Field, value: (typeof form)[Field]) => {
    setForm(current => ({ ...current, [field]: value }));
    setDirty(true);
  };

  const save = () => {
    if (!validArtworkUrl) {
      toast.error("Informe um link HTTPS válido para a arte.");
      return;
    }
    saveMutation.mutate({ calendarItemId, ...form, artworkUrl: form.artworkUrl.trim() });
  };

  return (
    <section className={`editorial-workflow status-${status.tone}`} aria-label="Produção e aprovação da pauta">
      <header className="editorial-workflow-head">
        <div className="editorial-workflow-title">
          <Workflow size={19} />
          <div><span>PRODUÇÃO E APROVAÇÃO</span><strong>Espaço compartilhado da pauta</strong><p>Agência e cliente visualizam a mesma legenda, link e etapa.</p></div>
        </div>
        <div className={`editorial-status-badge status-${status.tone}`}><i />{status.label}</div>
      </header>

      <div className="editorial-workflow-grid">
        <label className="editorial-caption-field">
          <span>Legenda do post</span>
          <textarea
            value={form.caption}
            onChange={event => update("caption", event.target.value)}
            maxLength={5000}
            placeholder="A agência insere aqui a legenda completa para revisão e aprovação."
          />
          <small>{remainingCaption.toLocaleString("pt-BR")} caracteres disponíveis</small>
        </label>

        <div className="editorial-workflow-side">
          <label>
            <span>Link da arte para aprovação</span>
            <div className={`artwork-url-field ${validArtworkUrl ? "" : "is-invalid"}`}><Link2 size={16} /><input type="url" value={form.artworkUrl} onChange={event => update("artworkUrl", event.target.value)} placeholder="https://drive.google.com/..." /></div>
            {!validArtworkUrl ? <small className="field-error">Use um link completo iniciado por https://</small> : <small>Pode ser uma pasta ou um arquivo compartilhado do Drive.</small>}
          </label>

          <label>
            <span>Status atual</span>
            <select value={form.status} onChange={event => update("status", event.target.value as EditorialStatusId)}>
              {statusesByGroup.map(({ group, statuses }) => <optgroup key={group} label={group}>{statuses.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</optgroup>)}
            </select>
          </label>

          <div className="editorial-workflow-actions">
            {validArtworkUrl && form.artworkUrl.trim() ? <a href={form.artworkUrl.trim()} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Abrir arte</a> : null}
            <button type="button" className="editorial-refresh" onClick={() => utils.planning.getState.invalidate()}><RefreshCw size={15} /> Atualizar</button>
            <button type="button" className="editorial-save" onClick={save} disabled={saveMutation.isPending || !validArtworkUrl || !dirty}><Save size={15} /> {saveMutation.isPending ? "Salvando..." : "Salvar"}</button>
          </div>
        </div>
      </div>

      <footer className="editorial-workflow-meta">
        {row?.updatedAt ? <><Cloud size={14} /><span>Última atualização compartilhada em {new Date(row.updatedAt).toLocaleString("pt-BR")}</span></> : <><Cloud size={14} /><span>{hasContent ? "Alterações ainda não salvas." : "Pronto para o primeiro registro da equipe."}</span></>}
        {dirty ? <em>Há alterações locais pendentes</em> : row ? <em><CheckCircle2 size={13} /> Sincronizado</em> : null}
      </footer>
    </section>
  );
}
