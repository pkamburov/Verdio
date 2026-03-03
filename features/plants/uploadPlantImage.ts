import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

export async function uploadPlantImage(params: {
  uid: string;
  plantId: string;
  file: File;
}) {
  const { uid, plantId, file } = params;

  const ext = file.name.split(".").pop() || "jpg";
  const safeExt = ext.toLowerCase();
  const path = `users/${uid}/plants/${plantId}/main.${ext}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const url = await getDownloadURL(storageRef);
  return { url, path };
}
