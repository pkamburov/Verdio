import type { Timestamp } from "firebase/firestore";

export type LocationSource = "gps" | "manual";

export type UserLocationSettings = {
  source: LocationSource;
  latitude: number;
  longitude: number;
  label?: string;
  updatedAt?: Timestamp;
};

export type LocationSearchResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  label: string;
};
