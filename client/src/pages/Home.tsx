/**
 * Design philosophy: "Sala de Comando da Campanha" — página executiva, assimétrica
 * e didática, com profundidade por camadas e identidade Arnold aplicada ao sistema inteiro.
 */
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  FileText,
  Gauge,
  Lightbulb,
  Mail,
  MessageCircleMore,
  MousePointerClick,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import StrategyLayout, { SectionHeader } from "@/components/StrategyLayout";
import ObjectiveTracker from "@/components/ObjectiveTracker";
import LeadMagnetExplorer from "@/components/LeadMagnetExplorer";
import CalendarExplorer from "@/components/CalendarExplorer";
import KpiDashboard from "@/components/KpiDashboard";
import OccupancyDashboard from "@/components/OccupancyDashboard";
import SocialGoalsDashboard from "@/components/SocialGoalsDashboard";
import EditorialIntelligence from "@/components/EditorialIntelligence";
import EmailPerformanceDashboard from "@/components/EmailPerformanceDashboard";
import EmailCampaignBriefDetail from "@/components/EmailCampaignBriefDetail";
import LandingPageCenter from "@/components/LandingPageCenter";
import PaidMediaHub from "@/components/PaidMediaHub";
import WhatsAppPerformanceDashboard from "@/components/WhatsAppPerformanceDashboard";
import {
  brandAssets,
  congressLogos,
  congresses,
  cutMethod,
  emailAssets,
  emailBase,
  emailOperationalGates,
  emailNurture,
  futureMaterials,
  getCongressDisplayName,
  pieceTypes,
  roadmap,
  WTTC_PUBLIC_NAME,
  whatsappPlan,
} from "@/data/planData";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type IndicatorGuideProps = {
  number: string;
  level: string;
  title: string;
  purpose: string;
  cadence: string;
  source: string;
  avoid: string;
  primary?: boolean;
};

function IndicatorGuide({ number, level, title, purpose, cadence, source, avoid, primary = false }: IndicatorGuideProps) {
  return <div className={`indicator-guide ${primary ? "is-primary" : ""}`}>
    <header><span>{number}</span><div><small>{level}</small><h3>{title}</h3></div></header>
    <div className="indicator-guide-grid">
      <div><strong>O QUE MEDE</strong><p>{purpose}</p></div>
      <div><strong>QUANDO PREENCHER</strong><p>{cadence}</p></div>
      <div><strong>FONTE DO DADO</strong><p>{source}</p></div>
      <div><strong>NÃO ENTRA AQUI</strong><p>{avoid}</p></div>
    </div>
  </div>;
}

type IndicatorLayerId = "lotacao" | "leads" | "social" | "funil";
const indicatorLayerIds: IndicatorLayerId[] = ["lotacao", "leads", "social", "funil"];

function getInitialIndicatorLayer(): IndicatorLayerId {
  if (typeof window === "undefined") return "lotacao";
  const queryLayer = new URLSearchParams(window.location.search).get("indicator-layer");
  const requested = (queryLayer ?? window.location.hash.replace("#indicadores-", "")) as IndicatorLayerId;
  return indicatorLayerIds.includes(requested) ? requested : "lotacao";
}

type IndicatorAccordionItemProps = {
  id: IndicatorLayerId;
  number: string;
  level: string;
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  primary?: boolean;
  children: ReactNode;
};

function IndicatorAccordionItem({ id, number, level, title, summary, open, onToggle, primary = false, children }: IndicatorAccordionItemProps) {
  const triggerId = `indicator-trigger-${id}`;
  const panelId = `indicator-panel-${id}`;
  return <article id={`indicadores-${id}`} className={`indicator-accordion-item ${open ? "is-open" : ""} ${primary ? "is-primary" : ""}`}>
    <button id={triggerId} type="button" className="indicator-accordion-trigger" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
      <span className="indicator-accordion-number">{number}</span>
      <span className="indicator-accordion-copy"><small>{level}</small><strong>{title}</strong><em>{summary}</em></span>
      <span className="indicator-accordion-action">{open ? "Recolher" : "Explorar"}<ChevronDown size={19} aria-hidden="true" /></span>
    </button>
    <div id={panelId} className="indicator-accordion-panel" role="region" aria-labelledby={triggerId} hidden={!open}>{children}</div>
  </article>;
}

