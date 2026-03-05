export type WeatherData = {
  current: CurrentWeather;
  daily: DailyForecast[];
};

export type CurrentWeather = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
};

export type DailyForecast = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
};

export type OpenMeteoResponse = {
  current?: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
};
