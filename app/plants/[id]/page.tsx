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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Droplets,
  MapPin,
  Sun,
} from "lucide-react";

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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/plants">
        <Button variant="ghost" className="text-gray-600 hover:text-green-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plants
        </Button>
      </Link>

      {/* Main Plant Card */}
      <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border-green-100">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plant Image */}
          <div className="relative h-96 md:h-auto">
            <img
              src={plant.imageUrl || undefined}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              {/* <Badge
                variant="outline"
                className={`${getHealthColor(plant.health)} backdrop-blur-sm text-base px-3 py-1`}
              >
                {plant.health}
              </Badge> */}
            </div>
          </div>

          {/* Plant Info */}
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-semibold text-green-900 mb-2">
                {plant.name}
              </h1>
              <p className="text-lg text-gray-600 italic">{plant.speciesId}</p>
            </div>

            {/* <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div> */}

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Watering Schedule</p>
                  {/* <p className="text-sm text-gray-600">{plant.wateringFrequency}</p> */}
                  {/* <p className="text-sm text-gray-500 mt-1">
                    Next watering: {formatDate(plant.nextWatering)}
                  </p> */}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Sunlight Requirements
                  </p>
                  {/* <p className="text-sm text-gray-600">{plant.sunlight}</p> */}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{plant.position}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Last Watered</p>
                  {/* <p className="text-sm text-gray-600">{formatDate(plant.lastWatered)}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes Section */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Care Notes
            </h2>
            {/* <p className="text-gray-700">{plant.notes}</p> */}
          </div>
        </div>
      </Card>

      {/* Care History */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
        <h2 className="text-xl font-semibold text-green-900 mb-4">
          Care History
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-900">Watered</p>
              {/* <p className="text-sm text-gray-500">{formatDate(plant.lastWatered)}</p> */}
            </div>
          </div>
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-900">Fertilized</p>
              <p className="text-sm text-gray-500">February 15, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-900">Repotted</p>
              <p className="text-sm text-gray-500">January 10, 2026</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-linear-to-r from-green-500 to-emerald-600 border-0 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            className="bg-white text-green-700 hover:bg-green-50"
          >
            <Droplets className="w-4 h-4 mr-2" />
            Mark as Watered
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
    </div>
  );
}
