import type { CurrencyPairMeta } from "../../lib/rates/types";
import styles from "./rates-table.module.css";

interface CurrencyPairCellProps {
  pair: CurrencyPairMeta;
}

export function CurrencyPairCell({ pair }: CurrencyPairCellProps) {
  return (
    <>
      <span className={styles.pairFlag}>{pair.flag}</span>
      <div className={styles.pairInfo}>
        <span className={styles.pairName}>{pair.displayName}</span>
        <span className={styles.pairMarket}>
          {pair.market === "offshore" ? "Offshore" : "Onshore"}
        </span>
      </div>
    </>
  );
}
