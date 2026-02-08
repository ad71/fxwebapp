import shared from "./shared.module.css";
import styles from "./payments-widget.module.css";

export default function PaymentsWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div>
          <p className={shared.cardSub}>Payments being sent this week</p>
        </div>
        <button className={shared.outlineBtn}>VIEW ALL</button>
      </div>
      <div className={styles.paymentsEmpty}>
        <p className={styles.emptyText}>
          There are no payments scheduled for this week.
        </p>
        <button className={shared.outlineBtn}>ADD A NEW PAYMENT</button>
      </div>
    </>
  );
}
