import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  COMMERCIAL_OPENING_DATE,
  COMMERCIAL_SOURCE_DATE,
  commercialLotWindows,
  commercialOffers,
  formatCommercialPrice,
} from "../client/src/data/commercialLots";

const component = readFileSync(
  "client/src/components/CommercialLotsPanel.tsx",
  "utf8"
);
const occupancy = readFileSync(
  "client/src/components/OccupancyDashboard.tsx",
  "utf8"
);
const home = readFileSync("client/src/pages/Home.tsx", "utf8");
const styles = readFileSync("client/src/index.css", "utf8");

describe("consulta comercial de preços e lotes", () => {
  it("mantém seis congressos e cinco janelas comerciais com abertura em 06/10", () => {
    expect(COMMERCIAL_OPENING_DATE).toBe("06/10/2026");
    expect(COMMERCIAL_SOURCE_DATE).toBe("22/09/2026");
    expect(commercialOffers).toHaveLength(6);
    expect(commercialLotWindows.map(window => window.period)).toEqual([
      "06/10/2026 a 09/11/2026",
      "10/11/2026 a 30/01/2027",
      "31/01/2027 a 08/03/2027",
      "09/03/2027 a 22/04/2027",
      "23/04/2027",
    ]);
  });

  it("preserva os valores exatos recebidos para todos os produtos", () => {
    expect(
      commercialOffers.find(offer => offer.key === "gestao-academias")
        ?.segments[0].prices
    ).toEqual([1090, 1240, 1390, 1540, 1690]);
    expect(
      commercialOffers.find(offer => offer.key === "wttc")?.segments[0].prices
    ).toEqual([569.9, 624.9, 672.9, 724.9, 779.9]);
    expect(
      commercialOffers.find(offer => offer.key === "nutricao-estetica")
        ?.segments[0].prices
    ).toEqual([819.9, 879.9, 964.9, 1030.9, 1109.9]);
    expect(
      commercialOffers.find(offer => offer.key === "nutricao-esportiva")
        ?.segments[0].prices
    ).toEqual([1244.9, 1387.9, 1599.9, 1799.9, 1999.9]);
    expect(
      commercialOffers.find(offer => offer.key === "bodybuilding")?.segments[0]
        .prices
    ).toEqual([790.9, 849.5, 930.9, 995.9, 1069.9]);
    expect(
      commercialOffers.find(offer => offer.key === "sonafe")?.segments
    ).toEqual([
      { label: "Associados", prices: [379.9, 429.9, 479.9, 529.9, 579.9] },
      { label: "Não associados", prices: [499.9, 549.9, 599.9, 649.9, 699.9] },
    ]);
    expect(
      commercialOffers.filter(offer => offer.packageNote).map(offer => offer.key)
    ).toEqual(["nutricao-esportiva"]);
  });

  it("mantém cada sequência de preço crescente e formata em reais", () => {
    commercialOffers
      .flatMap(offer => offer.segments)
      .forEach(segment => {
        expect(segment.prices).toHaveLength(5);
        expect(
          segment.prices.every(
            (price, index) => index === 0 || price > segment.prices[index - 1]
          )
        ).toBe(true);
      });
    expect(formatCommercialPrice(1090)).toMatch(/R\$\s*1\.090,00/);
  });

  it("posiciona a consulta dentro de lotação, mas fora dos cálculos de ocupação", () => {
    expect(occupancy).toContain("<CommercialLotsPanel />");
    expect(home).toContain(
      "Preços e lotes ficam em um bloco separado de consulta"
    );
    expect(home).toContain("não entram no percentual de ocupação");
    expect(component).toContain("não entram no cálculo da lotação");
    expect(component).toContain("Uso interno do cliente e das agências");
    expect(component).toContain("Não copiar para posts, anúncios, e-mails ou páginas");
    expect(component).toContain("sem validação comercial final");
  });

  it("fica recolhido por padrão e oferece navegação responsiva entre os seis congressos", () => {
    expect(component).toContain("useState(false)");
    expect(component).toContain('role="tablist"');
    expect(component).toContain(
      "aria-selected={offer.key === selectedOffer.key}"
    );
    expect(styles).toContain(
      ".commercial-lot-grid { grid-template-columns: 1fr; }"
    );
    expect(styles).toContain(
      ".commercial-lots-trigger-action { grid-column: 2; justify-self: start; }"
    );
  });
});
