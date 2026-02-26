"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  Activity,
  Briefcase,
  Calculator,
  ChevronLeft,
} from "lucide-react";
import { useSecurityData } from "../../../lib/security/use-security-data";
import { SectionAnchorNav } from "../../../components/ui/section-anchor-nav";
import type { AnchorSection } from "../../../components/ui/section-anchor-nav";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  SecurityHero,
  KeyStatistics,
  PerformanceSummary,
  HistoricalChart,
  ForwardRatesTable,
  ForwardCalendar,
  TechnicalSummary,
  InterestRateCurves,
  RelatedPositions,
  ActiveRules,
  HedgingCalculator,
  CurrencyConverter,
} from "../../../components/security";
import styles from "./security-page.module.css";

const SECTIONS: AnchorSection[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "chart", label: "Chart", icon: TrendingUp },
  { id: "forwards", label: "Forwards", icon: Calendar },
  { id: "technical", label: "Technical", icon: Activity },
  { id: "positions", label: "Positions", icon: Briefcase },
  { id: "tools", label: "Tools", icon: Calculator },
];

interface SecurityPageProps {
  pairId: string;
}

export function SecurityPage({ pairId }: SecurityPageProps) {
  const data = useSecurityData(pairId);
  const [activeSection, setActiveSection] = React.useState("overview");
  const [heroCondensed, setHeroCondensed] = React.useState(false);

  // IntersectionObserver for active section tracking
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const section of SECTIONS) {
      const el = document.getElementById(`section-${section.id}`);
      if (!el) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
              setActiveSection(section.id);
            }
          }
        },
        { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [data]);

  // Condensed hero on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setHeroCondensed(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Escape") {
        window.location.href = "/rates";
        return;
      }

      const idx = parseInt(e.key);
      if (idx >= 1 && idx <= SECTIONS.length) {
        const section = SECTIONS[idx - 1];
        const el = document.getElementById(`section-${section.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton}>
          <Skeleton style={{ height: 200, borderRadius: 14 }} />
          <Skeleton style={{ height: 40 }} />
          <Skeleton style={{ height: 120 }} />
          <Skeleton style={{ height: 400 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/rates" className={styles.breadcrumbLink}>
          <ChevronLeft size={14} />
          Rates
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>
          {data.pair.displayName} ({data.pair.market === "offshore" ? "Offshore" : "Onshore"})
        </span>
      </nav>

      {/* Condensed hero (sticky) */}
      {heroCondensed && (
        <div className={styles.stickyHero}>
          <SecurityHero
            pair={data.pair}
            spot={data.spot}
            forwardRates={data.forwardRates}
            condensed
          />
        </div>
      )}

      {/* Full hero */}
      <SecurityHero
        pair={data.pair}
        spot={data.spot}
        forwardRates={data.forwardRates}
      />

      {/* Anchor nav */}
      <SectionAnchorNav
        sections={SECTIONS}
        activeId={activeSection}
        className={styles.anchorNav}
      />

      {/* === OVERVIEW === */}
      <section id="section-overview" className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewMain}>
            <KeyStatistics pair={data.pair} spot={data.spot} />
          </div>
          <div className={styles.overviewSide}>
            <PerformanceSummary performance={data.performance} />
          </div>
        </div>
      </section>

      {/* === CHART === */}
      <section id="section-chart" className={styles.section}>
        <h2 className={styles.sectionTitle}>Historical Chart</h2>
        <HistoricalChart candles={data.historical} pairId={pairId} />
      </section>

      {/* === FORWARDS === */}
      <section id="section-forwards" className={styles.section}>
        <h2 className={styles.sectionTitle}>Forward Rates</h2>
        <ForwardRatesTable
          forwardRates={data.forwardRates}
          spotRate={data.spot.bid}
        />
        <div className={styles.sectionGap} />
        <ForwardCalendar
          calendar={data.calendar}
          spotRate={data.spot.bid}
        />
      </section>

      {/* === TECHNICAL === */}
      <section id="section-technical" className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical Analysis</h2>
        <TechnicalSummary technicals={data.technicals} />
        <div className={styles.sectionGap} />
        <InterestRateCurves
          domesticCurve={data.domesticCurve}
          foreignCurve={data.foreignCurve}
        />
      </section>

      {/* === POSITIONS === */}
      <section id="section-positions" className={styles.section}>
        <h2 className={styles.sectionTitle}>Positions & Rules</h2>
        <RelatedPositions positions={data.positions} />
        <div className={styles.sectionGap} />
        <ActiveRules rules={data.rules} pairDisplayName={data.pair.displayName} />
      </section>

      {/* === TOOLS === */}
      <section id="section-tools" className={styles.section}>
        <h2 className={styles.sectionTitle}>Tools</h2>
        <div className={styles.toolsGrid}>
          <HedgingCalculator
            spotRate={data.spot.bid}
            forwardRates={data.forwardRates}
          />
          <CurrencyConverter pair={data.pair} spotRate={data.spot.bid} />
        </div>
      </section>
    </div>
  );
}
