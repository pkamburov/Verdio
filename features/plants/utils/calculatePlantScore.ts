import type { Timestamp } from "firebase/firestore";
import type { Plant } from "@/features/plants/types";
import type { Species } from "@/features/species/types";
import type { Position } from "@/features/plants/types";

export type ScoreStatus = "good" | "warning" | "bad" | "unknown";
export type WateringFrequencyHint = "low" | "moderate" | "high";

export type ScoreBreakdownItem = {
  key: "position" | "light" | "temperature" | "watering";
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
  now?: Date;
};

const SCORE_WEIGHTS = {
  position: 30,
  light: 25,
  temperature: 20,
  watering: 25,
} as const;

function daysBetween(from: Timestamp | Date, to: Date) {
  const fromDate = from instanceof Date ? from : from.toDate();

  if (Number.isNaN(fromDate.getTime())) {
    return null;
  }

  const diffMs = to.getTime() - fromDate.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

function getScoreLabel(percent: number) {
  if (percent >= 85) return "Excellent";
  if (percent >= 70) return "Good";
  if (percent >= 50) return "Fair";
  if (percent >= 30) return "Poor";
  return "Critical";
}

function getScoreHint(percent: number) {
  if (percent >= 85) return "Conditions look very good for this plant.";
  if (percent >= 70) return "Mostly good, with a few things to watch.";
  if (percent >= 50)
    return "Some conditions are fine, but there are a few mismatches.";
  if (percent >= 30) return "Several conditions may be stressing the plant.";
  return "This plant may be under significant stress.";
}

function createUnknownItem(
  key: ScoreBreakdownItem["key"],
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

function getExposureBucketFromSunHours(
  min?: number,
  max?: number,
): "low" | "medium" | "high" | null {
  if (min == null && max == null) return null;

  const safeMin = min ?? 0;
  const safeMax = max ?? 12;
  const average = (safeMin + safeMax) / 2;

  if (average < 3) return "low";
  if (average < 6) return "medium";
  return "high";
}

function calculatePositionScore(
  plantPosition: Position | null | undefined,
  optimalPositions: Position[] | undefined,
): ScoreBreakdownItem {
  const maxPoints = SCORE_WEIGHTS.position;

  if (!plantPosition) {
    return createUnknownItem(
      "position",
      "Position",
      "Plant position is not set.",
    );
  }

  if (!optimalPositions?.length) {
    return createUnknownItem(
      "position",
      "Position",
      "Species positioning data is missing.",
    );
  }

  const isMatch = optimalPositions.includes(plantPosition);

  return {
    key: "position",
    label: "Position",
    points: isMatch ? maxPoints : 0,
    maxPoints,
    status: isMatch ? "good" : "bad",
    reason: isMatch
      ? `Plant position (${plantPosition}) matches the recommended placement.`
      : `Plant position (${plantPosition}) does not match the recommended placement: ${optimalPositions.join(", ")}.`,
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

  const isExactMatch = plantExposure === targetExposure;

  if (isExactMatch) {
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

function getRecommendedWateringWindowDays(
  frequencyHint?: WateringFrequencyHint,
) {
  switch (frequencyHint) {
    case "low":
      return { min: 5, max: 10 };
    case "moderate":
      return { min: 3, max: 6 };
    case "high":
      return { min: 1, max: 3 };
    default:
      return { min: 3, max: 7 };
  }
}

function calculateWateringScore(
  lastWatered: Plant["lastWatered"],
  frequencyHint: WateringFrequencyHint | undefined,
  now: Date,
): ScoreBreakdownItem {
  const maxPoints = SCORE_WEIGHTS.watering;

  if (!lastWatered || typeof lastWatered.toDate !== "function") {
    return createUnknownItem(
      "watering",
      "Watering",
      "No valid watering history is available.",
    );
  }

  const daysSinceWatered = daysBetween(lastWatered, now);

  if (daysSinceWatered == null) {
    return createUnknownItem(
      "watering",
      "Watering",
      "Last watered date is invalid.",
    );
  }

  const window = getRecommendedWateringWindowDays(frequencyHint);

  if (daysSinceWatered >= window.min && daysSinceWatered <= window.max) {
    return {
      key: "watering",
      label: "Watering",
      points: maxPoints,
      maxPoints,
      status: "good",
      reason: "Watering appears to be within the expected range.",
    };
  }

  if (daysSinceWatered < window.min) {
    return {
      key: "watering",
      label: "Watering",
      points: Math.round(maxPoints * 0.6),
      maxPoints,
      status: "warning",
      reason: "The plant may have been watered too recently.",
    };
  }

  const overdueDays = daysSinceWatered - window.max;
  const penalty = Math.min(maxPoints, Math.ceil(overdueDays * 5));
  const points = Math.max(0, maxPoints - penalty);

  return {
    key: "watering",
    label: "Watering",
    points,
    maxPoints,
    status: points > maxPoints * 0.5 ? "warning" : "bad",
    reason: "The plant may be overdue for watering.",
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
  const points = Math.max(0, maxPoints - penalty);

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
  now = new Date(),
}: CalculatePlantScoreOptions): PlantScoreResult {
  if (!species) {
    return {
      percent: 0,
      label: "Unknown",
      hint: "Species data is required to calculate a score.",
      totalPoints: 0,
      maxPoints: 0,
      breakdown: [
        createUnknownItem("position", "Position", "Species data is missing."),
        createUnknownItem("light", "Light", "Species data is missing."),
        createUnknownItem(
          "temperature",
          "Temperature",
          "Species data is missing.",
        ),
        createUnknownItem("watering", "Watering", "Species data is missing."),
      ],
    };
  }

  const breakdown: ScoreBreakdownItem[] = [
    calculatePositionScore(plant.position, species.optimalPositioning),
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
    calculateWateringScore(
      plant.lastWatered,
      species.watering?.frequencyHint,
      now,
    ),
  ];

  const totalPoints = breakdown.reduce((sum, item) => sum + item.points, 0);
  const maxPoints = breakdown.reduce((sum, item) => sum + item.maxPoints, 0);
  const percent =
    maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  return {
    percent,
    label: getScoreLabel(percent),
    hint: getScoreHint(percent),
    totalPoints,
    maxPoints,
    breakdown,
  };
}
