"use client";

import { useEffect, useState } from "react";
import { listPlants } from "../api";
import type { Plant } from "../types";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Droplets, Sun, CompassIcon } from "lucide-react";

export default function PlantList({ uid }: { uid: string }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "good":
        return "bg-green-100 text-green-700 border-green-200";
      case "fair":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "poor":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const needsWateringSoon = (nextWatering: string) => {
    const next = new Date(nextWatering);
    const today = new Date("2026-03-02");
    const daysUntil = Math.ceil(
      (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntil <= 2;
  };

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
            <div className="relative h-48 overflow-hidden">
              <img
                src={plant.imageUrl || undefined}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {/* <Badge
                    variant="outline"
                    className={`${getHealthColor(plant.health)} backdrop-blur-sm`}
                  >
                    {plant.health}
                  </Badge> */}
              </div>
              {/* {needsWateringSoon(plant.nextWatering) && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-500 text-white border-0">
                      <Droplets className="w-3 h-3 mr-1" />
                      Water Soon
                    </Badge>
                  </div>
                )} */}
            </div>

            {/* Plant Info */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  {plant.name}
                </h3>
                <p className="text-sm text-gray-600 italic">
                  {plant.speciesId}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  {/* <span>Next watering: {new Date(plant.nextWatering).toLocaleDateString()}</span> */}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span>{plant.exposure}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CompassIcon className="w-5 h-5 text-green-500" />
                  <span>{plant.position}</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
