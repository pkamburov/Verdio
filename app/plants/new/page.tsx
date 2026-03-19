"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Upload } from "lucide-react";

import { createPlant, updatePlant } from "@/features/plants/api";
import { uploadPlantImage } from "@/features/plants/uploadPlantImage";
import { POSITIONS, Position } from "@/features/plants/types";
import type { Exposure } from "@/features/plants/types";

import { useSpecies } from "@/features/species/useSpecies";
import SpeciesCombobox from "@/features/species/components/SpeciesCombobox";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NewPlantPage() {
  const { uid, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState<string>("");
  const [isIndoor, setIsIndoor] = useState(true);
  const [exposure, setExposure] = useState<Exposure | "">("");
  const [position, setPosition] = useState<Position | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { species, loading: speciesLoading } = useSpecies();

  useEffect(() => {
    if (!loading && !uid) {
      router.push("/login");
    }
  }, [uid, loading, router]);

  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  if (loading || !uid) {
    return <main className="p-8">Loading...</main>;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uid || submitting) return;

    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
      alert("Image too large (max 2MB).");
      return;
    }

    try {
      setSubmitting(true);

      let imageUrl: string | null = null;
      let imagePath: string | null = null;

      const plantId = await createPlant(uid, {
        name,
        speciesId: speciesId,
        position: position || null,
        isIndoor,
        exposure: exposure || null,
        imageUrl,
        imagePath,
        careHistory: {
          watering: [],
          repotting: [],
          fertilizing: [],
        },
      });

      if (imageFile) {
        const uploaded = await uploadPlantImage({
          uid,
          plantId,
          file: imageFile,
        });

        await updatePlant(uid, plantId, {
          imageUrl: uploaded.url,
          imagePath: uploaded.path,
        });
      }

      router.push("/plants");
    } catch (err) {
      console.error("Failed to create plant:", err);
      alert("Something went wrong while saving the plant.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/plants">
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-green-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plants
        </Button>
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-semibold text-green-900 mb-2">
          Add New Plant
        </h1>
        <p className="text-gray-600">
          Fill in the details to add a plant to your collection.
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-800">
                Plant Image
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      imagePreview
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 hover:border-green-400 hover:bg-green-50/60"
                    }`}
                    onClick={() =>
                      document.getElementById("plant-image")?.click()
                    }
                  >
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Plant preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-sm text-green-700">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="text-gray-700">
                          Click to upload plant image
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, WEBP up to 2MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <input
                id="plant-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-neutral-800"
                >
                  Plant Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="e.g. My Ficus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-800">
                  Species
                </label>
                {speciesLoading ? (
                  <div className="rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-500">
                    Loading species...
                  </div>
                ) : (
                  <SpeciesCombobox
                    species={species}
                    value={speciesId}
                    onChange={setSpeciesId}
                  />
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="exposure"
                  className="text-sm font-medium text-neutral-800"
                >
                  Light Exposure
                </label>
                <select
                  id="exposure"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  value={exposure}
                  onChange={(e) => setExposure(e.target.value as Exposure | "")}
                >
                  <option value="">Select exposure</option>
                  <option value="low">Low light (2–4 hours/day)</option>
                  <option value="medium">Medium light (4–6 hours/day)</option>
                  <option value="high">High light (6+ hours/day)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="position"
                  className="text-sm font-medium text-neutral-800"
                >
                  Position
                </label>
                <select
                  id="position"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  value={position}
                  onChange={(e) => setPosition(e.target.value as Position | "")}
                >
                  <option value="">Select position</option>
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <label className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                <input
                  type="checkbox"
                  checked={isIndoor}
                  onChange={(e) => setIsIndoor(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                Indoor plant
              </label>
              <p className="mt-2 text-sm text-neutral-500">
                Turn this off if the plant is mainly kept outdoors.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {submitting ? "Saving..." : "Add Plant"}
              </button>

              <Link
                href="/plants"
                className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </Card>

      <div className="rounded-3xl bg-linear-to-r from-emerald-600 to-green-700 p-6 text-white shadow-sm">
        <h3 className="text-lg font-semibold">Tips for Adding Plants</h3>
        <div className="mt-3 space-y-2 text-sm text-emerald-50">
          <p>• Add a clear photo so the plant is easier to recognize later.</p>
          <p>• Choose the closest matching species for better care guidance.</p>
          <p>
            • Start with the most accurate light and position info you know.
          </p>
          <p>• You can always edit the plant later as you improve the data.</p>
        </div>
      </div>
    </div>
  );
}
