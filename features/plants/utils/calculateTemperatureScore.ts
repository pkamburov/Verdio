export function calculateTemperatureScore(
  currentTemp: number | null | undefined,
  minTemp: number | undefined,
  maxTemp: number | undefined,
  maxPoints = 20,
) {
  if (currentTemp == null || minTemp == null || maxTemp == null) {
    return {
      points: 0,
      maxPoints,
      status: "unknown" as const,
      reason: "No temperature data available.",
    };
  }

  if (currentTemp >= minTemp && currentTemp <= maxTemp) {
    return {
      points: maxPoints,
      maxPoints,
      status: "good" as const,
      reason: "Current temperature is within the safe range.",
    };
  }

  const distance =
    currentTemp < minTemp ? minTemp - currentTemp : currentTemp - maxTemp;

  const penalty = Math.min(maxPoints, distance * 4);
  const points = Math.max(0, maxPoints - penalty);

  return {
    points,
    maxPoints,
    status: points > maxPoints * 0.5 ? ("warning" as const) : ("bad" as const),
    reason:
      currentTemp < minTemp
        ? `Current temperature is below the recommended minimum of ${minTemp}°C.`
        : `Current temperature is above the recommended maximum of ${maxTemp}°C.`,
  };
}
