"use client";

import Link from "next/link";
import type { Plant } from "@/features/plants/types";
import type { Species } from "@/features/species/types";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import {
  formatPlantExposure,
  formatPlantPosition,
  getDaysSinceWatered,
  slugToTitle,
} from "@/features/plants/utils/format";

import { Droplets, Sun, CompassIcon, Calendar } from "lucide-react";

type PlantScore = {
  percent: number;
  label: string;
  hint: string;
};

type PlantHeaderCardProps = {
  plant: Plant;
  species: Species | null;
  deleting: boolean;
  onDelete: () => void;
  score: PlantScore | null;
};

export function PlantHeaderCard({
  plant,
  species,
  deleting,
  onDelete,
  score,
}: PlantHeaderCardProps) {
  return (
    <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border-green-100">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Plant Image */}
        <div className="relative h-68 md:h-auto">
          <img
            src={plant.imageUrl || undefined}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Plant Info */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-semibold text-green-900 mb-2">
              {plant.name}
            </h1>

            <p className="text-lg text-gray-600 italic">
              {species?.commonName ?? slugToTitle(plant.speciesId)}

              {species?.latinName ? (
                <span className="text-neutral-500 italic ml-1">
                  ({species.latinName})
                </span>
              ) : null}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Link href={`${plant.id}/edit`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                Edit Details
              </Button>
            </Link>

            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>

          {/* Info rows */}
          <div className="space-y-4 pt-4">
            {score ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-emerald-700 shadow-sm">
                    {score.percent}%
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">Plant Score</p>
                    <p className="text-sm text-gray-600">{score.label}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600">{score.hint}</p>
              </div>
            ) : null}
            {/* Sunlight */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5 text-amber-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Direct Sunlight</p>
                <p className="text-sm text-gray-600">
                  {formatPlantExposure(plant.exposure)}
                </p>
              </div>
            </div>

            {/* Position */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <CompassIcon className="w-5 h-5 text-green-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Placement</p>
                <p className="text-sm text-gray-600">
                  {plant.isIndoor ? "Indoor" : "Outdoor"} /{" "}
                  {formatPlantPosition(plant.position)}
                </p>
              </div>
            </div>

            {/* Watering */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Last Watered</p>
                <p className="text-sm text-gray-600">
                  {getDaysSinceWatered(plant.lastWatered) ?? "—"}
                </p>
              </div>
            </div>

            {/* Reminders */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Reminders</p>
                <p className="text-sm text-gray-600">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
