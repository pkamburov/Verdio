import type { CareHistory } from "../types";
import type { NumericRange } from "@/features/species/types";
import { getLastRepotted } from "./careHistory";
import { Timestamp } from "firebase/firestore";

type RepottingScoreStatus = "good" | "warning" | "bad" | "unknown";

type RepottingScoreResult = {
  points: number;
  maxPoints: number;
  status: RepottingScoreStatus;
  reason: string;
};

function getMonthsSince(date: Timestamp | null): number | null {
  if (!date) return null;

  const now = Timestamp.now().toDate();
  const then = date.toDate();

  const yearDiff = now.getFullYear() - then.getFullYear();
  const monthDiff = now.getMonth() - then.getMonth();

  return yearDiff * 12 + monthDiff;
}

export function calculateRepottingScore(
  careHistory: CareHistory | undefined,
  intervalMonths: NumericRange | undefined,
  maxPoints = 10,
): RepottingScoreResult {
  if (!intervalMonths) {
    return {
      points: Math.round(maxPoints / 2),
      maxPoints,
      status: "unknown",
      reason: "No repotting guideline available for this species.",
    };
  }

  const lastRepotted = getLastRepotted(careHistory);

  if (!lastRepotted) {
    return {
      points: Math.round(maxPoints / 2),
      maxPoints,
      status: "unknown",
      reason: "No repotting history available.",
    };
  }

  const monthsSinceRepotted = getMonthsSince(lastRepotted);

  if (monthsSinceRepotted == null) {
    return {
      points: Math.round(maxPoints / 2),
      maxPoints,
      status: "unknown",
      reason: "Repotting history could not be evaluated.",
    };
  }

  const { min, max } = intervalMonths;

  if (monthsSinceRepotted >= min && monthsSinceRepotted <= max) {
    return {
      points: maxPoints,
      maxPoints,
      status: "good",
      reason: "Repotting appears to be within the expected range.",
    };
  }

  if (monthsSinceRepotted < min) {
    const earlyMonths = min - monthsSinceRepotted;

    let points = 8;
    if (earlyMonths >= 6) points = 4;
    if (earlyMonths >= 12) points = 2;

    return {
      points,
      maxPoints,
      status: points >= 7 ? "warning" : "bad",
      reason: "The plant may have been repotted too recently.",
    };
  }

  const overdueMonths = monthsSinceRepotted - max;

  let points = 8;
  if (overdueMonths >= 3) points = 6;
  if (overdueMonths >= 6) points = 4;
  if (overdueMonths >= 12) points = 1;

  const status: RepottingScoreStatus =
    points >= 9 ? "good" : points >= 5 ? "warning" : "bad";

  return {
    points,
    maxPoints,
    status,
    reason: "The plant may be overdue for repotting.",
  };
}
