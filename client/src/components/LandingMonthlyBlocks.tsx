import { LockKeyhole, RefreshCw } from "lucide-react";
import { civilDateFromUtcNoon } from "@shared/brasiliaTime";

export type LandingBlock = { sourceKey: string; monthKey: string; snapshotId: number; status: "open" | "closed"; updatedAt: number };

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
export function landingMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const label = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1, 12)));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function LandingMonthlyBlocks({ blocks, selectedMonth, onSelect, endById }: {
  blocks: LandingBlock[];
  selectedMonth: string | null;
  onSelect: (monthKey: string) => void;
  endById: Map<number, number>;
}) {
  if (!blocks.length) return null;
  return <section className="landing-monthly-blocks" aria-label="Acompanhamento mensal">
    <header><strong>BLOCOS MENSAIS</strong><span>Um consolidado oficial por mês. Fotografias parciais anteriores continuam no histórico.</span></header>
    <div className="landing-monthly-list">{[...blocks].sort((a, b) => b.monthKey.localeCompare(a.monthKey)).map(block =>
      <button type="button" key={block.monthKey} aria-pressed={selectedMonth === block.monthKey} className={selectedMonth === block.monthKey ? "active" : ""} onClick={() => onSelect(block.monthKey)}>
        <strong>{landingMonthLabel(block.monthKey)}</strong>
        <span>{block.status === "closed" ? <LockKeyhole size={14} /> : <RefreshCw size={14} />}{block.status === "closed" ? "Fechado" : "Em andamento"}</span>
        <small>{endById.has(block.snapshotId) ? `Dados até ${civilDateFromUtcNoon(endById.get(block.snapshotId)! ).split("-").reverse().join("/")}` : "Aguardando sincronização"}</small>
      </button>)}</div>
    <p>O botão «Sincronizar agora» altera apenas o mês corrente. Para um acumulado entre meses, consulte o endpoint com o período inteiro; não some estes blocos.</p>
  </section>;
}
