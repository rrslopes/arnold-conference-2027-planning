/**
 * Design philosophy: "Sala de Comando da Campanha" — página executiva, assimétrica
 * e didática, com profundidade por camadas e identidade Arnold aplicada ao sistema inteiro.
 */
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
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
import PaidMediaHub from "@/components/PaidMediaHub";
import {
  brandAssets,
  congressLogos,
  congresses,
  cutMethod,
  emailAssets,
  emailBase,
  emailNurture,
  futureMaterials,
  pieceTypes,
  roadmap,
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
          <button type="button" className="lime-button" onClick={() => scrollToSection("calendario")}>Explorar primeira fase <ArrowDown size={17} /></button>
          <button type="button" className="ghost-button" onClick={() => scrollToSection("objetivos")}>Registrar avanços <Target size={17} /></button>
        </div>
      </div>
      <div className="hero-stats">
        <article><strong>06</strong><span>CONGRESSOS<br />EM UM ECOSSISTEMA</span></article>
        <article><strong>06</strong><span>ISCAS DIGITAIS<br />CONTRATADAS</span></article>
        <article><strong>23.09</strong><span>ABERTURA<br />ÀS 12H</span></article>
        <article><strong>ABR.27</strong><span>HORIZONTE<br />ESTRATÉGICO</span></article>
      </div>
      <div className="hero-rail">ARNOLD CONFERENCE · GESTÃO · WTTC · SONAFE · NUTRIÇÃO · BODYBUILDING</div>
    </section>
  );
}

