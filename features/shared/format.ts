import type { Timestamp } from "firebase/firestore";
import type { NumericRange } from "@/features/species/types";
import type { SeasonKey } from "./types/season";

function toDate(value?: Timestamp | Date | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if ("toDate" in value && typeof value.toDate === "function") {
    return value.toDate();
  }
  return null;
}

function getLatestDate(dates?: Timestamp[] | Date[] | null): Date | null {
  if (!dates || dates.length === 0) return null;

  const parsed = dates
    .map((item) => toDate(item))
    .filter((item): item is Date => item instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime());

  return parsed[0] ?? null;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addYears(date: Date, years: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRelativeDate(date: Date, now: Date = new Date()): string {
  const today = startOfDay(now);
  const target = startOfDay(date);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays > 1) return `in ${diffDays} days`;
  if (diffDays === -1) return "yesterday";

  return `${Math.abs(diffDays)} days ago`;
}

export function getSuggestedNextWatering(args: {
  wateringHistory?: Timestamp[] | Date[] | null;
  intervalDays?: NumericRange | null;
  now?: Date;
}): string {
  const { wateringHistory, intervalDays, now = new Date() } = args;

  const lastWatered = getLatestDate(wateringHistory);

  if (!intervalDays?.min && !intervalDays?.max) {
    return "No watering schedule available";
  }

  if (!lastWatered) {
    return intervalDays.min != null
      ? `No watering history yet — usually every ${intervalDays.min}${
          intervalDays.max != null && intervalDays.max !== intervalDays.min
            ? `–${intervalDays.max}`
            : ""
        } days`
      : "No watering history yet";
  }

  const min = intervalDays.min ?? intervalDays.max ?? 0;
  const max = intervalDays.max ?? intervalDays.min ?? min;

  const earliest = addDays(lastWatered, min);
  const latest = addDays(lastWatered, max);

  if (min === max) {
    return `Around ${formatDate(earliest)} (${formatRelativeDate(earliest, now)})`;
  }

  return `${formatDate(earliest)} – ${formatDate(latest)}`;
}

const SEASON_LABELS: Record<SeasonKey, string> = {
  early_spring: "Early spring",
  spring: "Spring",
  late_spring: "Late spring",
  summer: "Summer",
  early_autumn: "Early autumn",
  autumn: "Autumn",
  late_autumn: "Late autumn",
  winter: "Winter",
};

function getCurrentSeasonKey(date: Date): SeasonKey {
  const month = date.getMonth() + 1;

  if (month === 12 || month === 1 || month === 2) return "winter";
  if (month === 3) return "early_spring";
  if (month === 4) return "spring";
  if (month === 5) return "late_spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month === 9) return "early_autumn";
  if (month === 10) return "autumn";
  return "late_autumn";
}

const SEASON_ORDER: SeasonKey[] = [
  "early_spring",
  "spring",
  "late_spring",
  "summer",
  "early_autumn",
  "autumn",
  "late_autumn",
  "winter",
];

function getNextSeasonLabel(seasons: SeasonKey[], now: Date): string | null {
  if (!seasons.length) return null;

  const currentSeason = getCurrentSeasonKey(now);
  const currentIndex = SEASON_ORDER.indexOf(currentSeason);

  for (let offset = 0; offset < SEASON_ORDER.length; offset++) {
    const idx = (currentIndex + offset) % SEASON_ORDER.length;
    const candidate = SEASON_ORDER[idx];

    if (seasons.includes(candidate)) {
      return SEASON_LABELS[candidate];
    }
  }

  return null;
}

export function getSuggestedNextRepotting(args: {
  repottingHistory?: Timestamp[] | Date[] | null;
  repottingSeasons?: SeasonKey[] | null;
  now?: Date;
}): string {
  const { repottingHistory, repottingSeasons, now = new Date() } = args;

  if (!repottingSeasons || repottingSeasons.length === 0) {
    return "No repotting schedule available";
  }

  const lastRepotted = getLatestDate(repottingHistory);

  if (!lastRepotted) {
    const nextSeason = getNextSeasonLabel(repottingSeasons, now);
    return nextSeason
      ? `Suggested in ${nextSeason}`
      : "Repotting season info available";
  }

  const dueDate = addYears(lastRepotted, 2);

  if (now < dueDate) {
    return `Not due yet — review after ${formatDate(dueDate)}`;
  }

  const nextSeason = getNextSeasonLabel(repottingSeasons, now);

  return nextSeason ? `Suggested in ${nextSeason}` : "Repotting is due";
}
