import type { Timestamp } from "firebase/firestore";
import type { Plant } from "@/features/plants/types";
import type { Species } from "../species/types";
import type { WeatherData } from "@/features/weather/types";
import type { DashboardTip, DashboardTipPriority } from "./types";
import { getSpeciesById } from "../species/api";
import { getDaysSinceWatered } from "../plants/utils/careHistory";

type PlantWithSpecies = {
  plant: Plant;
  species: Species | null;
};

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

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "low":
      return "bg-gray-100 text-gray-700 border-gray-200";

    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";

    case "high":
      return "bg-red-100 text-red-700 border-red-200 ring-1 ring-red-200";

    case "urgent":
      return "bg-red-200 text-red-800 border-red-300";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export function getLastWateredDate(watering?: Timestamp[]): Date | null {
  if (!watering || watering.length === 0) return null;

  const last = watering[watering.length - 1];

  return last?.toDate() ?? null;
}

export function countPlantsNeedingWater(
  items: PlantWithSpecies[],
  now: Date = new Date(),
): Plant[] {
  let result: Plant[] = [];

  for (const { plant, species } of items) {
    const maxDays = species?.watering?.intervalDays?.max;
    if (!maxDays) continue;

    const lastWatered = getLastWateredDate(plant.careHistory?.watering);

    if (!lastWatered) {
      result.push(plant);
      continue;
    }

    const diffMs = now.getTime() - lastWatered.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= maxDays) {
      result.push(plant);
    }
  }
  return result;
}

export async function generateDashboardTips(
  plants: Plant[],
  weatherData: WeatherData,
): Promise<DashboardTip[]> {
  const tips: DashboardTip[] = [];

  const today = weatherData.daily[0];
  const current = weatherData.current;

  if (!today) return tips;

  for (const plant of plants) {
    const daysSinceWatered = getDaysSinceWatered(plant.careHistory);
    const speciesId = plant.speciesId;
    const species = await getSpeciesById(speciesId);
    // 1) No watering history
    if (
      !plant.careHistory?.watering ||
      plant.careHistory?.watering.length === 0
    ) {
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
    if (
      !plant.isIndoor &&
      species?.temperature &&
      today.tempMin <= species?.temperature.min
    ) {
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
    // 8) Strong wind warning for outdoor plants
    if (!plant.isIndoor && current.windSpeed > 15) {
      tips.push({
        id: `wind-warning-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: "warning",
        priority: current.windSpeed >= 20 ? "high" : "medium",
        message: `Strong winds are currently detected in your area. Make sure your ${plant.name} plant is protected.`,
      });
    }
  }

  return tips
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 6);
}
