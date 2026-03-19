import { Timestamp } from "firebase/firestore";
import { CareHistory } from "../types";

const DAY_MS = 1000 * 60 * 60 * 24;

export function sortTimestampsAsc(items: Timestamp[]): Timestamp[] {
  return [...items].sort((a, b) => a.toMillis() - b.toMillis());
}

export function getLatestTimestamp(items: Timestamp[]): Timestamp | null {
  if (!items.length) return null;

  const sorted = sortTimestampsAsc(items);
  return sorted[sorted.length - 1] ?? null;
}

export function getDaysBetween(a: Timestamp, b: Timestamp): number {
  const diffMs = Math.abs(b.toMillis() - a.toMillis());
  return Math.floor(diffMs / DAY_MS);
}

export function getDaysSince(date: Timestamp | null): number | null {
  if (!date) return null;

  const now = Timestamp.now();
  return getDaysBetween(date, now);
}

export function getIntervalsInDays(items: Timestamp[]): number[] {
  const sorted = sortTimestampsAsc(items);

  if (sorted.length < 2) return [];

  const intervals: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const previous = sorted[i - 1];
    const current = sorted[i];

    intervals.push(getDaysBetween(previous, current));
  }

  return intervals;
}

export function getAverageIntervalInDays(items: Timestamp[]): number | null {
  const intervals = getIntervalsInDays(items);

  if (!intervals.length) return null;

  const total = intervals.reduce((sum, value) => sum + value, 0);
  return Math.round(total / intervals.length);
}

export function getLastIntervalInDays(items: Timestamp[]): number | null {
  const intervals = getIntervalsInDays(items);

  if (!intervals.length) return null;

  return intervals[intervals.length - 1] ?? null;
}

function safeHistoryArray(items?: Timestamp[]): Timestamp[] {
  return items ? sortTimestampsAsc(items) : [];
}

export function getLastWatered(careHistory?: CareHistory): Timestamp | null {
  return getLatestTimestamp(safeHistoryArray(careHistory?.watering));
}

export function getLastRepotted(careHistory?: CareHistory): Timestamp | null {
  const repotting = careHistory?.repotting ?? [];
  if (!repotting.length) return null;

  return (
    [...repotting].sort((a, b) => a.toMillis() - b.toMillis()).at(-1) ?? null
  );
}

export function getLastFertilized(careHistory?: CareHistory): Timestamp | null {
  return getLatestTimestamp(safeHistoryArray(careHistory?.fertilizing));
}

export function getDaysSinceWatered(careHistory?: CareHistory): number | null {
  return getDaysSince(getLastWatered(careHistory));
}

export function getDaysSinceRepotted(careHistory?: CareHistory): number | null {
  return getDaysSince(getLastRepotted(careHistory));
}

export function getDaysSinceFertilized(
  careHistory?: CareHistory,
): number | null {
  return getDaysSince(getLastFertilized(careHistory));
}

export function getAverageWateringInterval(
  careHistory?: CareHistory,
): number | null {
  return getAverageIntervalInDays(safeHistoryArray(careHistory?.watering));
}

export function getLastWateringInterval(
  careHistory?: CareHistory,
): number | null {
  return getLastIntervalInDays(safeHistoryArray(careHistory?.watering));
}

export function getCareHistorySummary(careHistory?: CareHistory) {
  return {
    lastWatered: getLastWatered(careHistory),
    daysSinceWatered: getDaysSinceWatered(careHistory),
    averageWateringInterval: getAverageWateringInterval(careHistory),
    lastWateringInterval: getLastWateringInterval(careHistory),

    lastRepotted: getLastRepotted(careHistory),
    daysSinceRepotted: getDaysSinceRepotted(careHistory),

    lastFertilized: getLastFertilized(careHistory),
    daysSinceFertilized: getDaysSinceFertilized(careHistory),
  };
}

export function hasEnoughWateringData(careHistory: CareHistory | undefined) {
  if (!careHistory?.watering) return false;

  return careHistory.watering.length >= 2;
}

export function getMonthsSince(date: Timestamp | null): number | null {
  if (!date) return null;

  const now = Timestamp.now().toDate();
  const then = date.toDate();

  const yearDiff = now.getFullYear() - then.getFullYear();
  const monthDiff = now.getMonth() - then.getMonth();
  const totalMonths = yearDiff * 12 + monthDiff;

  return totalMonths;
}
