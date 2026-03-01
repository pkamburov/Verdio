"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getPlant, deletePlant } from "@/features/plants/api";
import { getSpeciesById } from "@/features/species/api";
import { Row } from "@/features/plants/components/DetailRow";
import { AccordionItem } from "@/features/species/components/AccordioinItem";
import type { Plant } from "@/features/plants/types";
import type { Species } from "@/features/species/types";
import {
  formatEnDate,
  formatPlantExposure,
} from "@/features/plants/utils/format";
import {
  formatExposureRange,
  formatIndoorOutdoor,
  formatSpeciesPlacement,
  titleCaseWords,
} from "@/features/species/utils/format";

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
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">{plant.name}</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {species?.commonName ?? plant.speciesId ?? "—"} •{" "}
              {plant.isIndoor ? "Indoor" : "Outdoor"}
            </p>
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

        {/* Two cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CARD 1: User plant */}
          <section className="rounded-2xl border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Your plant</h2>
              {/* future: score pill */}
              {/* <span className="text-xs rounded-full border px-2 py-1">Score: 82%</span> */}
            </div>

            {/* Image placeholder */}
            <div className="overflow-hidden rounded-2xl border bg-neutral-50">
              <div className="aspect-[4/3] w-full grid place-items-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-700">
                    No photo yet
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">Placeholder</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Row label="Name" value={plant.name} />
              <Row
                label="Indoor / Outdoor"
                value={plant.isIndoor ? "Indoor" : "Outdoor"}
              />
              <Row label="Position / Placement" value={plant.position ?? "—"} />
              <Row
                label="Exposure"
                value={formatPlantExposure(plant.exposure)}
              />
              <Row label="Added on" value={formatEnDate(plant.createdAt)} />
              <Row label="Last update" value={formatEnDate(plant.updatedAt)} />
            </div>
          </section>

          {/* CARD 2: Species */}
          <section className="rounded-2xl border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Species</h2>
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
                <div className="space-y-3">
                  <Row label="Common name" value={species.commonName ?? "—"} />
                  <Row label="Latin name" value={species.latinName ?? "—"} />
                  <Row
                    label="Indoor / Outdoor"
                    value={
                      species.indoorOutdoor
                        ? formatIndoorOutdoor(species.indoorOutdoor)
                        : "—"
                    }
                  />
                  <Row
                    label="Optimal placement"
                    value={formatSpeciesPlacement(species.optimalPositioning)}
                  />
                  <Row
                    label="Exposure"
                    value={formatExposureRange(species.sunExposureHours)}
                  />
                </div>

                {/* Care tips accordion */}
                <div className="pt-2 space-y-2">
                  <p className="text-sm font-semibold">Care tips</p>

                  <AccordionItem title="Description">
                    <p className="text-sm text-neutral-700">
                      {species.description ?? "—"}
                    </p>
                  </AccordionItem>

                  <AccordionItem title="Watering">
                    <p className="text-sm font-medium text-neutral-800">
                      {species.watering?.rule ?? "—"}
                    </p>
                    {species.watering?.notes ? (
                      <p className="mt-2 text-sm text-neutral-700">
                        {species.watering.notes}
                      </p>
                    ) : null}
                  </AccordionItem>

                  <AccordionItem title="Pruning">
                    <p className="text-sm text-neutral-700">
                      {species.pruningSeasons?.length
                        ? species.pruningSeasons.map(titleCaseWords).join(", ")
                        : "—"}
                    </p>
                  </AccordionItem>

                  <AccordionItem title="Repotting">
                    <p className="text-sm text-neutral-700">
                      {species.repottingSeasons?.length
                        ? species.repottingSeasons
                            .map(titleCaseWords)
                            .join(", ")
                        : "—"}
                    </p>
                  </AccordionItem>

                  <AccordionItem title="Pests">
                    <p className="text-sm text-neutral-700">
                      {species.commonPests?.length
                        ? species.commonPests.map(titleCaseWords).join(", ")
                        : "—"}
                    </p>
                  </AccordionItem>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
