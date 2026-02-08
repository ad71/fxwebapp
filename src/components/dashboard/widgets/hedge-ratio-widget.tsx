import shared from "./shared.module.css";

export default function HedgeRatioWidget() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span className={shared.infoIcon}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
      </div>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-ink-500)",
          textAlign: "center",
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        Connect your accounting software to discover your FX exposures
      </p>
      <button className={shared.outlineBtnFull}>MORE DETAILS</button>
    </>
  );
}
