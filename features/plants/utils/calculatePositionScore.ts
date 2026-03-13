import { Position } from "../types";

export function calculatePositionScore(
  plantPosition: Position | null | undefined,
  optimalPositions: Position[] | undefined,
  maxPoints: number,
) {
  if (!plantPosition || !optimalPositions?.length) {
    return {
      points: 0,
      maxPoints,
      status: "unknown" as const,
      reason: "No position data available.",
    };
  }

  const isOptimal = optimalPositions.includes(plantPosition);

  return {
    points: isOptimal ? maxPoints : 0,
    maxPoints,
    status: isOptimal ? ("good" as const) : ("bad" as const),
    reason: isOptimal
      ? `Position ${plantPosition} matches the species needs.`
      : `Position ${plantPosition} is outside the recommended range: ${optimalPositions.join(", ")}.`,
  };
}
