"use client";

import * as React from "react";
import Link from "next/link";
import {
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
import { SectionHeader } from "../../../components/ui/section-header";
import {
  SecurityOverviewCard,
  HistoricalChart,
  ForwardWidget,
  TechnicalSummary,
  InterestRateCurves,
  RelatedPositions,
  ActiveRules,
  HedgingCalculator,
  CurrencyConverter,
} from "../../../components/security";
import styles from "./security-page.module.css";

const SECTIONS: AnchorSection[] = [
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
  const [activeSection, setActiveSection] = React.useState("chart");

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

  // IntersectionObserver for section entrance animations
  React.useEffect(() => {
    const sectionEls = document.querySelectorAll(`.${styles.section}`);
    const entranceObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(styles.sectionVisible);
            entranceObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    sectionEls.forEach((el, i) => {
      (el as HTMLElement).style.setProperty("--section-delay", `${i * 80}ms`);
      entranceObserver.observe(el);
    });
    return () => entranceObserver.disconnect();
  }, [data]);

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
          {/* Hero skeleton */}
          <Skeleton style={{ height: 200, borderRadius: 14 }} />
          {/* Anchor nav skeleton */}
          <Skeleton style={{ height: 40, borderRadius: 8 }} />
          {/* Stats grid skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} style={{ height: 72, borderRadius: 8 }} />
            ))}
          </div>
          {/* Chart skeleton */}
          <Skeleton style={{ height: 400, borderRadius: 14 }} />
          {/* Table skeleton */}
          <Skeleton style={{ height: 48, borderRadius: 8, marginTop: 24 }} />
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={`r-${i}`} style={{ height: 36, borderRadius: 4 }} />
          ))}
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

      {/* Overview card */}
      <SecurityOverviewCard
        pair={data.pair}
        spot={data.spot}
        forwardRates={data.forwardRates}
        performance={data.performance}
      />

      {/* Anchor nav */}
      <SectionAnchorNav
        sections={SECTIONS}
        activeId={activeSection}
        className={styles.anchorNav}
      />

      {/* === CHART === */}
      <section id="section-chart" className={styles.section}>
        <SectionHeader title="Historical Chart" subtitle="Price action and moving averages" />
        <HistoricalChart candles={data.historical} pairId={pairId} />
      </section>

      {/* === FORWARDS === */}
      <section id="section-forwards" className={styles.section}>
        <SectionHeader title="Forward Rates" subtitle="Tenor curve and settlement calendar" />
        <ForwardWidget
          forwardRates={data.forwardRates}
          calendar={data.calendar}
          spotRate={data.spot.bid}
        />
      </section>

      {/* === TECHNICAL === */}
      <section id="section-technical" className={styles.section}>
        <SectionHeader title="Technical Analysis" subtitle="Indicators and interest rate differentials" />
        <TechnicalSummary technicals={data.technicals} />
        <div className={styles.sectionGap} />
        <InterestRateCurves
          domesticCurve={data.domesticCurve}
          foreignCurve={data.foreignCurve}
        />
      </section>

      {/* === POSITIONS === */}
      <section id="section-positions" className={styles.section}>
        <SectionHeader title="Positions & Rules" subtitle="Active hedges and alert rules" />
        <RelatedPositions positions={data.positions} />
        <div className={styles.sectionGap} />
        <ActiveRules rules={data.rules} pairDisplayName={data.pair.displayName} />
      </section>

      {/* === TOOLS === */}
      <section id="section-tools" className={styles.section}>
        <SectionHeader title="Tools" subtitle="Forward calculator and currency converter" />
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
