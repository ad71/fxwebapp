import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "16px",
        textAlign: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          fontSize: "64px",
          fontWeight: 700,
          color: "var(--color-ink-200)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h2
        style={{
          fontSize: "var(--typography-size-xl)",
          fontWeight: "var(--typography-weight-semibold)" as any,
          color: "var(--color-ink-900)",
          margin: 0,
        }}
      >
        Page not found
      </h2>
      <p
        style={{
          fontSize: "var(--typography-size-md)",
          color: "var(--color-ink-500)",
          maxWidth: "400px",
          margin: 0,
        }}
      >
        The page you're looking for doesn't exist. It may have been moved or the
        URL might be incorrect.
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: "var(--radius-8)",
            background: "var(--color-brand-500)",
            color: "var(--color-white)",
            fontSize: "var(--typography-size-sm)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Go to Dashboard
        </Link>
        <Link
          href="/rates"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: "var(--radius-8)",
            border: "1px solid var(--color-border-strong)",
            background: "var(--color-surface-1)",
            color: "var(--color-ink-700)",
            fontSize: "var(--typography-size-sm)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Browse Rates
        </Link>
      </div>
    </div>
  );
}
