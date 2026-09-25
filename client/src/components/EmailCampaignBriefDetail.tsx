import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  GitBranch,
  Link2,
  MousePointerClick,
  Search,
  ShieldCheck,
} from "lucide-react";
import { emailCampaignBriefs } from "@/data/emailBriefs";

type EmailCampaignBriefDetailProps = {
  emailId: string;
};

export default function EmailCampaignBriefDetail({
  emailId,
}: EmailCampaignBriefDetailProps) {
  const brief = emailCampaignBriefs[emailId];
  if (!brief) return null;
  const requestedEmail =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("email-focus");
  const startsOpen =
    emailId === "email-base-comparativo" || emailId === "email-oct-announcement" || requestedEmail === emailId;

  return (
    <details className="email-campaign-brief" open={startsOpen}>
      <summary>
        <div>
          <small>{brief.label}</small>
          <strong>{brief.decision}</strong>
        </div>
        <ChevronDown size={18} />
      </summary>

      <div className="email-campaign-brief-body">
        <div className="email-brief-rationale">
          <span>DECISÃO SOBRE O CTA</span>
          <p>{brief.rationale}</p>
        </div>

        <div className="email-brief-versions">
          {brief.versions.map(version => (
            <article
              key={version.id}
              className={`email-brief-version is-${version.id}`}
            >
              <header>
                <small>{version.label}</small>
                <h4>{version.objective}</h4>
              </header>

              <div className="email-brief-context">
                <div>
                  <span>PÚBLICO E FILTRO</span>
                  <p>{version.audience}</p>
                </div>
                <div>
                  <span>DIREÇÃO DE ASSUNTO</span>
                  <p>{version.subjectDirection}</p>
                </div>
              </div>

              <div className="email-brief-steps">
                {version.steps.map(step => (
                  <section key={`${version.id}-${step.step}`}>
                    <header>
                      <b>{step.step}</b>
                      <em>{step.role}</em>
                    </header>
                    <p>{step.direction}</p>
                    <div>
                      <span>EXEMPLO DE DIREÇÃO</span>
                      <strong>{step.example}</strong>
                    </div>
                  </section>
                ))}
              </div>

              <div className="email-brief-action">
                <MousePointerClick size={18} />
                <div>
                  <span>CTA PRINCIPAL DESTE ENVIO</span>
                  <strong>{version.cta}</strong>
                </div>
                <a
                  href={version.destinationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {version.destinationLabel}
                  <ArrowUpRight size={14} />
                </a>
              </div>
              {version.secondaryAction ? (
                <div className="email-brief-secondary">
                  <div>
                    <span>REFERÊNCIA SECUNDÁRIA · ACERVO CONTEXTUALIZADO</span>
                    <strong>{version.secondaryAction.label}</strong>
                    <p>{version.secondaryAction.context}</p>
                  </div>
                  <a
                    href={version.secondaryAction.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {version.secondaryAction.destinationLabel}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              ) : null}
              <p className="email-brief-exclusion">
                <ShieldCheck size={15} />
                <span>
                  <b>REGRA DE ENVIO</b>
                  {version.exclusion}
                </span>
              </p>
            </article>
          ))}
        </div>

        <section className="email-routing">
          <header>
            <GitBranch size={19} />
            <div>
              <span>REGRA DE DISTRIBUIÇÃO</span>
              <strong>{brief.versions.length > 1 ? "Qual versão cada contato recebe" : "Quem priorizar sem criar novas versões"}</strong>
            </div>
          </header>
          <div className="email-routing-grid">
            {brief.routing.map(rule => (
              <article key={rule.condition}>
                <span>SE</span>
                <strong>{rule.condition}</strong>
                <span>ENTÃO</span>
                <p>{rule.action}</p>
                <small>{rule.reason}</small>
              </article>
            ))}
          </div>
        </section>

        {brief.agencyResearch?.length || brief.proofGate ? (
          <section className="email-agency-research">
            <header>
              <Search size={19} />
              <div>
                <span>PESQUISA E MATERIAL BRUTO</span>
                <strong>A agência deve comprovar antes de usar</strong>
              </div>
            </header>
            {brief.agencyResearch?.map(item => (
              <p key={item}><ShieldCheck size={14} />{item}</p>
            ))}
            {brief.proofGate ? <div><span>GATE DE PROVA</span><p>{brief.proofGate}</p></div> : null}
          </section>
        ) : null}

        {brief.sourceLinks?.length ? (
          <section className="email-source-links">
            <header>
              <Link2 size={19} />
              <div>
                <span>FONTES E PONTOS DE BUSCA</span>
                <strong>Abrir o material original antes de produzir</strong>
              </div>
            </header>
            <div>
              {brief.sourceLinks.map(source => (
                <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">
                  <div>
                    <strong>{source.label}</strong>
                    <p>{source.note}</p>
                  </div>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <div className="email-brief-footer">
          <section>
            <span>CHECKLIST ANTES DO DISPARO</span>
            {brief.productionChecks.map(item => (
              <p key={item}>
                <CheckCircle2 size={14} />
                {item}
              </p>
            ))}
          </section>
          <section>
            <span>ALTERNATIVA SEGURA</span>
            <p>{brief.fallback}</p>
            <span>LIMITES</span>
            <p>{brief.limits}</p>
          </section>
        </div>
      </div>
    </details>
  );
}
