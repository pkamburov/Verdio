"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import { getPlant, updatePlant } from "@/features/plants/api";
import {
  POSITIONS,
  type Exposure,
  type Position,
} from "@/features/plants/types";
import { slugToTitle } from "@/features/plants/utils/format";
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

  // form state
  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const { species, loading: speciesLoading } = useSpecies();
  const [position, setPosition] = useState<Position | "">("");
  const [isIndoor, setIsIndoor] = useState(true);
  const [exposure, setExposure] = useState<Exposure | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const latinName = slugToTitle(speciesId);

  // Auth guard
  useEffect(() => {
    if (!loading && !uid) router.push("/login");
  }, [loading, uid, router]);

  // Load plant and prefill
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
        setPosition((p.position ?? "") as any);
        setIsIndoor(!!p.isIndoor);
        setExposure((p.exposure ?? "") as any);
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

  if (loading || !uid) return <main className="p-8">Loading...</main>;

  if (fetching) return <main className="p-8">Loading plant...</main>;

  if (notFound) {
    return (
      <main className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold">Plant not found</h1>
        <Link className="text-emerald-700 hover:underline" href="/plants">
          ← Back to Plants
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold">Error</h1>
        <p className="text-sm text-neutral-700">{error}</p>
        <Link
          className="text-emerald-700 hover:underline"
          href={`/plants/${plantId}`}
        >
          ← Back to Plant
        </Link>
      </main>
    );
  }

  async function handleSubmit(e: React.SyntheticEvent) {
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

  return (
    <main className="p-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold">Edit Plant</h1>
          <Link
            href={`/plants/${plantId}`}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>

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

          <select
            className="w-full rounded-xl border p-2"
            value={exposure}
            onChange={(e) => setExposure(e.target.value as Exposure | "")}
          >
            <option value="">Select exposure</option>
            <option value="low">Low light</option>
            <option value="medium">Medium light</option>
            <option value="high">High light</option>
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
            disabled={saving}
            className="w-full rounded-xl bg-emerald-600 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
