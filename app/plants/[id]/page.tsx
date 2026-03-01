"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import { getPlant } from "@/features/plants/api";
import type { Plant } from "@/features/plants/types";

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

export default function PlantDetailsPage() {
  const { uid, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const plantId = useMemo(() => params?.id ?? "", [params]);

  const [plant, setPlant] = useState<Plant | null>(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">{plant.name}</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {plant.speciesId ?? "—"} • {plant.isIndoor ? "Indoor" : "Outdoor"}
            </p>
          </div>

          <Link
            href="/plants"
            className="shrink-0 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Back
          </Link>
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <Row label="Position" value={plant.position ?? "—"} />
          <Row label="Exposure" value={plant.exposure || "—"} />
          <Row label="Created" value={formatBgDate(plant.createdAt)} />
          <Row label="Last Updated" value={formatBgDate(plant.updatedAt)} />
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
