export const EDITORIAL_STATUS_IDS = [
  "nao-iniciado",
  "brief-da-ideia",
  "fazer-legenda",
  "editar-arte-video",
  "aprovar-legenda",
  "aprovar-arte",
  "revisar-publicacao",
  "refazer-legenda",
  "ajustar-arte-video",
  "aplicar-observacoes",
  "legenda-aprovada",
  "aprovado-para-programar",
  "programar",
  "programado",
  "postado",
  "arquivado",
] as const;

export type EditorialStatusId = (typeof EDITORIAL_STATUS_IDS)[number];

export type EditorialStatusGroup = "Fila" | "Produção inicial" | "Aprovação do cliente" | "Ajustes solicitados" | "Finalização" | "Publicado";
export type EditorialStatusTone = "neutral" | "agency" | "social" | "approval" | "ready" | "published";

export type EditorialStatusDefinition = {
  id: EditorialStatusId;
  label: string;
  group: EditorialStatusGroup;
  tone: EditorialStatusTone;
};

export const EDITORIAL_STATUSES: readonly EditorialStatusDefinition[] = [
  { id: "nao-iniciado", label: "Não iniciado", group: "Fila", tone: "neutral" },
  { id: "brief-da-ideia", label: "Social · brief da ideia", group: "Produção inicial", tone: "social" },
  { id: "fazer-legenda", label: "Social · fazer legenda", group: "Produção inicial", tone: "social" },
  { id: "editar-arte-video", label: "Agência · editar arte/vídeo", group: "Produção inicial", tone: "agency" },
  { id: "aprovar-legenda", label: "Cliente · aprovar legenda", group: "Aprovação do cliente", tone: "approval" },
  { id: "aprovar-arte", label: "Cliente · aprovar arte", group: "Aprovação do cliente", tone: "approval" },
  { id: "revisar-publicacao", label: "Cliente · revisar publicação", group: "Aprovação do cliente", tone: "approval" },
  { id: "refazer-legenda", label: "Social · refazer legenda", group: "Ajustes solicitados", tone: "social" },
  { id: "ajustar-arte-video", label: "Agência · ajustar arte/vídeo", group: "Ajustes solicitados", tone: "agency" },
  { id: "aplicar-observacoes", label: "Social · observações na legenda", group: "Ajustes solicitados", tone: "social" },
  { id: "legenda-aprovada", label: "Legenda aprovada", group: "Finalização", tone: "ready" },
  { id: "aprovado-para-programar", label: "Aprovado para programar", group: "Finalização", tone: "ready" },
  { id: "programar", label: "Social · programar", group: "Finalização", tone: "social" },
  { id: "programado", label: "Programado", group: "Publicado", tone: "published" },
  { id: "postado", label: "Postado", group: "Publicado", tone: "published" },
  { id: "arquivado", label: "Arquivado", group: "Publicado", tone: "neutral" },
] as const;

export const EDITORIAL_STATUS_GROUPS: readonly EditorialStatusGroup[] = [
  "Fila",
  "Produção inicial",
  "Aprovação do cliente",
  "Ajustes solicitados",
  "Finalização",
  "Publicado",
] as const;

export function getEditorialStatus(statusId: string | null | undefined) {
  return EDITORIAL_STATUSES.find(status => status.id === statusId) ?? EDITORIAL_STATUSES[0];
}

export function isValidArtworkUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
