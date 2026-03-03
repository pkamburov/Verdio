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
  medium: "Medium: 4–6 hours",
  high: "High: 6–8 hours",
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
