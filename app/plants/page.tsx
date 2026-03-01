"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import PlantList from "@/features/plants/components/PlantsList";

export default function PlantsPage() {
  const { uid, loading } = useAuth();

  if (loading) {
    return <main className="p-8">Loading auth...</main>;
  }

  // Guest view (auth guard + CTA Login)
  if (!uid) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 items-center">
        <div className="mx-auto max-w-4xl space-y-4">
          <h1 className="text-2xl font-semibold">Plants</h1>

          <p className="text-neutral-600">
            Please log in to see and manage your plants.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  // Logged-in view
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Plants</h1>

        <Link
          href="/plants/new"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
        >
          + Add Plant
        </Link>
      </div>

      <PlantList uid={uid} />
    </div>
  );
}
