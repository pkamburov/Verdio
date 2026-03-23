"use client";

import { useEffect, useState } from "react";
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

export default function PlantList({ uid }: { uid: string }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await listPlants(uid);
      setPlants(data);
      setLoading(false);
    }

    load();
  }, [uid]);

  if (loading) {
    return <main className="p-8">Loading plants...</main>;
  }

  if (plants.length === 0) {
    return <main className="p-8">No plants yet.</main>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plants.map((plant) => (
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

              {getDaysSinceWatered(plant.careHistory?.watering).includes(
                "days",
              ) && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-500 text-white border-0">
                    <Droplets className="w-3 h-3 mr-1" />
                    Water Soon
                  </Badge>
                </div>
              )}
            </div>

            {/* Plant Info */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  {plant.name}
                </h3>
                <p className="text-sm text-gray-600 italic">
                  {slugToTitle(plant.speciesId)}
                </p>
              </div>

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
          </Card>
        </Link>
      ))}
    </div>
  );
}
