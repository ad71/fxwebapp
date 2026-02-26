"use client";

import * as React from "react";
import type { RelatedPosition } from "../../lib/security/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "../ui/table";
import { cn } from "../ui/cn";
import styles from "./related-positions.module.css";

interface RelatedPositionsProps {
  positions: RelatedPosition[];
}

const STATUS_MAP: Record<
  RelatedPosition["status"],
  { variant: "success" | "warning" | "danger"; label: string }
> = {
  hedged: { variant: "success", label: "Hedged" },
  partial: { variant: "warning", label: "Partial" },
  unhedged: { variant: "danger", label: "Unhedged" },
};

/** Format a number as USD with K/M suffix (e.g. $500K, $1.2M). */
function fmtUsd(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const k = value / 1_000;
    return `$${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function fmtPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function RelatedPositions({ positions }: RelatedPositionsProps) {
  if (positions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>No positions for this pair</p>
          <Button variant="primary" size="sm">
            Upload Positions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Related Positions</h3>
      </div>

      <div className={styles.tableWrap}>
        <Table className={styles.table}>
          <TableHead>
            <tr className={styles.headRow}>
              <TableHeaderCell>Position ID</TableHeaderCell>
              <TableHeaderCell className={styles.numCol}>Account</TableHeaderCell>
              <TableHeaderCell className={styles.numCol}>Amount</TableHeaderCell>
              <TableHeaderCell className={styles.numCol}>Hedged</TableHeaderCell>
              <TableHeaderCell className={styles.numCol}>Hedge Cost</TableHeaderCell>
              <TableHeaderCell>Maturity</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {positions.map((pos) => {
              const { variant, label } = STATUS_MAP[pos.status];
              return (
                <TableRow key={pos.positionId} className={styles.dataRow}>
                  <TableCell className={cn(styles.mono, styles.idCell)}>
                    {pos.positionId}
                  </TableCell>
                  <TableCell className={cn(styles.numCol, styles.mono)}>
                    {pos.accountNum}
                  </TableCell>
                  <TableCell className={cn(styles.numCol, styles.mono)}>
                    {fmtUsd(pos.amount)}
                  </TableCell>
                  <TableCell className={cn(styles.numCol, styles.mono)}>
                    {fmtUsd(pos.hedgeAmount)}
                  </TableCell>
                  <TableCell className={cn(styles.numCol, styles.mono)}>
                    {fmtPct(pos.hedgeCost)}
                  </TableCell>
                  <TableCell className={styles.dateCol}>
                    {pos.maturityDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