function ExecutiveHero() {
  return (
    <section id="visao" className="hero-panel">
      <img className="hero-bg" src={brandAssets.hero} alt="" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-kicker"><span /> PLANEJAMENTO INTERATIVO · 2026–2027</div>
        <div className="hero-title-lockup">
          <img src={brandAssets.conferenceLogo} alt="Arnold Conference" />
          <div>
            <h1>MARKETING<br /><em>ESTRATÉGICO</em></h1>
            <p>Uma central executiva para revisar, validar e acompanhar o plano de aquisição, relacionamento e vendas dos seis congressos até abril de 2027.</p>
          </div>
        </div>
        <div className="hero-actions">
          <button type="button" className="lime-button" onClick={() => scrollToSection("calendario")}>Explorar calendário <ArrowDown size={17} /></button>
          <button type="button" className="ghost-button" onClick={() => scrollToSection("objetivos")}>Registrar avanços <Target size={17} /></button>
        </div>
      </div>
      <div className="hero-stats">
        <article><strong>06</strong><span>CONGRESSOS<br />EM UM ECOSSISTEMA</span></article>
        <article><strong>06</strong><span>ISCAS DIGITAIS<br />CONTRATADAS</span></article>
        <article><strong>06/10</strong><span>ABERTURA DE VENDAS<br />DATA CONFIRMADA</span></article>
        <article><strong>ABR.27</strong><span>HORIZONTE<br />ESTRATÉGICO</span></article>
      </div>
      <div className="hero-rail">ARNOLD CONFERENCE · NUTRIÇÃO ESPORTIVA · NUTRIÇÃO ESTÉTICA · SONAFE · GESTÃO DE ACADEMIAS · {WTTC_PUBLIC_NAME.toUpperCase()} · BODYBUILDING</div>
    </section>
  );
}

function ExecutiveSummary() {
  return (
    <section className="executive-summary section-pad">
      <div className="summary-manifesto">
        <p className="eyebrow">SUMÁRIO EXECUTIVO</p>
        <Quote size={30} />
        <h2>Outubro leva cada público de um problema reconhecido à inscrição no congresso certo.</h2>
      </div>
      <div className="summary-copy">
        <p>A nova fase começa em 28/09, primeira data livre do calendário, com Nutrição Esportiva. Os ciclos seguem por Nutrição Estética, SONAFE, Gestão de Academias, Certificação Internacional em Personal Training – WTTC e Bodybuilding, mantendo três pautas para cada congresso. Em 30/09, a campanha anuncia que as inscrições abrem em 06/10. Depois da abertura, conteúdo, e-mail, mídia e WhatsApp ajudam a converter e perseguir a lotação máxima de cada sala.</p>
        <p>A geração de leads continua em paralelo para quem ainda está pesquisando. Ela não substitui venda: a LP de novidades identifica interesse, enquanto compra confirmada e ocupação por congresso passam a ser os indicadores principais da fase.</p>
        <div className="command-status">
          <article><span>ESTADO DO PLANO</span><strong><CircleDot size={15} /> Em revisão executiva</strong><p>Conteúdo consolidado; validação do cliente e do marketing interno em andamento.</p></article>
          <article><span>PRÓXIMA DECISÃO</span><strong><Target size={15} /> Preparar a abertura de 06/10</strong><p>Fechar checkout, links de venda, condições públicas e suporte antes de ativar a campanha comercial.</p></article>
          <article><span>DEPENDÊNCIA CRÍTICA</span><strong><CalendarClock size={15} /> Operação comercial</strong><p>Preços e lotes já estão documentados internamente; publicar somente após a validação comercial final dos materiais e destinos.</p></article>
        </div>
        <div className="journey-line" aria-label="Etapas da jornada">
          {["Reconhecer", "Escolher", "Acompanhar", "Inscrever", "Retomar", "Confirmar", "Ocupar"].map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>)}
        </div>
      </div>
    </section>
  );
}

