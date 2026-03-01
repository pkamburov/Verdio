import { Timestamp } from "firebase/firestore";

export const POSITIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
export type Position = (typeof POSITIONS)[number];

export type Plant = {
  id: string;
  name: string;
  speciesId?: string;
  position?: Position;
  isIndoor: boolean;
  exposure?: string | null;
  createdAt?: any;
};

export type PlantCreateInput = {
  name: string;
  speciesId: string;
  isIndoor: boolean;
  exposure?: string | null;
};

export type PlantDoc = {
  name: string;
  speciesId: string;
  isIndoor: boolean;
  exposure?: string | null;
  createdAt?: Timestamp | null;
};
