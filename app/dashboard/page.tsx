"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { getWeather, getWeatherWithCache } from "@/features/weather/api";
import { WeatherCard } from "@/components/ui/WeatherCard";
import { WeatherData } from "@/features/weather/types";
import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useMemo, useState } from "react";
import { generateDashboardTips, getPriorityColor } from "@/features/tips/utils";
import { DashboardTip } from "@/features/tips/types";
import { Plant } from "@/features/plants/types";
import { Species } from "@/features/species/types";
import { useSpecies } from "@/features/species/useSpecies";
import { countPlantsNeedingWater } from "@/features/tips/utils";
import { getPlants } from "@/features/plants/api";
import { countHealthyPlants } from "@/features/plants/utils/countHealthyPlants";
import {
  LocationSearchResult,
  UserLocationSettings,
} from "@/features/location/types";
import {
  getUserLocationSettings,
  saveUserLocationSettings,
} from "@/features/location/api";
import { getCurrentBrowserLocation } from "@/features/location/browser";
import {
  getCachedUserLocation,
  setCachedUserLocation,
} from "@/features/location/cache";
import { searchLocations } from "@/features/location/geocoding";

export default function DashboardPage() {
  const { uid } = useAuth();
  const { species } = useSpecies();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [tips, setTips] = useState<DashboardTip[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState("");
  const [manualResults, setManualResults] = useState<LocationSearchResult[]>(
    [],
  );
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [locationSettings, setLocationSettings] =
    useState<UserLocationSettings | null>(null);

  const speciesMap = useMemo<Record<string, Species>>(
    () => Object.fromEntries(species.map((s) => [s.id, s])),
    [species],
  );
  const healthyPlantsCount = useMemo(() => {
    if (!plants.length || !species.length) return 0;

    return countHealthyPlants(
      plants.map((plant) => ({
        plant,
        species: speciesMap[plant.speciesId] ?? null,
      })),
    );
  }, [plants, species, speciesMap]);

  const plantsNeedingWater = useMemo(() => {
    if (!plants.length || !species.length) return [];

    return countPlantsNeedingWater(
      plants.map((plant) => ({
        plant,
        species: speciesMap[plant.speciesId] ?? null,
      })),
    );
  }, [plants, species, speciesMap]);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    const currentId = uid;

    async function run() {
      const plantsData = await getPlants(currentId);
      if (!cancelled) {
        setPlants(plantsData);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    if (!uid || !locationSettings) {
      setWeatherData(null);
      setWeatherError(null);
      return;
    }

    const currentId = uid;
    const currentLocationSettings = locationSettings;
    let cancelled = false;

    async function run() {
      try {
        setWeatherLoading(true);
        setWeatherError(null);

        const data = await getWeatherWithCache(
          currentId,
          currentLocationSettings.latitude,
          currentLocationSettings.longitude,
        );

        if (!cancelled) setWeatherData(data);
      } catch (e) {
        if (!cancelled) setWeatherError("Failed to load weather");
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [uid, locationSettings]);

  useEffect(() => {
    async function run() {
      if (!plants.length || !weatherData) return;
      const generated = await generateDashboardTips(plants, weatherData);
      setTips(generated);
    }

    run();
  }, [plants, weatherData]);

  useEffect(() => {
    if (!uid) return;

    const currentId = uid;
    let cancelled = false;

    const cachedLocation = getCachedUserLocation(currentId);
    if (cachedLocation) {
      setLocationSettings(cachedLocation);
    }

    async function run() {
      const savedLocation = await getUserLocationSettings(currentId);
      if (!cancelled && savedLocation) {
        setLocationSettings({
          source: savedLocation.source,
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          label: savedLocation.label,
        });
        setCachedUserLocation(currentId, {
          source: savedLocation.source,
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          label: savedLocation.label,
        });
      }
    }
    run();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  async function handleUseCurrentLocation() {
    if (!uid) return;
    const currentUid = uid;

    try {
      setLocationLoading(true);
      setLocationError(null);

      const coords = await getCurrentBrowserLocation();

      await saveUserLocationSettings(currentUid, {
        source: "gps",
        latitude: coords.latitude,
        longitude: coords.longitude,
        label: "Current location",
      });

      const savedLocation = await getUserLocationSettings(currentUid);
      setLocationSettings(savedLocation);
    } catch (error: unknown) {
      console.error("Location flow error:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "number"
      ) {
        switch (error.code) {
          case 1:
            setLocationError("Location access was denied.");
            break;
          case 2:
            setLocationError("Unable to determine your location.");
            break;
          case 3:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("Failed to get your location.");
        }
      } else if (error instanceof Error) {
        setLocationError(error.message);
      } else {
        setLocationError("Failed to get your location.");
      }
    }
  }

  async function handleManualLocationSearch() {
    try {
      setManualLoading(true);
      setManualError(null);

      const results = await searchLocations(manualQuery);
      setManualResults(results);

      if (!results.length) {
        setManualError("No locations found.");
      }
    } catch (error) {
      console.error(error);
      setManualError("Failed to search locations.");
    } finally {
      setManualLoading(false);
    }
  }

  async function handleSelectManualLocation(result: LocationSearchResult) {
    if (!uid) return;
    const currentUid = uid;

    const nextLocation = {
      source: "manual" as const,
      latitude: result.latitude,
      longitude: result.longitude,
      label: result.label,
    };

    try {
      setLocationLoading(true);
      setLocationError(null);

      await saveUserLocationSettings(currentUid, nextLocation);
      setCachedUserLocation(currentUid, nextLocation);
      setLocationSettings(nextLocation);

      setManualResults([]);
      setManualQuery("");
      setManualError(null);
    } catch (error) {
      console.error(error);
      setLocationError("Failed to save selected location.");
    } finally {
      setLocationLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-semibold text-green-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your garden's health and get personalized care tips
        </p>
      </div>
      {!locationSettings ? (
        <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
          <h3 className="text-lg font-semibold text-green-900">
            Set your location
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Allow location access to see local weather and personalized plant
            tips.
          </p>

          {locationError && (
            <p className="text-sm text-red-600 mt-3">{locationError}</p>
          )}

          <button onClick={handleUseCurrentLocation} disabled={locationLoading}>
            {locationLoading
              ? "Getting location..."
              : "Use my current location"}
          </button>
          <div className="mt-4 border-t border-green-100 pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Or set your location manually
            </p>

            <div className="flex gap-2">
              <input
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="Enter city"
                className="..."
              />
              <button
                onClick={handleManualLocationSearch}
                disabled={manualLoading}
              >
                {manualLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {manualError && (
              <p className="text-sm text-red-600 mt-2">{manualError}</p>
            )}

            {manualResults.length > 0 ? (
              <div className="mt-3 space-y-2">
                {manualResults.map((result) => (
                  <button
                    key={`${result.latitude}-${result.longitude}-${result.label}`}
                    onClick={() => handleSelectManualLocation(result)}
                    className="w-full text-left ..."
                  >
                    {result.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}
      {/* Weather Conditions Section */}

      {locationSettings ? (
        <section>
          <h2 className="text-2xl font-semibold text-green-900 mb-4">
            Weather Conditions
          </h2>
          {weatherLoading && <div>Loading weather...</div>}
          {weatherError && <div className="text-red-600">{weatherError}</div>}
          {weatherData ? <WeatherCard weatherData={weatherData} /> : null}
        </section>
      ) : null}

      {/* Quick Stats */}
      <section>
        <h2 className="text-2xl font-semibold text-green-900 mb-4">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Total Plants</p>
            <p className="text-3xl font-semibold text-green-800 mt-1">
              {plants.length}
            </p>
          </Card>
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Need Water</p>
            <p className="text-3xl font-semibold text-blue-600 mt-1">
              {plantsNeedingWater.length}
            </p>
          </Card>
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Plants In Good Health</p>
            <p className="text-3xl font-semibold text-emerald-600 mt-1">
              {healthyPlantsCount}
            </p>
          </Card>
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Pending Tasks</p>
            <p className="text-3xl font-semibold text-amber-600 mt-1">
              {tips.length}
            </p>
          </Card>
        </div>
      </section>

      {/* Notifications & Growing Tips Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-green-900">
            Notifications & Growing Tips
          </h2>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {tips.length} active
          </Badge>
        </div>

        <div className="space-y-3">
          {tips.map((notification) => (
            <Card
              key={notification.id}
              className="p-4 bg-white/60 backdrop-blur-sm border-green-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                // className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}
                >
                  {/* {getNotificationIcon(notification.type)} */}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {notification.plantName && (
                        <Link
                          href={`/plants/${notification.plantId}`}
                          className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
                        >
                          {notification.plantName}
                        </Link>
                      )}
                      <p className="text-gray-900 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={getPriorityColor(notification.priority)}
                    >
                      {notification.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
