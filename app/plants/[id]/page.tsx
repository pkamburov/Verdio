"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getPlant, deletePlant, markAsWatered } from "@/features/plants/api";
import { getSpeciesById } from "@/features/species/api";

import type { Plant } from "@/features/plants/types";
import type { Species } from "@/features/species/types";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, ClipboardList, Sun } from "lucide-react";
import { PlantHeaderCard } from "@/features/plants/components/details/PlantHeaderCard";
import { QuickActionsCard } from "@/features/plants/components/details/QuickActionsCard";
import { CareHistoryCard } from "@/features/plants/components/details/CareHistoryCard";
import { SpeciesGuideCard } from "@/features/plants/components/details/SpeciesGuideCard";

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
  const [watering, setWatering] = useState(false);

  const speciesId = useMemo(() => plant?.speciesId?.trim() ?? "", [plant]);

  const fetchPlant = useCallback(async () => {
    if (!uid || !plantId) return;

    setFetching(true);
    setError(null);
    setNotFound(false);

    try {
      const p = await getPlant(uid, plantId);

      if (!p) {
        setNotFound(true);
        setPlant(null);
      } else {
        setPlant(p);
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load plant.");
    } finally {
      setFetching(false);
    }
  }, [uid, plantId]);

  async function handleMarkAsWatered() {
    if (!uid || !plantId) return;

    try {
      setWatering(true);
      await markAsWatered(uid, plantId);
      await fetchPlant();
    } finally {
      setWatering(false);
    }
  }

  async function handleDelete() {
    if (!uid || !plantId) return;

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

  useEffect(() => {
    if (!uid || !plantId) return;
    fetchPlant();
  }, [uid, plantId, fetchPlant]);

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
    return <main className="p-8">-</main>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/plants">
        <Button variant="ghost" className="text-gray-600 hover:text-green-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plants
        </Button>
      </Link>

      <PlantHeaderCard
        plant={plant}
        species={species}
        deleting={deleting}
        onDelete={handleDelete}
      />

      <QuickActionsCard
        watering={watering}
        handleMarkAsWatered={handleMarkAsWatered}
      />

      <SpeciesGuideCard plant={plant} species={species} speciesLoading />

      {/* Notes Section */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Care Notes
            </h2>
          </div>
        </div>
      </Card>

      <CareHistoryCard plant={plant} />
    </div>
  );
}
