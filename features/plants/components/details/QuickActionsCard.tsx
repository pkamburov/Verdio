"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Calendar, Droplets, Sprout } from "lucide-react";

type QuickActionsCardProps = {
  watering: boolean;
  repotting: boolean;
  fertilizing: boolean;
  handleMarkAsWatered: () => void;
  handleMarkAsRepotted: () => void;
  handleMarkAsFertilized: () => void;
};

export function QuickActionsCard({
  watering,
  repotting,
  fertilizing,
  handleMarkAsWatered,
  handleMarkAsRepotted,
  handleMarkAsFertilized,
}: QuickActionsCardProps) {
  return (
    <Card className="p-6 bg-linear-to-r from-green-500 to-emerald-600 border-0 text-white">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          className="bg-white text-green-700 hover:bg-green-50 cursor-pointer"
          onClick={handleMarkAsWatered}
          disabled={watering}
        >
          <Droplets className="w-4 h-4" />
          {watering ? "Saving" : "Mark as Watered"}
        </Button>
        <Button
          variant="secondary"
          className="bg-white text-green-700 hover:bg-green-50 cursor-pointer"
          onClick={handleMarkAsRepotted}
          disabled={repotting}
        >
          <Sprout />
          {repotting ? "Saving" : "Mark as Repotted"}
        </Button>
        <Button
          variant="secondary"
          className="bg-white text-green-700 hover:bg-green-50 cursor-pointer"
          onClick={handleMarkAsFertilized}
          disabled={fertilizing}
        >
          <Sprout />
          {fertilizing ? "Saving" : "Mark as Fertilized"}
        </Button>
        <Button
          variant="secondary"
          className="bg-white text-green-700 hover:bg-green-50 cursor-pointer"
        >
          <Calendar />
          Set Reminder
        </Button>
      </div>
    </Card>
  );
}
