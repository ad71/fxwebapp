"use client";

import * as React from "react";
import type { InterestRateCurve } from "../../lib/security/types";
import styles from "./interest-rate-curves.module.css";

interface InterestRateCurvesProps {
  domesticCurve: InterestRateCurve;
  foreignCurve: InterestRateCurve;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (isNaN(diff) || diff < 0) return "just now";
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmt(r: number) { return r.toFixed(2) + "%"; }
function fmtSpread(d: number) { return (d >= 0 ? "+" : "") + d.toFixed(2) + "%"; }

type TenorRow = { tenor: string; domestic: number; foreign: number; spread: number };

function buildRows(a: InterestRateCurve, b: InterestRateCurve): TenorRow[] {
  return a.tenors.map(({ tenor, rate: ra }) => {
    const rb = b.tenors.find((t) => t.tenor === tenor)?.rate ?? ra;
    return { tenor, domestic: ra, foreign: rb, spread: ra - rb };
  });
}

type Shape = "normal" | "inverted" | "flat";

function curveShape(c: InterestRateCurve): Shape {
  const rates = c.tenors.map((t) => t.rate);
  const delta = rates[rates.length - 1] - rates[0];
  if (delta > 0.12) return "normal";
  if (delta < -0.12) return "inverted";
  return "flat";
}

const SHAPE_LABEL: Record<Shape, string> = {
  normal: "Normal ↗",
  inverted: "Inverted ↘",
  flat: "Flat →",
};

// ─── SVG path helpers ────────────────────────────────────────────────────────

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const dx = (cx - px) / 2.4;
    d += ` C ${px + dx},${py} ${cx - dx},${cy} ${cx},${cy}`;
  }
  return d;
}

function areaPath(upper: [number, number][], lower: [number, number][]): string {
  const top = smoothPath(upper);
  const bottom = [...lower].reverse().map(([x, y]) => `L ${x} ${y}`).join(" ");
  return `${top} ${bottom} Z`;
}

function curveAreaPath(pts: [number, number][], baseY: number): string {
  const top = smoothPath(pts);
  return `${top} L ${pts[pts.length - 1][0]},${baseY} L ${pts[0][0]},${baseY} Z`;
}

// ─── Chart constants (square: SZ × SZ) ──────────────────────────────────────

const PL = 44, PR = 14, PT = 22, PB = 36;

// ─── Chart sub-component ────────────────────────────────────────────────────

