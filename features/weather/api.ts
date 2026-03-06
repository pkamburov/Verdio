import { DailyForecast, OpenMeteoResponse, WeatherData } from "./types";

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max",
    timezone: "auto",

    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Open-Meteo ${res.status}: ${text}`);
  }

  const data: OpenMeteoResponse = await res.json();
  const current = data.current
    ? {
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        time: data.current.time,
        humidity: data.current.relative_humidity_2m,
      }
    : null;

  if (!current) {
    throw new Error("Open-Meteo response missing current weather data");
  }

  const daily = data.daily.time.map((date, i) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipitation: data.daily.precipitation_sum[i],
    uvIndexMax: data.daily.uv_index_max[i],
  }));

  return {
    current,
    daily,
  };
}
