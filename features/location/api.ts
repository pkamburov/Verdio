import { db } from "@/lib/firebase/client";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { LocationSource } from "./types";

type SaveUserLocationInput = {
  source: LocationSource;
  latitude: number;
  longitude: number;
  label?: string;
};

export async function getUserLocationSettings(uid: string) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return data.locationSettings ?? null;
}

export async function saveUserLocationSettings(
  uid: string,
  location: SaveUserLocationInput,
) {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    {
      locationSettings: {
        ...location,
        updatedAt: serverTimestamp(),
      },
    },
    { merge: true },
  );
}
