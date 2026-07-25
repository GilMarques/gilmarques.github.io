import { For } from "solid-js";
import {
  cloudRain,
  cloudy,
  drizzle,
  snowflake,
  sun,
} from "../assets/sprites/sun_dial";
import { WeatherType } from "../hooks/useWeather";

type WeatherButtonsProps = {
  weather: WeatherType;
  setWeather: (weather: WeatherType) => void;
};

const WEATHER_OPTIONS: { type: WeatherType; label: string; icon: string }[] =
  [
    { type: WeatherType.Clear, label: "Clear", icon: sun },
    { type: WeatherType.Clouds, label: "Clouds", icon: cloudy },
    { type: WeatherType.Drizzle, label: "Drizzle", icon: drizzle },
    { type: WeatherType.Rain, label: "Rain", icon: cloudRain },
    { type: WeatherType.Snow, label: "Snow", icon: snowflake },
  ];

const WeatherButtons = (props: WeatherButtonsProps) => {
  return (
    <div class="flex flex-row items-center justify-center gap-3 w-50">
      <For each={WEATHER_OPTIONS}>
        {(opt) => {
          const isActive = () => props.weather === opt.type;
          return (
            <button
              type="button"
              aria-label={opt.label}
              aria-pressed={isActive()}
              onClick={() => props.setWeather(opt.type)}
              class={`eightbit-button !p-1 w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center ${
                isActive() ? "is-pressed" : ""
              }`}
            >
              <img
                src={opt.icon}
                alt={opt.label}
                class="w-6 h-6 pixelated"
                draggable={false}
              />
            </button>
          );
        }}
      </For>
    </div>
  );
};

export default WeatherButtons;
