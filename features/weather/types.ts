export type WeatherData = {
  current: CurrentWeather;
  daily: DailyForecast[];
};

export type CurrentWeather = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  humidity: number;
  time: string;
};

export type DailyForecast = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  uvIndexMax: number;
};

export type OpenMeteoResponse = {
  current?: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    relative_humidity_2m: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    uv_index_max: number[];
  };
};
