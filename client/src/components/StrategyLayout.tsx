/**
 * Design philosophy: "Sala de Comando da Campanha" — navegação persistente,
 * marca de congresso, contrastes roxo/lima e leitura executiva em camadas.
 */
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  Gauge,
  LayoutDashboard,
  Mail,
  Map,
  Menu,
  MessageCircleMore,
  SearchCheck,
  Sparkles,
  Target,
  UsersRound,
  X,
} from "lucide-react";
import { brandAssets, navigation } from "@/data/planData";

const navIcons: Record<string, typeof Gauge> = {
  visao: LayoutDashboard,
  objetivos: Target,
  publicos: UsersRound,
  iscas: Sparkles,
  laboratorio: SearchCheck,
  calendario: CalendarDays,
  email: Mail,
  whatsapp: MessageCircleMore,
  roadmap: Map,
  indicadores: BarChart3,
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  index,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  index: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-index" aria-hidden="true">{index}</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
    </div>
  );
}

export default function StrategyLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("arnold-sidebar-collapsed") === "true");
  const [active, setActive] = useState("visao");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem("arnold-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.removeItem("arnold-collaborator-name");
  }, []);

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
      const sections = navigation
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];
      const candidates = sections.filter((section) => section.getBoundingClientRect().top <= 180);
      const visible = candidates[candidates.length - 1];
      if (visible) setActive(visible.id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`strategy-shell ${collapsed ? "is-sidebar-collapsed" : ""}`}>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />

      <header className="mobile-header">
        <button type="button" className="icon-button" onClick={() => setOpen(true)} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <img src={brandAssets.conferenceLogo} alt="Arnold Conference" />
        <span>Plano 2027</span>
      </header>

      {open ? <button type="button" className="nav-backdrop" onClick={() => setOpen(false)} aria-label="Fechar menu" /> : null}

      <aside className={`sidebar ${open ? "sidebar-open" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}>
        <button type="button" className="desktop-sidebar-toggle" onClick={() => setCollapsed(current => !current)} aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"} title={collapsed ? "Expandir menu" : "Recolher menu"}>
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          <span>{collapsed ? "Expandir" : "Recolher"}</span>
        </button>
        <div className="sidebar-top">
          <button type="button" className="sidebar-close" onClick={() => setOpen(false)} aria-label="Fechar menu"><X /></button>
          <div className="brand-lockup">
            <img src={brandAssets.conferenceLogo} alt="Arnold Conference" />
            <div>
              <strong>PLANO 2027</strong>
              <span>Central estratégica</span>
            </div>
          </div>
          <div className="launch-chip">
            <span>ABERTURA DE VENDAS</span>
            <strong>23 SET · 12H</strong>
          </div>
        </div>

        <nav aria-label="Navegação principal">
          {navigation.map((item, index) => {
            const Icon = navIcons[item.id] ?? BookOpenCheck;
            return (
              <button
                type="button"
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => goTo(item.id)}
                aria-label={item.label}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-number">{String(index + 1).padStart(2, "0")}</span>
                <Icon size={17} />
                <span>{item.label}</span>
                <ChevronRight size={15} className="nav-arrow" />
              </button>
            );
          })}
        </nav>

      </aside>

      <main className="content-stage">{children}</main>
    </div>
  );
}
