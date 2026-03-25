export function getWeatherLabel(code: number) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";

  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";

  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "Snow";

  if (code >= 95) return "Thunderstorm";

  return "Unknown";
}

export function getUVLevel(uv: number) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}
