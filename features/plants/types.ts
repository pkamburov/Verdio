import { Timestamp } from "firebase/firestore";

export type Plant = {
  id: string;
  name: string;
  speciesId: string;
  isIndoor: boolean;
  exposure?: string | null;
  createdAt: number;
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
