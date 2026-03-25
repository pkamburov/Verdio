export type BrowserCoordinates = {
  latitude: number;
  longitude: number;
};

export async function getCurrentBrowserLocation(): Promise<BrowserCoordinates> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 300000,
      },
    );
  });
}
