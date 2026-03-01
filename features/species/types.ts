export type Species = {
  id: string;
  commonName: string;
  latinName: string;
  indoorOutdoor?: "indoor" | "outdoor" | "both";
  //care
  commonPests: [string];
  description?: string;
  optimalPositioning?: Array<"N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW">;

  pruningSeasons: string[];
  repottingSeasons: string[];
  sunExposureHours: { min?: number; max?: number };
  watering: { rule?: string; notes?: string };
};
