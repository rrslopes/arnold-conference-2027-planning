import { useState } from "react";
import { ExternalLink, GraduationCap, LayoutDashboard } from "lucide-react";
import LeadProfileDashboard from "@/components/LeadProfileDashboard";
import MasterclassLandingDashboard from "@/components/MasterclassLandingDashboard";
import { NEWS_LP_SOURCE } from "@shared/leadProfile";
import { MASTERCLASS_LP_SOURCE } from "@shared/masterclassLanding";

type Source = "news" | "masterclasses";

export default function LandingPageCenter() {
  const reviewSource = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("lp-source") : null;
  const [source, setSource] = useState<Source>(reviewSource === "masterclasses" ? "masterclasses" : "news");

  return <div className="landing-center" id="landing-pages-center">
    <header className="landing-center-head">
      <div><LayoutDashboard size={27} /><span>FONTE ÚNICA DE AQUISIÇÃO</span><h3>Central de Landing Pages</h3><p>Registre cada resultado na página que o gerou. A plataforma consolida os KPIs sem misturar origens nem exigir redigitação.</p></div>
    </header>
    <div className="landing-source-switch" role="tablist" aria-label="Selecionar landing page">
      <button type="button" role="tab" aria-selected={source === "news"} className={source === "news" ? "active" : ""} onClick={() => setSource("news")}>
        <LayoutDashboard size={19} /><span><strong>LP de novidades</strong><small>Captação, perfil e interesses</small></span>
      </button>
      <button type="button" role="tab" aria-selected={source === "masterclasses"} className={source === "masterclasses" ? "active" : ""} onClick={() => setSource("masterclasses")}>
        <GraduationCap size={19} /><span><strong>LP das masterclasses</strong><small>Captação, entrega e consumo</small></span>
      </button>
    </div>
    <div className="landing-source-context">
      <span>ORIGEM SELECIONADA</span><strong>{source === "news" ? NEWS_LP_SOURCE.label : MASTERCLASS_LP_SOURCE.label}</strong>
      <a href={source === "news" ? NEWS_LP_SOURCE.url : MASTERCLASS_LP_SOURCE.url} target="_blank" rel="noreferrer">Abrir página <ExternalLink size={13} /></a>
    </div>
    {source === "news" ? <LeadProfileDashboard /> : <MasterclassLandingDashboard />}
  </div>;
}
