import { Timestamp } from "firebase/firestore";
import { Species } from "../species/types";

export const POSITIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
export type Position = (typeof POSITIONS)[number];
export type Exposure = "low" | "medium" | "high";

export type Plant = {
  id: string;
  name: string;
  speciesId?: string;
  position?: Position | null;
  isIndoor: boolean;
  imageUrl: string | null;
  imagePath: string | null;
  exposure?: Exposure | "" | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  lastWatered?: Timestamp | null;
};

export type PlantCreateInput = {
  name: string;
  speciesId?: string;
  position?: Position | null;
  isIndoor: boolean;
  exposure?: Exposure | "" | null;
  imageUrl?: string | null;
  imagePath?: string | null;
  lastWatered?: Timestamp | null;
};

export type UpdatePlantInput = Partial<PlantCreateInput>;
