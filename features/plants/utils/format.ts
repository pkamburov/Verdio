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
