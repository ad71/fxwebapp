import type { ForwardRate } from "./types";

const PILLAR_TENORS = [
  { tenor: "ON", days: 1 },
  { tenor: "TN", days: 2 },
  { tenor: "1W", days: 7 },
  { tenor: "2W", days: 14 },
  { tenor: "1M", days: 30 },
  { tenor: "2M", days: 60 },
  { tenor: "3M", days: 90 },
  { tenor: "6M", days: 180 },
  { tenor: "9M", days: 270 },
  { tenor: "1Y", days: 365 },
];

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

function formatDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

function lastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

export function generateForwardRates(
  spotRate: number,
  baseDifferential: number = 1.5,
): ForwardRate[] {
  const today = new Date();
  const rates: ForwardRate[] = [];

  // Pillar tenors
  for (const { tenor, days } of PILLAR_TENORS) {
    const settlement = addBusinessDays(today, days);
    const annualFactor = days / 365;
    const premium = baseDifferential * annualFactor * (1 + (Math.random() - 0.5) * 0.2);
    const fwdPoints = spotRate * (premium / 100);
    const fwdRate = spotRate + fwdPoints;
    const hedgingCost = premium * (0.12 + Math.random() * 0.04);

    rates.push({
      tenor,
      settlementDate: formatDate(settlement),
      forwardRate: Number(fwdRate.toFixed(4)),
      forwardPoints: Number(fwdPoints.toFixed(4)),
      annualizedPremiumPct: Number(premium.toFixed(2)),
      hedgingCostPct: Number(hedgingCost.toFixed(2)),
    });
  }

  // Month-end dates (next 12 months)
  for (let m = 0; m < 12; m++) {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const eom = lastDayOfMonth(targetMonth.getFullYear(), targetMonth.getMonth());

    // Skip if month-end is in the past
    if (eom <= today) continue;

    const daysToEom = Math.round((eom.getTime() - today.getTime()) / 86400000);
    const annualFactor = daysToEom / 365;
    const premium = baseDifferential * annualFactor * (1 + (Math.random() - 0.5) * 0.15);
    const fwdPoints = spotRate * (premium / 100);
    const fwdRate = spotRate + fwdPoints;
    const hedgingCost = premium * (0.12 + Math.random() * 0.04);

    rates.push({
      tenor: "EOM",
      settlementDate: formatDate(eom),
      forwardRate: Number(fwdRate.toFixed(4)),
      forwardPoints: Number(fwdPoints.toFixed(4)),
      annualizedPremiumPct: Number(premium.toFixed(2)),
      hedgingCostPct: Number(hedgingCost.toFixed(2)),
      isMonthEnd: true,
    });
  }

  return rates;
}
