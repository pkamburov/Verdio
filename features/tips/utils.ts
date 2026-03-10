import type { Timestamp } from "firebase/firestore";
import type { Plant } from "@/features/plants/types";
import type { WeatherData } from "@/features/weather/types";
import type { DashboardTip, DashboardTipPriority } from "./types";

export function getDaysSince(timestamp?: Timestamp | null): number | null {
  if (!timestamp) return null;

  const date = timestamp.toDate();
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function priorityRank(priority: DashboardTipPriority) {
  switch (priority) {
    case "high":
      return 0;
    case "medium":
      return 1;
    case "low":
      return 2;
    default:
      return 3;
  }
}

export function generateDashboardTips(
  plants: Plant[],
  weatherData: WeatherData,
): DashboardTip[] {
  const tips: DashboardTip[] = [];

  const today = weatherData.daily[0];

  if (!today) return tips;

  for (const plant of plants) {
    const daysSinceWatered = getDaysSince(plant.lastWatered);

    // 1) No watering history
    if (!plant.lastWatered) {
      tips.push({
        id: `no-water-history-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "tip",
        priority: "low",
        message:
          "No watering history yet. Track the next watering to improve care reminders.",
        time: "Today",
      });
    }

    // 2) Indoor watering reminder
    if (plant.isIndoor && daysSinceWatered !== null && daysSinceWatered >= 6) {
      tips.push({
        id: `indoor-water-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "water",
        priority: daysSinceWatered >= 9 ? "high" : "medium",
        message: `It has been ${daysSinceWatered} days since this plant was watered. Check soil moisture today.`,
        time: "Today",
      });
    }

    // 3) Outdoor watering reminder if no meaningful rain
    if (
      !plant.isIndoor &&
      daysSinceWatered !== null &&
      daysSinceWatered >= 3 &&
      today.precipitation < 5
    ) {
      tips.push({
        id: `outdoor-water-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "water",
        priority: daysSinceWatered >= 5 ? "high" : "medium",
        message: `No significant rain is expected today and it has been ${daysSinceWatered} days since watering. Check soil moisture.`,
        time: "Today",
      });
    }

    // 4) Outdoor skip watering if rain is expected
    if (!plant.isIndoor && today.precipitation >= 5) {
      tips.push({
        id: `rain-tip-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "tip",
        priority: "medium",
        message: "Rain is expected today. You may be able to skip watering.",
        time: "Today",
      });
    }

    // 5) Hot weather warning
    if (today.tempMax >= 32) {
      tips.push({
        id: `heat-warning-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "warning",
        priority: today.tempMax >= 36 ? "high" : "medium",
        message:
          "Hot weather is expected today. Monitor soil moisture and leaf stress closely.",
        time: "Today",
      });
    }

    // 6) Very high UV warning
    if (today.uvIndexMax >= 8) {
      tips.push({
        id: `uv-warning-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "warning",
        priority: today.uvIndexMax >= 10 ? "high" : "medium",
        message:
          "Very strong UV is expected today. Watch for leaf scorch on sensitive plants.",
        time: "Today",
      });
    }

    // 7) Cold warning for outdoor plants
    if (!plant.isIndoor && today.tempMin <= 3) {
      tips.push({
        id: `cold-warning-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "warning",
        priority: today.tempMin <= 0 ? "high" : "medium",
        message:
          "Low temperatures are expected tonight. Protect sensitive outdoor plants.",
        time: "Today",
      });
    }
  }

  return tips
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 6);
}
