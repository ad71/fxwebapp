import type { CurrencyPairMeta, RateTick } from "../rates/types";

export interface HistoricalCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ForwardRate {
  tenor: string;
  settlementDate: string;
  forwardRate: number;
  forwardPoints: number;
  annualizedPremiumPct: number;
  hedgingCostPct: number;
  isMonthEnd?: boolean;
}

export interface CalendarDay {
  date: string;
  dayOfWeek: number;
  forwardRate: number | null;
  forwardPremium: number | null;
  isHoliday: boolean;
  holidayName?: string;
  isWeekend: boolean;
  isMonthEnd: boolean;
}

export interface InterestRateCurve {
  currency: string;
  tenors: { tenor: string; rate: number }[];
  source: string;
  asOf: string;
}

export interface TechnicalSignal {
  indicator: string;
  value: number;
  signal: "buy" | "sell" | "neutral";
}

export interface MovingAverage {
  period: number;
  value: number;
  signal: "buy" | "sell" | "neutral";
}

export interface RelatedPosition {
  positionId: string;
  accountNum: number;
  amount: number;
  hedgeAmount: number;
  hedgeCost: number;
  maturityDate: string;
  status: "hedged" | "partial" | "unhedged";
}

export interface ActiveRule {
  ruleName: string;
  expression: string;
  lastEvaluated: string;
  status: "passing" | "violated" | "pending";
}

export interface SecurityPageData {
  pair: CurrencyPairMeta;
  spot: RateTick;
  historical: HistoricalCandle[];
  forwardRates: ForwardRate[];
  calendar: Record<string, CalendarDay[]>;
  domesticCurve: InterestRateCurve;
  foreignCurve: InterestRateCurve;
  technicals: {
    movingAverages: MovingAverage[];
    signals: TechnicalSignal[];
    pivotPoints: Record<string, number>;
  };
  positions: RelatedPosition[];
  rules: ActiveRule[];
  performance: Record<string, number>;
}
