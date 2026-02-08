import shared from "./shared.module.css";
import styles from "./var-widget.module.css";

export default function VarWidget() {
  return (
    <>
      <div className={shared.cardHead}>
        <div />
        <button className={shared.outlineBtn}>DETAILS</button>
      </div>
      <div className={styles.varValue}>
        <span className={shared.flag}>{"\u{1F1EC}\u{1F1E7}"}</span>
        <span>GBP 190.15K</span>
      </div>
    </>
  );
}
