import shared from "./shared.module.css";
import styles from "./settlements-widget.module.css";

const FLAG: Record<string, string> = {
  USD: "\u{1F1FA}\u{1F1F8}",
  NOK: "\u{1F1F3}\u{1F1F4}",
};

export default function SettlementsNextWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div />
        <button className={shared.outlineBtn}>VIEW TRADES</button>
      </div>
      <div className={`${shared.alertBar} ${shared.alertInfo}`}>
        You have unfinished trades and these figures are incomplete.
      </div>
      <div className={styles.settlementRow}>
        <div className={styles.settlementItem}>
          <div className={styles.settlementLabel}>
            <span className={shared.arrowDown}>↙</span>
            Funding due at 11 AM
          </div>
          <div className={shared.currencyAmount}>
            <span className={shared.flag}>{FLAG.NOK}</span>
            <span className={shared.ccy}>NOK</span>
            <span className={shared.amount}>-943,977.48</span>
          </div>
        </div>
        <div className={styles.settlementItem}>
          <div className={styles.settlementLabel}>
            <span className={shared.arrowUp}>↗</span>
            Proceeds at 11 AM
          </div>
          <div className={shared.currencyAmount}>
            <span className={shared.flag}>{FLAG.USD}</span>
            <span className={shared.ccy}>USD</span>
            <span className={shared.amount}>92,041.05</span>
          </div>
        </div>
      </div>
    </>
  );
}
