import styles from "./range-bar.module.css";

interface RangeBarProps {
  low: number;
  high: number;
  current: number;
}

export function RangeBar({ low, high, current }: RangeBarProps) {
  const range = high - low;
  const position = range > 0 ? ((current - low) / range) * 100 : 50;
  const clampedPos = Math.max(0, Math.min(100, position));

  const formatNum = (n: number) => {
    if (n >= 100) return n.toFixed(4);
    if (n >= 10) return n.toFixed(4);
    if (n >= 1) return n.toFixed(4);
    return n.toFixed(4);
  };

  return (
    <div className={styles.rangeContainer}>
      <div className={styles.labels}>
        <span className={styles.label}>{formatNum(low)}</span>
        <span className={styles.separator}>-</span>
        <span className={styles.label}>{formatNum(high)}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${clampedPos}%` }} />
        <div className={styles.dot} style={{ left: `${clampedPos}%` }} />
      </div>
    </div>
  );
}
