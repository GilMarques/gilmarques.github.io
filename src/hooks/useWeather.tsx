import { createEffect, onCleanup } from "solid-js";
import { daySliderPercentFromOpenWeather } from "../utils/daySliderFromOpenWeather";

export enum WeatherType {
  Rain = "rain",
  Drizzle = "drizzle",
  Snow = "snow",
  Clear = "clear",
  Clouds = "clouds",
}

const mapWeatherIdToType = (id: number): WeatherType => {
  if (id >= 200 && id <= 232) return WeatherType.Rain;
  if (id >= 300 && id <= 321) return WeatherType.Drizzle;
  if (id >= 500 && id <= 531) {
    if (id === 502 || id === 503 || id === 504 || id === 522 || id === 531) {
      return WeatherType.Rain;
    }
    return WeatherType.Drizzle;
  }
  if (id >= 600 && id <= 622) return WeatherType.Snow;
  if (id >= 701 && id <= 781) return WeatherType.Clear;
  if (id === 800) return WeatherType.Clear;
  if (id >= 801 && id <= 804) return WeatherType.Clouds;
  return WeatherType.Clear;
};

type UseWeatherParams = {
  setWeather: (weather: WeatherType) => void;
  setDaySliderValue: (value: number) => void;
  setCloudsAll?: (value: number | undefined) => void;
  setWeatherConditionId?: (value: number | undefined) => void;
};

const useWeather = ({
  setWeather,
  setDaySliderValue,
  setCloudsAll,
  setWeatherConditionId,
}: UseWeatherParams) => {
  createEffect(() => {
    const apiKey = import.meta.env.VITE_API_URL;
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${41.55}&lon=${-8.42}&appid=${apiKey}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        const id = data?.weather?.[0]?.id;
        if (typeof id === "number") {
          setWeather(mapWeatherIdToType(id));
          setWeatherConditionId?.(id);
        } else {
          setWeatherConditionId?.(undefined);
        }

        const cloudsPct = data?.clouds?.all;
        if (typeof cloudsPct === "number") {
          setCloudsAll?.(cloudsPct);
        } else {
          setCloudsAll?.(undefined);
        }

        const dt = data?.dt;
        const sunrise = data?.sys?.sunrise;
        const sunset = data?.sys?.sunset;
        if (
          typeof dt === "number" &&
          typeof sunrise === "number" &&
          typeof sunset === "number"
        ) {
          const daySliderPercent = daySliderPercentFromOpenWeather({
            dt,
            sys: { sunrise, sunset },
          });
          console.log("[useWeather] daySliderPercent", daySliderPercent, {
            dt,
            sunrise,
            sunset,
          });
          setDaySliderValue(daySliderPercent);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchWeather();
    onCleanup(() => {
      controller.abort();
    });
  });
};

export default useWeather;
