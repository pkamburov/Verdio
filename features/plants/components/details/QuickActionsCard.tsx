"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Droplets } from "lucide-react";

type QuickActionsCardProps = {
  watering: boolean;
  handleMarkAsWatered: () => void;
};

export function QuickActionsCard({
  watering,
  handleMarkAsWatered,
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
          <Droplets className="w-4 h-4 mr-2" />
          {watering ? "Saving" : "Mark as Watered"}
        </Button>
        <Button
          variant="secondary"
          className="bg-white text-green-700 hover:bg-green-50"
        >
          Add Note
        </Button>
        <Button
          variant="secondary"
          className="bg-white text-green-700 hover:bg-green-50"
        >
          Set Reminder
        </Button>
      </div>
    </Card>
  );
}
