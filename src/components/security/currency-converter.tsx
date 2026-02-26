"use client";

import * as React from "react";
import type { CurrencyPairMeta } from "../../lib/rates/types";
import { Field, Input } from "../ui/input";
import { cn } from "../ui/cn";
import { ArrowUpDown } from "lucide-react";
import styles from "./currency-converter.module.css";

interface CurrencyConverterProps {
  pair: CurrencyPairMeta;
  spotRate: number;
}

export function CurrencyConverter({ pair, spotRate }: CurrencyConverterProps) {
  const [baseAmount, setBaseAmount] = React.useState("1");
  const [quoteAmount, setQuoteAmount] = React.useState(spotRate.toFixed(4));
  const [isReversed, setIsReversed] = React.useState(false);

  const fromCurrency = isReversed ? pair.quote : pair.base;
  const toCurrency = isReversed ? pair.base : pair.quote;

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBaseAmount(val);

    const num = parseFloat(val);
    if (!Number.isNaN(num)) {
      const converted = isReversed ? num / spotRate : num * spotRate;
      setQuoteAmount(converted.toFixed(4));
    } else {
      setQuoteAmount("");
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuoteAmount(val);

    const num = parseFloat(val);
    if (!Number.isNaN(num)) {
      const converted = isReversed ? num * spotRate : num / spotRate;
      setBaseAmount(converted.toFixed(4));
    } else {
      setBaseAmount("");
    }
  };

  const handleSwap = () => {
    setIsReversed((prev) => !prev);
    /* Swap the displayed amounts */
    const prevBase = baseAmount;
    setBaseAmount(quoteAmount);
    setQuoteAmount(prevBase);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Convert</h3>
      </div>

      <div className={styles.body}>
        <div className={styles.inputRow}>
          <Field label={fromCurrency}>
            <Input
              type="number"
              value={baseAmount}
              onChange={handleFromChange}
              className={styles.mono}
              min={0}
              step="any"
            />
          </Field>

          <button
            type="button"
            className={styles.swapButton}
            onClick={handleSwap}
            aria-label="Swap currencies"
          >
            <ArrowUpDown size={16} />
          </button>

          <Field label={toCurrency}>
            <Input
              type="number"
              value={quoteAmount}
              onChange={handleToChange}
              className={styles.mono}
              min={0}
              step="any"
            />
          </Field>
        </div>

        <span className={styles.spotLabel}>
          At spot rate:{" "}
          <span className={styles.spotValue}>
            {spotRate >= 100 ? spotRate.toFixed(4) : spotRate >= 1 ? spotRate.toFixed(4) : spotRate.toFixed(5)}
          </span>
        </span>
      </div>
    </div>
  );
}
