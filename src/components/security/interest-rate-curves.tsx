"use client";

import * as React from "react";
import type { InterestRateCurve } from "../../lib/security/types";
import styles from "./interest-rate-curves.module.css";

interface InterestRateCurvesProps {
  domesticCurve: InterestRateCurve;
  foreignCurve: InterestRateCurve;
}

/**
 * Format an ISO date string as a relative time label (e.g. "2h ago", "3d ago").
 */
function relativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  if (Number.isNaN(diffMs) || diffMs < 0) return "just now";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function fmtRate(rate: number): string {
  return `${rate.toFixed(3)}%`;
}

function findRate(curve: InterestRateCurve, tenor: string): number | null {
  const match = curve.tenors.find((t) => t.tenor === tenor);
  return match ? match.rate : null;
}

function CurvePanel({ curve }: { curve: InterestRateCurve }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{curve.currency} Yield Curve</h3>
        <p className={styles.panelSubtitle}>
          ({curve.source} &middot; {relativeTime(curve.asOf)})
        </p>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tenor</th>
              <th className={styles.rateCol}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {curve.tenors.map((t) => (
              <tr key={t.tenor}>
                <td className={styles.tenorCol}>{t.tenor}</td>
                <td className={styles.rateCol}>{fmtRate(t.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InterestRateCurves({
  domesticCurve,
  foreignCurve,
}: InterestRateCurvesProps) {
  const domestic1Y = findRate(domesticCurve, "1Y");
  const foreign1Y = findRate(foreignCurve, "1Y");
  const diff =
    domestic1Y != null && foreign1Y != null
      ? (domestic1Y - foreign1Y).toFixed(3)
      : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <CurvePanel curve={domesticCurve} />
        <CurvePanel curve={foreignCurve} />
      </div>

      {diff != null && (
        <div className={styles.differential}>
          <span className={styles.diffLabel}>Differential:</span>
          <span className={styles.diffValue}>{diff}%</span>
          <span className={styles.diffTenor}>(1Y)</span>
        </div>
      )}
    </div>
  );
}
