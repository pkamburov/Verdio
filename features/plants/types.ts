import { Timestamp } from "firebase/firestore";

export const POSITIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
export type Position = (typeof POSITIONS)[number];
export type Exposure = "low" | "medium" | "high";

export type Plant = {
  id: string;
  name: string;
  speciesId: string;
  position?: Position | null;
  isIndoor: boolean;
  imageUrl: string | null;
  imagePath: string | null;
  exposure?: Exposure | "" | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  careHistory?: CareHistory;
  notes?: Note[];
};

export type PlantCreateInput = {
  name: string;
  speciesId: string;
  position?: Position | null;
  isIndoor: boolean;
  exposure?: Exposure | "" | null;
  imageUrl?: string | null;
  imagePath?: string | null;
  careHistory: CareHistory;
};

export type Note = {
  id: string;
  text: string;
  createdAt: Timestamp | null;
};

export type NoteCreateInput = {
  text: string;
};

export type CareHistory = {
  watering: Timestamp[];
  repotting: Timestamp[];
  fertilizing: Timestamp[];
};

export type UpdatePlantInput = Partial<
  Omit<PlantCreateInput, "careHistory">
> & {
  careHistory?: Partial<CareHistory>;
};
