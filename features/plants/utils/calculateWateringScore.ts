function getRecommendedWateringWindowDays(
  frequencyHint?: "low" | "moderate" | "high",
) {
  switch (frequencyHint) {
    case "low":
      return { min: 5, max: 10 };
    case "moderate":
      return { min: 3, max: 6 };
    case "high":
      return { min: 1, max: 3 };
    default:
      return { min: 3, max: 7 };
  }
}

export function calculateWateringScore(
  lastWatered: string | null | undefined,
  frequencyHint: "low" | "moderate" | "high" | undefined,
  now = new Date(),
  maxPoints = 25,
) {
  if (!lastWatered) {
    return {
      points: 0,
      maxPoints,
      status: "unknown" as const,
      reason: "No watering history available.",
    };
  }

  const last = new Date(lastWatered);
  const diffMs = now.getTime() - last.getTime();
  const daysSinceWatered = diffMs / (1000 * 60 * 60 * 24);

  const window = getRecommendedWateringWindowDays(frequencyHint);

  if (daysSinceWatered >= window.min && daysSinceWatered <= window.max) {
    return {
      points: maxPoints,
      maxPoints,
      status: "good" as const,
      reason: "Watering appears to be within the expected range.",
    };
  }

  if (daysSinceWatered < window.min) {
    return {
      points: Math.round(maxPoints * 0.6),
      maxPoints,
      status: "warning" as const,
      reason: "The plant may have been watered too recently.",
    };
  }

  const overdueDays = daysSinceWatered - window.max;
  const penalty = Math.min(maxPoints, Math.ceil(overdueDays * 5));
  const points = Math.max(0, maxPoints - penalty);

  return {
    points,
    maxPoints,
    status: points > maxPoints * 0.5 ? ("warning" as const) : ("bad" as const),
    reason: "The plant may be overdue for watering.",
  };
}
