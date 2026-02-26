import type { RelatedPosition } from "./types";

const STATUSES: RelatedPosition["status"][] = ["hedged", "partial", "unhedged"];

export function generatePositions(pairId: string): RelatedPosition[] {
  // Generate 2-5 mock positions
  const count = 2 + Math.floor(Math.random() * 4);
  const positions: RelatedPosition[] = [];

  for (let i = 0; i < count; i++) {
    const amount = Math.round((100000 + Math.random() * 900000) / 10000) * 10000;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const hedgeRatio = status === "hedged" ? 1 : status === "partial" ? 0.4 + Math.random() * 0.4 : 0;
    const hedgeAmount = Math.round(amount * hedgeRatio / 1000) * 1000;
    const hedgeCost = status === "unhedged" ? 0 : 1.2 + Math.random() * 2;

    // Maturity: 1-12 months from now
    const maturity = new Date();
    maturity.setMonth(maturity.getMonth() + 1 + Math.floor(Math.random() * 11));
    const day = String(maturity.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    positions.push({
      positionId: `POS-${String(i + 1).padStart(3, "0")}`,
      accountNum: 1001 + i,
      amount,
      hedgeAmount,
      hedgeCost: Number(hedgeCost.toFixed(2)),
      maturityDate: `${day}-${months[maturity.getMonth()]}-${maturity.getFullYear()}`,
      status,
    });
  }

  return positions;
}
