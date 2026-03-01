import { collection, orderBy, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type Species = {
  id: string;
  commonName: string;
  latinName: string;
  indoorOutdoor: "indoor" | "outdoor" | "both";
};

export async function listSpecies(): Promise<Species[]> {
  const q = query(collection(db, "species"), orderBy("commonName"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Species, "id">),
  }));
}
