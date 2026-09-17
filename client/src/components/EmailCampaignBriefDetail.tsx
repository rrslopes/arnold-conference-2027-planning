import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  GitBranch,
  MousePointerClick,
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

  return (
    <details className="email-campaign-brief" open>
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
                  <span>CTA ÚNICO DESTA VERSÃO</span>
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
              <p className="email-brief-exclusion">
                <ShieldCheck size={15} />
                <span>
                  <b>EXCLUSÃO OBRIGATÓRIA</b>
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
              <span>MATRIZ DE DECISÃO</span>
              <strong>Quem recebe qual versão e para onde vai</strong>
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
