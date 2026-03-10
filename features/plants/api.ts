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
  updateDoc,
} from "firebase/firestore";
import type { Plant, PlantCreateInput, UpdatePlantInput } from "./types";
import { Timestamp } from "firebase/firestore";

function plantsCol(uid: string) {
  return collection(db, "users", uid, "plants");
}

function plantDoc(uid: string, plantId: string) {
  return doc(db, "users", uid, "plants", plantId);
}

export async function listPlants(uid: string): Promise<Plant[]> {
  const q = query(plantsCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Omit<Plant, "id">;
    return { id: d.id, ...data };
  });
}

export async function createPlant(uid: string, input: PlantCreateInput) {
  const payload = {
    ...input,
    speciesId: input.speciesId?.trim() || null,
    exposure: input.exposure || null,
    position: input.position ?? null,
    imageUrl: null,
    imagePath: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(plantsCol(uid), payload);
  return ref.id;
}

export async function getPlant(
  uid: string,
  plantId: string,
): Promise<Plant | null> {
  const snap = await getDoc(plantDoc(uid, plantId));
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<Plant, "id">;
  return { id: snap.id, ...data };
}

export async function updatePlant(
  uid: string,
  plantId: string,
  patch: UpdatePlantInput,
) {
  const payload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if ("name" in patch) payload.name = patch.name;
  if ("speciesId" in patch) payload.speciesId = patch.speciesId?.trim() || null;
  if ("exposure" in patch) {
    payload.exposure = patch.exposure ?? null;
  }
  if ("position" in patch) {
    payload.position = patch.position ?? null;
  }
  if ("isIndoor" in patch) payload.isIndoor = patch.isIndoor;
  if ("imageUrl" in patch) payload.imageUrl = patch.imageUrl ?? null;
  if ("imagePath" in patch) payload.imagePath = patch.imagePath ?? null;
  if ("lastWatered" in patch) payload.lastWatered = patch.lastWatered;

  await updateDoc(plantDoc(uid, plantId), payload);
}

export async function deletePlant(uid: string, plantId: string): Promise<void> {
  await deleteDoc(plantDoc(uid, plantId));
}

export async function getPlants(uid: string) {
  const q = query(plantsCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Plant[];
}

export async function markAsWatered(uid: string, plantId: string) {
  return updatePlant(uid, plantId, {
    lastWatered: Timestamp.now(),
  });
}
