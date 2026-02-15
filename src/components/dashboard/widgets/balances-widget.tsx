import { Button } from "../../ui/button";
import shared from "./shared.module.css";
import styles from "./balances-widget.module.css";

const FLAG: Record<string, string> = {
  USD: "\u{1F1FA}\u{1F1F8}",
  EUR: "\u{1F1EA}\u{1F1FA}",
  GBP: "\u{1F1EC}\u{1F1E7}",
  JPY: "\u{1F1EF}\u{1F1F5}",
};

const balances = [
  { ccy: "USD", amount: "125,430.00" },
  { ccy: "EUR", amount: "89,210.50" },
  { ccy: "GBP", amount: "42,800.75" },
  { ccy: "JPY", amount: "5,230,000" },
];

export default function BalancesWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div />
        <Button variant="secondary" size="sm">CREATE</Button>
      </div>
      <div className={styles.balanceList}>
        {balances.map((b) => (
          <div key={b.ccy} className={styles.balanceRow}>
            <div className={styles.balanceCcy}>
              <span className={shared.flag}>{FLAG[b.ccy]}</span>
              <span>{b.ccy}</span>
            </div>
            <span className={styles.balanceAmt}>{b.amount}</span>
          </div>
        ))}
      </div>
    </>
  );
}
