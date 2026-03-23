import { SeasonKey } from "../shared/types/season";

export type Pest = {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention?: string[];
  riskSeasons?: SeasonKey[];
  imageUrl?: string;
  imageAlt?: string;
};
