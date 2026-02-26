"use client";

import * as React from "react";
import type { ActiveRule } from "../../lib/security/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../ui/cn";
import styles from "./active-rules.module.css";

interface ActiveRulesProps {
  rules: ActiveRule[];
  pairDisplayName: string;
}

const STATUS_MAP: Record<
  ActiveRule["status"],
  { variant: "success" | "danger" | "neutral"; label: string }
> = {
  passing: { variant: "success", label: "Passing" },
  violated: { variant: "danger", label: "Violated" },
  pending: { variant: "neutral", label: "Pending" },
};

/** Format an ISO date string as relative time (e.g. "3m ago", "2h ago"). */
function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1_000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActiveRules({ rules, pairDisplayName }: ActiveRulesProps) {
  if (rules.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>No rules configured</p>
          <Button variant="primary" size="sm">
            Create Rule
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Active Rules</h3>
        <Button variant="secondary" size="sm">
          Create Alert
        </Button>
      </div>

      <div className={styles.list}>
        {rules.map((rule) => {
          const { variant, label } = STATUS_MAP[rule.status];
          return (
            <div
              key={rule.ruleName}
              className={cn(
                styles.ruleCard,
                rule.status === "violated" && styles.violatedCard,
              )}
            >
              <div className={styles.ruleTop}>
                <span className={styles.ruleName}>{rule.ruleName}</span>
                <Badge variant={variant}>{label}</Badge>
              </div>
              <code className={styles.expression}>{rule.expression}</code>
              <span className={styles.evaluated}>
                Evaluated {relativeTime(rule.lastEvaluated)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
