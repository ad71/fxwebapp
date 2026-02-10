import type { RateDataSource } from "./data-source";
import { MockRateDataSource } from "./mock-data-source";
import { LiveRateDataSource } from "./live-data-source";

export function createDataSource(
  type: "mock" | "live" = "mock",
): RateDataSource {
  if (type === "live") return new LiveRateDataSource();
  return new MockRateDataSource();
}
