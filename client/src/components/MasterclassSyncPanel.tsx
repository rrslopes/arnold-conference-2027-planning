import { useEffect, useState } from "react";
import { CheckCircle2, CloudDownload, LockKeyhole, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { brasiliaCivilDate } from "@shared/brasiliaTime";

export default function MasterclassSyncPanel() {
  const utils = trpc.useUtils();
  const [today, setToday] = useState(() => brasiliaCivilDate());
  const [lastResult, setLastResult] = useState<{ from: string; to: string; closed: string[]; action: "created" | "updated" } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  useEffect(() => { const timer = setInterval(() => setToday(brasiliaCivilDate()), 60_000); return () => clearInterval(timer); }, []);
  const status = trpc.planning.getMasterclassSyncStatus.useQuery();
  const sync = trpc.planning.syncMasterclassLandingSnapshot.useMutation({
    onSuccess: async result => {
      await utils.planning.getState.invalidate();
      setLastError(null);
      setLastResult(result);
      toast.success(`Masterclasses: ${result.closed.length ? "mês anterior fechado e " : ""}mês corrente atualizado.`);
    },
    onError: error => { setLastError(error.message); toast.error("Sincronização interrompida. A fotografia anterior foi preservada."); },
  });
  const configured = status.data?.configured === true;
  const from = `${today.slice(0, 7)}-01`;

  return <section className="masterclass-sync-panel" aria-busy={sync.isPending}>
    <header><div><CloudDownload size={21} /><span>SINCRONIZAÇÃO SEGURA · LOVABLE</span><h4>Atualizar o mês em andamento</h4></div><small><LockKeyhole size={13} /> O token fica somente no servidor</small></header>
    <div className="masterclass-sync-body">
      <div className="masterclass-sync-copy"><p>O servidor consulta automaticamente {from} a {today}, em Brasília, e atualiza o mesmo bloco. Na primeira sincronização de um novo mês, fecha o mês anterior completo antes de abrir o novo. Meses fechados não são alterados por este botão.</p><strong><CheckCircle2 size={14} /> Sem nomes, e-mails ou telefones</strong></div>
      <button type="button" className="primary-button masterclass-sync-button" disabled={!configured || sync.isPending || status.isLoading} onClick={() => { setLastResult(null); setLastError(null); sync.mutate(); }}>
        {sync.isPending ? <RefreshCw size={16} className="spin" /> : <CloudDownload size={16} />} Sincronizar agora
      </button>
    </div>
    <footer>
      {!configured && !status.isLoading ? <span className="sync-error">Integração ainda não configurada no servidor.</span> : null}
      {lastResult ? <span className="sync-success"><CheckCircle2 size={13} /> {lastResult.closed.length ? `Fechados: ${lastResult.closed.join(", ")} · ` : ""}{lastResult.from} a {lastResult.to}: {lastResult.action === "created" ? "bloco criado" : "bloco atualizado"}.</span> : null}
      {lastError ? <div className="masterclass-sync-diagnostic" role="alert"><strong>Sincronização interrompida</strong><p>{lastError}</p></div> : null}
      <p>Fotografias parciais antigas permanecem no histórico; o bloco mensal é o número oficial daquele mês.</p>
    </footer>
  </section>;
}
