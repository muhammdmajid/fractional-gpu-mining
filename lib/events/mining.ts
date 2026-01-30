// lib/events.ts
import { EventEmitter } from "events";

export type MiningEvent =
  | { type: "hourly"; planId: string; month: number; day: number; hour: number; profit: number }
  | { type: "day"; planId: string; month: number; day: number; total: number }
  | { type: "month"; planId: string; month: number; total: number }
  | { type: "cycleEnded"; planId: string; payout: number };

class MiningEventBus extends EventEmitter {
  emitEvent(e: MiningEvent) { this.emit(e.type, e); }
}

export const miningEvents = new MiningEventBus();
