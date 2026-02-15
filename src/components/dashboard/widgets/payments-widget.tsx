import { Button } from "../../ui/button";
import shared from "./shared.module.css";
import styles from "./payments-widget.module.css";

export default function PaymentsWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div>
          <p className={shared.cardSub}>Payments being sent this week</p>
        </div>
        <Button variant="secondary" size="sm">VIEW ALL</Button>
      </div>
      <div className={styles.paymentsEmpty}>
        <p className={styles.emptyText}>
          There are no payments scheduled for this week.
        </p>
        <Button variant="secondary" size="sm">ADD A NEW PAYMENT</Button>
      </div>
    </>
  );
}
