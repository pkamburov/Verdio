"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function NewPlantPage() {
  const { uid, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [isIndoor, setIsIndoor] = useState(true);
  const [exposure, setExposure] = useState("");

  useEffect(() => {
    if (!loading && !uid) {
      router.push("/login");
    }
  }, [uid, loading, router]);

  if (loading || !uid) {
    return <main className="p-8">Loading...</main>;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!uid) return;

    await addDoc(collection(db, "users", uid, "plants"), {
      uid,
      name,
      speciesId,
      isIndoor,
      exposure,
      createdAt: serverTimestamp(),
    });

    router.push("/plants");
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Add Plant</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-xl border p-2"
            placeholder="Plant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border p-2"
            placeholder="Species ID"
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value)}
          />

          <select
            className="w-full rounded-xl border p-2"
            value={exposure}
            onChange={(e) => setExposure(e.target.value)}
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
            className="w-full rounded-xl bg-emerald-600 py-2 text-white hover:bg-emerald-700"
          >
            Save
          </button>
        </form>
      </div>
    </main>
  );
}
