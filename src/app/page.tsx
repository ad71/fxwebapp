import Link from "next/link";

const cardStyle: React.CSSProperties = {
  background: "var(--color-surface-1)",
  border: "var(--border-1)",
  borderRadius: "var(--radius-14)",
  padding: "var(--space-16)",
  boxShadow: "var(--shadow-sm)",
};

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "var(--space-32)",
      }}
    >
      <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-12)" }}>
        FX Web App Scaffold
      </h1>
      <p style={{ color: "var(--color-ink-600)", marginBottom: "var(--space-24)" }}>
        Core routes to validate tokens, layout, and UI foundation.
      </p>
      <div style={{ display: "grid", gap: "var(--space-16)" }}>
        <Link href="/preview/tokens" style={cardStyle}>
          <strong>Design Tokens Preview</strong>
          <div style={{ color: "var(--color-ink-500)", marginTop: "var(--space-6)" }}>
            Visual overview of the full color system.
          </div>
        </Link>
      </div>
    </main>
  );
}
