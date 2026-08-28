export const OCCUPANCY_CONGRESSES = [
  { key: "gestao-academias", name: "Gestão de Academias" },
  { key: "wttc", name: "WTTC" },
  { key: "sonafe", name: "SONAFE" },
  { key: "nutricao-estetica", name: "Nutrição Estética" },
  { key: "nutricao-esportiva", name: "Nutrição Esportiva" },
  { key: "bodybuilding", name: "Bodybuilding" },
] as const;

export const SALES_MONTHS = [
  { key: "2026-09", label: "Set/26", fullLabel: "Setembro de 2026" },
  { key: "2026-10", label: "Out/26", fullLabel: "Outubro de 2026" },
  { key: "2026-11", label: "Nov/26", fullLabel: "Novembro de 2026" },
  { key: "2026-12", label: "Dez/26", fullLabel: "Dezembro de 2026" },
  { key: "2027-01", label: "Jan/27", fullLabel: "Janeiro de 2027" },
  { key: "2027-02", label: "Fev/27", fullLabel: "Fevereiro de 2027" },
  { key: "2027-03", label: "Mar/27", fullLabel: "Março de 2027" },
  { key: "2027-04", label: "Abr/27", fullLabel: "Abril de 2027" },
] as const;

export type OccupancyCongressKey = typeof OCCUPANCY_CONGRESSES[number]["key"];
export type SalesMonthKey = typeof SALES_MONTHS[number]["key"];

export type OccupancyCalculation = {
  sold: number;
  capacity: number | null;
  remaining: number | null;
  percentage: number | null;
  barPercentage: number;
  overCapacity: number;
};

export function calculateOccupancy(capacity: number | null, monthlySales: Record<string, number>): OccupancyCalculation {
  const sold = Object.values(monthlySales).reduce((total, value) => total + Math.max(0, Number.isFinite(value) ? value : 0), 0);
  if (!capacity || capacity <= 0) {
    return { sold, capacity: null, remaining: null, percentage: null, barPercentage: 0, overCapacity: 0 };
  }
  const percentage = (sold / capacity) * 100;
  return {
    sold,
    capacity,
    remaining: Math.max(0, capacity - sold),
    percentage,
    barPercentage: Math.min(100, percentage),
    overCapacity: Math.max(0, sold - capacity),
  };
}
