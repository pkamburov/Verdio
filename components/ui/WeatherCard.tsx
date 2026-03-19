import { Droplets, Sun, Wind, CloudRain } from "lucide-react";
import { Card } from "./Card";
import { WeatherData } from "@/features/weather/types";
import { getWeatherLabel } from "@/features/weather/utils";

type WeatherDataProps = {
  weatherData: WeatherData;
};

const getWeatherBackground = (code: string) => {
  const lowerCondition = code.toLowerCase();
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 19 || currentHour < 6;

  if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) {
    return isNight
      ? "https://images.unsplash.com/photo-1551913833-c87f0e39a279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHNreSUyMHN0YXJzJTIwY2xlYXJ8ZW58MXx8fHwxNzczOTQwMjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      : "https://images.unsplash.com/photo-1772449521537-d6c0b9b78b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5ueSUyMGJsdWUlMjBza3klMjBicmlnaHQlMjB3ZWF0aGVyfGVufDF8fHx8MTc3MzkzODMzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  } else if (lowerCondition.includes("rain")) {
    return isNight
      ? "https://images.unsplash.com/photo-1714920268131-92b8492162c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwbmlnaHQlMjBjaXR5JTIwbGlnaHRzfGVufDF8fHx8MTc3Mzk0MDI5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      : "https://images.unsplash.com/photo-1571631991440-7c337530733e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF2eSUyMHJhaW4lMjBkcm9wcyUyMHdpbmRvd3xlbnwxfHx8fDE3NzM5NDAyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  } else if (lowerCondition.includes("snow")) {
    return isNight
      ? "https://images.unsplash.com/photo-1651078578504-6e7ad2d422fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwbmlnaHQlMjB3aW50ZXIlMjBldmVuaW5nfGVufDF8fHx8MTc3Mzk0MDI5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      : "https://images.unsplash.com/photo-1615406518728-57b17c26a511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwc25vd3klMjB3aW50ZXIlMjB3ZWF0aGVyfGVufDF8fHx8MTc3MzkzODMzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  } else {
    // Default to cloudy for "Partly Cloudy" and other conditions
    return isNight
      ? "https://images.unsplash.com/photo-1764267758843-30975c8a7f38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZHklMjBuaWdodCUyMHNreSUyMGRhcmt8ZW58MXx8fHwxNzczOTQwMjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      : "https://images.unsplash.com/photo-1682946688922-39fb6a12c38c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZHklMjBvdmVyY2FzdCUyMHNreSUyMHdlYXRoZXJ8ZW58MXx8fHwxNzczOTM4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  }
};

export function WeatherCard({ weatherData }: WeatherDataProps) {
  const code = getWeatherLabel(weatherData.current.weatherCode);

  return (
    <section>
      <Card className="overflow-hidden border-0 relative h-64 md:h-72">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getWeatherBackground(code)})` }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-br from-black/50 to-black/30" />

        {/* Content */}
        <div className="relative h-full p-6 flex items-start justify-between">
          <div className="space-y-4 text-white">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-white/80">Current Weather</p>
                <p className="text-5xl font-semibold text-white">
                  {weatherData.current.temperature}°C
                </p>
                <p className="text-xl text-white/90">{code}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-white/90" />
                <div>
                  <p className="text-xs text-white/70">Humidity</p>
                  <p className="text-lg font-semibold text-white">
                    {weatherData.current.humidity}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-white/90" />
                <div>
                  <p className="text-xs text-white/70">UV Index</p>
                  <p className="text-lg font-semibold text-white">
                    {weatherData.daily[0].uvIndexMax}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-white/90" />
                <div>
                  <p className="text-xs text-white/70">Wind Speed</p>
                  <p className="text-lg font-semibold text-white">
                    {weatherData.current.windSpeed} km/h
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-white/90" />
                <div>
                  <p className="text-xs text-white/70">Precipitation</p>
                  <p className="text-lg font-semibold text-white">
                    {weatherData.daily[0].precipitation} mm
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 space-y-2 max-w-xs">
              <p className="text-sm font-medium text-white">Garden Tips</p>
              <p className="text-sm text-white/90">
                Perfect conditions for watering. UV levels are moderate - good
                for most indoor plants near windows.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
