import type { LocationSearchResult } from "./types";

type OpenMeteoGeocodingResponse = {
  results?: Array<{
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  }>;
};

function buildLocationLabel(result: {
  name: string;
  country?: string;
  admin1?: string;
}) {
  return [result.name, result.admin1, result.country]
    .filter(Boolean)
    .join(", ");
}

export async function searchLocations(
  query: string,
): Promise<LocationSearchResult[]> {
  const trimmed = query.trim();

  if (!trimmed) return [];

  const params = new URLSearchParams({
    name: trimmed,
    count: "5",
    language: "en",
    format: "json",
  });

  const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to search locations");
  }

  const data: OpenMeteoGeocodingResponse = await res.json();

  return (data.results ?? []).map((result) => ({
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    label: buildLocationLabel(result),
  }));
}
