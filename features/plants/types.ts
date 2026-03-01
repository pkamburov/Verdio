import { Timestamp } from "firebase/firestore";

export const POSITIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
export type Position = (typeof POSITIONS)[number];
export type Exposure = "low" | "medium" | "high";

export type Plant = {
  id: string;
  name: string;
  speciesId?: string;
  position?: Position | null;
  isIndoor: boolean;
  exposure?: Exposure | "" | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type PlantCreateInput = {
  name: string;
  speciesId?: string;
  position?: Position | null;
  isIndoor: boolean;
  exposure?: Exposure | "" | null;
};

export type UpdatePlantInput = Partial<PlantCreateInput>;
