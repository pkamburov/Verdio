import {
  collection,
  orderBy,
  getDocs,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Species } from "../species/types";

export async function listSpecies(): Promise<Species[]> {
  const q = query(collection(db, "species"), orderBy("commonName"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Species, "id">),
  }));
}

export async function getSpeciesById(
  speciesId: string,
): Promise<Species | null> {
  if (!speciesId) return null;

  const ref = doc(db, "species", speciesId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Species, "id">;
  return { id: snap.id, ...data };
}
