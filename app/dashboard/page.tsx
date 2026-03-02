"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  CloudSun,
  Droplets,
  Sun,
  Wind,
  Droplet,
  Leaf,
  Scissors,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { weatherData, notifications } from "../../data/mock-data";
import Link from "next/link";

export default function DashboardPage() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "water":
        return <Droplet className="w-5 h-5" />;
      case "fertilize":
        return <Leaf className="w-5 h-5" />;
      case "prune":
        return <Scissors className="w-5 h-5" />;
      case "tip":
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "water":
        return "text-blue-600 bg-blue-50";
      case "fertilize":
        return "text-green-600 bg-green-50";
      case "prune":
        return "text-purple-600 bg-purple-50";
      case "tip":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

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
        <Card className="p-6 bg-linear-to-br from-blue-50 to-cyan-50 border-blue-100">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CloudSun className="w-12 h-12 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Current Weather</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {weatherData.temperature}°F
                  </p>
                  <p className="text-gray-700">{weatherData.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-600">Humidity</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {weatherData.humidity}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-gray-600">UV Index</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {weatherData.uvIndex}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Air Quality</p>
                    <p className="text-lg font-semibold text-gray-900">Good</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Garden Tips</p>
                <p className="text-sm text-gray-600">
                  Perfect conditions for watering. UV levels are moderate - good
                  for most indoor plants near windows.
                </p>
              </div>
            </div>
          </div>
        </Card>
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
                  className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}
                >
                  {getNotificationIcon(notification.type)}
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
