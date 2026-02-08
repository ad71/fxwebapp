import styles from "./home.module.css";

const FLAG: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  NOK: "🇳🇴",
  JPY: "🇯🇵",
  CHF: "🇨🇭",
  AUD: "🇦🇺",
};

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ── Top Row: Settlements + VaR ── */}
      <div className={styles.topGrid}>
        {/* Settlement Card 1 */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Tomorrow&apos;s settlements</h3>
            <button className={styles.outlineBtn}>VIEW TRADES</button>
          </div>
          <div className={styles.alertBar + " " + styles.alertWarning}>
            You do not have sufficient funds for tomorrow&apos;s settlements
          </div>
          <div className={styles.settlementRow}>
            <div className={styles.settlementItem}>
              <div className={styles.settlementLabel}>
                <span className={styles.arrowDown}>↙</span>
                Funding due at 11 AM
              </div>
              <div className={styles.currencyAmount}>
                <span className={styles.flag}>{FLAG.USD}</span>
                <span className={styles.ccy}>USD</span>
                <span className={styles.amount}>-1,000,000.00</span>
              </div>
            </div>
            <div className={styles.settlementItem}>
              <div className={styles.settlementLabel}>
                <span className={styles.arrowUp}>↗</span>
                Proceeds at 11 AM
              </div>
              <div className={styles.currencyAmount}>
                <span className={styles.flag}>{FLAG.EUR}</span>
                <span className={styles.ccy}>EUR</span>
                <span className={styles.amount}>844,643.26</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settlement Card 2 */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>03 Feb 2026 settlements</h3>
            <button className={styles.outlineBtn}>VIEW TRADES</button>
          </div>
          <div className={styles.alertBar + " " + styles.alertInfo}>
            You have unfinished trades and these figures are incomplete.
          </div>
          <div className={styles.settlementRow}>
            <div className={styles.settlementItem}>
              <div className={styles.settlementLabel}>
                <span className={styles.arrowDown}>↙</span>
                Funding due at 11 AM
              </div>
              <div className={styles.currencyAmount}>
                <span className={styles.flag}>{FLAG.NOK}</span>
                <span className={styles.ccy}>NOK</span>
                <span className={styles.amount}>-943,977.48</span>
              </div>
            </div>
            <div className={styles.settlementItem}>
              <div className={styles.settlementLabel}>
                <span className={styles.arrowUp}>↗</span>
                Proceeds at 11 AM
              </div>
              <div className={styles.currencyAmount}>
                <span className={styles.flag}>{FLAG.USD}</span>
                <span className={styles.ccy}>USD</span>
                <span className={styles.amount}>92,041.05</span>
              </div>
            </div>
          </div>
        </div>

        {/* VaR Card */}
        <div className={styles.card + " " + styles.varCard}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Lifetime VaR Saved</h3>
            <button className={styles.outlineBtn}>DETAILS</button>
          </div>
          <div className={styles.varValue}>
            <span className={styles.flag}>{FLAG.GBP}</span>
            <span>GBP 190.15K</span>
          </div>
        </div>
      </div>

      {/* ── Middle Row: Payments + Side Cards ── */}
      <div className={styles.midGrid}>
        {/* Upcoming Payments */}
        <div className={styles.card + " " + styles.paymentsCard}>
          <div className={styles.cardHead}>
            <div>
              <h3 className={styles.cardTitle}>Upcoming payments</h3>
              <p className={styles.cardSub}>Payments being sent this week</p>
            </div>
            <button className={styles.outlineBtn}>VIEW ALL</button>
          </div>
          <div className={styles.paymentsEmpty}>
            <p className={styles.emptyText}>
              There are no payments scheduled for this week.
            </p>
            <button className={styles.outlineBtn}>ADD A NEW PAYMENT</button>
          </div>
        </div>

        {/* Side Stack */}
        <div className={styles.sideStack}>
          {/* Hedge Ratio */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>
                Your hedge ratio
                <span className={styles.infoIcon}>
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
              </h3>
            </div>
            <p className={styles.hedgeDesc}>
              Connect your accounting software to discover your FX exposures
            </p>
            <button className={styles.outlineBtnFull}>MORE DETAILS</button>
          </div>

          {/* Balances */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Your balances</h3>
              <button className={styles.outlineBtn}>CREATE</button>
            </div>
            <div className={styles.balanceList}>
              <div className={styles.balanceRow}>
                <div className={styles.balanceCcy}>
                  <span className={styles.flag}>{FLAG.USD}</span>
                  <span>USD</span>
                </div>
                <span className={styles.balanceAmt}>125,430.00</span>
              </div>
              <div className={styles.balanceRow}>
                <div className={styles.balanceCcy}>
                  <span className={styles.flag}>{FLAG.EUR}</span>
                  <span>EUR</span>
                </div>
                <span className={styles.balanceAmt}>89,210.50</span>
              </div>
              <div className={styles.balanceRow}>
                <div className={styles.balanceCcy}>
                  <span className={styles.flag}>{FLAG.GBP}</span>
                  <span>GBP</span>
                </div>
                <span className={styles.balanceAmt}>42,800.75</span>
              </div>
              <div className={styles.balanceRow}>
                <div className={styles.balanceCcy}>
                  <span className={styles.flag}>{FLAG.JPY}</span>
                  <span>JPY</span>
                </div>
                <span className={styles.balanceAmt}>5,230,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recent Trades + Analytics ── */}
      <div className={styles.bottomGrid}>
        {/* Recent Trades */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Recent trades</h3>
            <button className={styles.outlineBtn}>VIEW ALL</button>
          </div>
          <div className={styles.tradeTable}>
            <div className={styles.tradeTableHead}>
              <span>Date</span>
              <span>Type</span>
              <span>Sell</span>
              <span>Rate</span>
              <span>Buy</span>
              <span>Status</span>
            </div>
            <TradeRow
              date="07 Feb 2026"
              type="Spot/Forward"
              sellFlag={FLAG.EUR}
              sellCcy="EUR"
              sellAmt="200,000"
              rate="1.0808833"
              buyFlag={FLAG.USD}
              buyCcy="USD"
              buyAmt="216,176.66"
              status="In progress"
            />
            <TradeRow
              date="07 Feb 2026"
              type="Ranging"
              sellFlag={FLAG.USD}
              sellCcy="USD"
              sellAmt="1,000,000"
              rate="0.84464326"
              buyFlag={FLAG.EUR}
              buyCcy="EUR"
              buyAmt="844,643.26"
              status="In progress"
            />
            <TradeRow
              date="24 Jan 2026"
              type="Spot/Forward"
              sellFlag={FLAG.EUR}
              sellCcy="EUR"
              sellAmt="1,500,000"
              rate="1.17767344"
              buyFlag={FLAG.USD}
              buyCcy="USD"
              buyAmt="1,766,510.16"
              status="Settled"
            />
            <TradeRow
              date="15 Jan 2026"
              type="Averaging"
              sellFlag={FLAG.EUR}
              sellCcy="EUR"
              sellAmt="750,000"
              rate="1.17059257"
              buyFlag={FLAG.USD}
              buyCcy="USD"
              buyAmt="877,944.43"
              status="Settled"
            />
          </div>
        </div>

        {/* Analytics Preview */}
        <div className={styles.card + " " + styles.analyticsCard}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Performance</h3>
          </div>
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
                    className={styles.riskBarFill + " " + styles.riskBarBrand}
                    style={{ width: "12%" }}
                  />
                </div>
                <span className={styles.riskAmt}>10.8K USD</span>
              </div>
              <div className={styles.riskRow}>
                <span className={styles.riskLabel}>Unhedged risk</span>
                <div className={styles.riskBarTrack}>
                  <div
                    className={styles.riskBarFill + " " + styles.riskBarDanger}
                    style={{ width: "78%" }}
                  />
                </div>
                <span className={styles.riskAmt}>156K USD</span>
              </div>
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
      </div>
    </div>
  );
}

function TradeRow({
  date,
  type,
  sellFlag,
  sellCcy,
  sellAmt,
  rate,
  buyFlag,
  buyCcy,
  buyAmt,
  status,
}: {
  date: string;
  type: string;
  sellFlag: string;
  sellCcy: string;
  sellAmt: string;
  rate: string;
  buyFlag: string;
  buyCcy: string;
  buyAmt: string;
  status: string;
}) {
  return (
    <div className={styles.tradeRow}>
      <span className={styles.tradeDate}>{date}</span>
      <span className={styles.tradeType}>
        <span className={styles.typeBadge}>{type}</span>
      </span>
      <span className={styles.tradeCcy}>
        {sellFlag} {sellCcy} {sellAmt}
      </span>
      <span className={styles.tradeRate}>{rate}</span>
      <span className={styles.tradeCcy}>
        {buyFlag} {buyCcy} {buyAmt}
      </span>
      <span>
        <span
          className={`${styles.statusBadge} ${status === "Settled" ? styles.statusSettled : styles.statusProgress}`}
        >
          {status}
        </span>
      </span>
    </div>
  );
}
