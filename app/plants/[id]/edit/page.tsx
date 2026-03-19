"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getPlant, updatePlant } from "@/features/plants/api";
import {
  POSITIONS,
  type Exposure,
  type Position,
} from "@/features/plants/types";
import SpeciesCombobox from "@/features/species/components/SpeciesCombobox";
import { useSpecies } from "@/features/species/useSpecies";

export default function EditPlantPage() {
  const { uid, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const plantId = useMemo(() => params?.id ?? "", [params]);

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const { species, loading: speciesLoading } = useSpecies();
  const [position, setPosition] = useState<Position | "">("");
  const [isIndoor, setIsIndoor] = useState(true);
  const [exposure, setExposure] = useState<Exposure | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !uid) {
      router.push("/login");
    }
  }, [loading, uid, router]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!uid || !plantId) return;

      setFetching(true);
      setError(null);
      setNotFound(false);

      try {
        const p = await getPlant(uid, plantId);
        if (cancelled) return;

        if (!p) {
          setNotFound(true);
          return;
        }

        setName(p.name ?? "");
        setSpeciesId((p.speciesId ?? "") as string);
        setPosition((p.position ?? "") as Position | "");
        setIsIndoor(!!p.isIndoor);
        setExposure((p.exposure ?? "") as Exposure | "");
        setImagePreview(p.imageUrl ?? null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load plant.");
      } finally {
        if (!cancelled) setFetching(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [uid, plantId]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uid) return;

    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
      alert("Image too large (max 2MB).");
      return;
    }

    setSaving(true);

    try {
      await updatePlant(uid, plantId, {
        name: name.trim(),
        speciesId: speciesId.trim() || undefined,
        position: (position || null) as any,
        isIndoor,
        exposure: exposure || null,
      });

      router.push(`/plants/${plantId}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !uid) {
    return (
      <main className="p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (fetching) {
    return (
      <main className="p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-neutral-500">Loading plant...</p>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <h1 className="text-2xl font-semibold text-green-950">
            Plant not found
          </h1>
          <Link href="/plants">
            <Button
              variant="ghost"
              className="text-green-700 hover:text-green-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plants
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <h1 className="text-2xl font-semibold text-green-950">Error</h1>
          <p className="text-sm text-neutral-600">{error}</p>
          <Link href={`/plants/${plantId}`}>
            <Button
              variant="ghost"
              className="text-green-700 hover:text-green-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plant
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href={`/plants/${plantId}`}>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-green-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plant Details
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-green-950">
            Edit Plant
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            Update your plant details and keep its care profile accurate.
          </p>
        </div>

        <Card className="border-green-100 bg-white/70 p-6 backdrop-blur-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="image">Plant Image</Label>

              <label
                htmlFor="image"
                className={`block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition ${
                  imagePreview
                    ? "border-green-300 bg-green-50"
                    : "border-green-200 bg-green-50/60 hover:border-green-400 hover:bg-green-50"
                }`}
              >
                {imagePreview ? (
                  <div className="space-y-3 p-3">
                    <img
                      src={imagePreview}
                      alt="Plant preview"
                      className="h-64 w-full rounded-xl object-cover"
                    />

                    <div className="text-center">
                      <p className="font-medium text-green-900">
                        Click to change image
                      </p>
                      <p className="text-sm text-neutral-500">
                        PNG, JPG up to 2MB
                      </p>
                      {imageFile ? (
                        <p className="mt-1 text-sm text-green-700">
                          {imageFile.name}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-8 text-center">
                    <div className="rounded-full bg-white p-3 shadow-sm">
                      <Upload className="h-6 w-6 text-green-700" />
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium text-green-900">
                        Click to upload a new image
                      </p>
                      <p className="text-sm text-neutral-500">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                )}
              </label>

              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);

                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setImagePreview(objectUrl);
                  }
                }}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
                <Label>
                  Species <span className="text-red-500">*</span>
                </Label>
                {speciesLoading ? (
                  <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500">
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

            <div className="grid gap-5 md:grid-cols-2">
              {/* <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={position}
                  onValueChange={(value) => setPosition(value as Position | "")}
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
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

              {/* <div className="space-y-2">
                <Label htmlFor="exposure">Light Exposure</Label>
                <Select
                  value={exposure}
                  onValueChange={(value) => setExposure(value as Exposure | "")}
                >
                  <SelectTrigger id="exposure">
                    <SelectValue placeholder="Select exposure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low light</SelectItem>
                    <SelectItem value="medium">Medium light</SelectItem>
                    <SelectItem value="high">High light</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
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
            </div>

            <div className="space-y-3">
              <Label>Environment</Label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsIndoor(true)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    isIndoor
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  Indoor
                </button>

                <button
                  type="button"
                  onClick={() => setIsIndoor(false)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    !isIndoor
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  Outdoor
                </button>
              </div>

              <p className="text-sm text-neutral-500">
                Choose whether this plant is currently kept indoors or outdoors.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-green-100 pt-6 sm:flex-row">
              <Button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>

              <Link href={`/plants/${plantId}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        <Card className="border-0 bg-linear-to-r from-green-500 to-emerald-600 p-6 text-white">
          <h2 className="mb-3 text-lg font-semibold">Tips for Plant Care</h2>
          <ul className="space-y-2 text-sm text-green-50">
            <li>• Keep plant details updated when you move the plant.</li>
            <li>• Adjust light exposure if seasonal conditions change.</li>
            <li>• Upload fresh photos over time to track progress.</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
