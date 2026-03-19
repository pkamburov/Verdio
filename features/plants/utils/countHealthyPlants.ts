import type { Plant } from "@/features/plants/types";
import type { Species } from "@/features/species/types";
import { calculatePlantScore } from "./calculatePlantScore";

type PlantWithSpecies = {
  plant: Plant;
  species: Species | null;
};

export function countHealthyPlants(
  items: PlantWithSpecies[],
  temperature?: number | null,
): number {
  let count = 0;

  for (const { plant, species } of items) {
    const score = calculatePlantScore({
      plant,
      species,
      currentTemperature: temperature,
    });

    if (score.percent >= 70) {
      count++;
    }
  }

  return count;
}
