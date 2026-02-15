import { Button } from "../../ui/button";
import shared from "./shared.module.css";
import styles from "./var-widget.module.css";

export default function VarWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div />
        <Button variant="secondary" size="sm">DETAILS</Button>
      </div>
      <div className={styles.varValue}>
        <span className={shared.flag}>{"\u{1F1EC}\u{1F1E7}"}</span>
        <span>GBP 190.15K</span>
      </div>
    </>
  );
}
