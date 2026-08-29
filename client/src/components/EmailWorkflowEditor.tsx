import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Cloud, ExternalLink, Link2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import {
  EMAIL_STATUSES,
  EMAIL_STATUS_GROUPS,
  getEmailStatus,
  isValidEmailPreviewUrl,
  type EmailStatusId,
} from "../../../shared/emailWorkflow";
import { trpc } from "@/lib/trpc";

type EmailWorkflowRow = {
  emailItemId: string;
  previewUrl: string;
  status: string;
  updatedAt: number;
};

type EmailWorkflowEditorProps = {
  emailItemId: string;
  row?: EmailWorkflowRow;
  defaultOpen?: boolean;
};

export default function EmailWorkflowEditor({ emailItemId, row, defaultOpen = false }: EmailWorkflowEditorProps) {
  const utils = trpc.useUtils();
  const [previewUrl, setPreviewUrl] = useState("");
  const [statusId, setStatusId] = useState<EmailStatusId>("nao-foi-feito");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPreviewUrl(row?.previewUrl ?? "");
    setStatusId(getEmailStatus(row?.status).id);
    setDirty(false);
  }, [emailItemId, row?.previewUrl, row?.status, row?.updatedAt]);

  const status = getEmailStatus(statusId);
  const validUrl = isValidEmailPreviewUrl(previewUrl);
  const statusesByGroup = useMemo(() => EMAIL_STATUS_GROUPS.map(group => ({
    group,
    statuses: EMAIL_STATUSES.filter(item => item.group === group),
  })), []);

  const saveMutation = trpc.planning.saveEmailWorkflow.useMutation({
    onSuccess: async () => {
      setDirty(false);
      await utils.planning.getState.invalidate();
      toast.success("Link e status do e-mail salvos para a equipe.");
    },
    onError: error => toast.error(`Não foi possível salvar: ${error.message}`),
  });

  const save = () => {
    if (!validUrl) {
      toast.error("Informe um link HTTPS válido para a prévia do e-mail.");
      return;
    }
    saveMutation.mutate({ emailItemId, previewUrl: previewUrl.trim(), status: statusId });
  };

  return (
    <details className={`email-approval status-${status.tone}`} open={defaultOpen || undefined}>
      <summary>
        <span><Link2 size={15} /><b>APROVAÇÃO DO E-MAIL</b><small>Link da prévia e status compartilhados</small></span>
        <em className={`email-status-badge status-${status.tone}`}><i />{status.label}</em>
        <ChevronDown size={16} className="email-approval-chevron" />
      </summary>
      <div className="email-approval-body">
        <label>
          <span>Link do e-mail para aprovação</span>
          <div className={`email-preview-url ${validUrl ? "" : "is-invalid"}`}><Link2 size={16} /><input type="url" value={previewUrl} onChange={event => { setPreviewUrl(event.target.value); setDirty(true); }} placeholder="https://..." /></div>
          {!validUrl ? <small className="field-error">Use um link completo iniciado por https://</small> : <small>Insira a prévia navegável ou o link da plataforma de disparo.</small>}
        </label>

        <label>
          <span>Status do e-mail</span>
          <select value={statusId} onChange={event => { setStatusId(event.target.value as EmailStatusId); setDirty(true); }}>
            {statusesByGroup.map(({ group, statuses }) => <optgroup key={group} label={group}>{statuses.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</optgroup>)}
          </select>
        </label>

        <div className="email-approval-actions">
          {validUrl && previewUrl.trim() ? <a href={previewUrl.trim()} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Abrir prévia</a> : <button type="button" disabled title="Informe um link HTTPS válido"><ExternalLink size={14} /> Abrir prévia</button>}
          <button type="button" onClick={() => utils.planning.getState.invalidate()}><RefreshCw size={14} /> Atualizar</button>
          <button type="button" className="email-approval-save" onClick={save} disabled={saveMutation.isPending || !validUrl || !dirty}><Save size={14} /> {saveMutation.isPending ? "Salvando..." : "Salvar"}</button>
        </div>
      </div>
      <footer>
        <Cloud size={13} />
        <span>{row?.updatedAt ? `Última atualização compartilhada em ${new Date(row.updatedAt).toLocaleString("pt-BR")}` : "Pronto para o primeiro registro da equipe."}</span>
        {dirty ? <em>Alterações locais pendentes</em> : row ? <em><CheckCircle2 size={12} /> Sincronizado</em> : null}
      </footer>
    </details>
  );
}
