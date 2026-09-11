import { describe, expect, it } from "vitest";

const token = process.env.LOVABLE_METRICS_API_TOKEN ?? process.env.LOVABLE_MASTERCLASS_METRICS_TOKEN;
const endpoint = "https://masterclassconference.savagetgroup.com.br/api/public/metrics";

describe.runIf(Boolean(token))("credencial do endpoint de métricas das masterclasses", () => {
  it("autoriza uma consulta agregada de período sem expor dados pessoais", async () => {
    const url = new URL(endpoint);
    url.searchParams.set("from", "2026-09-01");
    url.searchParams.set("to", "2026-09-01");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
    });

    expect(response.status).toBe(200);
    const body = await response.json() as Record<string, unknown>;
    expect(body).toHaveProperty("origem", "LP das Masterclasses");
    expect(body).toHaveProperty("periodo");
    expect(body).toHaveProperty("trafego_e_captacao");
    expect(body).toHaveProperty("consumo_das_aulas");
    expect(body).not.toHaveProperty("email");
    expect(body).not.toHaveProperty("telefone");
  }, 15_000);
});
