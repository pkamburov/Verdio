export function titleCaseWords(s: string) {
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatIndoorOutdoor(v?: string) {
  if (!v) return "—";
  if (v === "indoor") return "Indoor";
  if (v === "outdoor") return "Outdoor";
  if (v === "both") return "Indoor / Outdoor";
  return v;
}

export function formatExposureRange(r?: { min?: number; max?: number }) {
  if (!r) return "—";
  const min = typeof r.min === "number" ? r.min : null;
  const max = typeof r.max === "number" ? r.max : null;

  if (min == null && max == null) return "—";
  if (min != null && max != null) return `${min}–${max} h`;
  if (min != null) return `≥ ${min} h`;
  return `≤ ${max} h`;
}
export function formatSpeciesPlacement(pos?: string[]) {
  return pos?.length ? pos.join(", ") : "—";
}
