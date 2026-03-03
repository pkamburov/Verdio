"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPlant, updatePlant } from "@/features/plants/api";
import { POSITIONS, Position } from "@/features/plants/types";
import { useSpecies } from "@/features/species/useSpecies";
import { uploadPlantImage } from "@/features/plants/uploadPlantImage";
import SpeciesCombobox from "@/features/species/components/SpeciesCombobox";

import type { Exposure } from "@/features/plants/types";

export default function NewPlantPage() {
  const { uid, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState<string | null>(null);
  const [isIndoor, setIsIndoor] = useState(true);
  const [exposure, setExposure] = useState<Exposure | "">("");
  const [position, setPosition] = useState<Position | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { species, loading: speciesLoading } = useSpecies();

  useEffect(() => {
    if (!loading && !uid) {
      router.push("/login");
    }
  }, [uid, loading, router]);

  if (loading || !uid) {
    return <main className="p-8">Loading...</main>;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!uid) return;

    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
      alert("Image too large (max 2MB).");
      return;
    }

    let imageUrl: string | null = null;
    let imagePath: string | null = null;

    const plantId = await createPlant(uid, {
      name,
      speciesId: speciesId || undefined,
      position: position || null,
      isIndoor,
      exposure: exposure || null,
      imageUrl,
      imagePath,
    });

    if (imageFile) {
      try {
        const uploaded = await uploadPlantImage({
          uid,
          plantId,
          file: imageFile,
        });

        await updatePlant(uid, plantId, {
          imageUrl: uploaded.url,
          imagePath: uploaded.path,
        });
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    router.push("/plants");
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Add Plant</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-xl border p-2"
            placeholder="Plant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {speciesLoading ? (
            <div className="text-sm text-neutral-500">Loading species...</div>
          ) : (
            <SpeciesCombobox
              species={species}
              value={speciesId}
              onChange={setSpeciesId}
            />
          )}

          <input
            type="file"
            accept="image/*"
            className="w-full rounded-xl border p-2"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />

          <select
            className="w-full rounded-xl border p-2"
            value={exposure}
            onChange={(e) => setExposure(e.target.value as Exposure | "")}
          >
            <option value="">Select exposure</option>
            <option value="low">Low light (2-4 hours/day)</option>
            <option value="medium">Medium light (4-6 hours/day)</option>
            <option value="high">High light (6+ hours/day)</option>
          </select>

          <select
            className="w-full rounded-xl border p-2"
            value={position}
            onChange={(e) => setPosition(e.target.value as Position)}
          >
            <option value="">Select position</option>
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isIndoor}
              onChange={(e) => setIsIndoor(e.target.checked)}
            />
            Indoor plant
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-2 text-white hover:bg-emerald-700"
          >
            Save
          </button>
        </form>
      </div>
    </main>
  );
}
