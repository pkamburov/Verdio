"use client";

import { useAuth } from "@/lib/auth/auth-context";
import PlantList from "@/features/plants/components/PlantsList";

export default function PlantsPage() {
  const { uid, loading } = useAuth();

  if (loading) {
    return <main className="p-8">Loading auth...</main>;
  }

  if (!uid) {
    return <main className="p-8">Please log in to see your plants.</main>;
  }

  return <PlantList uid={uid} />;
}
