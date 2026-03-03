"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import PlantList from "@/features/plants/components/PlantsList";

export default function PlantsPage() {
  const { uid, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return <main className="p-8">Loading auth...</main>;
  }

  // Guest view
  if (!uid) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-green-900 mb-2">
              My Plants
            </h1>
            <p className="text-gray-600">
              Manage and track all your plants in one places
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto space-y-8">
          <p className="text-neutral-600">
            Please log in to see and manage your plants.
          </p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Logged-in view
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-green-900 mb-2">
              My Plants
            </h1>
            <p className="text-gray-600">
              Manage and track all your plants in one places
            </p>
          </div>

          <Link
            href="/plants/new"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            + Add Plant
          </Link>
        </div>

        <PlantList uid={uid} />
      </div>
    </main>
  );
}
