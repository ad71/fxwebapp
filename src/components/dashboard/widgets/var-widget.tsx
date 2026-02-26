"use client";

import { Button } from "../../ui/button";
import { useCountUp } from "../../../hooks/use-count-up";
import shared from "./shared.module.css";
import styles from "./var-widget.module.css";

export default function VarWidget() {
  const animatedValue = useCountUp({ end: 190.15, duration: 800, decimals: 2, suffix: "K" });

  return (
    <>
      <div className={shared.cardHead}>
        <div />
        <Button variant="secondary" size="sm">DETAILS</Button>
      </div>
      <div className={styles.varValue}>
        <span className={shared.flag}>{"\u{1F1EC}\u{1F1E7}"}</span>
        <span>GBP {animatedValue}</span>
      </div>
    </>
  );
}
