import { describe, expect, it } from "vitest";

const BASE_URL = "https://masterclassconference.savagetgroup.com.br/api/public";
const runExternalIntegrationTests = process.env.RUN_EXTERNAL_INTEGRATION_TESTS === "true";

describe.runIf(runExternalIntegrationTests)("credencial agregada do Lovable", () => {
  it("é aceita pelas rotas de masterclasses e novidades", async () => {
    const token = process.env.LOVABLE_METRICS_API_TOKEN;
    expect(token, "LOVABLE_METRICS_API_TOKEN precisa estar configurado").toBeTruthy();

    for (const route of ["metrics", "metrics-novidades"]) {
      const url = new URL(`${BASE_URL}/${route}`);
      url.searchParams.set("from", "2026-09-01");
      url.searchParams.set("to", "2026-09-01");

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(12_000),
      });

      expect(response.status, `${route} deve aceitar a credencial`).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/json");
    }
  }, 30_000);
});
