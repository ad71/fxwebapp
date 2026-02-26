"use client";

import * as React from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
} from "lightweight-charts";
import type { IChartApi, ISeriesApi, CandlestickData, LineData, AreaData, Time } from "lightweight-charts";
import type { HistoricalCandle } from "../../lib/security/types";
import { SegmentedControl } from "../ui/segmented-control";
import { filterCandlesByRange } from "../../lib/security/mock-historical";
import { useTheme } from "../theme/theme-provider";
import styles from "./historical-chart.module.css";

interface HistoricalChartProps {
  candles: HistoricalCandle[];
  pairId: string;
}

const RANGES = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "Max", label: "Max" },
];

const CHART_TYPES = [
  { value: "line", label: "Line" },
  { value: "candlestick", label: "Candlestick" },
];

const MA_PERIODS = [
  { period: 7, label: "SMA 7", color: "#6BC0BB" },
  { period: 30, label: "SMA 30", color: "#D98A2B" },
  { period: 90, label: "SMA 90", color: "#2F7AD7" },
];

function computeSMA(data: HistoricalCandle[], period: number): LineData<Time>[] {
  const result: LineData<Time>[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += data[j].close;
    }
    result.push({ time: data[i].date as Time, value: sum / period });
  }
  return result;
}

export function HistoricalChart({ candles, pairId }: HistoricalChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<IChartApi | null>(null);
  const { resolved: themeMode } = useTheme();

  const [range, setRange] = React.useState("1Y");
  const [chartType, setChartType] = React.useState("candlestick");
  const [activeMAs, setActiveMAs] = React.useState<number[]>([30]);

  const filteredCandles = React.useMemo(
    () => filterCandlesByRange(candles, range),
    [candles, range],
  );

  const toggleMA = (period: number) => {
    setActiveMAs((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period],
    );
  };

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isDark = themeMode === "dark";
    const textColor = isDark ? "#8E96AA" : "#3C4757";
    const gridColor = isDark ? "rgba(62, 68, 96, 0.25)" : "rgba(197, 203, 215, 0.15)";
    const borderColor = isDark ? "rgba(62, 68, 96, 0.4)" : "rgba(197, 203, 215, 0.3)";

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor,
        fontFamily: "monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor,
      },
      timeScale: {
        borderColor,
        timeVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    chartRef.current = chart;

    // Main series
    const upColor = isDark ? "#3BB76B" : "#2E9E5B";
    const downColor = isDark ? "#E76B63" : "#D9544D";
    const lineColor = isDark ? "#3AADA7" : "#1F8F8A";

    if (chartType === "candlestick") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor,
        downColor,
        borderUpColor: upColor,
        borderDownColor: downColor,
        wickUpColor: upColor,
        wickDownColor: downColor,
      });
      const data: CandlestickData<Time>[] = filteredCandles.map((c) => ({
        time: c.date as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      series.setData(data);
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor,
        topColor: isDark ? "rgba(58, 173, 167, 0.28)" : "rgba(31, 143, 138, 0.28)",
        bottomColor: isDark ? "rgba(58, 173, 167, 0.02)" : "rgba(31, 143, 138, 0.02)",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: false,
      });
      const data: AreaData<Time>[] = filteredCandles.map((c) => ({
        time: c.date as Time,
        value: c.close,
      }));
      series.setData(data);
    }

    // MA overlays
    for (const ma of MA_PERIODS) {
      if (!activeMAs.includes(ma.period)) continue;
      const series = chart.addSeries(LineSeries, {
        color: ma.color,
        lineWidth: 1,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      });
      series.setData(computeSMA(filteredCandles, ma.period));
    }

    chart.timeScale().fitContent();

    // Resize handler
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [filteredCandles, chartType, activeMAs, pairId, themeMode]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <SegmentedControl
          options={RANGES}
          value={range}
          onChange={setRange}
          size="sm"
        />
        <SegmentedControl
          options={CHART_TYPES}
          value={chartType}
          onChange={setChartType}
          size="sm"
        />
        <div className={styles.maToggles}>
          {MA_PERIODS.map((ma) => (
            <button
              key={ma.period}
              type="button"
              className={`${styles.maBtn} ${activeMAs.includes(ma.period) ? styles.maBtnActive : ""}`}
              onClick={() => toggleMA(ma.period)}
              style={
                activeMAs.includes(ma.period)
                  ? { borderColor: ma.color, color: ma.color }
                  : undefined
              }
            >
              {ma.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} className={styles.chartArea} />
    </div>
  );
}
