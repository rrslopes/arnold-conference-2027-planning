import { useMemo, useState } from "react";
import { CalendarRange, CheckCircle2, CloudDownload, LockKeyhole, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { brasiliaCivilDate, firstDayOfBrasiliaMonth } from "@shared/brasiliaTime";

export default function MasterclassSyncPanel() {
  const utils = trpc.useUtils();
  const today = useMemo(() => brasiliaCivilDate(), []);
  const [from, setFrom] = useState(firstDayOfBrasiliaMonth);
  const [to, setTo] = useState(today);
  const [lastResult, setLastResult] = useState<"created" | "updated" | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const status = trpc.planning.getMasterclassSyncStatus.useQuery();
  const sync = trpc.planning.syncMasterclassLandingSnapshot.useMutation({
    onSuccess: async result => {
      await utils.planning.getState.invalidate();
      setLastError(null);
      setLastResult(result.action);
      toast.success(result.action === "created" ? "Fotografia importada do Lovable." : "Fotografia do período atualizada sem duplicidade.");
    },
    onError: error => {
      setLastError(error.message);
      toast.error("Sincronização interrompida. Veja abaixo os campos e valores rejeitados.");
    },
  });
  const invalidPeriod = !from || !to || from > to || to > today;
  const configured = status.data?.configured === true;

  return <section className="masterclass-sync-panel" aria-busy={sync.isPending}>
    <header><div><CloudDownload size={21} /><span>SINCRONIZAÇÃO SEGURA · LOVABLE</span><h4>Importar fotografia agregada</h4></div><small><LockKeyhole size={13} /> O token fica somente no servidor</small></header>
    <div className="masterclass-sync-body">
      <div className="masterclass-sync-copy"><p>Escolha o mesmo período usado no painel da LP. A plataforma importa somente totais agregados, aceita novas aulas e origens sem confundi-las com os indicadores já mapeados e atualiza a fotografia existente quando o período já estiver salvo.</p><strong><CheckCircle2 size={14} /> Sem nomes, e-mails ou telefones</strong></div>
      <div className="masterclass-sync-fields">
        <label><span>Início do período</span><div><CalendarRange size={14} /><input type="date" max={today} value={from} onChange={event => setFrom(event.target.value)} /></div></label>
        <label><span>Fim do período</span><div><CalendarRange size={14} /><input type="date" min={from} max={today} value={to} onChange={event => setTo(event.target.value)} /></div></label>
      </div>
      <button type="button" className="primary-button masterclass-sync-button" disabled={!configured || invalidPeriod || sync.isPending || status.isLoading} onClick={() => { setLastResult(null); setLastError(null); sync.mutate({ from, to }); }}>
        {sync.isPending ? <RefreshCw size={16} className="spin" /> : <CloudDownload size={16} />} Sincronizar agora
      </button>
    </div>
    <footer>
      {!configured && !status.isLoading ? <span className="sync-error">Integração ainda não configurada no servidor.</span> : null}
      {invalidPeriod ? <span className="sync-error">Informe um período válido, sem data futura.</span> : null}
      {lastResult ? <span className="sync-success"><CheckCircle2 size={13} /> {lastResult === "created" ? "Nova fotografia criada." : "Fotografia existente atualizada."}</span> : null}
      {lastError ? <div className="masterclass-sync-diagnostic" role="alert"><strong>Sincronização interrompida</strong><p>{lastError}</p></div> : null}
      <p>Repetir o mesmo período não cria outra linha. Se o Lovable enviar dados inválidos, a atualização é interrompida e a fotografia anterior permanece preservada.</p>
    </footer>
  </section>;
}
