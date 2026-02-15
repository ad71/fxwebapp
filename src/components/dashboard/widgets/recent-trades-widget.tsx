import { Button } from "../../ui/button";
import shared from "./shared.module.css";
import styles from "./recent-trades-widget.module.css";

const FLAG: Record<string, string> = {
  USD: "\u{1F1FA}\u{1F1F8}",
  EUR: "\u{1F1EA}\u{1F1FA}",
};

interface Trade {
  date: string;
  type: string;
  sellFlag: string;
  sellCcy: string;
  sellAmt: string;
  rate: string;
  buyFlag: string;
  buyCcy: string;
  buyAmt: string;
  status: "In progress" | "Settled";
}

const trades: Trade[] = [
  {
    date: "07 Feb 2026", type: "Spot/Forward",
    sellFlag: FLAG.EUR, sellCcy: "EUR", sellAmt: "200,000",
    rate: "1.0808833",
    buyFlag: FLAG.USD, buyCcy: "USD", buyAmt: "216,176.66",
    status: "In progress",
  },
  {
    date: "07 Feb 2026", type: "Ranging",
    sellFlag: FLAG.USD, sellCcy: "USD", sellAmt: "1,000,000",
    rate: "0.84464326",
    buyFlag: FLAG.EUR, buyCcy: "EUR", buyAmt: "844,643.26",
    status: "In progress",
  },
  {
    date: "24 Jan 2026", type: "Spot/Forward",
    sellFlag: FLAG.EUR, sellCcy: "EUR", sellAmt: "1,500,000",
    rate: "1.17767344",
    buyFlag: FLAG.USD, buyCcy: "USD", buyAmt: "1,766,510.16",
    status: "Settled",
  },
  {
    date: "15 Jan 2026", type: "Averaging",
    sellFlag: FLAG.EUR, sellCcy: "EUR", sellAmt: "750,000",
    rate: "1.17059257",
    buyFlag: FLAG.USD, buyCcy: "USD", buyAmt: "877,944.43",
    status: "Settled",
  },
];

export default function RecentTradesWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div />
        <Button variant="secondary" size="sm">VIEW ALL</Button>
      </div>
      <div className={styles.tradeTable}>
        <div className={styles.tradeTableHead}>
          <span>Date</span>
          <span>Type</span>
          <span>Sell</span>
          <span>Rate</span>
          <span>Buy</span>
          <span>Status</span>
        </div>
        {trades.map((t, i) => (
          <div key={i} className={styles.tradeRow}>
            <span className={styles.tradeDate}>{t.date}</span>
            <span className={styles.tradeType}>
              <span className={styles.typeBadge}>{t.type}</span>
            </span>
            <span className={styles.tradeCcy}>
              {t.sellFlag} {t.sellCcy} {t.sellAmt}
            </span>
            <span className={styles.tradeRate}>{t.rate}</span>
            <span className={styles.tradeCcy}>
              {t.buyFlag} {t.buyCcy} {t.buyAmt}
            </span>
            <span>
              <span
                className={`${styles.statusBadge} ${t.status === "Settled" ? styles.statusSettled : styles.statusProgress}`}
              >
                {t.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
