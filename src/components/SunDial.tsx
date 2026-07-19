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

  const updateFromPointer = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const ratio = x / rect.width;
    props.onChange(min() + ratio * (max() - min()));
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

      {/* 8-bit slider: rectangular track + eightbit button handle */}
      <div
        class="relative w-50 h-10 select-none cursor-pointer focus:outline-none"
        style={{ "touch-action": "none" }}
        role="slider"
        aria-label="Day cycle slider"
        aria-valuemin={min()}
        aria-valuemax={max()}
        aria-valuenow={props.value}
        tabIndex={0}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          updateFromPointer(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons & 1) updateFromPointer(e);
        }}
        onPointerUp={(e) => {
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerCancel={(e) => {
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {}
        }}
        onKeyDown={(e) => {
          const range = max() - min();
          const step = range / 100;
          const big = range / 10;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            props.onChange(clamp(props.value - step, min(), max()));
          } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            props.onChange(clamp(props.value + step, min(), max()));
          } else if (e.key === "PageDown") {
            e.preventDefault();
            props.onChange(clamp(props.value - big, min(), max()));
          } else if (e.key === "PageUp") {
            e.preventDefault();
            props.onChange(clamp(props.value + big, min(), max()));
          } else if (e.key === "Home") {
            e.preventDefault();
            props.onChange(min());
          } else if (e.key === "End") {
            e.preventDefault();
            props.onChange(max());
          }
        }}
      >
        {/* Track - simple 8-bit rectangle */}
        <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 border-4 border-black bg-[#a8a29e]">
          <div
            class="absolute inset-0 bg-yellow-300 pointer-events-none"
            style={{ "clip-path": `inset(0 ${100 - percent()}% 0 0)` }}
          />
        </div>

        {/* Handle - rectangular eightbit button */}
        <div
          class="eightbit-button absolute top-1/2 w-4 h-8 !p-0"
          style={{
            left: `calc(${percent()}% - 0.5rem)`,
            transform: "translateY(-50%)",
          }}
        />
      </div>
    </div>
  );
};

export default SunDial;
