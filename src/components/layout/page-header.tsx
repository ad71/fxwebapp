/**
 * PageHeader — Page-level heading with optional description, kicker, and actions.
 *
 * @usage Place at the top of page content. Use `kicker` for a small label above
 *   the title, `actions` for buttons aligned to the right.
 */
import * as React from "react";
import styles from "./page-header.module.css";

export interface PageHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  kicker,
  actions,
  meta,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        {kicker ? <div className={styles.kicker}>{kicker}</div> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
        {meta ? <div className={styles.meta}>{meta}</div> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
};