function CongressSection() {
  const [active, setActive] = useState("Todos");
  const visible = active === "Todos" ? congresses : congresses.filter((item) => item.name === active);

  return (
    <section id="publicos" className="section-pad congress-section">
      <SectionHeader index="03" eyebrow="PÚBLICOS E PROPOSTA DE VALOR" title="Seis congressos. Seis problemas profissionais específicos." description="Cada proposta parte de uma situação reconhecível, sem frases genéricas e sem comparar produtos de públicos diferentes." />
      <div className="congress-filter"><button type="button" className={active === "Todos" ? "active" : ""} onClick={() => setActive("Todos")}>Visão geral</button>{congresses.map((item) => <button type="button" className={active === item.name ? "active" : ""} key={item.name} onClick={() => setActive(item.name)}>{getCongressDisplayName(item.name)}</button>)}</div>
      <div className={`congress-grid ${active !== "Todos" ? "single" : ""}`}>
        {visible.map((item, index) => (
          <article key={item.name} className="congress-card" style={{ "--congress-accent": item.accent } as React.CSSProperties}>
            <div className="congress-card-top"><span>{String(index + 1).padStart(2, "0")}</span><img src={congressLogos[item.name]} alt={`Logo ${getCongressDisplayName(item.name)}`} /></div>
            <div className="congress-card-body"><small>PÚBLICO PRIORITÁRIO</small><p>{item.audience}</p><small>PROBLEMA CENTRAL</small><h3>{item.tension}</h3><small>PROMESSA DE COMUNICAÇÃO</small><p className="promise">{item.promise}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContentLab() {
  const [active, setActive] = useState(pieceTypes[0].name);
  const current = pieceTypes.find((item) => item.name === active) ?? pieceTypes[0];

  return (
    <section id="laboratorio" className="section-pad content-lab">
      <SectionHeader index="06" eyebrow="LABORATÓRIO DE CONTEÚDO" title="Como reconhecer um corte que realmente merece virar post" description="A busca começa pela transcrição e termina no arquivo original. Se a fala não funcionar isoladamente, a alternativa é parte do planejamento — não um improviso." />
      <div className="cut-method">
        {cutMethod.map((item) => <article key={item.step}><span>{String(item.step).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.action}</p><small><CheckCircle2 size={14} /> {item.criterion}</small></div></article>)}
      </div>
      <div className="format-workbench">
        <div className="format-menu">
          <p className="eyebrow">BIBLIOTECA DE FORMATOS</p>
          {pieceTypes.map((item) => <button type="button" className={active === item.name ? "active" : ""} key={item.name} onClick={() => setActive(item.name)}>{item.name}<ArrowRight size={15} /></button>)}
        </div>
        <div className="format-detail" key={current.name}>
          <div className="format-icon"><Sparkles /></div>
          <span>NA PRÁTICA</span><h3>{current.use}</h3>
          <div><small>QUANDO USAR</small><p>{current.when}</p></div>
          <div className="fallback-box"><small>ALTERNATIVA SEGURA</small><p>{current.fallback}</p></div>
        </div>
        <div className="editorial-rule"><ShieldCheck size={22} /><p><strong>Regra editorial:</strong> não cortar uma fala apenas porque ela parece impactante. O trecho precisa existir, funcionar sozinho e ter relação clara com o destino do CTA.</p></div>
      </div>
    </section>
  );
}

function EmailPlan() {
  const [tab, setTab] = useState<"base" | "nurture" | "assets" | "performance">(() => {
    if (typeof window === "undefined") return "base";
    const requested = new URLSearchParams(window.location.search).get("email-tab");
    return requested === "nurture" || requested === "assets" || requested === "performance" ? requested : "base";
  });
  const [campaignMonth, setCampaignMonth] = useState<"Setembro" | "Outubro">("Outubro");
  const visibleEmailBase = emailBase.filter(item => campaignMonth === "Outubro" ? item.id.startsWith("email-oct-") : !item.id.startsWith("email-oct-"));
  useEffect(() => {
    const emailFocusId = new URLSearchParams(window.location.search).get("email-focus");
    if (!emailFocusId) return;
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(emailFocusId)?.scrollIntoView()));
  }, []);
  return (
    <section id="email" className="section-pad email-section">
      <SectionHeader index="09" eyebrow="PLANO DE E-MAIL MARKETING" title="Uma base de 10 mil contatos não é uma lista homogênea" description="A intensidade comercial cresce com sinais reais de abertura, clique, histórico e intenção. Cada envio tem um CTA clicável e um único destino principal." />
      <div className="channel-principles">
        <article><Mail /><strong>Segmentação real</strong><p>Histórico, origem, data do último engajamento, cliques e compra.</p></article>
        <article><MousePointerClick /><strong>Um CTA principal</strong><p>O botão conduz ao próximo passo da jornada; uma referência secundária só entra quando aprofunda o conteúdo sem competir com ele.</p></article>
        <article><ShieldCheck /><strong>Supressão disciplinada</strong><p>Já converteu, comprou, recusou ou pediu saída: não repetir a mesma solicitação.</p></article>
      </div>
      <div className="external-operation-note"><FileText size={19} /><div><span>ORIENTAÇÃO ESTRATÉGICA</span><strong>A plataforma define a lógica da régua; a produção e a aprovação ficam na planilha operacional</strong><p>Aqui permanecem público, objetivo, materiais, CTA, destino, regra e gates de cada envio. Copy final, link da prévia, ajustes e status devem ser controlados com as agências na planilha compartilhada, junto da evidência e do horário de cada GO.</p></div></div>
      <div className="email-tabs">
        <button type="button" className={tab === "base" ? "active" : ""} onClick={() => setTab("base")}>Campanhas para a base</button>
        <button type="button" className={tab === "nurture" ? "active" : ""} onClick={() => setTab("nurture")}>Sequência das masterclasses</button>
        <button type="button" className={tab === "assets" ? "active" : ""} onClick={() => setTab("assets")}>Materiais necessários</button>
        <button type="button" className={tab === "performance" ? "active" : ""} onClick={() => setTab("performance")}>Performance e ranking</button>
      </div>
      {tab === "base" ? <>
        <div className="plan-month-tabs" role="tablist" aria-label="Mês das campanhas de e-mail">
          <button type="button" role="tab" aria-selected={campaignMonth === "Setembro"} className={campaignMonth === "Setembro" ? "active" : ""} onClick={() => setCampaignMonth("Setembro")}>Setembro · histórico e produção</button>
          <button type="button" role="tab" aria-selected={campaignMonth === "Outubro"} className={campaignMonth === "Outubro" ? "active" : ""} onClick={() => setCampaignMonth("Outubro")}>Outubro · abertura e venda</button>
        </div>
        {campaignMonth === "Outubro" ? (
          <section className="email-gate-map">
            <header><ShieldCheck size={22} /><div><span>GATES DE LIBERAÇÃO · ACESSO DA AGÊNCIA</span><strong>Requisito escrito não significa status verde</strong><p>A agência consulta os critérios nesta plataforma. O GO precisa ser registrado pelo cliente e pela operação, com evidência e horário, na planilha compartilhada. Sem evidência, o envio usa o fallback ou é cancelado.</p></div></header>
            <div>
              {emailOperationalGates.map(gate => (
                <article key={gate.id}>
                  <small>{gate.moment}</small>
                  <h3>{gate.title}</h3>
                  <p><b>Quem vê e decide:</b> {gate.access}</p>
                  <p><b>Evidência necessária:</b> {gate.evidence}</p>
                  <p><b>NO-GO:</b> {gate.noGo}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <div className="email-timeline">
          {visibleEmailBase.map((item) => <article id={item.id} key={item.id}><span className="email-date">{item.date}</span><div><small>PÚBLICO</small><p>{item.audience}</p><small>OBJETIVO</small><h3>{item.objective}</h3><p className="material-note"><FileText size={15} /> {item.materials}</p><div className="email-cta"><MousePointerClick size={16} /><strong>{item.cta}</strong><span>{item.destination}</span></div><small className="rule-note">{item.rule}</small><EmailCampaignBriefDetail emailId={item.id} /></div></article>)}
        </div>
      </> : null}
      {tab === "nurture" ? <div className="nurture-grid">{emailNurture.map((item, index) => <article id={item.id} key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.moment}</small><h3>{item.content}</h3><div><strong>{item.cta}</strong><p>{item.destination}</p></div><em>{item.condition}</em></article>)}</div> : null}
      {tab === "assets" ? <div className="assets-table"><div className="assets-head"><span>Material</span><span>Conteúdo mínimo</span><span>Prazo</span></div>{emailAssets.map((item) => <div key={item.material}><strong>{item.material}</strong><p>{item.minimum}</p><span>{item.deadline}</span></div>)}</div> : null}
      {tab === "performance" ? <EmailPerformanceDashboard /> : null}
    </section>
  );
}

function WhatsAppPlan() {
  const [planMonth, setPlanMonth] = useState<"Setembro" | "Outubro">("Outubro");
  const visibleWhatsAppPlan = whatsappPlan.filter(item => planMonth === "Outubro" ? item.date.includes("/10") : item.date.includes("/09"));
  return (
    <section id="whatsapp" className="section-pad whatsapp-section">
      <div className="whatsapp-strategy-grid">
        <div className="whatsapp-heading"><div><p className="eyebrow">PLANO DE WHATSAPP</p><h2>Alta intenção.<br /><em>Baixo ruído.</em></h2><p>O canal não repete redes sociais e e-mail. Ele entra onde há consentimento, urgência real e próximo passo claro.</p></div><MessageCircleMore size={72} /></div>
        <div><div className="plan-month-tabs on-purple" role="tablist" aria-label="Mês do plano de WhatsApp"><button type="button" role="tab" aria-selected={planMonth === "Setembro"} className={planMonth === "Setembro" ? "active" : ""} onClick={() => setPlanMonth("Setembro")}>Setembro</button><button type="button" role="tab" aria-selected={planMonth === "Outubro"} className={planMonth === "Outubro" ? "active" : ""} onClick={() => setPlanMonth("Outubro")}>Outubro</button></div><div className="whatsapp-flow">{visibleWhatsAppPlan.map((item, index) => <article key={`${item.date}-${item.function}`}><span className="whatsapp-step">{index + 1}</span><div><small>{item.date}</small><h3>{item.function}</h3><p>{item.segment}</p><strong><ArrowRight size={15} /> {item.destination}</strong></div></article>)}</div></div>
        <div className="whatsapp-rule"><ShieldCheck size={21} /><p>Recuperação pós-abertura não é disparo em massa. Interromper após compra, resposta negativa ou pedido de saída. Pagamento pendente e abandono de checkout recebem fluxos distintos.</p></div>
      </div>
      <WhatsAppPerformanceDashboard />
    </section>
  );
}

function RoadmapSection() {
  const [selected, setSelected] = useState(roadmap[0].month);
  const current = roadmap.find((item) => item.month === selected) ?? roadmap[0];
  return (
    <section id="roadmap" className="section-pad roadmap-section">
      <SectionHeader index="11" eyebrow="ROADMAP ATÉ O EVENTO" title="Outubro abre as vendas e começa a perseguição da lotação por sala." description="A abertura está confirmada para 06/10, mas a comunicação comercial só entra com checkout, links, condições, tracking e suporte validados. As fases futuras serão revistas com vendas e ocupação reais." />
      <div className="roadmap-stage">
        <img src={brandAssets.roadmap} alt="Representação abstrata da jornada estratégica até o evento" />
        <div className="roadmap-months">{roadmap.map((item) => <button type="button" className={selected === item.month ? "active" : ""} key={item.month} onClick={() => setSelected(item.month)}><span>{item.month}</span><strong>{item.title}</strong></button>)}</div>
        <div className="roadmap-detail" key={current.month}><p className="eyebrow">{current.month.toUpperCase()} · MOVIMENTO ESTRATÉGICO</p><h3>{current.title}</h3><p>{current.summary}</p><div>{current.deliverables.map((item) => <span key={item}><CircleDot size={15} /> {item}</span>)}</div></div>
      </div>
    </section>
  );
}

function IndicatorsSection() {
  const [openIndicatorLayer, setOpenIndicatorLayer] = useState<IndicatorLayerId | null>(() => getInitialIndicatorLayer());
  return <section id="indicadores" className="section-pad kpi-section">
    <SectionHeader index="12" eyebrow="PAINEL DE ACOMPANHAMENTO" title="Quatro camadas, quatro perguntas diferentes" description="Comece pela lotação, identifique quem está sendo captado pela LP de novidades, diagnostique o Instagram e use o funil para localizar avanços e travas. Cada dado deve entrar uma única vez." />
    <div className="indicator-accordion" aria-label="Camadas do painel de Indicadores">
      <IndicatorAccordionItem id="lotacao" number="01" level="RESULTADO PRINCIPAL" title="Lotação das salas" summary="Inscrições confirmadas, capacidade, ritmo de ocupação e consulta comercial separada." primary open={openIndicatorLayer === "lotacao"} onToggle={() => setOpenIndicatorLayer(current => current === "lotacao" ? null : "lotacao")}>
        <IndicatorGuide number="01" level="RESULTADO PRINCIPAL" title="Lotação das salas" purpose="Quantas inscrições confirmadas cada congresso acumulou em relação à capacidade vigente da sala. Preços e lotes ficam em um bloco separado de consulta." cadence="Registre as vendas confirmadas no fechamento de cada mês e corrija o mês quando houver conciliação. Consulte a virada de lote ao planejar a comunicação." source="Plataforma de vendas, pedidos pagos e relatório financeiro conciliado por congresso; planilha comercial interna para preços e lotes." avoid="Leads, checkouts iniciados, pagamentos pendentes, seguidores ou alcance. Preço e lote orientam a estratégia, mas não entram no percentual de ocupação." primary />
        <OccupancyDashboard />
      </IndicatorAccordionItem>
      <IndicatorAccordionItem id="leads" number="02" level="FONTES DE AQUISIÇÃO" title="Central de Landing Pages" summary="Tráfego, captação, perfil e consumo separados por página de origem." open={openIndicatorLayer === "leads"} onToggle={() => setOpenIndicatorLayer(current => current === "leads" ? null : "leads")}>
        <IndicatorGuide number="02" level="FONTES DE AQUISIÇÃO" title="Central de Landing Pages" purpose="Registrar cada resultado na página que o gerou: perfil e interesse na LP de novidades; captação, entrega e consumo na LP das masterclasses." cadence="Faça fotografias semanais ou mensais com o mesmo período em cada origem e preencha somente eventos disponíveis." source="Relatórios filtrados de cada landing page, página de obrigado e eventos reais do player das aulas." avoid="Misturar páginas, somar acumulados, redigitar dados nos KPIs ou estimar consumo sem evento configurado." />
        <LandingPageCenter />
      </IndicatorAccordionItem>
      <IndicatorAccordionItem id="social" number="03" level="DIAGNÓSTICO DO CANAL" title="Desempenho do Instagram" summary="Alcance, consumo, interação, crescimento, formatos e horários." open={openIndicatorLayer === "social"} onToggle={() => setOpenIndicatorLayer(current => current === "social" ? null : "social")}>
        <IndicatorGuide number="03" level="DIAGNÓSTICO DO CANAL" title="Desempenho do Instagram" purpose="Se os conteúdos estão alcançando pessoas e gerando consumo, interação, compartilhamento, salvamento e crescimento do perfil." cadence="Faça o fechamento mensal com os totais da conta e as medianas de Reels, Posts não Reels e Stories publicados no período." source="Exportações do Meta Business Suite e relatório da mLabs, sempre usando o mesmo intervalo de datas." avoid="Leads da landing page, cliques de e-mail, compras, receita ou métricas sociais que a exportação não disponibiliza." />
        <SocialGoalsDashboard />
      </IndicatorAccordionItem>
      <IndicatorAccordionItem id="funil" number="04" level="CONSOLIDAÇÃO DO FUNIL" title="Aquisição e vendas" summary="KPIs automáticos de Social, LPs, E-mail, WhatsApp e Vendas." open={openIndicatorLayer === "funil"} onToggle={() => setOpenIndicatorLayer(current => current === "funil" ? null : "funil")}>
        <IndicatorGuide number="04" level="CONSOLIDAÇÃO DO FUNIL" title="Aquisição e vendas" purpose="Reunir automaticamente os resultados informados nas áreas específicas e manter editáveis apenas consolidações ou etapas ainda sem rastreamento." cadence="Atualize cada dado na área de origem; este painel lê o fechamento mais recente e mostra sua fonte e período." source="Social, Central de Landing Pages, Performance de E-mail, Performance de WhatsApp e Lotação das salas." avoid="Redigitar métricas já conectadas, somar origens duas vezes ou preencher dados ausentes por estimativa." />
        <KpiDashboard />
      </IndicatorAccordionItem>
    </div>
  </section>;
}

export default function Home() {
  const isCalendarPlanView = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("calendar-plan-view");
  if (isCalendarPlanView) return <StrategyLayout><section id="calendario" className="section-pad calendar-section"><SectionHeader index="07" eyebrow="CALENDÁRIO EDITORIAL · VISÃO ESTRATÉGICA" title="Pautas, formatos e CTAs sem fluxo operacional" description="Modo isolado para validar o calendário estratégico após a retirada de legenda, links de arte e status." /><CalendarExplorer /></section></StrategyLayout>;
  const isEmailPlanView = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("email-plan-view");
  if (isEmailPlanView) return <StrategyLayout><EmailPlan /></StrategyLayout>;
  const isWhatsAppReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("whatsapp-review");
  if (isWhatsAppReview) return <StrategyLayout><WhatsAppPlan /></StrategyLayout>;
  const isIntelligenceReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("intelligence-review");
  if (isIntelligenceReview) return <StrategyLayout><section id="inteligencia" className="section-pad intelligence-section"><SectionHeader index="04" eyebrow="INTELIGÊNCIA DE PROGRAMAÇÃO E CONTEÚDO" title="Uma fonte única para decidir quem atrair e o que produzir" description="A programação oficial organiza a promessa de 2027; o acervo de 2026 fornece matéria-prima." /><EditorialIntelligence /></section></StrategyLayout>;
  const isPaidMediaReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("paid-media-review");
  if (isPaidMediaReview) return <StrategyLayout><section id="midia-paga" className="section-pad paid-media-section"><SectionHeader index="08" eyebrow="REVISÃO DO PLANO DE MÍDIA PAGA" title="Packs de mídia já previstos no calendário" description="Modo isolado para validar somente os desdobramentos previamente solicitados nos grandes marcos, sem antecipar novas peças exclusivas." /><PaidMediaHub /></section></StrategyLayout>;
  const isLeadProfileReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("lead-profile-review");
  if (isLeadProfileReview) return <StrategyLayout><section id="indicadores" className="section-pad kpi-section"><SectionHeader index="12" eyebrow="REVISÃO DA CENTRAL DE LANDING PAGES" title="Cada página como uma fonte separada" description="Modo isolado para validar a LP de novidades e a LP das masterclasses no mesmo local, sem misturar seus dados." /><IndicatorGuide number="02" level="FONTES DE AQUISIÇÃO" title="Central de Landing Pages" purpose="Registrar tráfego, captação, perfil e consumo na página que originou cada dado e consolidar os KPIs automaticamente." cadence="Faça fotografias com o mesmo período em cada origem e preencha somente os eventos disponíveis nos relatórios." source="Relatórios filtrados da LP de novidades, LP das masterclasses, página de obrigado e player das aulas." avoid="Somar as duas páginas dentro de uma fotografia, redigitar dados no funil ou estimar eventos não configurados." /><LandingPageCenter /></section></StrategyLayout>;
  const isMasterclassMagnetReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("masterclass-magnet-review");
  if (isMasterclassMagnetReview) return <StrategyLayout><section id="iscas" className="section-pad magnets-section"><SectionHeader index="03" eyebrow="REVISÃO DA PERFORMANCE DA ISCA" title="Masterclasses com leitura automática" description="Modo isolado para validar a performance alimentada pela Central de Landing Pages, sem qualquer campo duplicado." /><LeadMagnetExplorer /></section></StrategyLayout>;
  const isSocialReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("social-review");
  if (isSocialReview) return <StrategyLayout><section id="indicadores" className="section-pad kpi-section"><SectionHeader index="12" eyebrow="REVISÃO DO PAINEL SOCIAL" title="Metas de referência do Instagram" description="Modo isolado para validar resultados mensais, referências por formato e limites de interpretação." /><SocialGoalsDashboard /></section></StrategyLayout>;
  const isFunnelReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("funnel-review");
  if (isFunnelReview) return <StrategyLayout><section id="indicadores" className="section-pad kpi-section"><SectionHeader index="12" eyebrow="REVISÃO DO FUNIL INTEGRADO" title="Aquisição e vendas" description="Modo isolado para validar a consolidação automática de Social, LP, E-mail, WhatsApp e Vendas, mantendo manual apenas o que ainda não possui fonte interna." /><IndicatorGuide number="04" level="CONSOLIDAÇÃO DO FUNIL" title="Aquisição e vendas" purpose="Reunir automaticamente os resultados informados nas áreas específicas e manter editáveis apenas consolidações ou etapas ainda sem rastreamento." cadence="Atualize cada dado na área de origem; este painel lê o fechamento mais recente e mostra sua fonte e período." source="Social, Leads e perfil, Performance de E-mail, Performance de WhatsApp e Lotação das salas." avoid="Redigitar métricas já conectadas, somar origens duas vezes ou preencher dados ausentes por estimativa." /><KpiDashboard /></section></StrategyLayout>;
  const isIndicatorsReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("indicators-review");
  if (isIndicatorsReview) return <StrategyLayout><IndicatorsSection /></StrategyLayout>;

  return (
    <StrategyLayout>
      <ExecutiveHero />
      <ExecutiveSummary />

      <section id="objetivos" className="section-pad objectives-section">
        <SectionHeader index="02" eyebrow="OBJETIVOS E VALIDAÇÃO" title="O avanço precisa deixar rastros" description="Registre metas, resultados e evidências. O sucesso não será medido pela quantidade de posts, mas pela passagem entre etapas." />
        <ObjectiveTracker />
      </section>

      <CongressSection />

      <section id="inteligencia" className="section-pad intelligence-section">
        <SectionHeader index="04" eyebrow="INTELIGÊNCIA DE PROGRAMAÇÃO E CONTEÚDO" title="Uma fonte única para decidir quem atrair e o que produzir" description="A programação oficial organiza a promessa de 2027; o acervo de 2026 fornece matéria-prima. As três visões abaixo mantêm essas funções separadas, mas conectadas." />
        <EditorialIntelligence />
      </section>

      <section id="iscas" className="section-pad lead-magnet-section">
        <SectionHeader index="05" eyebrow="PORTFÓLIO DE AQUISIÇÃO" title="Seis iscas, cada uma com um trabalho diferente" description="As entregas evoluem de prova para diagnóstico, aplicação e decisão. As três masterclasses contam como uma única isca." />
        <LeadMagnetExplorer />
        <div className="future-materials"><div><p className="eyebrow">INSUMOS FUTUROS</p><h3>{WTTC_PUBLIC_NAME}, SONAFE e Bodybuilding</h3><p>Esses materiais não são iscas adicionais. Eles fortalecem conteúdos, páginas, diagnóstico e planejador.</p></div>{futureMaterials.map((item) => <article key={item.congress}><strong>{item.congress}</strong><p>{item.materials}</p><span>{item.use}</span></article>)}</div>
      </section>

      <ContentLab />

      <section id="calendario" className="section-pad calendar-section">
        <SectionHeader index="07" eyebrow="CALENDÁRIO EDITORIAL · SETEMBRO E OUTUBRO" title="Cada peça precisa responder: para quem, por que agora e qual é o próximo passo" description="Setembro permanece preservado. A nova fase começa em 28/09 por Nutrição Esportiva e repete três ciclos na mesma ordem, sem mudar o peso entre congressos. O dia 30/09 fica exclusivamente para o anúncio da abertura em 06/10." />
        <CalendarExplorer />
      </section>

      <section id="midia-paga" className="section-pad paid-media-section">
        <SectionHeader index="08" eyebrow="PLANO DE MÍDIA PAGA" title="Packs de mídia já previstos no calendário" description="O módulo reúne somente os desdobramentos solicitados nos grandes marcos. Peças exclusivas serão incluídas apenas depois de análise e validação do cliente." />
        <PaidMediaHub />
      </section>

      <EmailPlan />
      <WhatsAppPlan />
      <RoadmapSection />

      <IndicatorsSection />

      <footer className="site-footer">
        <img src={brandAssets.conferenceLogo} alt="Arnold Conference" />
        <div><strong>PLANEJAMENTO INTERATIVO 2027</strong><p>Versão executiva baseada no documento integrado de marketing. O documento continua sendo a fonte para orientações que não fazem parte desta interface.</p></div>
        <button type="button" onClick={() => scrollToSection("visao")}>Voltar ao topo <ArrowDown size={16} /></button>
      </footer>
    </StrategyLayout>
  );
}
