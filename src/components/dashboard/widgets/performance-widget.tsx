import styles from "./performance-widget.module.css";

export default function PerformanceWidget() {
  return (
    <div className={styles.analyticsBody}>
      <div className={styles.statBlock}>
        <span className={styles.statLabel}>Volatility Reduction</span>
        <span className={styles.statValue}>88.37%</span>
      </div>
      <div className={styles.riskBars}>
        <div className={styles.riskRow}>
          <span className={styles.riskLabel}>Achieved risk</span>
          <div className={styles.riskBarTrack}>
            <div
              className={`${styles.riskBarFill} ${styles.riskBarBrand}`}
              style={{ width: "12%" }}
            />
          </div>
          <span className={styles.riskAmt}>10.8K USD</span>
        </div>
        <div className={styles.riskRow}>
          <span className={styles.riskLabel}>Unhedged risk</span>
          <div className={styles.riskBarTrack}>
            <div
              className={`${styles.riskBarFill} ${styles.riskBarDanger}`}
              style={{ width: "78%" }}
            />
          </div>
          <span className={styles.riskAmt}>156K USD</span>
        </div>
      </div>
      <div className={styles.chartPlaceholder}>
        <div className={styles.chartLine} />
        <div className={styles.chartLegend}>
          <span>
            <i className={styles.dotDanger} /> Daily rate
          </span>
          <span>
            <i className={styles.dotBrand} /> Your rate
          </span>
        </div>
      </div>
    </div>
  );
}
