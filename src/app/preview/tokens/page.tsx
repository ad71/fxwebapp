import { colorGroups } from "../../../preview/color-tokens";
import styles from "./page.module.css";
import { PageHeader } from "../../../components/layout/page-header";

export default function TokensPreviewPage() {
  return (
    <main className={styles.page}>
      <PageHeader
        kicker="Design System"
        title="Design Tokens Preview"
        description="Single source of truth: tokens/tokens.json"
      />

      {colorGroups.map((group) => (
        <section key={group.title} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{group.title}</h2>
            <div className={styles.sectionMeta}>{group.items.length} tokens</div>
          </div>
          <div className={styles.sectionCard}>
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
          </div>
        </section>
      ))}
    </main>
  );
}
