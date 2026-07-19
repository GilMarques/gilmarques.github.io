import { createMemo } from "solid-js";
import {
  indicator,
  cloudy,
  drizzle,
  moon,
  snowflake,
  sun,
  sun_dial,
} from "../assets/sprites/sun_dial";
import { WeatherType } from "../hooks/useWeather";

type DaySliderProps = {
  weather: WeatherType;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  setWeather: (weather: WeatherType) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const SunDial = (props: DaySliderProps) => {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 100;

  const percent = createMemo(() => {
    if (max() === min()) return 0;
    const rawPercent = ((props.value - min()) / (max() - min())) * 100;
    return clamp(rawPercent, 0, 100);
  });

  const sunAngle = createMemo(() => {
    if (percent() >= 75) return 0;
    const ratio = percent() / 75;
    return 180 - ratio * 180;
  });

  const moonAngle = createMemo(() => {
    if (percent() < 75) return 180;
    const ratio = (percent() - 75) / 25;
    return 180 - ratio * 90;
  });

  const rangeAngle = createMemo(() => 180 - (percent() / 100) * 180);

  const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
    props.onChange(parseFloat(e.currentTarget.value));
  };

  return (
    <div class="flex flex-col items-center gap-2">
      <div class="relative w-50 h-32">
        <img
          src={sun_dial}
          alt="sun dial"
          class="absolute w-full h-full pointer-events-none z-10"
        />

        <div class="absolute  left-[50%] translate-x-[-53%]  bottom-6  pointer-events-none z-10 ">
          {(props.weather === WeatherType.Drizzle ||
            props.weather === WeatherType.Rain) && (
            <img
              src={drizzle}
              class="w-8 h-8"
              style={{ filter: "invert(1)" }}
            />
          )}
          {props.weather === WeatherType.Clouds && (
            <img src={cloudy} class="w-8 h-8" style={{ filter: "invert(1)" }} />
          )}
          {props.weather === WeatherType.Snow && (
            <img
              src={snowflake}
              class="w-8 h-8"
              style={{ filter: "invert(1)" }}
            />
          )}
        </div>

        <div class="absolute left-0 w-full h-full pointer-events-none z-10 ">
          <div
            class="absolute w-6 h-6"
            style={{
              left: `calc(50% + (42% * cos(${rangeAngle()}deg)))`,
              bottom: `calc(2rem + (4rem * sin(${rangeAngle()}deg)))`,
              transform: "translate(-50%, 50%)",
            }}
          >
            <img
              src={indicator}
              alt="indicator"
              class="w-full h-full"
            />
          </div>
        </div>

        <div class="relative left-[25%] w-[50%] h-full pointer-events-none z-10">
          <img
            src={sun}
            alt="sun"
            class="absolute w-8 h-8"
            style={{
              left: `calc(50% + (44% * cos(${sunAngle()}deg)))`,
              bottom: `calc(2rem + (2.75rem * sin(${sunAngle()}deg)))`,
              opacity: percent() < 75 ? 1 : 0,
              transform: "translate(-50%, 50%)",
              filter: "blur(0.5px)",
            }}
          />

          <img
            src={moon}
            alt="moon"
            class="absolute w-8 h-8"
            style={{
              left: `calc(50% + (44% * cos(${moonAngle()}deg)))`,
              bottom: `calc(2rem + (2.75rem * sin(${moonAngle()}deg)))`,
              opacity: percent() >= 75 ? 1 : 0,
              transform: "translate(-50%, 50%)",
              filter: "blur(0.5px)",
            }}
          />
        </div>
      </div>

      <input
        type="range"
        min={min()}
        max={max()}
        value={props.value}
        onInput={handleChange}
        onChange={handleChange}
        class="w-50 accent-teal-400 cursor-pointer"
        aria-label="Day cycle slider"
      />
    </div>
  );
};

export default SunDial;
