import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import { Pest } from "./types";

export async function getPest(id: string): Promise<Pest | null> {
  if (!id) return null;

  try {
    const ref = doc(db, "pests", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return null;
    }

    return snap.data() as Pest;
  } catch (error) {
    console.error(`Error fetching pest "${id}:`, error);
    return null;
  }
}

export async function getPestsByIds(ids: string[]): Promise<Pest[]> {
  if (!ids || ids.length === 0) return [];

  try {
    const promises = ids.map((id) => getPest(id));
    const results = await Promise.all(promises);

    return results.filter((pest): pest is Pest => pest !== null);
  } catch (error) {
    console.error("Error fetching pests:", error);
    return [];
  }
}
