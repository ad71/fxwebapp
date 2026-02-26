"use client";

import Link from "next/link";
import { CURRENCY_PAIRS } from "../../../lib/rates/currency-pairs";
import { useLiveRates } from "../../../lib/rates/use-live-rates";
import { Sparkline } from "../../ui/sparkline";
import shared from "./shared.module.css";
import styles from "./watchlist-widget.module.css";

const WATCHLIST_PAIRS = CURRENCY_PAIRS.slice(0, 5);
const WATCHLIST_IDS = WATCHLIST_PAIRS.map((p) => p.id);

// Generate a static mini sparkline per pair (mock recent ticks)
function mockSparkline(base: number): number[] {
  const points: number[] = [];
  let val = base;
  for (let i = 0; i < 20; i++) {
    val += (Math.random() - 0.48) * base * 0.001;
    points.push(val);
  }
  return points;
}

export default function WatchlistWidget() {
  const { rates } = useLiveRates(WATCHLIST_IDS);

  return (
    <>
      <div className={shared.cardHead}>
        <div />
      </div>
      <div className={styles.list}>
        {WATCHLIST_PAIRS.map((pair) => {
          const tick = rates[pair.id];
          if (!tick) return null;

          const isPositive = tick.change >= 0;
          const spark = mockSparkline(tick.bid);

          return (
            <Link
              key={pair.id}
              href={`/security/${pair.id}`}
              className={styles.row}
            >
              <div className={styles.pairInfo}>
                <span className={shared.flag}>{pair.flag}</span>
                <span className={styles.pairName}>{pair.displayName}</span>
              </div>
              <span className={styles.bid}>{tick.bid.toFixed(4)}</span>
              <span
                className={
                  isPositive ? styles.changePositive : styles.changeNegative
                }
              >
                {isPositive ? "+" : ""}
                {tick.changePct.toFixed(2)}%
              </span>
              <Sparkline
                data={spark}
                width={60}
                height={24}
                color={
                  isPositive
                    ? "var(--color-semantic-success-600)"
                    : "var(--color-semantic-danger-600)"
                }
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}
