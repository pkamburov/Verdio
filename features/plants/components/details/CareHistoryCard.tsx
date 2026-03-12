"use client";

import { Card } from "@/components/ui/Card";
import { Plant } from "../../types";
import { getDaysSinceWatered } from "../../utils/format";

type CareHistoryCardProps = {
  plant: Plant;
};

export function CareHistoryCard({ plant }: CareHistoryCardProps) {
  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
      <h2 className="text-xl font-semibold text-green-900 mb-4">
        Care History
      </h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-gray-900">Last watered</p>
            <p className="text-sm text-gray-500">
              {plant.lastWatered ? getDaysSinceWatered(plant.lastWatered) : "-"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-gray-900">Fertilized</p>
            <p className="text-sm text-gray-500">February 15, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-gray-900">Repotted</p>
            <p className="text-sm text-gray-500">January 10, 2026</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
