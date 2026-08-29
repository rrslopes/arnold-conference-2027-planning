export const EMAIL_STATUS_IDS = [
  "nao-foi-feito",
  "agencia-fazer",
  "na-fila-agencia",
  "agencia-ja-precisa",
  "feito-standby",
  "cancelado",
  "aguardando-pack",
  "falta-info-savaget",
  "falta-logo",
  "criar-briefing",
  "briefing-em-andamento",
  "aprovar-ideia-briefing-adri",
  "agencia-roteirizar",
  "em-criacao",
  "aprovar-texto-adri",
  "aprovar-arte-job-adri",
  "arte-aprovada",
  "video-aprovado",
  "email-mkt-aprovado",
  "aprovando-feijo",
  "aprovando-cibele",
  "aprovando-terceiros",
  "adri-ok-aprovar-ve",
  "adri-ok-aprovar-ci",
  "adri-ok-aprovar-cris",
  "agencia-refazer",
  "concluido",
  "enviado-rapha",
  "enviar-gazeta",
  "enviado-gazeta",
] as const;

export type EmailStatusId = (typeof EMAIL_STATUS_IDS)[number];
export type EmailStatusGroup = "Fila" | "Dependências" | "Briefing" | "Criação" | "Aprovação" | "Ajustes" | "Concluído" | "Envio";
export type EmailStatusTone = "neutral" | "queue" | "dependency" | "briefing" | "creation" | "approval" | "revision" | "ready" | "sent" | "canceled";

export type EmailStatus = {
  id: EmailStatusId;
  label: string;
  group: EmailStatusGroup;
  tone: EmailStatusTone;
};

export const EMAIL_STATUSES: EmailStatus[] = [
  { id: "nao-foi-feito", label: "Não foi feito", group: "Fila", tone: "neutral" },
  { id: "agencia-fazer", label: "Agência · fazer", group: "Fila", tone: "queue" },
  { id: "na-fila-agencia", label: "Na fila da agência", group: "Fila", tone: "queue" },
  { id: "agencia-ja-precisa", label: "Agência · já precisa", group: "Fila", tone: "queue" },
  { id: "feito-standby", label: "Feito / standby", group: "Fila", tone: "neutral" },
  { id: "cancelado", label: "Cancelado", group: "Fila", tone: "canceled" },
  { id: "aguardando-pack", label: "Aguardando pack ficar pronto", group: "Dependências", tone: "dependency" },
  { id: "falta-info-savaget", label: "Falta informação Savaget", group: "Dependências", tone: "dependency" },
  { id: "falta-logo", label: "Falta logo", group: "Dependências", tone: "dependency" },
  { id: "criar-briefing", label: "Criar briefing", group: "Briefing", tone: "briefing" },
  { id: "briefing-em-andamento", label: "Briefing em andamento", group: "Briefing", tone: "briefing" },
  { id: "aprovar-ideia-briefing-adri", label: "Adri · aprovar ideia/briefing", group: "Briefing", tone: "approval" },
  { id: "agencia-roteirizar", label: "Agência · roteirizar", group: "Briefing", tone: "queue" },
  { id: "em-criacao", label: "Em criação", group: "Criação", tone: "creation" },
  { id: "aprovar-texto-adri", label: "Adri · aprovar texto", group: "Aprovação", tone: "approval" },
  { id: "aprovar-arte-job-adri", label: "Adri · aprovar arte/job", group: "Aprovação", tone: "approval" },
  { id: "arte-aprovada", label: "Arte aprovada", group: "Aprovação", tone: "ready" },
  { id: "video-aprovado", label: "Vídeo aprovado", group: "Aprovação", tone: "ready" },
  { id: "email-mkt-aprovado", label: "E-mail marketing aprovado", group: "Aprovação", tone: "ready" },
  { id: "aprovando-feijo", label: "Aprovando com Feijó", group: "Aprovação", tone: "approval" },
  { id: "aprovando-cibele", label: "Aprovando com Cibele", group: "Aprovação", tone: "approval" },
  { id: "aprovando-terceiros", label: "Aprovando com terceiros", group: "Aprovação", tone: "approval" },
  { id: "adri-ok-aprovar-ve", label: "Adri ok · aprovar com Ve", group: "Aprovação", tone: "approval" },
  { id: "adri-ok-aprovar-ci", label: "Adri ok · aprovar com Ci", group: "Aprovação", tone: "approval" },
  { id: "adri-ok-aprovar-cris", label: "Adri ok · aprovar com Cris", group: "Aprovação", tone: "approval" },
  { id: "agencia-refazer", label: "Agência · refazer", group: "Ajustes", tone: "revision" },
  { id: "concluido", label: "Concluído", group: "Concluído", tone: "ready" },
  { id: "enviado-rapha", label: "Enviado para Rapha", group: "Envio", tone: "sent" },
  { id: "enviar-gazeta", label: "Enviar para Gazeta", group: "Envio", tone: "dependency" },
  { id: "enviado-gazeta", label: "Enviado para Gazeta", group: "Envio", tone: "sent" },
];

export const EMAIL_STATUS_GROUPS: EmailStatusGroup[] = ["Fila", "Dependências", "Briefing", "Criação", "Aprovação", "Ajustes", "Concluído", "Envio"];

export function getEmailStatus(status?: string): EmailStatus {
  return EMAIL_STATUSES.find(item => item.id === status) ?? EMAIL_STATUSES[0];
}

export function isValidEmailPreviewUrl(value: string) {
  if (!value.trim()) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
