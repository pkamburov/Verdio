import type { UserLocationSettings } from "./types";

const LOCATION_CACHE_KEY_PREFIX = "verdio:user-location:";

type CachedUserLocation = {
  source: UserLocationSettings["source"];
  latitude: number;
  longitude: number;
  label?: string;
};

function getLocationCacheKey(uid: string) {
  return `${LOCATION_CACHE_KEY_PREFIX}${uid}`;
}

export function getCachedUserLocation(uid: string): CachedUserLocation | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(getLocationCacheKey(uid));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CachedUserLocation;
  } catch {
    return null;
  }
}

export function setCachedUserLocation(
  uid: string,
  location: CachedUserLocation,
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    getLocationCacheKey(uid),
    JSON.stringify(location),
  );
}

export function clearCachedUserLocation(uid: string) {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(getLocationCacheKey(uid));
}
