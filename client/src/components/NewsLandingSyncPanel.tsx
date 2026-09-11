import { useMemo, useState } from "react";
import { CalendarRange, CheckCircle2, CloudDownload, LockKeyhole, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { brasiliaCivilDate } from "@shared/brasiliaTime";

const OFFICIAL_SERIES_START = "2026-09-04";

export default function NewsLandingSyncPanel() {
  const utils = trpc.useUtils();
  const today = useMemo(() => brasiliaCivilDate(), []);
  const [to, setTo] = useState(today);
  const [lastResult, setLastResult] = useState<{ created: number; updated: number; dailyCount: number } | null>(null);
  const status = trpc.planning.getNewsSyncStatus.useQuery();
  const sync = trpc.planning.syncLeadProfileSnapshot.useMutation({
    onSuccess: async result => {
      await utils.planning.getState.invalidate();
      setLastResult(result);
      toast.success(`${result.dailyCount} dias e o consolidado foram sincronizados sem duplicidade.`);
    },
    onError: error => toast.error(`Não foi possível sincronizar: ${error.message}`),
  });
  const invalidPeriod = !to || OFFICIAL_SERIES_START > to || to > today;
  const configured = status.data?.configured === true;

  return <section className="masterclass-sync-panel lead-profile-sync-panel" aria-busy={sync.isPending}>
    <header><div><CloudDownload size={21} /><span>SINCRONIZAÇÃO SEGURA · LOVABLE</span><h4>Atualizar série diária e consolidado oficial</h4></div><small><LockKeyhole size={13} /> O token fica somente no servidor</small></header>
    <div className="masterclass-sync-body">
      <div className="masterclass-sync-copy"><p>A plataforma consulta cada dia desde 04/09 e também o consolidado até a data final. Repetir a sincronização atualiza os mesmos registros; as datas são civis de Brasília e não mudam de dia.</p><strong><CheckCircle2 size={14} /> Sem nomes, e-mails ou telefones</strong></div>
      <div className="masterclass-sync-fields">
        <label><span>Início oficial</span><div><CalendarRange size={14} /><input type="date" value={OFFICIAL_SERIES_START} disabled /></div></label>
        <label><span>Sincronizar até</span><div><CalendarRange size={14} /><input type="date" min={OFFICIAL_SERIES_START} max={today} value={to} onChange={event => setTo(event.target.value)} /></div></label>
      </div>
      <button type="button" className="primary-button masterclass-sync-button" disabled={!configured || invalidPeriod || sync.isPending || status.isLoading} onClick={() => { setLastResult(null); sync.mutate({ from: OFFICIAL_SERIES_START, to }); }}>
        {sync.isPending ? <RefreshCw size={16} className="spin" /> : <CloudDownload size={16} />} Sincronizar agora
      </button>
    </div>
    <footer>
      {!configured && !status.isLoading ? <span className="sync-error">Integração ainda não configurada no servidor.</span> : null}
      {invalidPeriod ? <span className="sync-error">Informe um período válido, sem data futura.</span> : null}
      {lastResult ? <span className="sync-success"><CheckCircle2 size={13} /> {lastResult.dailyCount} dias processados · {lastResult.created} criados · {lastResult.updated} atualizados.</span> : null}
      <p>O consolidado sustenta o perfil e os KPIs; os registros diários mostram a evolução. Nenhum deles é somado manualmente.</p>
    </footer>
  </section>;
}
