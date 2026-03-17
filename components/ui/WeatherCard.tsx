import {
  CloudRain,
  CloudSun,
  Droplets,
  Snowflake,
  Sun,
  Wind,
} from "lucide-react";
import { Card } from "./Card";
import { WeatherData } from "@/features/weather/types";
import { getUVLevel, getWeatherLabel } from "@/features/weather/utils";
import { weatherData } from "@/data/mock-data";

type WeatherDataProps = {
  weatherData: WeatherData;
};

const uvLevel = getUVLevel(weatherData.uvIndex);

function getWeatherIcon(code: string) {
  if (code === "Clear sky") {
    return <Sun className="w-12 h-12 text-yellow-600" />;
  }

  if (code === "Cloudy") {
    return <CloudSun className="w-12 h-12 text-yellow-400" />;
  }

  if (code === "Rain") {
    return <CloudRain className="w-12 h-12 text-blue-300" />;
  }

  if (code === "Snow") {
    return <Snowflake className="w-12 h-12 text-gray-300" />;
  }

  return <CloudSun className="w-12 h-12 text-gray-300" />;
}

export function WeatherCard({ weatherData }: WeatherDataProps) {
  const code = getWeatherLabel(weatherData.current.weatherCode);
  return (
    <div>
      <Card className="p-6 bg-linear-to-br from-blue-50 to-cyan-50 border-blue-100">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              {getWeatherIcon(code)}
              <div className="grid pt-2">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Weather</p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {weatherData.current.temperature}°C
                    </p>
                    <p className="text-gray-700">{code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Min Temp</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {weatherData.daily[0].tempMin}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max Temp</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {weatherData.daily[0].tempMax}°C
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-600">Precipitation</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {weatherData.daily[0].precipitation} mm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-600">UV Index</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {weatherData.daily[0].uvIndexMax} {uvLevel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Wind speed</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {weatherData.current.windSpeed} km/h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:block">
          <div className="bg-white/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Garden Tips</p>
            <p className="text-sm text-gray-600">
              Perfect conditions for watering. UV levels are moderate - good for
              most indoor plants near windows.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
