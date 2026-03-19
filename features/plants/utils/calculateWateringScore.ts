import type { CareHistory } from "../types";
import { NumericRange } from "@/features/species/types";
import {
  getAverageWateringInterval,
  getDaysSinceWatered,
  hasEnoughWateringData,
} from "./careHistory";

type WateringScoreStatus = "good" | "warning" | "bad" | "unknown";

type WateringScoreResult = {
  points: number;
  maxPoints: number;
  status: WateringScoreStatus;
  reason: string;
};

function scoreValueAgainstRange(
  value: number | null,
  range: NumericRange | undefined,
  maxScore: number,
) {
  if (value == null || !range) {
    return Math.round(maxScore / 2);
  }

  const { min, max } = range;

  if (value >= min && value <= max) {
    return maxScore;
  }

  const distance = value < min ? min - value : value - max;

  if (distance === 1) return Math.round(maxScore * 0.8);
  if (distance <= 3) return Math.round(maxScore * 0.5);
  if (distance <= 5) return Math.round(maxScore * 0.25);

  return 0;
}

export function calculateWateringScore(
  careHistory: CareHistory | undefined,
  intervalDays: NumericRange | undefined,
  maxPoints = 20,
): WateringScoreResult {
  if (!intervalDays) {
    return {
      points: Math.round(maxPoints / 2),
      maxPoints,
      status: "unknown",
      reason: "No watering guideline available for this species.",
    };
  }

  const daysSinceWatered = getDaysSinceWatered(careHistory);
  const averageInterval = getAverageWateringInterval(careHistory);

  const currentMax = Math.round(maxPoints / 2);
  const frequencyMax = maxPoints - currentMax;

  if (daysSinceWatered == null) {
    return {
      points: 0,
      maxPoints,
      status: "unknown",
      reason: "No watering history available.",
    };
  }

  const currentScore = scoreValueAgainstRange(
    daysSinceWatered,
    intervalDays,
    currentMax,
  );

  if (!hasEnoughWateringData(careHistory)) {
    const points = currentScore + Math.round(frequencyMax / 2);

    return {
      points,
      maxPoints,
      status: points >= 14 ? "good" : points >= 8 ? "warning" : "bad",
      reason:
        "Recent watering can be assessed, but more history is needed for a reliable frequency score.",
    };
  }

  const frequencyScore = scoreValueAgainstRange(
    averageInterval,
    intervalDays,
    frequencyMax,
  );

  const points = currentScore + frequencyScore;

  let reason = "Watering appears to be within the expected range.";

  if (daysSinceWatered < intervalDays.min) {
    reason = "The plant may have been watered too recently.";
  } else if (daysSinceWatered > intervalDays.max) {
    reason = "The plant may be overdue for watering.";
  } else if (averageInterval != null && averageInterval < intervalDays.min) {
    reason = "The plant may be watered too frequently on average.";
  } else if (averageInterval != null && averageInterval > intervalDays.max) {
    reason = "The plant may be watered too infrequently on average.";
  }

  const status: WateringScoreStatus =
    points >= 16 ? "good" : points >= 9 ? "warning" : "bad";

  return {
    points,
    maxPoints,
    status,
    reason,
  };
}
