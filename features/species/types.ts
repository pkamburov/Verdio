import { Position } from "../plants/types";
import { SeasonKey } from "../shared/types/season";

export type NumericRange = {
  min: number;
  max: number;
};

export type Species = {
  id: string;
  commonName: string;
  latinName: string;
  indoorOutdoor: "indoor" | "outdoor" | "both";
  optimalPositioning: Position[];

  description: {
    short: string;
    full: string;
  };

  light: {
    sunExposureHours: NumericRange;
    notes?: string;
  };

  temperature: {
    min: number;
    max: number;
    notes?: string;
  };

  watering: {
    rule: string;
    notes?: string;
    frequencyHint?: "low" | "moderate" | "high";
    intervalDays?: NumericRange;
  };

  pruningSeasons?: SeasonKey[];
  repottingSeasons?: SeasonKey[];
  fertilizingSeasons?: SeasonKey[];

  pruningNotes?: string;
  repottingNotes?: string;
  fertilizingNotes?: string;

  repottingIntervalMonths?: NumericRange;
  fertilizingIntervalDays?: NumericRange;

  commonPests?: string[];
};

export type Pest = {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention?: string[];
  riskSeasons?: SeasonKey[];
};
