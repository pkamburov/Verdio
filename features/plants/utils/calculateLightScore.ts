export function getExposureBucketFromHours(min?: number, max?: number) {
  if (min == null && max == null) return null;

  const safeMin = min ?? 0;
  const safeMax = max ?? 24;
  const avg = (safeMin + safeMax) / 2;

  if (avg < 3) return "low";
  if (avg < 6) return "medium";
  return "high";
}

export function calculateLightScore(
  plantExposure: string | null | undefined,
  speciesMin?: number,
  speciesMax?: number,
  maxPoints = 25,
) {
  if (!plantExposure || (speciesMin == null && speciesMax == null)) {
    return {
      points: 0,
      maxPoints,
      status: "unknown" as const,
      reason: "No light data available.",
    };
  }

  const targetExposure = getExposureBucketFromHours(speciesMin, speciesMax);
  const isMatch = plantExposure === targetExposure;

  return {
    points: isMatch ? maxPoints : Math.round(maxPoints * 0.4),
    maxPoints,
    status: isMatch ? ("good" as const) : ("warning" as const),
    reason: isMatch
      ? "Light exposure is close to the species needs."
      : `Plant exposure is ${plantExposure}, but the species prefers ${targetExposure}.`,
  };
}
