"use client";

import * as React from "react";
import type { ForwardRate } from "../../lib/security/types";
import { SegmentedControl } from "../ui/segmented-control";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "../ui/table";
import { cn } from "../ui/cn";
import styles from "./forward-rates-table.module.css";

interface ForwardRatesTableProps {
  forwardRates: ForwardRate[];
  spotRate: number;
}

type DisplayMode = "points" | "annualized" | "outright";

const DISPLAY_OPTIONS = [
  { value: "points", label: "Points" },
  { value: "annualized", label: "Annualized %" },
  { value: "outright", label: "Outright Rate" },
];

function fmtRate(v: number): string {
  if (v >= 100) return v.toFixed(4);
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(5);
}

function fmtPoints(v: number): string {
  return v >= 0 ? `+${v.toFixed(4)}` : v.toFixed(4);
}

function fmtPct(v: number): string {
  return `${v.toFixed(2)}%`;
}

export function ForwardRatesTable({
  forwardRates,
  spotRate,
}: ForwardRatesTableProps) {
  const [mode, setMode] = React.useState<DisplayMode>("points");

  /* Split into pillar tenors and month-end rows, preserving insertion order */
  const pillars = forwardRates.filter((r) => r.isMonthEnd !== true);
  const monthEnds = forwardRates.filter((r) => r.isMonthEnd === true);

  /* Build unified row list: pillars first, then a separator + month-ends */
  const rows: Array<{ type: "data" | "separator"; rate?: ForwardRate }> = [];
  for (const r of pillars) {
    rows.push({ type: "data", rate: r });
  }
  if (monthEnds.length > 0) {
    rows.push({ type: "separator" });
    for (const r of monthEnds) {
      rows.push({ type: "data", rate: r });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Forward Rates</h3>
        <SegmentedControl
          options={DISPLAY_OPTIONS}
          value={mode}
          onChange={(v) => setMode(v as DisplayMode)}
          size="sm"
        />
      </div>

      <div className={styles.tableWrap}>
        <Table className={styles.table}>
          <TableHead>
            <tr className={styles.headRow}>
              <TableHeaderCell>Tenor</TableHeaderCell>
              <TableHeaderCell className={styles.dateCol}>
                Settlement Date
              </TableHeaderCell>
              <TableHeaderCell
                className={cn(
                  styles.numCol,
                  mode === "outright" && styles.emphasizedHeader,
                )}
              >
                Forward Rate
              </TableHeaderCell>
              <TableHeaderCell
                className={cn(
                  styles.numCol,
                  mode === "points" && styles.emphasizedHeader,
                )}
              >
                Fwd Points
              </TableHeaderCell>
              <TableHeaderCell
                className={cn(
                  styles.numCol,
                  mode === "annualized" && styles.emphasizedHeader,
                )}
              >
                Ann. Premium %
              </TableHeaderCell>
              <TableHeaderCell className={styles.numCol}>
                Hedging Cost
              </TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              if (row.type === "separator") {
                return (
                  <tr key="sep" className={styles.separatorRow}>
                    <td colSpan={6} className={styles.separatorCell}>
                      <span className={styles.separatorLine} />
                      <span className={styles.separatorText}>
                        Month-End
                      </span>
                      <span className={styles.separatorLine} />
                    </td>
                  </tr>
                );
              }

              const r = row.rate!;
              const isMonthEnd = r.isMonthEnd === true;
              const hedgingDanger = r.hedgingCostPct > 2.5;
              const hedgingBrand = r.hedgingCostPct < 1;

              return (
                <TableRow
                  key={`${r.tenor}-${r.settlementDate}-${i}`}
                  className={cn(
                    styles.dataRow,
                    isMonthEnd && styles.monthEndRow,
                  )}
                >
                  <TableCell className={styles.tenorCell}>
                    {isMonthEnd ? "EOM" : r.tenor}
                  </TableCell>
                  <TableCell className={styles.dateCol}>
                    {r.settlementDate}
                  </TableCell>
                  <TableCell
                    className={cn(
                      styles.numCol,
                      styles.mono,
                      mode === "outright" && styles.emphasizedCell,
                    )}
                  >
                    {fmtRate(r.forwardRate)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      styles.numCol,
                      styles.mono,
                      mode === "points" && styles.emphasizedCell,
                    )}
                  >
                    {fmtPoints(r.forwardPoints)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      styles.numCol,
                      styles.mono,
                      mode === "annualized" && styles.emphasizedCell,
                    )}
                  >
                    {fmtPct(r.annualizedPremiumPct)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      styles.numCol,
                      styles.mono,
                      hedgingBrand && styles.hedgingBrand,
                      hedgingDanger && styles.hedgingDanger,
                    )}
                  >
                    {fmtPct(r.hedgingCostPct)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerNote}>
          Spot reference: {fmtRate(spotRate)}
        </span>
      </div>
    </div>
  );
}
