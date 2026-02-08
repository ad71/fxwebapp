import { colorGroups } from "../../../preview/color-tokens";
import styles from "./page.module.css";

export default function TokensPreviewPage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>Design Tokens Preview</div>
        <div className={styles.subtitle}>Single source of truth: tokens/tokens.json</div>
      </div>

      {colorGroups.map((group) => (
        <section key={group.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{group.title}</h2>
          <div className={styles.grid}>
            {group.items.map((item) => (
              <div
                key={item.cssVar}
                className={styles.swatch}
                style={{ ["--swatch-color" as string]: `var(${item.cssVar})` }}
              >
                <div className={styles.chip} />
                <div className={styles.label}>{item.name}</div>
                <div className={styles.meta}>{item.cssVar}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
