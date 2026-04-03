"use client";

import { useEffect, useState, useMemo } from "react";
import { listPlants } from "../api";
import type { Plant } from "../types";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Droplets, Sun, CompassIcon } from "lucide-react";
import {
  formatPlantExposure,
  formatPlantPosition,
  slugToTitle,
} from "../utils/format";
import { getDaysSinceWatered } from "../utils/format";
import { getSpeciesByIds } from "@/features/species/api";
import { calculatePlantScore } from "../utils/calculatePlantScore";
import ScoreCircle from "./ScoreCircle";

export default function PlantList({ uid }: { uid: string }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [speciesMap, setSpeciesMap] = useState<Record<string, any>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);

      const plantsData = await listPlants(uid);
      const speciesIds = [...new Set(plantsData.map((p) => p.speciesId))];
      const speciesList = await getSpeciesByIds(speciesIds);

      const map = Object.fromEntries(speciesList.map((s) => [s.id, s]));

      setPlants(plantsData);
      setSpeciesMap(map);
      setLoading(false);
    }

    load();
  }, [uid]);

  const plantsWithScore = useMemo(() => {
    return plants
      .map((p) => {
        const species = speciesMap[p.speciesId];
        if (!species) return null;

        return {
          ...p,
          scoreData: calculatePlantScore({
            plant: p,
            species,
          }),
        };
      })
      .filter(Boolean) as (Plant & { scoreData: any })[];
  }, [plants, speciesMap]);
  if (loading) {
    return <main className="p-8">Loading plants...</main>;
  }

  if (plants.length === 0) {
    return <main className="p-8">No plants yet.</main>;
  }

  function getScoreColor(score: number) {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  }

  function getDaysSinceLastWatering(
    wateringHistory?: { date: string }[],
  ): number | null {
    if (!wateringHistory || wateringHistory.length === 0) return null;

    const lastWatering = wateringHistory[wateringHistory.length - 1];
    const lastDate = new Date(lastWatering.date);
    const now = new Date();

    const diffMs = now.getTime() - lastDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plantsWithScore.map((plant) => {
        const species = speciesMap[plant.speciesId];
        const wateringHistory = plant.careHistory?.watering;

        const lastWatering =
          wateringHistory && wateringHistory.length > 0
            ? wateringHistory[wateringHistory.length - 1]
            : null;
        let daysSinceWatering: number | null = null;

        if (lastWatering) {
          const lastDate = lastWatering.toDate();
          const now = new Date();

          const diffMs = now.getTime() - lastDate.getTime();
          daysSinceWatering = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        }

        const interval = species?.watering?.intervalDays;

        const needsWater =
          daysSinceWatering !== null &&
          interval?.max !== undefined &&
          daysSinceWatering > interval.max;

        const isSoon =
          daysSinceWatering !== null &&
          interval?.min !== undefined &&
          interval?.max !== undefined &&
          daysSinceWatering >= interval.min &&
          daysSinceWatering <= interval.max;

        return (
          <Link key={plant.id} href={`/plants/${plant.id}`}>
            <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
              {/* Plant Image */}
              <div className="relative h-68 overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={plant.imageUrl || undefined}
                  alt={plant.name}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                />

                {needsWater && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="destructive">
                      <Droplets className="w-3 h-3 mr-1" />
                      Water now
                    </Badge>
                  </div>
                )}

                {!needsWater && isSoon && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-500 text-white border-0">
                      <Droplets className="w-3 h-3 mr-1" />
                      Water Soon
                    </Badge>
                  </div>
                )}
              </div>

              {/* Plant Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* LEFT */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-green-900">
                        {plant.name}
                      </h3>
                      <p className="text-sm text-gray-600 italic">
                        {slugToTitle(plant.speciesId)}
                      </p>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span>
                          {getDaysSinceWatered(plant.careHistory?.watering)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Sun className="w-5 h-5 text-amber-500" />
                        <span>{formatPlantExposure(plant.exposure)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CompassIcon className="w-5 h-5 text-green-500" />
                        <span>
                          {plant.isIndoor ? "Indoor" : "Outdoor"} /{" "}
                          {formatPlantPosition(plant.position)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="shrink-0 self-center">
                    <ScoreCircle percent={plant.scoreData.percent} />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
