"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getPlant, deletePlant } from "@/features/plants/api";
import { getSpeciesById } from "@/features/species/api";
import type { Plant } from "@/features/plants/types";
import type { Species } from "@/features/species/types";

function formatBgDate(d?: any) {
  try {
    const date =
      d?.toDate?.() instanceof Date
        ? (d.toDate() as Date)
        : d instanceof Date
          ? d
          : null;
    return date ? date.toLocaleString("bg-BG") : "—";
  } catch {
    return "—";
  }
}

function titleCaseWords(s: string) {
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatIndoorOutdoor(v?: string) {
  if (!v) return "—";
  if (v === "indoor") return "Indoor";
  if (v === "outdoor") return "Outdoor";
  if (v === "both") return "Indoor / Outdoor";
  return v;
}

function formatExposureRange(r?: { min?: number; max?: number }) {
  if (!r) return "—";
  const min = typeof r.min === "number" ? r.min : null;
  const max = typeof r.max === "number" ? r.max : null;

  if (min == null && max == null) return "—";
  if (min != null && max != null) return `${min}–${max} h`;
  if (min != null) return `≥ ${min} h`;
  return `≤ ${max} h`;
}

function formatList(list?: string[]) {
  return list?.length ? list.join(", ") : "—";
}

function getCareSummary(species?: {
  optimalPositioning?: string[];
  sunExposureHours?: { min?: number; max?: number };
  watering?: { rule?: string };
}) {
  if (!species) return null;

  const pos = species.optimalPositioning?.length
    ? `Position: ${species.optimalPositioning.join(", ")}`
    : null;

  const sun = species.sunExposureHours
    ? `Sun: ${formatExposureRange(species.sunExposureHours)}`
    : null;

  const water = species.watering?.rule
    ? `Water: ${species.watering.rule}`
    : null;

  const parts = [pos, sun, water].filter(Boolean);
  return parts.length ? parts.join(" • ") : null;
}

export default function PlantDetailsPage() {
  const { uid, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const plantId = useMemo(() => params?.id ?? "", [params]);

  const [plant, setPlant] = useState<Plant | null>(null);
  const [species, setSpecies] = useState<Species | null>(null);
  const [speciesLoading, setSpeciesLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const speciesId = useMemo(() => plant?.speciesId?.trim() ?? "", [plant]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!speciesId) {
        setSpecies(null);
        setSpeciesLoading(false);
        return;
      }

      setSpeciesLoading(true);
      try {
        const s = await getSpeciesById(speciesId);
        if (!cancelled) setSpecies(s);
      } catch {
        if (!cancelled) setSpecies(null);
      } finally {
        if (!cancelled) setSpeciesLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [speciesId]);

  // Auth guard
  useEffect(() => {
    if (!loading && !uid) router.push("/login");
  }, [loading, uid, router]);

  // Fetch plant
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
          setPlant(null);
        } else {
          setPlant(p);
        }
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

  if (loading || !uid) {
    return <main className="p-8">Loading...</main>;
  }

  if (fetching) {
    return <main className="p-8">Loading plant...</main>;
  }

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
        <Link className="text-emerald-700 hover:underline" href="/plants">
          ← Back to Plants
        </Link>
      </main>
    );
  }

  if (!plant) {
    return <main className="p-8">—</main>;
  }

  async function handleDelete() {
    if (!uid) return;
    if (!plantId) return;

    const ok = confirm("Delete this plant? This action cannot be undone.");
    if (!ok) return;

    try {
      setDeleting(true);
      await deletePlant(uid, plantId);
      router.push("/plants");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">{plant.name}</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {species?.commonName ?? plant.speciesId ?? "—"} •{" "}
              {plant.isIndoor ? "Indoor" : "Outdoor"}
            </p>
            {species ? (
              <p className="mt-1 text-xs text-neutral-500">
                {getCareSummary(species) ?? "—"}
              </p>
            ) : null}
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href={`/plants/${plant.id}/edit`}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
              title="Delete"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>

            <Link
              href="/plants"
              className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <Row label="Position" value={plant.position ?? "—"} />
          <Row label="Exposure" value={plant.exposure || "—"} />
          <Row label="Created" value={formatBgDate(plant.createdAt)} />
          <Row label="Last Updated" value={formatBgDate(plant.updatedAt)} />
        </div>
        <div className="rounded-2xl border p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Species</p>
            {speciesLoading ? (
              <span className="text-xs text-neutral-500">Loading…</span>
            ) : null}
          </div>

          {!plant.speciesId ? (
            <p className="text-sm text-neutral-600">No species selected.</p>
          ) : !species ? (
            <p className="text-sm text-neutral-600">
              Species not found for id:{" "}
              <span className="font-mono text-xs">{plant.speciesId}</span>
            </p>
          ) : (
            <>
              <Row label="Common name" value={species.commonName ?? "—"} />
              <Row
                label="Latin name"
                value={species.latinName ? species.latinName : "—"}
              />
              <Row
                label="Indoor / Outdoor"
                value={formatIndoorOutdoor(species.indoorOutdoor)}
              />
              <Row
                label="Optimal positioning"
                value={
                  species.optimalPositioning?.length
                    ? species.optimalPositioning.join(", ")
                    : "—"
                }
              />
              <Row
                label="Sun exposure"
                value={formatExposureRange(species.sunExposureHours)}
              />

              <div className="pt-2 space-y-2">
                <p className="text-sm text-neutral-600">Watering</p>
                <div className="rounded-xl bg-neutral-50 border p-3 space-y-2">
                  <p className="text-sm font-medium">
                    {species.watering?.rule ?? "—"}
                  </p>
                  {species.watering?.notes ? (
                    <p className="text-sm text-neutral-700">
                      {species.watering.notes}
                    </p>
                  ) : null}
                </div>
              </div>

              <Row
                label="Pruning seasons"
                value={
                  species.pruningSeasons?.length
                    ? species.pruningSeasons.map(titleCaseWords).join(", ")
                    : "—"
                }
              />
              <Row
                label="Repotting seasons"
                value={
                  species.repottingSeasons?.length
                    ? species.repottingSeasons.map(titleCaseWords).join(", ")
                    : "—"
                }
              />
              <Row
                label="Common pests"
                value={
                  species.commonPests?.length
                    ? species.commonPests.map(titleCaseWords).join(", ")
                    : "—"
                }
              />

              <div className="pt-2 space-y-1">
                <p className="text-sm text-neutral-600">Description</p>
                <p className="text-sm font-medium">
                  {species.description ?? "—"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className={`text-sm ${mono ? "font-mono text-xs" : "font-medium"}`}>
        {value}
      </p>
    </div>
  );
}
