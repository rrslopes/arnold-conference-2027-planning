import { describe, expect, it } from "vitest";
import {
  EDITORIAL_STATUSES,
  EDITORIAL_STATUS_GROUPS,
  getEditorialStatus,
  isValidArtworkUrl,
} from "../shared/editorialWorkflow";

describe("editorial workflow", () => {
  it("offers distinct stages for agency, client, revisions and publishing", () => {
    expect(EDITORIAL_STATUS_GROUPS).toEqual(["Fila", "Produção inicial", "Aprovação do cliente", "Ajustes solicitados", "Finalização", "Publicado"]);
    expect(new Set(EDITORIAL_STATUSES.map(status => status.id)).size).toBe(EDITORIAL_STATUSES.length);
    expect(EDITORIAL_STATUSES.some(status => status.id === "aprovar-legenda")).toBe(true);
    expect(EDITORIAL_STATUSES.some(status => status.id === "aprovar-arte")).toBe(true);
    expect(EDITORIAL_STATUSES.some(status => status.id === "programado")).toBe(true);
    expect(EDITORIAL_STATUSES.some(status => status.id === "postado")).toBe(true);
    expect(EDITORIAL_STATUSES.some(status => status.label.startsWith("Agência ·") && status.tone === "agency")).toBe(true);
    expect(EDITORIAL_STATUSES.some(status => status.label.startsWith("Cliente ·") && status.tone === "approval")).toBe(true);
    expect(EDITORIAL_STATUSES.some(status => status.label.startsWith("Social ·") && status.tone === "social")).toBe(true);
  });

  it("falls back to the not-started status for unknown data", () => {
    expect(getEditorialStatus("legacy-status").id).toBe("nao-iniciado");
  });

  it("accepts blank or HTTPS links and rejects unsafe protocols", () => {
    expect(isValidArtworkUrl("")).toBe(true);
    expect(isValidArtworkUrl("https://drive.google.com/file/d/example/view")).toBe(true);
    expect(isValidArtworkUrl("http://drive.google.com/file/d/example/view")).toBe(false);
    expect(isValidArtworkUrl("javascript:alert(1)")).toBe(false);
    expect(isValidArtworkUrl("not-a-link")).toBe(false);
  });
});
