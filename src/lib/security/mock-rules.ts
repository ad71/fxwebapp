import type { ActiveRule } from "./types";

const RULE_TEMPLATES = [
  { name: "Rate Breach Alert", expr: "spot > {high}" },
  { name: "Spread Widening", expr: "spread > {threshold}" },
  { name: "Daily Move Limit", expr: "abs(changePct) > 0.5%" },
  { name: "Forward Premium Alert", expr: "fwd_premium_1M > 3%" },
  { name: "Rate Floor Watch", expr: "spot < {low}" },
];

const STATUSES: ActiveRule["status"][] = ["passing", "violated", "pending"];

export function generateRules(pairDisplayName: string, spotRate: number): ActiveRule[] {
  const count = 2 + Math.floor(Math.random() * 3);
  const rules: ActiveRule[] = [];
  const shuffled = [...RULE_TEMPLATES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const template = shuffled[i];
    const high = (spotRate * 1.005).toFixed(4);
    const low = (spotRate * 0.995).toFixed(4);
    const threshold = (spotRate * 0.0005).toFixed(4);

    const expression = template.expr
      .replace("{high}", high)
      .replace("{low}", low)
      .replace("{threshold}", threshold);

    const evalTime = new Date();
    evalTime.setMinutes(evalTime.getMinutes() - Math.floor(Math.random() * 120));

    rules.push({
      ruleName: `${pairDisplayName}: ${template.name}`,
      expression,
      lastEvaluated: evalTime.toISOString(),
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    });
  }

  return rules;
}
