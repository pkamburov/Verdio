import { db } from "@/lib/firebase/client";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type { Plant, PlantCreateInput } from "./types";
import { exp } from "firebase/firestore/pipelines";

function plantsCol(uid: string) {
  return collection(db, "users", uid, "plants");
}

function mapPlant(id: string, data: any): Plant {
  const creeatedAt =
    data?.creeatedAt instanceof Timestamp
      ? data.creeatedAt.toMillis()
      : typeof data?.creeatedAt === "number"
        ? data.creeatedAt
        : Date.now();

  return {
    id,
    name: String(data?.name ?? ""),
    speciesId: String(data?.speciesId ?? ""),
    isIndoor: Boolean(data?.isIndoor),
    exposure: data?.exposure ?? null,
    creeatedAt,
  };
}

export async function listPlants(uid: string): Promise<Plant[]> {
  const q = query(plantsCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapPlant(d.id, d.data()));
}

export async function createPlant(
  uid: string,
  input: PlantCreateInput,
): Promise<string> {
  const ref = await addDoc(plantsCol(uid), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPlant(uid: string, id: string): Promise<Plant | null> {
  const ref = doc(db, "users", uid, "plants", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapPlant(snap.id, snap.data());
}

export async function deletePlant(uid: string, id: string): Promise<void> {
  const ref = doc(db, "users", uid, "plants", id);
}
