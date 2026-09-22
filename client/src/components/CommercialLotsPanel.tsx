import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  CalendarDays,
  ChevronDown,
  LockKeyhole,
  Ticket,
} from "lucide-react";
import {
  COMMERCIAL_OPENING_DATE,
  COMMERCIAL_SOURCE_DATE,
  commercialLotWindows,
  commercialOffers,
  formatCommercialPrice,
  type CommercialOffer,
} from "@/data/commercialLots";

export default function CommercialLotsPanel() {
  const [expanded, setExpanded] = useState(false);
  const [selectedKey, setSelectedKey] =
    useState<CommercialOffer["key"]>("gestao-academias");
  const selectedOffer = useMemo(
    () =>
      commercialOffers.find(offer => offer.key === selectedKey) ??
      commercialOffers[0],
    [selectedKey]
  );

  return (
    <section
      className={`commercial-lots-panel${expanded ? " is-open" : ""}`}
      aria-label="Consulta interna de preços e lotes"
    >
      <button
        type="button"
        className="commercial-lots-trigger"
        aria-expanded={expanded}
        aria-controls="commercial-lots-content"
        onClick={() => setExpanded(current => !current)}
      >
        <span className="commercial-lots-trigger-icon">
          <BadgeDollarSign size={23} />
        </span>
        <span className="commercial-lots-trigger-copy">
          <small>CONSULTA INTERNA · REFERÊNCIA COMERCIAL</small>
          <strong>Preços e calendário de lotes</strong>
          <em>
            Consulte condições comerciais sem misturá-las aos KPIs de
            capacidade, vendas e ocupação.
          </em>
        </span>
        <span className="commercial-lots-trigger-action">
          {expanded ? "Recolher" : "Consultar"} <ChevronDown size={17} />
        </span>
      </button>

      {expanded ? (
        <div id="commercial-lots-content" className="commercial-lots-content">
          <div className="commercial-lots-notice">
            <LockKeyhole size={22} />
            <div>
              <strong>Uso interno do cliente e das agências</strong>
              <p>
                Estes valores e datas apoiam planejamento, produção e
                conferência. Não copiar para posts, anúncios, e-mails ou páginas
                sem validação comercial final.
              </p>
            </div>
          </div>

          <div className="commercial-lots-facts">
            <article>
              <CalendarDays size={18} />
              <div>
                <span>ABERTURA CONFIRMADA</span>
                <strong>{COMMERCIAL_OPENING_DATE}</strong>
              </div>
            </article>
            <article>
              <Ticket size={18} />
              <div>
                <span>JANELAS COMERCIAIS</span>
                <strong>{commercialLotWindows.length} condições</strong>
              </div>
            </article>
            <article>
              <BadgeDollarSign size={18} />
              <div>
                <span>FONTE INTERNA</span>
                <strong>Planilha de {COMMERCIAL_SOURCE_DATE}</strong>
              </div>
            </article>
          </div>

          <div
            className="commercial-lots-tabs"
            role="tablist"
            aria-label="Selecionar congresso para consultar preços"
          >
            {commercialOffers.map(offer => (
              <button
                type="button"
                role="tab"
                aria-selected={offer.key === selectedOffer.key}
                className={offer.key === selectedOffer.key ? "active" : ""}
                key={offer.key}
                onClick={() => setSelectedKey(offer.key)}
              >
                {offer.shortName}
              </button>
            ))}
          </div>

          <article
            className="commercial-offer"
            role="tabpanel"
            aria-label={`Preços de ${selectedOffer.name}`}
          >
            <header>
              <div>
                <span>CONGRESSO SELECIONADO</span>
                <h4>{selectedOffer.name}</h4>
                {selectedOffer.packageNote ? (
                  <p>{selectedOffer.packageNote}</p>
                ) : null}
              </div>
              <strong>
                {selectedOffer.segments.length === 2
                  ? "2 faixas de preço"
                  : "1 faixa de preço"}
              </strong>
            </header>

            <div className="commercial-lot-grid">
              {commercialLotWindows.map((window, index) => (
                <section className="commercial-lot-card" key={window.key}>
                  <header>
                    <span>{window.label}</span>
                    <small>{window.period}</small>
                  </header>
                  <div>
                    {selectedOffer.segments.map(segment => (
                      <p key={segment.label}>
                        <span>{segment.label}</span>
                        <strong>
                          {formatCommercialPrice(segment.prices[index])}
                        </strong>
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          <footer>
            <strong>Como usar este bloco</strong>
            <p>
              Capacidade, inscrições confirmadas e percentual de ocupação
              continuam sendo os indicadores de resultado. Preço e lote são
              referência para planejar argumento, urgência, mídia e viradas de
              comunicação — não entram no cálculo da lotação.
            </p>
          </footer>
        </div>
      ) : null}
    </section>
  );
}
