"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { getWeather } from "@/features/weather/api";
import { WeatherCard } from "@/components/ui/WeatherCard";
import { WeatherData } from "@/features/weather/types";
import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useMemo, useState } from "react";

import { notifications } from "@/data/mock-data";

export default function DashboardPage() {
  const { uid } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const coords = useMemo(() => ({ latitude: 42.697, longitude: 23.3219 }), []);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;

    async function run() {
      try {
        setWeatherLoading(true);
        setWeatherError(null);

        const data = await getWeather(coords.latitude, coords.longitude);

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
  }, [uid, coords.latitude, coords.longitude]);

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

      {/* Weather Conditions Section */}
      <section>
        <h2 className="text-2xl font-semibold text-green-900 mb-4">
          Weather Conditions
        </h2>
        {weatherLoading && <div>Loading weather...</div>}
        {weatherError && <div className="text-red-600">{weatherError}</div>}
        {weatherData ? <WeatherCard weatherData={weatherData} /> : null}
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-2xl font-semibold text-green-900 mb-4">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Total Plants</p>
            <p className="text-3xl font-semibold text-green-800 mt-1">6</p>
          </Card>
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Need Water</p>
            <p className="text-3xl font-semibold text-blue-600 mt-1">2</p>
          </Card>
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Excellent Health</p>
            <p className="text-3xl font-semibold text-emerald-600 mt-1">4</p>
          </Card>
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-100">
            <p className="text-sm text-gray-600">Pending Tasks</p>
            <p className="text-3xl font-semibold text-amber-600 mt-1">3</p>
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
            {notifications.length} active
          </Badge>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
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
                      // className={getPriorityColor(notification.priority)}
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
