import type {
  Plant,
  CareHistory,
  Position,
  Exposure,
} from "@/features/plants/types";
import type { Species, NumericRange } from "@/features/species/types";
import { calculateWateringScore } from "./calculateWateringScore";
import { calculateRepottingScore } from "./calculateRepottingScore";

export type ScoreStatus = "good" | "warning" | "bad" | "unknown";

export type ScoreBreakdownKey =
  | "indoorOutdoor"
  | "light"
  | "temperature"
  | "watering"
  | "repotting";

export type ScoreBreakdownItem = {
  key: ScoreBreakdownKey;
  label: string;
  points: number;
  maxPoints: number;
  status: ScoreStatus;
  reason: string;
};

export type PlantScoreResult = {
  percent: number;
  label: string;
  hint: string;
  totalPoints: number;
  maxPoints: number;
  breakdown: ScoreBreakdownItem[];
};

type CalculatePlantScoreOptions = {
  plant: Plant;
  species: Species | null;
  currentTemperature?: number | null;
};

const SCORE_WEIGHTS = {
  indoorOutdoor: 10,
  light: 30,
  temperature: 30,
  watering: 20,
  repotting: 10,
} as const;

function getScoreLabel(percent: number) {
  if (percent >= 85) return "Excellent";
  if (percent >= 70) return "Good";
  if (percent >= 50) return "Fair";
  if (percent >= 30) return "Poor";
  return "Critical";
}

function createUnknownItem(
  key: ScoreBreakdownKey,
  label: string,
  reason: string,
): ScoreBreakdownItem {
  return {
    key,
    label,
    points: 0,
    maxPoints: 0,
    status: "unknown",
    reason,
  };
}

function getStrongestHint(
  breakdown: ScoreBreakdownItem[],
  fallbackPercent: number,
) {
  const scoredItems = breakdown.filter((item) => item.maxPoints > 0);

  if (!scoredItems.length) {
    if (fallbackPercent >= 85)
      return "Conditions look very good for this plant.";
    if (fallbackPercent >= 70)
      return "Mostly good, with a few things to watch.";
    if (fallbackPercent >= 50)
      return "Some conditions are fine, but there are a few mismatches.";
    if (fallbackPercent >= 30)
      return "Several conditions may be stressing the plant.";
    return "This plant may be under significant stress.";
  }

  const weakestItem = [...scoredItems].sort((a, b) => {
    const aRatio = a.maxPoints > 0 ? a.points / a.maxPoints : 1;
    const bRatio = b.maxPoints > 0 ? b.points / b.maxPoints : 1;
    return aRatio - bRatio;
  })[0];

  return weakestItem?.reason ?? "Some conditions may need attention.";
}

function getExposureBucketFromSunHours(
  min?: number,
  max?: number,
): Exposure | null {
  if (min == null && max == null) return null;

  const safeMin = min ?? 0;
  const safeMax = max ?? 12;
  const average = (safeMin + safeMax) / 2;

  if (average < 3) return "low";
  if (average < 6) return "medium";
  return "high";
}

function calculateIndoorOutdoorScore(
  isIndoor: boolean,
  indoorOutdoor: Species["indoorOutdoor"] | undefined,
): ScoreBreakdownItem {
  const maxPoints = SCORE_WEIGHTS.indoorOutdoor;

  if (!indoorOutdoor) {
    return createUnknownItem(
      "indoorOutdoor",
      "Placement",
      "Species indoor/outdoor preference is missing.",
    );
  }

  const matches =
    indoorOutdoor === "both" ||
    (indoorOutdoor === "indoor" && isIndoor) ||
    (indoorOutdoor === "outdoor" && !isIndoor);

  return {
    key: "indoorOutdoor",
    label: "Placement",
    points: matches ? maxPoints : 0,
    maxPoints,
    status: matches ? "good" : "bad",
    reason: matches
      ? `This ${isIndoor ? "indoor" : "outdoor"} placement matches the species needs.`
      : `This plant is marked as ${isIndoor ? "indoor" : "outdoor"}, but the species is best suited for ${indoorOutdoor}.`,
  };
}

