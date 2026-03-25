import type { WeatherData } from "./types";

const WEATHER_CACHE_KEY_PREFIX = "verdio:weather:";
export const WEATHER_CACHE_MAX_AGE_MS = 30 * 60 * 1000;

export type CachedWeather = {
  latitude: number;
  longitude: number;
  fetchedAt: number;
  data: WeatherData;
};

function getWeatherCacheKey(uid: string) {
  return `${WEATHER_CACHE_KEY_PREFIX}${uid}`;
}

function normalizeCoordinate(value: number) {
  return Number(value.toFixed(3));
}

export function getCachedWeather(uid: string): CachedWeather | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(getWeatherCacheKey(uid));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CachedWeather;
  } catch {
    return null;
  }
}

export function setCachedWeather(uid: string, value: CachedWeather) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(getWeatherCacheKey(uid), JSON.stringify(value));
}

export function clearCachedWeather(uid: string) {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(getWeatherCacheKey(uid));
}

export function isCachedWeatherValid(
  cached: CachedWeather,
  latitude: number,
  longitude: number,
  maxAgeMs = WEATHER_CACHE_MAX_AGE_MS,
) {
  const isFresh = Date.now() - cached.fetchedAt < maxAgeMs;

  const sameLatitude =
    normalizeCoordinate(cached.latitude) === normalizeCoordinate(latitude);

  const sameLongitude =
    normalizeCoordinate(cached.longitude) === normalizeCoordinate(longitude);

  return isFresh && sameLatitude && sameLongitude;
}
