"use client";

import { useEffect, useState } from "react";
import { listPlants } from "../api";
import type { Plant } from "../types";

export default function PlantList({ uid }: { uid: string }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

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
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-xl font-semibold">My Plants</h1>

      <ul className="mt-6 space-y-4">
        {plants.map((plant) => (
          <li key={plant.id} className="rounded-xl border p-4">
            <p className="font-medium">{plant.name}</p>
            <p className="text-sm text-neutral-600">
              {plant.speciesId} • {plant.isIndoor ? "Indoor" : "Outdoor"}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