function calculateLightScore(
  plantExposure: Plant["exposure"],
  speciesMin?: number,
  speciesMax?: number,
): ScoreBreakdownItem {
  const maxPoints = SCORE_WEIGHTS.light;

  if (!plantExposure) {
    return createUnknownItem(
      "light",
      "Light",
      "Plant light exposure is not set.",
    );
  }

  const targetExposure = getExposureBucketFromSunHours(speciesMin, speciesMax);

  if (!targetExposure) {
    return createUnknownItem(
      "light",
      "Light",
      "Species light requirements are missing.",
    );
  }

  if (plantExposure === targetExposure) {
    return {
      key: "light",
      label: "Light",
      points: maxPoints,
      maxPoints,
      status: "good",
      reason: "Light exposure is close to the species needs.",
    };
  }

  return {
    key: "light",
    label: "Light",
    points: Math.round(maxPoints * 0.4),
    maxPoints,
    status: "warning",
    reason: `Plant exposure is ${plantExposure}, but the species prefers ${targetExposure}.`,
  };
}

function calculateTemperatureScore(
  currentTemperature: number | null | undefined,
  minTemp?: number,
  maxTemp?: number,
): ScoreBreakdownItem {
  const maxPoints = SCORE_WEIGHTS.temperature;

  if (currentTemperature == null) {
    return createUnknownItem(
      "temperature",
      "Temperature",
      "Current temperature is not available.",
    );
  }

  if (minTemp == null || maxTemp == null) {
    return createUnknownItem(
      "temperature",
      "Temperature",
      "Species temperature range is missing.",
    );
  }

  if (currentTemperature >= minTemp && currentTemperature <= maxTemp) {
    return {
      key: "temperature",
      label: "Temperature",
      points: maxPoints,
      maxPoints,
      status: "good",
      reason: "Current temperature is within the recommended range.",
    };
  }

  const distance =
    currentTemperature < minTemp
      ? minTemp - currentTemperature
      : currentTemperature - maxTemp;

  const penalty = Math.min(maxPoints, distance * 4);
  const points = Math.max(0, Math.round(maxPoints - penalty));

  return {
    key: "temperature",
    label: "Temperature",
    points,
    maxPoints,
    status: points > maxPoints * 0.5 ? "warning" : "bad",
    reason:
      currentTemperature < minTemp
        ? `Current temperature is below the recommended minimum of ${minTemp}°C.`
        : `Current temperature is above the recommended maximum of ${maxTemp}°C.`,
  };
}

export function calculatePlantScore({
  plant,
  species,
  currentTemperature = null,
}: CalculatePlantScoreOptions): PlantScoreResult {
  if (!species) {
    return {
      percent: 0,
      label: "Unknown",
      hint: "Species data is required to calculate a score.",
      totalPoints: 0,
      maxPoints: 0,
      breakdown: [
        createUnknownItem(
          "indoorOutdoor",
          "Placement",
          "Species data is missing.",
        ),
        createUnknownItem("light", "Light", "Species data is missing."),
        createUnknownItem(
          "temperature",
          "Temperature",
          "Species data is missing.",
        ),
        createUnknownItem("watering", "Watering", "Species data is missing."),
        createUnknownItem("repotting", "Repotting", "Species data is missing."),
      ],
    };
  }

  const wateringResult = calculateWateringScore(
    plant.careHistory,
    species.watering?.intervalDays,
    SCORE_WEIGHTS.watering,
  );

  const repottingResult = calculateRepottingScore(
    plant.careHistory,
    species.repottingIntervalMonths,
    SCORE_WEIGHTS.repotting,
  );

  const breakdown: ScoreBreakdownItem[] = [
    calculateIndoorOutdoorScore(plant.isIndoor, species.indoorOutdoor),
    calculateLightScore(
      plant.exposure,
      species.light?.sunExposureHours?.min,
      species.light?.sunExposureHours?.max,
    ),
    calculateTemperatureScore(
      currentTemperature,
      species.temperature?.min,
      species.temperature?.max,
    ),
    {
      key: "watering",
      label: "Watering",
      points: wateringResult.points,
      maxPoints: wateringResult.maxPoints,
      status: wateringResult.status,
      reason: wateringResult.reason,
    },
    {
      key: "repotting",
      label: "Repotting",
      points: repottingResult.points,
      maxPoints: repottingResult.maxPoints,
      status: repottingResult.status,
      reason: repottingResult.reason,
    },
  ];

  const totalPoints = breakdown.reduce((sum, item) => sum + item.points, 0);
  const maxPoints = breakdown.reduce((sum, item) => sum + item.maxPoints, 0);
  const percent =
    maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  return {
    percent,
    label: getScoreLabel(percent),
    hint: getStrongestHint(breakdown, percent),
    totalPoints,
    maxPoints,
    breakdown,
  };
}
