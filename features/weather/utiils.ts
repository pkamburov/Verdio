export function getWeatherLabel(code: number) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Cloudy";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";

  return "Unknown";
}
