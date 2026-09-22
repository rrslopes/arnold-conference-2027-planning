export type CommercialLotWindow = {
  key: "lot-1" | "lot-2" | "lot-3" | "lot-4" | "event";
  label: string;
  period: string;
};

export type CommercialPriceSegment = {
  label: string;
  prices: [number, number, number, number, number];
};

export type CommercialOffer = {
  key:
    | "gestao-academias"
    | "wttc"
    | "sonafe"
    | "nutricao-estetica"
    | "nutricao-esportiva"
    | "bodybuilding";
  name: string;
  shortName: string;
  packageNote?: string;
  segments: CommercialPriceSegment[];
};

export const COMMERCIAL_OPENING_DATE = "06/10/2026";
export const COMMERCIAL_SOURCE_DATE = "22/09/2026";

export const commercialLotWindows: CommercialLotWindow[] = [
  { key: "lot-1", label: "Lote 1", period: "06/10/2026 a 09/11/2026" },
  { key: "lot-2", label: "Lote 2", period: "10/11/2026 a 30/01/2027" },
  { key: "lot-3", label: "Lote 3", period: "31/01/2027 a 08/03/2027" },
  { key: "lot-4", label: "Lote 4", period: "09/03/2027 a 22/04/2027" },
  { key: "event", label: "No evento", period: "23/04/2027" },
];

export const commercialOffers: CommercialOffer[] = [
  {
    key: "gestao-academias",
    name: "Gestão de Academias",
    shortName: "Gestão",
    segments: [{ label: "Valor", prices: [1090, 1240, 1390, 1540, 1690] }],
  },
  {
    key: "wttc",
    name: "Certificação Internacional em Personal Training – WTTC",
    shortName: "Certificação",
    segments: [{ label: "Valor", prices: [569.9, 624.9, 672.9, 724.9, 779.9] }],
  },
  {
    key: "sonafe",
    name: "Simpósio de Fisioterapia Esportiva – SONAFE",
    shortName: "SONAFE",
    segments: [
      { label: "Associados", prices: [379.9, 429.9, 479.9, 529.9, 579.9] },
      { label: "Não associados", prices: [499.9, 549.9, 599.9, 649.9, 699.9] },
    ],
  },
  {
    key: "nutricao-estetica",
    name: "Nutrição Estética",
    shortName: "Nutrição Estética",
    segments: [
      { label: "Valor", prices: [819.9, 879.9, 964.9, 1030.9, 1109.9] },
    ],
  },
  {
    key: "nutricao-esportiva",
    name: "Nutrição Esportiva",
    shortName: "Nutrição Esportiva",
    packageNote: "Somente pacote de 2 dias",
    segments: [
      { label: "Valor", prices: [1244.9, 1387.9, 1599.9, 1799.9, 1999.9] },
    ],
  },
  {
    key: "bodybuilding",
    name: "Bodybuilding",
    shortName: "Bodybuilding",
    segments: [
      { label: "Valor", prices: [790.9, 849.5, 930.9, 995.9, 1069.9] },
    ],
  },
];

export function formatCommercialPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}
