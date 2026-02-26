"use client";

import * as React from "react";
import type { CalendarDay } from "../../lib/security/types";
import { cn } from "../ui/cn";
import { Badge } from "../ui/badge";
import styles from "./forward-calendar.module.css";

interface ForwardCalendarProps {
  calendar: Record<string, CalendarDay[]>;
  spotRate: number;
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmtRate(v: number): string {
  if (v >= 100) return v.toFixed(2);
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(4);
}

function fmtPremium(v: number): string {
  return v >= 0 ? `+${v.toFixed(4)}` : v.toFixed(4);
}

function parseMonthKey(key: string): { year: number; month: number } {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m - 1 };
}

function monthLabel(key: string): string {
  const { year, month } = parseMonthKey(key);
  return `${MONTH_NAMES[month]} ${year}`;
}

function shortMonthLabel(key: string): string {
  const { year, month } = parseMonthKey(key);
  return `${MONTH_NAMES[month].slice(0, 3)} ${year}`;
}

/** Compute max absolute premium across all calendar days for opacity scaling */
function getMaxPremium(calendar: Record<string, CalendarDay[]>): number {
  let max = 0;
  for (const days of Object.values(calendar)) {
    for (const d of days) {
      if (d.forwardPremium !== null) {
        max = Math.max(max, Math.abs(d.forwardPremium));
      }
    }
  }
  return max || 1;
}

