"use client";

import * as React from "react";
import type { ForwardRate, CalendarDay } from "../../lib/security/types";
import { SegmentedControl } from "../ui/segmented-control";
import styles from "./forward-widget.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TOGGLE_OPTIONS = [
  { value: "tenors",    label: "Tenors"    },
  { value: "month-end", label: "Month-End" },
] as const;

type TableView = "tenors" | "month-end";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const SHORT_DATED = new Set(["ON", "TN", "1W", "2W"]);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function computeDefaultMonth(calendar: Record<string, CalendarDay[]>): string {
  const keys = Object.keys(calendar).sort();
  const today = new Date();
  const curKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  if (keys.includes(curKey)) {
    const remaining = (calendar[curKey] ?? [])
      .filter((d) => !d.isWeekend && !d.isHoliday && new Date(d.date) > today).length;
    if (remaining >= 5) return curKey;
  }
  return keys.find((k) => k > curKey) ?? keys[0] ?? curKey;
}

function parseMonthKey(key: string): { year: number; month: number } {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m - 1 }; // 0-indexed
}

function monthKeyLabel(key: string): string {
  const { year, month } = parseMonthKey(key);
  return `${MONTH_NAMES[month]} ${year}`;
}

function getPrevMonthKey(key: string): string {
  const { year, month } = parseMonthKey(key);
  if (month === 0) return `${year - 1}-12`;
  return `${year}-${String(month).padStart(2, "0")}`;
}

