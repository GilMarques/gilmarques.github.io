import { createMemo, createSignal, JSXElement, onMount } from "solid-js";
import {
  blue_circle,
  button,
  buttonPressed,
  cloudy,
  drizzle,
  droplet,
  moon,
  snowflake,
  sun,
  sun_dial,
  sunny,
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

const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: JSXElement;
}) => {
  const [held, setHeld] = createSignal(false);
  const imageSource = createMemo(() => (held() ? buttonPressed : button));

  const handlePointerDown = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.setPointerCapture(e.pointerId);
    setHeld(true);
  };

  const handlePointerUp = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
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
      style={{
        width: "64px",
        height: "64px",
      }}
      class="relative"
    >
      <div
        class={`absolute w-full h-full flex justify-center items-center text-black ${
          held() ? "top-1" : ""
        }  `}
      >
        {children}
      </div>
      <img src={imageSource()} draggable={false} width={64} height={64} />
    </button>
  );
};

const SunDial = (props: DaySliderProps) => {
  let rootRef: HTMLDivElement | undefined;

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

  onMount(() => {
    const root = rootRef;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -2 : 2;
      const nextValue = clamp(props.value + direction, min(), max());
      if (nextValue !== props.value) props.onChange(nextValue);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  });

  return (
    <div class="flex flex-col items-center" ref={rootRef}>
      <div class="group relative w-50 h-32">
        <input
          type="range"
          min={min()}
          max={max()}
          value={props.value}
          onInput={handleChange}
          onChange={handleChange}
          class="absolute w-full h-full opacity-0 cursor-pointer z-20 touch-none"
          aria-label="Slider"
        />

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
              style={{ filter: `invert(1)` }}
            />
          )}
          {props.weather === WeatherType.Clouds && (
            <img src={cloudy} class="w-8 h-8" style={{ filter: `invert(1)` }} />
          )}
          {props.weather === WeatherType.Snow && (
            <img
              src={snowflake}
              class="w-8 h-8"
              style={{ filter: `invert(1)` }}
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
              src={blue_circle}
              alt="blue circle"
              class="w-full h-full group-hover:animate-[scale_1s_ease-in-out_infinite] "
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

      <div class="flex items-center gap-2">
        <Button onClick={() => props.setWeather(WeatherType.Clouds)}>
          <img src={cloudy} alt="Make it cloudy" />
        </Button>
        <Button onClick={() => props.setWeather(WeatherType.Drizzle)}>
          <img src={drizzle} alt="Make it drizzle" />
        </Button>
        <Button onClick={() => props.setWeather(WeatherType.Rain)}>
          <img src={droplet} alt="Make it rain" />
        </Button>

        <Button onClick={() => props.setWeather(WeatherType.Snow)}>
          <img src={snowflake} alt="Make it snow" />
        </Button>
        <Button onClick={() => props.setWeather(WeatherType.Clear)}>
          <img src={sunny} alt="Make it clear" />
        </Button>
      </div>
    </div>
  );
};

export default SunDial;