function YieldChart({
  rows,
  hovered,
  onHover,
}: {
  rows: TenorRow[];
  hovered: number | null;
  onHover: (i: number | null) => void;
}) {
  const paneRef = React.useRef<HTMLDivElement>(null);
  const [SZ, setSZ] = React.useState(360);

  // Dynamic square viewBox — avoids letterboxing and text distortion
  React.useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setSZ(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cw = SZ - PL - PR;
  const ch = SZ - PT - PB;

  const allRates = rows.flatMap((r) => [r.domestic, r.foreign]);
  const rMin = Math.min(...allRates) - 0.15;
  const rMax = Math.max(...allRates) + 0.15;
  const rRange = rMax - rMin;

  const xOf = (i: number) => PL + (i / (rows.length - 1)) * cw;
  const yOf = (r: number) => PT + ch - ((r - rMin) / rRange) * ch;

  const dPts: [number, number][] = rows.map((r, i) => [xOf(i), yOf(r.domestic)]);
  const fPts: [number, number][] = rows.map((r, i) => [xOf(i), yOf(r.foreign)]);

  const avgSpread = rows.reduce((s, r) => s + r.spread, 0) / rows.length;
  const upper = avgSpread >= 0 ? dPts : fPts;
  const lower = avgSpread >= 0 ? fPts : dPts;

  const gridStep = rRange > 4 ? 1 : rRange > 1.5 ? 0.5 : 0.25;
  const gridStart = Math.ceil(rMin / gridStep) * gridStep;
  const gridLines: number[] = [];
  for (let r = gridStart; r <= rMax + 0.001; r = +(r + gridStep).toFixed(4)) {
    gridLines.push(r);
  }

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * SZ;
    let ci = 0, cd = Infinity;
    rows.forEach((_, i) => {
      const d = Math.abs(xOf(i) - svgX);
      if (d < cd) { ci = i; cd = d; }
    });
    onHover(ci);
  };

  const hx = hovered !== null ? xOf(hovered) : null;
  const baseY = PT + ch;

  return (
    <div className={styles.chartPane} ref={paneRef}>
      <svg
        viewBox={`0 0 ${SZ} ${SZ}`}
        className={styles.chartSvg}
        onMouseMove={handleMove}
        onMouseLeave={() => onHover(null)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="yc-grad-d" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   style={{ stopColor: "var(--color-brand-500)",          stopOpacity: 0.22 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-brand-500)",          stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="yc-grad-f" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   style={{ stopColor: "var(--color-semantic-info-600)", stopOpacity: 0.16 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-semantic-info-600)", stopOpacity: 0 }} />
          </linearGradient>
          {/* Glow for active dots */}
          <filter id="yc-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines + Y labels */}
        {gridLines.map((r) => (
          <g key={r}>
            <line
              x1={PL} y1={yOf(r)} x2={SZ - PR} y2={yOf(r)}
              stroke="var(--color-border-subtle)"
              strokeWidth="0.75"
            />
            <text
              x={PL - 6} y={yOf(r)}
              textAnchor="end" dominantBaseline="middle"
              fontSize="9" fill="var(--color-ink-400)"
              fontFamily="var(--typography-fontFamily-mono)"
            >
              {r.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X-axis tenor labels */}
        {rows.map((row, i) => (
          <text
            key={row.tenor}
            x={xOf(i)} y={SZ - 10}
            textAnchor="middle"
            fontSize="8.5"
            fill={hovered === i ? "var(--color-ink-700)" : "var(--color-ink-400)"}
            fontWeight={hovered === i ? "700" : "400"}
            fontFamily="var(--typography-fontFamily-mono)"
          >
            {row.tenor}
          </text>
        ))}

        {/* Gradient area fills under each curve */}
        <path d={curveAreaPath(dPts, baseY)} fill="url(#yc-grad-d)" />
        <path d={curveAreaPath(fPts, baseY)} fill="url(#yc-grad-f)" />

        {/* Spread fill — neutral */}
        <path d={areaPath(upper, lower)} fill="rgba(148,162,180,0.10)" />

        {/* Active tenor column highlight */}
        {hx !== null && (
          <rect
            x={hx - 14} y={PT}
            width={28} height={ch}
            fill="rgba(148,162,180,0.06)"
            rx="3"
          />
        )}

        {/* Foreign curve */}
        <path
          d={smoothPath(fPts)} fill="none"
          stroke="var(--color-semantic-info-600)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          opacity="0.88"
        />

        {/* Domestic curve */}
        <path
          d={smoothPath(dPts)} fill="none"
          stroke="var(--color-brand-500)"
          strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Foreign dots */}
        {fPts.map(([x, y], i) => (
          <circle
            key={i} cx={x} cy={y}
            r={hovered === i ? 5 : 2.5}
            fill="var(--color-semantic-info-600)"
            stroke="var(--color-surface-1)" strokeWidth="1.5"
            filter={hovered === i ? "url(#yc-glow)" : undefined}
          />
        ))}

        {/* Domestic dots */}
        {dPts.map(([x, y], i) => (
          <circle
            key={i} cx={x} cy={y}
            r={hovered === i ? 5 : 2.5}
            fill="var(--color-brand-500)"
            stroke="var(--color-surface-1)" strokeWidth="1.5"
            filter={hovered === i ? "url(#yc-glow)" : undefined}
          />
        ))}

        {/* Crosshair */}
        {hx !== null && (
          <line
            x1={hx} y1={PT} x2={hx} y2={baseY}
            stroke="var(--color-ink-300)"
            strokeWidth="1" strokeDasharray="3 2"
          />
        )}
      </svg>
    </div>
  );
}

// Compute inline badge styles that form a smooth gradient across all tenor rows.
// t = 0 (ON) → surface-3 background, ink-600 text   (the "short" colour)
// t = 1 (10Y) → brand-500-at-8% background, brand-700 text  (the "long" colour)
// Everything in between is color-mix()-interpolated, dark-mode-safe.
function tenorBadgeStyle(i: number, total: number): React.CSSProperties {
  const t = total <= 1 ? 0 : i / (total - 1);
  const surface3Pct = ((1 - t) * 100).toFixed(1);
  return {
    background: `color-mix(in srgb, rgba(var(--color-brand-500-rgb), 0.08), var(--color-surface-3) ${surface3Pct}%)`,
    color: `color-mix(in srgb, var(--color-brand-700), var(--color-ink-600) ${surface3Pct}%)`,
  };
}

// ─── Data table ──────────────────────────────────────────────────────────────

function DataTable({
  rows,
  domesticCurve,
  foreignCurve,
  hovered,
  onHover,
}: {
  rows: TenorRow[];
  domesticCurve: InterestRateCurve;
  foreignCurve: InterestRateCurve;
  hovered: number | null;
  onHover: (i: number | null) => void;
}) {
  return (
    <div className={styles.tablePane}>
      {/* Column headers */}
      <div className={styles.ratesHeader}>
        <div className={styles.ratesTh} />
        <div className={`${styles.ratesTh} ${styles.ratesThRight}`}>
          <span className={styles.thDot} style={{ background: "var(--color-brand-500)" }} />
          {domesticCurve.currency}
        </div>
        <div className={`${styles.ratesTh} ${styles.ratesThRight}`}>
          <span className={styles.thDot} style={{ background: "var(--color-semantic-info-600)" }} />
          {foreignCurve.currency}
        </div>
        <div className={`${styles.ratesTh} ${styles.ratesThRight}`}>Spread</div>
      </div>

      {/* Rows — flex:1 each, they divide the available height equally */}
      <div className={styles.ratesBody}>
        {rows.map((row, i) => {
          const spreadCls = row.spread >= 0 ? styles.spreadPos : styles.spreadNeg;
          return (
            <div
              key={row.tenor}
              className={`${styles.ratesTr}${hovered === i ? " " + styles.ratesTrActive : ""}`}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
            >
              <div className={styles.ratesTd}>
                <span className={styles.tenorBadge} style={tenorBadgeStyle(i, rows.length)}>
                  {row.tenor}
                </span>
              </div>
              <div className={`${styles.ratesTd} ${styles.ratesTdRight} ${styles.valueCell}`}>
                {fmt(row.domestic)}
              </div>
              <div className={`${styles.ratesTd} ${styles.ratesTdRight} ${styles.valueCell}`}>
                {fmt(row.foreign)}
              </div>
              <div className={`${styles.ratesTd} ${styles.ratesTdRight} ${spreadCls}`}>
                {fmtSpread(row.spread)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function InterestRateCurves({
  domesticCurve,
  foreignCurve,
}: InterestRateCurvesProps) {
  const rows = buildRows(domesticCurve, foreignCurve);
  const [hovered, setHovered] = React.useState<number | null>(null);

  const spread1Y = rows.find((r) => r.tenor === "1Y")?.spread ?? null;
  const dShape = curveShape(domesticCurve);
  const fShape = curveShape(foreignCurve);
  const freshness = `${relativeTime(domesticCurve.asOf)} / ${relativeTime(foreignCurve.asOf)}`;

  const carryLong =
    spread1Y !== null ? (spread1Y >= 0 ? domesticCurve.currency : foreignCurve.currency) : null;
  const carryShort =
    spread1Y !== null ? (spread1Y >= 0 ? foreignCurve.currency : domesticCurve.currency) : null;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Yield Curve Differential</h3>
          <div className={styles.meta}>
            <span className={styles.badge} data-which="domestic">{domesticCurve.currency}</span>
            <span className={styles.metaVs}>vs</span>
            <span className={styles.badge} data-which="foreign">{foreignCurve.currency}</span>
            <span className={styles.metaSrc}>
              {domesticCurve.source} &middot; {foreignCurve.source}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.legend}>
            <span className={styles.legendLine} style={{ background: "var(--color-brand-500)" }} />
            <span className={styles.legendCcy}>{domesticCurve.currency}</span>
            <span className={styles.legendLine} style={{ background: "var(--color-semantic-info-600)" }} />
            <span className={styles.legendCcy}>{foreignCurve.currency}</span>
          </div>
          <span className={styles.freshness}>Updated {freshness}</span>
        </div>
      </div>

      {/* Body — square chart left, data table right */}
      <div className={styles.body}>
        <YieldChart rows={rows} hovered={hovered} onHover={setHovered} />
        <DataTable
          rows={rows}
          domesticCurve={domesticCurve}
          foreignCurve={foreignCurve}
          hovered={hovered}
          onHover={setHovered}
        />
      </div>

      {/* Carry insight footer */}
      {spread1Y !== null && carryLong && carryShort && (
        <div className={styles.footer}>
          <div className={styles.footerCarry}>
            <span className={styles.footerTag}>1Y Carry</span>
            <span className={styles.footerSpread} data-pos={spread1Y >= 0 ? "true" : "false"}>
              {fmtSpread(spread1Y)}
            </span>
            <span className={styles.footerSep}>·</span>
            <span className={styles.footerDir}>
              Long <strong>{carryLong}</strong> / Short <strong>{carryShort}</strong>
            </span>
          </div>
          <div className={styles.footerShapes}>
            <span>{domesticCurve.currency}: <strong>{SHAPE_LABEL[dShape]}</strong></span>
            <span className={styles.shapeSep}>·</span>
            <span>{foreignCurve.currency}: <strong>{SHAPE_LABEL[fShape]}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