function getNextMonthKey(key: string): string {
  const { year, month } = parseMonthKey(key);
  if (month === 11) return `${year + 1}-01`;
  return `${year}-${String(month + 2).padStart(2, "0")}`;
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ForwardCalendarPanel (internal)
// ─────────────────────────────────────────────────────────────────────────────

interface CalendarPanelProps {
  calendar: Record<string, CalendarDay[]>;
  selectedMonth: string;
  onMonthChange: (key: string) => void;
  spotRate: number;
}

type GridItem =
  | { kind: "cell"; day: CalendarDay; overflow: boolean }
  | { kind: "blank" };

function ForwardCalendarPanel({ calendar, selectedMonth, onMonthChange, spotRate }: CalendarPanelProps) {
  const keys = React.useMemo(() => Object.keys(calendar).sort(), [calendar]);
  const currentIdx = keys.indexOf(selectedMonth);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < keys.length - 1;

  const todayStr = React.useMemo(() => localDateStr(new Date()), []);

  const days = calendar[selectedMonth] ?? [];
  const { year, month } = parseMonthKey(selectedMonth);
  const firstDow = new Date(year, month, 1).getDay();

  const prevKey = getPrevMonthKey(selectedMonth);
  const nextKey = getNextMonthKey(selectedMonth);
  const prevDays = calendar[prevKey] ?? [];
  const nextDays = calendar[nextKey] ?? [];
  const { month: prevMonth } = parseMonthKey(prevKey);

  // When the month starts on Sunday we add a full 7-cell overflow row from
  // the previous month so the user always sees a few days of context.
  // When firstDow > 0 we fill the leading blanks with overflow days instead.
  const leadingOverflowCount = firstDow === 0 ? 7 : firstDow;
  const leadingOverflow = prevDays.slice(-leadingOverflowCount);

  // Fill the trailing blanks with the first days of next month
  const totalFilled = leadingOverflow.length + days.length;
  const trailingCount = totalFilled % 7 === 0 ? 0 : 7 - (totalFilled % 7);
  const trailingOverflow = nextDays.slice(0, trailingCount);

  // Show a band label only when we added the full extra overflow row (firstDow===0)
  const showBand = firstDow === 0 && leadingOverflow.length > 0;

  const gridItems: GridItem[] = React.useMemo(() => {
    const items: GridItem[] = [];
    for (const d of leadingOverflow) items.push({ kind: "cell", day: d, overflow: true });
    for (const d of days)           items.push({ kind: "cell", day: d, overflow: false });
    for (const d of trailingOverflow) items.push({ kind: "cell", day: d, overflow: true });
    return items;
  }, [leadingOverflow, days, trailingOverflow]);

  return (
    <div className={styles.calLeft}>
      {/* Navigation */}
      <div className={styles.calNav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => canPrev && onMonthChange(keys[currentIdx - 1])}
          disabled={!canPrev}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className={styles.navTitle}>{monthKeyLabel(selectedMonth)}</span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => canNext && onMonthChange(keys[currentIdx + 1])}
          disabled={!canNext}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className={styles.dayLabels}>
        {DAY_LABELS.map((l) => (
          <div key={l} className={styles.dayLabel}>{l}</div>
        ))}
      </div>

      {/* Grid area: optional overflow band + 7-column cell grid */}
      <div className={styles.calGridArea}>
        {showBand && (
          <div className={styles.monthBand}>{MONTH_SHORT[prevMonth]}</div>
        )}

        <div className={styles.grid}>
          {gridItems.map((item, i) => {
            if (item.kind === "blank") {
              return <div key={`blank-${i}`} className={styles.cellBlank} />;
            }

            const d = item.day;
            const dayNum = new Date(d.date + "T12:00:00").getDate();
            const isToday = d.date === todayStr;

            const cellCls = [
              styles.cell,
              item.overflow                                   ? styles.cellOverflow : "",
              !item.overflow && d.isWeekend                  ? styles.cellWknd     : "",
              !item.overflow && !d.isWeekend && d.isHoliday  ? styles.cellHol      : "",
              !item.overflow && d.isMonthEnd && !d.isWeekend ? styles.cellEOM      : "",
              isToday                                         ? styles.cellToday    : "",
            ].filter(Boolean).join(" ");

            // Business day with rate data → horizontal split layout
            const showRates = !item.overflow && d.forwardRate !== null;
            const premPositive = d.forwardPremium !== null && d.forwardPremium >= 0;
            const pctCls = `${styles.cellPct} ${premPositive ? styles.cellPctPos : styles.cellPctNeg}`;

            const dayEl = isToday
              ? <span className={styles.todayCircle}>{dayNum}</span>
              : <span className={styles.cellDayNum}>{dayNum}</span>;

            return (
              <div key={d.date} className={cellCls} title={d.holidayName ?? d.date}>
                {!item.overflow && d.isHoliday && !d.isWeekend && (
                  <span className={styles.holidayDot} />
                )}

                {showRates ? (
                  /* ── Side-by-side: day number LEFT, rates RIGHT ── */
                  <div className={styles.cellContent}>
                    {dayEl}
                    <div className={styles.cellRatesCol}>
                      <span className={styles.cellRate}>
                        {d.forwardRate!.toFixed(4)}
                      </span>
                      {d.forwardPremium !== null && (
                        <span className={pctCls}>
                          {d.forwardPremium >= 0 ? "+" : ""}
                          {d.forwardPremium.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ── No data (weekend / overflow / holiday): just the day ── */
                  dayEl
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.calFooter}>
        <span className={styles.calSpot}>Spot: {spotRate.toFixed(4)}</span>
        <span className={styles.legendItem}>
          <span className={styles.legendEOM} /> EOM
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendHolDot} /> Holiday
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ForwardRatesPanel (internal)
// ─────────────────────────────────────────────────────────────────────────────

interface RatesPanelProps {
  rates: ForwardRate[];
  view: TableView;
  spotRate: number;
}

function eomBadgeLabel(settlementDate: string): string {
  // settlementDate format: "28-Feb-2026"
  const parts = settlementDate.split("-");
  if (parts.length < 3) return settlementDate;
  return `${parts[1]} '${parts[2].slice(2)}`;
}

function ForwardRatesPanel({ rates, view, spotRate }: RatesPanelProps) {
  const rows = React.useMemo(
    () => view === "tenors"
      ? rates.filter((r) => !r.isMonthEnd)
      : rates.filter((r) => r.isMonthEnd),
    [rates, view],
  );

  const maxAnn = React.useMemo(
    () => Math.max(...rows.map((r) => r.annualizedPremiumPct), 0.001),
    [rows],
  );

  return (
    <div className={styles.ratesRight}>
      {/* ── Column header ── */}
      <div className={styles.ratesHeader}>
        <div className={styles.ratesTh}>Tenor</div>
        <div className={styles.ratesTh}>Settlement</div>
        <div className={`${styles.ratesTh} ${styles.ratesThRight}`}>Outright</div>
        <div className={`${styles.ratesTh} ${styles.ratesThRight}`}>Fwd Pts</div>
        <div className={`${styles.ratesTh} ${styles.ratesThRight}`}>Ann. %</div>
      </div>

      {/* ── Rows — flex:1 per row fills height exactly ── */}
      <div className={styles.ratesBody}>
        {rows.map((r, i) => {
          const isGroupBoundary =
            view === "tenors" &&
            i > 0 &&
            !SHORT_DATED.has(r.tenor) &&
            SHORT_DATED.has(rows[i - 1].tenor);

          const ptsCls = r.forwardPoints >= 0 ? styles.ptsPos : styles.ptsNeg;
          const ptsSign = r.forwardPoints >= 0 ? "+" : "";

          const badgeCls = view === "tenors" && SHORT_DATED.has(r.tenor)
            ? `${styles.tenorBadge} ${styles.tenorBadgeShort}`
            : `${styles.tenorBadge} ${styles.tenorBadgeMonthly}`;

          const badgeLabel = view === "month-end"
            ? eomBadgeLabel(r.settlementDate)
            : r.tenor;

          const annHeat = Math.min((r.annualizedPremiumPct / maxAnn) * 100, 100);

          return (
            <React.Fragment key={`${r.tenor}-${r.settlementDate}-${i}`}>
              {isGroupBoundary && (
                <div className={styles.ratesGroupRow}>
                  <div className={styles.ratesGroupLabel}>Monthly</div>
                </div>
              )}
              <div className={styles.ratesTr}>
                <div className={styles.ratesTd}>
                  <span className={badgeCls}>{badgeLabel}</span>
                </div>
                <div className={`${styles.ratesTd} ${styles.settlementCell}`}>
                  {r.settlementDate}
                </div>
                <div className={`${styles.ratesTd} ${styles.ratesTdRight} ${styles.outrightCell}`}>
                  {r.forwardRate.toFixed(4)}
                </div>
                <div className={`${styles.ratesTd} ${styles.ratesTdRight} ${ptsCls}`}>
                  {ptsSign}{r.forwardPoints.toFixed(4)}
                </div>
                <div
                  className={`${styles.ratesTd} ${styles.ratesTdRight} ${styles.annCell}`}
                  style={{
                    background: `linear-gradient(to left, rgba(var(--color-brand-500-rgb), 0.13) ${annHeat}%, transparent ${annHeat}%)`,
                  }}
                >
                  {r.annualizedPremiumPct.toFixed(2)}%
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className={styles.ratesFooter}>
        Spot ref: <strong className={styles.ratesFooterSpot}>{spotRate.toFixed(4)}</strong>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ForwardWidget (public)
// ─────────────────────────────────────────────────────────────────────────────

export interface ForwardWidgetProps {
  forwardRates: ForwardRate[];
  calendar: Record<string, CalendarDay[]>;
  spotRate: number;
}

export function ForwardWidget({ forwardRates, calendar, spotRate }: ForwardWidgetProps) {
  const [tableView, setTableView] = React.useState<TableView>("tenors");
  const [selectedMonth, setSelectedMonth] = React.useState<string>(() =>
    computeDefaultMonth(calendar),
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Forward Rates</h3>
        <SegmentedControl
          options={TOGGLE_OPTIONS as unknown as Array<{ value: string; label: string }>}
          value={tableView}
          onChange={(v) => setTableView(v as TableView)}
          size="sm"
        />
      </div>
      <div className={styles.body}>
        <ForwardCalendarPanel
          calendar={calendar}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          spotRate={spotRate}
        />
        <ForwardRatesPanel
          rates={forwardRates}
          view={tableView}
          spotRate={spotRate}
        />
      </div>
    </div>
  );
}