export function ForwardCalendar({
  calendar,
  spotRate,
}: ForwardCalendarProps) {
  const monthKeys = React.useMemo(
    () => Object.keys(calendar).sort(),
    [calendar],
  );

  /* Navigation: show 2 months at a time */
  const [pageStart, setPageStart] = React.useState(0);
  const visibleKeys = monthKeys.slice(pageStart, pageStart + 2);

  /* Which month is selected for the detail panel */
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    monthKeys[0] ?? "",
  );

  /* Keep selectedMonth in sync when data changes */
  React.useEffect(() => {
    if (monthKeys.length > 0 && !monthKeys.includes(selectedMonth)) {
      setSelectedMonth(monthKeys[0]);
    }
  }, [monthKeys, selectedMonth]);

  const maxPremium = React.useMemo(() => getMaxPremium(calendar), [calendar]);

  const canPrev = pageStart > 0;
  const canNext = pageStart + 2 < monthKeys.length;

  const goPrev = () => setPageStart((p) => Math.max(0, p - 2));
  const goNext = () =>
    setPageStart((p) => Math.min(monthKeys.length - 2, p + 2));

  const selectedDays = calendar[selectedMonth] ?? [];

  return (
    <div className={styles.container}>
      {/* ── Left: Calendar Grids ── */}
      <div className={styles.calendarPanel}>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            disabled={!canPrev}
            onClick={goPrev}
            aria-label="Previous months"
          >
            &#8249;
          </button>
          <span className={styles.navTitle}>
            {visibleKeys.map((k) => shortMonthLabel(k)).join("  /  ")}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            disabled={!canNext}
            onClick={goNext}
            aria-label="Next months"
          >
            &#8250;
          </button>
        </div>

        <div className={styles.gridsRow}>
          {visibleKeys.map((key) => (
            <MonthGrid
              key={key}
              monthKey={key}
              days={calendar[key]}
              maxPremium={maxPremium}
              isSelected={key === selectedMonth}
              onSelectMonth={() => setSelectedMonth(key)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: Detail Panel ── */}
      <div className={styles.detailPanel}>
        <h4 className={styles.detailTitle}>{monthLabel(selectedMonth)}</h4>
        <div className={styles.detailTableWrap}>
          <table className={styles.detailTable}>
            <thead>
              <tr className={styles.detailHeadRow}>
                <th className={styles.detailTh}>Date</th>
                <th className={cn(styles.detailTh, styles.detailRight)}>
                  Forward Rate
                </th>
                <th className={cn(styles.detailTh, styles.detailRight)}>
                  Fwd Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedDays
                .filter((d) => !d.isWeekend)
                .map((d) => {
                  const dateObj = new Date(d.date);
                  const label = dateObj.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  });

                  return (
                    <tr
                      key={d.date}
                      className={cn(
                        styles.detailRow,
                        d.isMonthEnd && styles.detailMonthEnd,
                        d.isHoliday && styles.detailHoliday,
                      )}
                    >
                      <td className={styles.detailCell}>
                        <span className={styles.detailDate}>{label}</span>
                        {d.isHoliday && (
                          <Badge variant="danger">{d.holidayName}</Badge>
                        )}
                        {d.isMonthEnd && <Badge variant="info">EOM</Badge>}
                      </td>
                      <td
                        className={cn(
                          styles.detailCell,
                          styles.detailRight,
                          styles.mono,
                        )}
                      >
                        {d.forwardRate !== null ? fmtRate(d.forwardRate) : "—"}
                      </td>
                      <td
                        className={cn(
                          styles.detailCell,
                          styles.detailRight,
                          styles.mono,
                        )}
                      >
                        {d.forwardPremium !== null
                          ? fmtPremium(d.forwardPremium)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className={styles.detailFooter}>
          <span className={styles.footerNote}>
            Spot: {fmtRate(spotRate)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
 * MonthGrid sub-component
 * ──────────────────────────────────────────── */

interface MonthGridProps {
  monthKey: string;
  days: CalendarDay[];
  maxPremium: number;
  isSelected: boolean;
  onSelectMonth: () => void;
}

function MonthGrid({
  monthKey,
  days,
  maxPremium,
  isSelected,
  onSelectMonth,
}: MonthGridProps) {
  const { month } = parseMonthKey(monthKey);
  const firstDow = days[0]?.dayOfWeek ?? 0;

  /* Build grid cells: leading blanks + day cells */
  const blanks = Array.from({ length: firstDow }, (_, i) => (
    <div key={`blank-${i}`} className={styles.cellBlank} />
  ));

  const dayCells = days.map((d) => {
    const opacity =
      d.forwardPremium !== null
        ? Math.min(Math.abs(d.forwardPremium) / maxPremium, 1)
        : 0;

    const bgStyle: React.CSSProperties =
      d.isHoliday
        ? { background: `rgba(var(--color-semantic-danger-600-rgb), ${0.1 + opacity * 0.15})` }
        : d.isWeekend
          ? {}
          : d.forwardPremium !== null
            ? { background: `rgba(var(--color-brand-500-rgb), ${0.04 + opacity * 0.2})` }
            : {};

    return (
      <div
        key={d.date}
        className={cn(
          styles.cell,
          d.isWeekend && styles.cellWeekend,
          d.isHoliday && styles.cellHoliday,
          d.isMonthEnd && styles.cellMonthEnd,
        )}
        style={bgStyle}
        title={
          d.isHoliday
            ? d.holidayName
            : d.forwardRate !== null
              ? `Fwd: ${fmtRate(d.forwardRate)}`
              : undefined
        }
      >
        <span className={styles.cellDay}>{new Date(d.date).getDate()}</span>
        {d.forwardRate !== null && !d.isWeekend && (
          <span className={styles.cellRate}>{d.forwardRate.toFixed(2)}</span>
        )}
        {d.isHoliday && <span className={styles.holidayDot} />}
      </div>
    );
  });

  return (
    <div className={cn(styles.monthGrid, isSelected && styles.monthGridSelected)}>
      <button
        type="button"
        className={styles.monthHeader}
        onClick={onSelectMonth}
      >
        {MONTH_NAMES[month]}
      </button>
      <div className={styles.dayLabels}>
        {DAY_LABELS.map((l) => (
          <span key={l} className={styles.dayLabel}>
            {l}
          </span>
        ))}
      </div>
      <div className={styles.grid}>
        {blanks}
        {dayCells}
      </div>
    </div>
  );
}
