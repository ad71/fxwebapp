import type { RateDataSource } from "./data-source";
import type { RateSnapshot } from "./types";

/**
 * Placeholder for a real-time data source (WebSocket, SSE, or REST polling).
 * Replace the method bodies with actual connection logic when ready.
 */
export class LiveRateDataSource implements RateDataSource {
  connect(): void {
    // TODO: establish WebSocket / SSE connection
  }

  disconnect(): void {
    // TODO: close connection, clean up
  }

  subscribe(
    _pairIds: string[],
    _onTick: (snapshot: RateSnapshot) => void,
  ): void {
    // TODO: subscribe to specific pairs on the connection
  }

  unsubscribe(): void {
    // TODO: unsubscribe from all pairs
  }
}
