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
