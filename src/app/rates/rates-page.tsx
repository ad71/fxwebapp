"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "../../components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui";
import { RatesTable } from "../../components/rates/rates-table";
import { SearchFilter } from "../../components/rates/search-filter";
import { useLiveRates } from "../../lib/rates/use-live-rates";
import { CURRENCY_PAIRS, PAIR_GROUPS } from "../../lib/rates/currency-pairs";
import type { MarketType } from "../../lib/rates/types";
import styles from "./rates-page.module.css";

function filterPairs(
  market: "all" | MarketType,
  search: string,
  group: string,
) {
  let pairs = CURRENCY_PAIRS;

  if (market !== "all") {
    pairs = pairs.filter((p) => p.market === market);
  }

  if (group !== "All" && PAIR_GROUPS[group]) {
    const groupIds = new Set(PAIR_GROUPS[group]);
    pairs = pairs.filter((p) => groupIds.has(p.id));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    pairs = pairs.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.base.toLowerCase().includes(q) ||
        p.quote.toLowerCase().includes(q) ||
        p.market.toLowerCase().includes(q),
    );
  }

  return pairs;
}

export function RatesPage() {
  const allPairIds = useMemo(() => CURRENCY_PAIRS.map((p) => p.id), []);
  const { rates, isConnected } = useLiveRates(allPairIds);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [tab, setTab] = useState("all");

  const groupNames = useMemo(() => Object.keys(PAIR_GROUPS), []);

  const market = tab === "offshore" ? "offshore" : tab === "onshore" ? "onshore" : "all";
  const filtered = useMemo(
    () => filterPairs(market as "all" | MarketType, search, activeGroup),
    [market, search, activeGroup],
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title="Live Rates"
        description="Real-time exchange rates and market data"
        actions={
          <div className={styles.liveIndicator}>
            <span className={`${styles.liveDot} ${isConnected ? styles.liveDotActive : ""}`} />
            <span className={styles.liveLabel}>
              {isConnected ? "Live" : "Connecting..."}
            </span>
          </div>
        }
      />

      <div className={styles.controls}>
        <SearchFilter
          value={search}
          onChange={setSearch}
          activeGroup={activeGroup}
          onGroupChange={setActiveGroup}
          groups={groupNames}
        />
      </div>

      <div className={styles.card}>
        <Tabs value={tab} onValueChange={setTab}>
          <div className={styles.tabBar}>
            <TabsList>
              <TabsTrigger value="all">All Markets</TabsTrigger>
              <TabsTrigger value="offshore">Offshore</TabsTrigger>
              <TabsTrigger value="onshore">Onshore</TabsTrigger>
            </TabsList>
          </div>

          <div className={styles.tabContent}>
            <TabsContent value="all">
              <RatesTable pairs={filtered} rates={rates} />
            </TabsContent>
            <TabsContent value="offshore">
              <RatesTable pairs={filtered} rates={rates} />
            </TabsContent>
            <TabsContent value="onshore">
              <RatesTable pairs={filtered} rates={rates} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