function ExecutiveSummary() {
  return (
    <section className="executive-summary section-pad">
      <div className="summary-manifesto">
        <p className="eyebrow">SUMÁRIO EXECUTIVO</p>
        <Quote size={30} />
        <h2>O plano não é uma sucessão de posts. É uma jornada que transforma atenção em decisão.</h2>
      </div>
      <div className="summary-copy">
        <p>O Arnold Conference 2027 será trabalhado como <strong>um ecossistema de seis congressos</strong>. Cada conteúdo precisa recuperar atenção, captar, identificar interesses, provar profundidade, orientar a escolha, preparar a decisão, vender ou acompanhar o participante.</p>
        <p>A primeira campanha usa três masterclasses de 2026 — Ana Paula Pujol, Andreia Naves e Roberto Tranjan — como prova de qualidade. A estratégia segue até abril com diagnóstico, guias especializados, planejador e integração do participante.</p>
        <div className="command-status">
          <article><span>ESTADO DO PLANO</span><strong><CircleDot size={15} /> Em revisão executiva</strong><p>Conteúdo consolidado; validação do cliente e do marketing interno em andamento.</p></article>
          <article><span>PRÓXIMA DECISÃO</span><strong><Target size={15} /> Aprovar a primeira fase</strong><p>Confirmar pautas, responsáveis e peças previstas de 31/08 a 23/09.</p></article>
          <article><span>DEPENDÊNCIA CRÍTICA</span><strong><CalendarClock size={15} /> Oferta comercial</strong><p>Preço, regras do primeiro lote, URLs de inscrição e condições precisam ser validados.</p></article>
        </div>
        <div className="journey-line" aria-label="Etapas da jornada">
          {["Reativar", "Captar", "Ativar", "Qualificar", "Vender", "Expandir", "Experiência"].map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>)}
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
      <SectionHeader index="03" eyebrow="PÚBLICOS E PROPOSTA DE VALOR" title="Seis congressos. Seis tensões profissionais reais." description="As propostas são territórios estratégicos provisórios e devem ser revisadas quando a programação de 2027 estiver confirmada." />
      <div className="congress-filter"><button type="button" className={active === "Todos" ? "active" : ""} onClick={() => setActive("Todos")}>Visão geral</button>{congresses.map((item) => <button type="button" className={active === item.name ? "active" : ""} key={item.name} onClick={() => setActive(item.name)}>{item.name}</button>)}</div>
      <div className={`congress-grid ${active !== "Todos" ? "single" : ""}`}>
        {visible.map((item, index) => (
          <article key={item.name} className="congress-card" style={{ "--congress-accent": item.accent } as React.CSSProperties}>
            <div className="congress-card-top"><span>{String(index + 1).padStart(2, "0")}</span><img src={congressLogos[item.name]} alt={`Logo ${item.name}`} /></div>
            <div className="congress-card-body"><small>PÚBLICO PRIORITÁRIO</small><p>{item.audience}</p><small>TENSÃO CENTRAL</small><h3>{item.tension}</h3><small>PROMESSA DE COMUNICAÇÃO</small><p className="promise">{item.promise}</p></div>
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
  return (
    <section id="email" className="section-pad email-section">
      <SectionHeader index="09" eyebrow="PLANO DE E-MAIL MARKETING" title="Uma base de 10 mil contatos não é uma lista homogênea" description="A intensidade comercial cresce com sinais reais de abertura, clique, histórico e intenção. Todo e-mail tem um CTA clicável e um único destino principal." /><div className="channel-principles"><article><Mail /><strong>Segmentação real</strong><p>Histórico, origem, data do último engajamento, cliques e compra.</p></article><article><MousePointerClick /><strong>Um CTA principal</strong><p>O botão pode se repetir, mas sempre leva ao mesmo destino.</p></article><article><ShieldCheck /><strong>Supressão disciplinada</strong><p>Comprou, recusou ou pediu saída: interromper a pressão comercial.</p></article></div>
      <div className="external-operation-note"><FileText size={19} /><div><span>ORIENTAÇÃO ESTRATÉGICA</span><strong>A plataforma define a lógica da régua; a produção e a aprovação ficam na planilha operacional</strong><p>Aqui permanecem público, objetivo, materiais, CTA, destino e regra de cada envio. Copy final, link da prévia, ajustes e status devem ser controlados com as agências na planilha compartilhada.</p></div></div>
      <div className="email-tabs"><button type="button" className={tab === "base" ? "active" : ""} onClick={() => setTab("base")}>Campanhas para a base</button><button type="button" className={tab === "nurture" ? "active" : ""} onClick={() => setTab("nurture")}>Sequência das masterclasses</button><button type="button" className={tab === "assets" ? "active" : ""} onClick={() => setTab("assets")}>Materiais necessários</button><button type="button" className={tab === "performance" ? "active" : ""} onClick={() => setTab("performance")}>Performance e ranking</button></div>
      {tab === "base" ? <div className="email-timeline">{emailBase.map((item) => <article id={item.id} key={item.id}><span className="email-date">{item.date}</span><div><small>PÚBLICO</small><p>{item.audience}</p><small>OBJETIVO</small><h3>{item.objective}</h3><p className="material-note"><FileText size={15} /> {item.materials}</p><div className="email-cta"><MousePointerClick size={16} /><strong>{item.cta}</strong><span>{item.destination}</span></div><small className="rule-note">{item.rule}</small></div></article>)}</div> : null}
      {tab === "nurture" ? <div className="nurture-grid">{emailNurture.map((item, index) => <article id={item.id} key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.moment}</small><h3>{item.content}</h3><div><strong>{item.cta}</strong><p>{item.destination}</p></div><em>{item.condition}</em></article>)}</div> : null}
      {tab === "assets" ? <div className="assets-table"><div className="assets-head"><span>Material</span><span>Conteúdo mínimo</span><span>Prazo</span></div>{emailAssets.map((item) => <div key={item.material}><strong>{item.material}</strong><p>{item.minimum}</p><span>{item.deadline}</span></div>)}</div> : null}
      {tab === "performance" ? <EmailPerformanceDashboard /> : null}
    </section>
  );
}

function WhatsAppPlan() {
  return (
    <section id="whatsapp" className="section-pad whatsapp-section">
      <div className="whatsapp-heading"><div><p className="eyebrow">PLANO DE WHATSAPP</p><h2>Alta intenção.<br /><em>Baixo ruído.</em></h2><p>O canal não repete redes sociais e e-mail. Ele entra onde há consentimento, urgência real e próximo passo claro.</p></div><MessageCircleMore size={72} /></div>
      <div className="whatsapp-flow">{whatsappPlan.map((item, index) => <article key={item.date}><span className="whatsapp-step">{index + 1}</span><div><small>{item.date}</small><h3>{item.function}</h3><p>{item.segment}</p><strong><ArrowRight size={15} /> {item.destination}</strong></div></article>)}</div>
      <div className="whatsapp-rule"><ShieldCheck size={21} /><p>Recuperação pós-abertura não é disparo em massa. Interromper após compra, resposta negativa ou pedido de saída. Pagamento pendente e abandono de checkout recebem fluxos distintos.</p></div>
    </section>
  );
}

function RoadmapSection() {
  const [selected, setSelected] = useState(roadmap[0].month);
  const current = roadmap.find((item) => item.month === selected) ?? roadmap[0];
  return (
    <section id="roadmap" className="section-pad roadmap-section">
      <SectionHeader index="11" eyebrow="ROADMAP ATÉ O EVENTO" title="Setembro abre as vendas. Abril encerra um ciclo de maturação." description="As fases futuras permanecem em nível estratégico para que o calendário seja revisto conforme dados, programação, oferta e capacidade real da equipe." />
      <div className="roadmap-stage">
        <img src={brandAssets.roadmap} alt="Representação abstrata da jornada estratégica até o evento" />
        <div className="roadmap-months">{roadmap.map((item) => <button type="button" className={selected === item.month ? "active" : ""} key={item.month} onClick={() => setSelected(item.month)}><span>{item.month}</span><strong>{item.title}</strong></button>)}</div>
        <div className="roadmap-detail" key={current.month}><p className="eyebrow">{current.month.toUpperCase()} · MOVIMENTO ESTRATÉGICO</p><h3>{current.title}</h3><p>{current.summary}</p><div>{current.deliverables.map((item) => <span key={item}><CircleDot size={15} /> {item}</span>)}</div></div>
      </div>
    </section>
  );
}

export default function Home() {
  const isCalendarPlanView = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("calendar-plan-view");
  if (isCalendarPlanView) return <StrategyLayout><section id="calendario" className="section-pad calendar-section"><SectionHeader index="07" eyebrow="CALENDÁRIO EDITORIAL · VISÃO ESTRATÉGICA" title="Pautas, formatos e CTAs sem fluxo operacional" description="Modo isolado para validar o calendário estratégico após a retirada de legenda, links de arte e status." /><CalendarExplorer /></section></StrategyLayout>;
  const isEmailPlanView = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("email-plan-view");
  if (isEmailPlanView) return <StrategyLayout><EmailPlan /></StrategyLayout>;
  const isIntelligenceReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("intelligence-review");
  if (isIntelligenceReview) return <StrategyLayout><section id="inteligencia" className="section-pad intelligence-section"><SectionHeader index="04" eyebrow="INTELIGÊNCIA DE PROGRAMAÇÃO E CONTEÚDO" title="Uma fonte única para decidir quem atrair e o que produzir" description="A programação oficial organiza a promessa de 2027; o acervo de 2026 fornece matéria-prima." /><EditorialIntelligence /></section></StrategyLayout>;
  const isPaidMediaReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("paid-media-review");
  if (isPaidMediaReview) return <StrategyLayout><section id="midia-paga" className="section-pad paid-media-section"><SectionHeader index="08" eyebrow="REVISÃO DO PLANO DE MÍDIA PAGA" title="Packs de mídia já previstos no calendário" description="Modo isolado para validar somente os desdobramentos previamente solicitados nos grandes marcos, sem antecipar novas peças exclusivas." /><PaidMediaHub /></section></StrategyLayout>;
  const isSocialReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("social-review");
  if (isSocialReview) return <StrategyLayout><section id="indicadores" className="section-pad kpi-section"><SectionHeader index="12" eyebrow="REVISÃO DO PAINEL SOCIAL" title="Metas de referência do Instagram" description="Modo isolado para validar resultados mensais, referências por formato e limites de interpretação." /><SocialGoalsDashboard /></section></StrategyLayout>;
  const isFunnelReview = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("funnel-review");
  if (isFunnelReview) return <StrategyLayout><section id="indicadores" className="section-pad kpi-section"><SectionHeader index="12" eyebrow="REVISÃO DO FUNIL INTEGRADO" title="Aquisição e vendas" description="Modo isolado para validar a orientação de preenchimento do funil, sem repetir métricas de Instagram." /><IndicatorGuide number="03" level="DIAGNÓSTICO DO FUNIL" title="Aquisição e vendas" purpose="Onde a audiência deixa o canal social, converte em lead, consome a recompensa, responde às réguas e avança até a compra." cadence="Atualize semanalmente durante campanhas e mantenha o valor atual como acumulado do ciclo; registre o período na observação." source="Relatório geral de mensagens da Meta, landing pages, RD Station, UTMs, WhatsApp, analytics, checkout e plataforma de vendas." avoid="Resultados por palavra-chave ou automação individual da Meta, além de alcance, visualizações, seguidores, compartilhamentos ou salvamentos do Instagram." /><KpiDashboard /></section></StrategyLayout>;

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
        <div className="future-materials"><div><p className="eyebrow">INSUMOS FUTUROS</p><h3>WTTC, SONAFE e Bodybuilding</h3><p>Esses materiais não são iscas adicionais. Eles fortalecem conteúdos, páginas, diagnóstico e planejador.</p></div>{futureMaterials.map((item) => <article key={item.congress}><strong>{item.congress}</strong><p>{item.materials}</p><span>{item.use}</span></article>)}</div>
      </section>

      <ContentLab />

      <section id="calendario" className="section-pad calendar-section">
        <SectionHeader index="07" eyebrow="CALENDÁRIO EDITORIAL · PRIMEIRA FASE" title="Cada dia precisa responder: por que publicar e para onde levar" description="De 31/08 a 27/09, pauta, fonte, alternativa e CTA aparecem no mesmo cartão. Use os filtros para revisar por fase, formato ou congresso." />
        <CalendarExplorer />
      </section>

      <section id="midia-paga" className="section-pad paid-media-section">
        <SectionHeader index="08" eyebrow="PLANO DE MÍDIA PAGA" title="Packs de mídia já previstos no calendário" description="O módulo reúne somente os desdobramentos solicitados nos grandes marcos. Peças exclusivas serão incluídas apenas depois de análise e validação do cliente." />
        <PaidMediaHub />
      </section>

      <EmailPlan />
      <WhatsAppPlan />
      <RoadmapSection />

      <section id="indicadores" className="section-pad kpi-section">
        <SectionHeader index="12" eyebrow="PAINEL DE ACOMPANHAMENTO" title="Três camadas, três perguntas diferentes" description="Comece pelo resultado principal, use o Instagram para diagnosticar atenção e consulte o funil para localizar onde a jornada avança ou trava. Cada dado deve entrar uma única vez." />
        <IndicatorGuide number="01" level="RESULTADO PRINCIPAL" title="Lotação das salas" purpose="Quantas inscrições confirmadas cada congresso acumulou em relação à capacidade vigente da sala." cadence="Registre as vendas confirmadas no fechamento de cada mês e corrija o mês quando houver conciliação." source="Plataforma de vendas, pedidos pagos e relatório financeiro conciliado por congresso." avoid="Leads, checkouts iniciados, pagamentos pendentes, seguidores, alcance ou qualquer intenção ainda não convertida em inscrição." primary />
        <OccupancyDashboard />
        <div className="secondary-kpi-block"><IndicatorGuide number="02" level="DIAGNÓSTICO DO CANAL" title="Desempenho do Instagram" purpose="Se os conteúdos estão alcançando pessoas e gerando consumo, interação, compartilhamento, salvamento e crescimento do perfil." cadence="Faça o fechamento mensal com os totais da conta e as medianas de Reels, carrosséis e Stories publicados no período." source="Exportações do Meta Business Suite e relatório da mLabs, sempre usando o mesmo intervalo de datas." avoid="Leads da landing page, cliques de e-mail, compras, receita ou métricas sociais que a exportação não disponibiliza." /><SocialGoalsDashboard /></div>
        <div className="secondary-kpi-block"><IndicatorGuide number="03" level="DIAGNÓSTICO DO FUNIL" title="Aquisição e vendas" purpose="Onde a audiência deixa o canal social, converte em lead, consome a recompensa, responde às réguas e avança até a compra." cadence="Atualize semanalmente durante campanhas e mantenha o valor atual como acumulado do ciclo; registre o período na observação." source="Relatório geral de mensagens da Meta, landing pages, RD Station, UTMs, WhatsApp, analytics, checkout e plataforma de vendas." avoid="Resultados por palavra-chave ou automação individual da Meta, além de alcance, visualizações, seguidores, compartilhamentos ou salvamentos do Instagram." /><KpiDashboard /></div>
      </section>

      <footer className="site-footer">
        <img src={brandAssets.conferenceLogo} alt="Arnold Conference" />
        <div><strong>PLANEJAMENTO INTERATIVO 2027</strong><p>Versão executiva baseada no documento integrado de marketing. O documento continua sendo a fonte para orientações que não fazem parte desta interface.</p></div>
        <button type="button" onClick={() => scrollToSection("visao")}>Voltar ao topo <ArrowDown size={16} /></button>
      </footer>
    </StrategyLayout>
  );
}
