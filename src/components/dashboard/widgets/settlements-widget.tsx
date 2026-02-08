import shared from "./shared.module.css";
import styles from "./settlements-widget.module.css";

const FLAG: Record<string, string> = {
  USD: "\u{1F1FA}\u{1F1F8}",
  EUR: "\u{1F1EA}\u{1F1FA}",
  NOK: "\u{1F1F3}\u{1F1F4}",
};

export default function SettlementsWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div />
        <button className={shared.outlineBtn}>VIEW TRADES</button>
      </div>
      <div className={`${shared.alertBar} ${shared.alertWarning}`}>
        You do not have sufficient funds for tomorrow&apos;s settlements
      </div>
      <div className={styles.settlementRow}>
        <div className={styles.settlementItem}>
          <div className={styles.settlementLabel}>
            <span className={shared.arrowDown}>↙</span>
            Funding due at 11 AM
          </div>
          <div className={shared.currencyAmount}>
            <span className={shared.flag}>{FLAG.USD}</span>
            <span className={shared.ccy}>USD</span>
            <span className={shared.amount}>-1,000,000.00</span>
          </div>
        </div>
        <div className={styles.settlementItem}>
          <div className={styles.settlementLabel}>
            <span className={shared.arrowUp}>↗</span>
            Proceeds at 11 AM
          </div>
          <div className={shared.currencyAmount}>
            <span className={shared.flag}>{FLAG.EUR}</span>
            <span className={shared.ccy}>EUR</span>
            <span className={shared.amount}>844,643.26</span>
          </div>
        </div>
      </div>
    </>
  );
}
