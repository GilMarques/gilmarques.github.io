import React, { useMemo, useState } from "react";
import {
  blue_circle,
  button,
  cloudy,
  drizzle,
  moon_icon,
  snowflake,
  sun_dial,
  sun_icon,
} from "../assets";
import { WeatherType } from "../hooks/useWeather";
import { Cloud, CloudRain, Droplet, Snowflake, Sun, X } from "lucide-react";

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

const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const [held, setHeld] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setHeld(true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setHeld(false);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setHeld(false)}
      onLostPointerCapture={() => setHeld(false)}
    >
      <div
        className={`absolute min-w-[50px] flex justify-center items-center text-black ${
          held ? " h-[50px]" : " h-[45px]"
        }  `}
      >
        {children}
      </div>
      <img
        src={held ? button[0] : button[1]}
        style={{
          minHeight: 50,
          minWidth: 50,
          maxHeight: 50,
          maxWidth: 50,
        }}
      />
    </button>
  );
};

const SunDial = ({
  weather,
  min = 0,
  max = 100,
  value,
  onChange,
  setWeather,
}: DaySliderProps) => {
  const percent = useMemo(() => {
    if (max === min) return 0;
    const rawPercent = ((value - min) / (max - min)) * 100;
    return clamp(rawPercent, 0, 100);
  }, [value, max, min]);

  const sunAngle = useMemo(() => {
    if (percent >= 75) return 0;
    const ratio = percent / 75;
    return 180 - ratio * 180;
  }, [percent]);

  const moonAngle = useMemo(() => {
    if (percent < 75) return 180;
    const ratio = (percent - 75) / 25;
    return 180 - ratio * 90;
  }, [percent]);

  /** Dial / range indicator: full slider maps linearly 0 → 180°, 100 → 0°. */
  const rangeAngle = useMemo(() => 180 - (percent / 100) * 180, [percent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="group relative w-[200px] h-32">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20 touch-none"
          aria-label="Slider"
        />

        <img
          src={sun_dial}
          alt="sun dial"
          className="absolute w-full h-full pointer-events-none z-10"
        />

        <div className="absolute  left-[50%] translate-x-[-53%]  bottom-6  pointer-events-none z-10 ">
          {(weather === WeatherType.Drizzle ||
            weather === WeatherType.Rain) && (
            <img
              src={drizzle}
              className="w-8 h-8"
              style={{ filter: `invert(1)` }}
            />
          )}
          {weather === WeatherType.Clouds && (
            <img
              src={cloudy}
              className="w-8 h-8"
              style={{ filter: `invert(1)` }}
            />
          )}
          {weather === WeatherType.Snow && (
            <img
              src={snowflake}
              className="w-8 h-8"
              style={{ filter: `invert(1)` }}
            />
          )}
        </div>

        <div className="absolute left-0 w-full h-full pointer-events-none z-10 ">
          <div
            className="absolute w-6 h-6"
            style={{
              left: `calc(50% + (42% * cos(${rangeAngle}deg)))`,
              bottom: `calc(2rem + (4rem * sin(${rangeAngle}deg)))`,
              transform: "translate(-50%, 50%)",
            }}
          >
            <img
              src={blue_circle}
              alt="blue circle"
              className="w-full h-full group-hover:animate-[scale_1s_ease-in-out_infinite] "
            />
          </div>
        </div>

        <div className="relative left-[25%] w-[50%] h-full pointer-events-none z-10">
          <img
            src={sun_icon}
            alt="sun"
            className="absolute w-8 h-8"
            style={{
              left: `calc(50% + (44% * cos(${sunAngle}deg)))`,
              bottom: `calc(2rem + (2.75rem * sin(${sunAngle}deg)))`,
              opacity: percent < 75 ? 1 : 0,
              transform: "translate(-50%, 50%)",
            }}
          />

          <img
            src={moon_icon}
            alt="moon"
            className="absolute w-8 h-8"
            style={{
              left: `calc(50% + (44% * cos(${moonAngle}deg)))`,
              bottom: `calc(2rem + (2.75rem * sin(${moonAngle}deg)))`,
              opacity: percent >= 75 ? 1 : 0,
              transform: "translate(-50%, 50%)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => setWeather(WeatherType.Clouds)}>
          <Cloud />
        </Button>
        <Button onClick={() => setWeather(WeatherType.Drizzle)}>
          <Droplet />
        </Button>
        <Button onClick={() => setWeather(WeatherType.Rain)}>
          <CloudRain />
        </Button>

        <Button onClick={() => setWeather(WeatherType.Snow)}>
          <Snowflake />
        </Button>
        <Button onClick={() => setWeather(WeatherType.Clear)}>
          <Sun />
        </Button>
      </div>
    </div>
  );
};

export default SunDial;
