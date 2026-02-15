import { Info } from "lucide-react";
import { Button } from "../../ui/button";
import shared from "./shared.module.css";
import styles from "./hedge-ratio-widget.module.css";

export default function HedgeRatioWidget() {
  return (
    <>
      <div className={styles.infoRow}>
        <span className={shared.infoIcon}>
          <Info size={14} strokeWidth={2} />
        </span>
      </div>
      <p className={styles.description}>
        Connect your accounting software to discover your FX exposures
      </p>
      <Button variant="secondary" size="sm" style={{ width: "100%" }}>
        MORE DETAILS
      </Button>
    </>
  );
}
