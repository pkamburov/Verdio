import { Timestamp } from "firebase/firestore";

export function formatEnDate(d?: any) {
  try {
    const date =
      d?.toDate?.() instanceof Date
        ? (d.toDate() as Date)
        : d instanceof Date
          ? d
          : null;
    return date ? date.toLocaleString("en-EN") : "—";
  } catch {
    return "—";
  }
}

const POSITION_LABELS: Record<string, string> = {
  S: "South",
  SE: "South-East",
  SW: "South-West",
  N: "North",
  NE: "North-East",
  NW: "North-West",
  E: "East",
  W: "West",
};

export function formatPlantPosition(position?: string | null) {
  if (!position) return "-";
  const key = position.trim();
  return POSITION_LABELS[key] ?? position;
}

const EXPOSURE_LABELS: Record<string, string> = {
  low: "Low: 2–4 hours",
  medium: "Medium: 4–7 hours",
  high: "High: 7+ hours",
};

export function formatPlantExposure(exposure?: string | null) {
  if (!exposure) return "—";
  const key = exposure.trim().toLowerCase();
  return EXPOSURE_LABELS[key] ?? exposure;
}

export function getScoreCopy(value: number) {
  if (value >= 75)
    return { label: "Looks great", hint: "Close to the species ideal." };
  if (value >= 45)
    return { label: "Needs attention", hint: "A few conditions are off." };
  return {
    label: "Needs changes",
    hint: "Several conditions differ from ideal.",
  };
}

export function slugToTitle(slug: string | undefined): string | undefined {
  if (!slug) {
    return;
  }
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getDaysSinceWatered(dates?: Timestamp[]): string {
  if (!dates || dates.length === 0) return "Not watered yet";

  const latest = dates.reduce((a, b) => (a.toMillis() > b.toMillis() ? a : b));
  const wateredDate = latest.toDate();
  const now = new Date();

  const diffMs = now.getTime() - wateredDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Watered today";
  if (diffDays === 1) return "Watered yesterday";

  return `${diffDays} days ago`;
}

export function getDaysSinceRepotted(dates?: Timestamp[]): string {
  if (!dates || dates.length === 0) return "Not repotted yet";

  const latest = dates.reduce((a, b) => (a.toMillis() > b.toMillis() ? a : b));
  const wateredDate = latest.toDate();
  const now = new Date();

  const diffMs = now.getTime() - wateredDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Repotted today";
  if (diffDays === 1) return "Repotted yesterday";

  return `${diffDays} days ago`;
}

export function getDaysSinceFertilized(dates?: Timestamp[]): string {
  if (!dates || dates.length === 0) return "Not fertilized yet";

  const latest = dates.reduce((a, b) => (a.toMillis() > b.toMillis() ? a : b));
  const wateredDate = latest.toDate();
  const now = new Date();

  const diffMs = now.getTime() - wateredDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Fertilized today";
  if (diffDays === 1) return "Fertilized yesterday";

  return `${diffDays} days ago`;
}
