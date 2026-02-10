import type { RateSnapshot } from "./types";

export interface RateDataSource {
  connect(): void;
  disconnect(): void;
  subscribe(
    pairIds: string[],
    onTick: (snapshot: RateSnapshot) => void,
  ): void;
  unsubscribe(): void;
}
