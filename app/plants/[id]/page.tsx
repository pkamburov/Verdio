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
  getScoreCopy,
} from "@/features/plants/utils/format";
import {
  formatExposureRange,
  formatIndoorOutdoor,
  formatSpeciesPlacement,
  titleCaseWords,
} from "@/features/species/utils/format";
import { CardShell } from "@/features/plants/components/CardShell";
import { CircularScore } from "@/features/plants/components/CircularProgress";

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
  const scorePercent = 70;
  const { label: scoreLabel, hint: scoreHint } = getScoreCopy(scorePercent);
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
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-neutral-900">
              {plant.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {species?.commonName ?? species?.latinName ?? "—"}
            </p>
          </div>
        </div>

        {/* Score card */}
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                Plant match score
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Based on how your plant data compares to the species ideal.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <CircularScore value={scorePercent} size={72} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  {scoreLabel}
                </p>
                <p className="text-sm text-neutral-600">{scoreHint}</p>
              </div>
            </div>
          </div>

          {/* Optional: quick insights row */}
          <div className="border-t border-neutral-200 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {/* Render badges/warnings later */}
              {/* <StatusPill tone="warn">Low humidity</StatusPill> */}
              {/* <StatusPill tone="bad">Too little light</StatusPill> */}
              <p className="text-sm text-neutral-600">
                Add insights here (e.g., “Light is below ideal”, “Watering OK”,
                etc.)
              </p>
            </div>
          </div>
        </section>

        {/* Two cards: mobile stacked, desktop side-by-side */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardShell title="Your plant">
            {/* Example: image placeholder */}
            <div className="mb-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
              <div className="aspect-4/3 w-full" />
              <img
                src={plant.imageUrl || undefined}
                className="w-full h-full object-cover"
              />
            </div>
            <Row label="Exposure" value={plant.exposure ?? "—"} />
            <Row label="Indoor" value={plant.isIndoor ? "Yes" : "No"} />
            <Row label="Placement" value={plant.position ?? "—"} />
            {/* ... */}
          </CardShell>

          <CardShell title="Species ideal">
            {/* Species summary */}
            <p className="text-sm text-neutral-600">
              Read-only species profile (what “ideal” looks like).
            </p>

            <div className="mt-4">
              <AccordionItem title="Description">
                <p className="text-sm text-neutral-700">
                  {species?.description ?? "—"}
                </p>
              </AccordionItem>
              <AccordionItem title="Watering">
                <p className="text-sm font-medium text-neutral-800">
                  {species?.watering?.rule ?? "—"}
                </p>
                {species?.watering?.notes ? (
                  <p className="mt-2 text-sm text-neutral-700">
                    {species?.watering.notes}
                  </p>
                ) : null}
              </AccordionItem>
              <AccordionItem title="Pruning">
                <p className="text-sm text-neutral-700">
                  {species?.pruningSeasons?.length
                    ? species.pruningSeasons.map(titleCaseWords).join(", ")
                    : "—"}
                </p>
              </AccordionItem>
              <AccordionItem title="Repotting">
                <p className="text-sm text-neutral-700">
                  {species?.repottingSeasons?.length
                    ? species.repottingSeasons.map(titleCaseWords).join(", ")
                    : "—"}
                </p>
              </AccordionItem>
              <AccordionItem title="Pests">
                <p className="text-sm text-neutral-700">
                  {species?.commonPests?.length
                    ? species.commonPests.map(titleCaseWords).join(", ")
                    : "—"}
                </p>
              </AccordionItem>
              {/* <AccordionItem title="Light">...</AccordionItem> */}
              {/* <DetailRow label="Light" value={species.light ?? "—"} /> */}
            </div>
          </CardShell>
        </section>
      </div>
    </main>
  );
}
