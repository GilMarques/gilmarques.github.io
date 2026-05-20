import "./App.css";
import Footer from "./components/Footer";
import Weather from "./components/Weather";

import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import Canvas from "./components/Canvas";
import Moon from "./components/Moon";
import Projects from "./components/Projects";
import Sun, { SUN_SIZE } from "./components/Sun";
import useSkyAtmosphere from "./hooks/useSkyAtmosphere";
import useWeather, { WeatherType } from "./hooks/useWeather";
import { dayLengthFromDate } from "./utils/dayLengthFromDayOfYear";

export type DaytimeType = "day" | "sunrise" | "sunset" | "night" | "cloudy";

function daytimeFromSunPosition(sunY: number, horizonY: number): DaytimeType {
  if (sunY >= horizonY) return "night";
  if (sunY + SUN_SIZE >= horizonY) return "sunset";
  if (sunY <= horizonY * 0.35) return "sunrise";
  return "day";
}

function App() {
  const [spawnClouds, setSpawnClouds] = createSignal(true);

  const [weather, setWeather] = createSignal<WeatherType>(WeatherType.Snow);
  const [daySliderValue, setDaySliderValue] = createSignal(50);
  const [cloudsAll, setCloudsAll] = createSignal<number | undefined>();
  const [weatherConditionId, setWeatherConditionId] = createSignal<
    number | undefined
  >();
  const [viewportWidth, setViewportWidth] = createSignal(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );

  let sunRef: HTMLDivElement | undefined;
  let moonRef: HTMLDivElement | undefined;

  const seasonalDayLength = createMemo(() => dayLengthFromDate(new Date()));

  useWeather({
    setWeather,
    setDaySliderValue,
    setCloudsAll,
    setWeatherConditionId,
  });

  const setWeatherFromUser = (next: WeatherType) => {
    setWeather(next);
    setWeatherConditionId(undefined);
    setCloudsAll(undefined);
  };

  createEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    onCleanup(() => window.removeEventListener("resize", onResize));
  });

  const bodyTrajectory = createMemo(() => {
    const normalized = Math.min(1, Math.max(0, daySliderValue() / 100));
    const leftMargin = 48;
    const rightMargin = 48;
    const travel = Math.max(0, viewportWidth() - leftMargin - rightMargin);

    const projectArc = (phase: number, peak = 124, baseline = 700) => {
      const x = leftMargin + travel * phase;
      const y = baseline - Math.sin(Math.PI * phase) * peak;
      return { x: Math.round(x), y: Math.round(y) };
    };

    const pageHeight =
      typeof document !== "undefined"
        ? Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight,
          )
        : 1200;
    const seasonalNormalized = seasonalDayLength().normalized; // 0 = shortest day, 1 = longest
    const seasonalShift = (seasonalNormalized - 0.5) * 0.18; // +/- 0.09 around default
    const sunNoonPhase = 0.375;
    const sunSetPhase = Math.min(0.9, Math.max(0.58, 0.75 + seasonalShift));
    const sunsetTargetY = Math.max(0, pageHeight - 600);
    const sunTrackX = viewportWidth() - 180;
    const sunDelta = Math.min(
      1,
      Math.abs(normalized - sunNoonPhase) / (sunSetPhase - sunNoonPhase),
    );
    const sunY = sunsetTargetY * sunDelta;

    // Moon trajectory follows day progression (not hour slider).
    // Keep only a subtle slider nudge so it doesn't look frozen.
    const moonCycleLength = 29.53;
    const moonDayPhase =
      (seasonalDayLength().dayOfYear % moonCycleLength) / moonCycleLength;
    const moonHourNudge = (normalized - 0.5) * 0.04;
    const moonPhase = (moonDayPhase + moonHourNudge + 1) % 1;

    return {
      sun: {
        x: Math.round(
          Math.max(leftMargin, Math.min(sunTrackX, viewportWidth() - 120)),
        ),
        y: Math.round(sunY),
        horizonY: Math.round(sunsetTargetY),
      },
      moon: projectArc(moonPhase, 110, 730),
      seasonalDayLength,
      sunNormalized: normalized,
      sunNoonPhase,
      sunSetPhase,
      sunDelta,
    };
  });

  const daytime = createMemo(() =>
    daytimeFromSunPosition(
      bodyTrajectory().sun.y,
      bodyTrajectory().sun.horizonY,
    ),
  );

  const isDay = createMemo(
    () => bodyTrajectory().sun.y < bodyTrajectory().sun.horizonY,
  );

  createEffect(() => {
    document.body.classList.toggle("is-day", isDay());
    document.body.classList.toggle("is-night", !isDay());
  });

  const skyPercentFromSunPosition = createMemo(() => {
    const { sun, sunNormalized, sunNoonPhase, sunSetPhase, sunDelta } =
      bodyTrajectory();
    const { y, horizonY } = sun;
    const touchY = horizonY - SUN_SIZE;
    const underY = horizonY;

    if (y >= underY) {
      const nightProgress = Math.min(1, (y - underY) / SUN_SIZE);
      return Math.round(75 + nightProgress * 25);
    }

    if (y >= touchY) {
      const sunsetProgress = (y - touchY) / SUN_SIZE;
      return Math.round(50 + sunsetProgress * 25);
    }

    const clampedSunsetPhase = Math.min(
      0.99,
      Math.max(sunNoonPhase + 0.01, sunSetPhase),
    );

    if (sunNormalized >= clampedSunsetPhase) {
      return 50;
    }

    if (sunNormalized <= sunNoonPhase) {
      return Math.round(Math.min(37.5, Math.max(0, (1 - sunDelta) * 37.5)));
    }

    return Math.round(Math.min(50, Math.max(37.5, 50 - (1 - sunDelta) * 12.5)));
  });

  const { skyGradient, cloudLevel, cloudLayers } = useSkyAtmosphere({
    daySliderPercent: skyPercentFromSunPosition,
    weather,
    cloudsAll,
    weatherConditionId,
  });

  return (
    <>
      <div class="navbar z-20 flex justify-end text-nowrap border-b-4 border-r-4 border-black bg-stone-300 px-8 py-4">
        <div class="flex gap-8 font-custom text-xl">
          <a href="#about" class="hover:underline">
            About
          </a>
          <a href="#projects" class="hover:underline">
            Projects
          </a>
          <a href="#contact" class="hover:underline">
            Contact
          </a>
        </div>
      </div>
      <div
        class="front-row relative z-10 min-w-full"
        style={{ background: skyGradient() }}
      >
        <Weather
          weather={weather()}
          daytime={daytime()}
          spawnClouds={spawnClouds()}
          cloudLevel={cloudLevel()}
          cloudLayers={cloudLayers()}
        />

        <div class={`px-8  ${isDay() ? "text-black" : "text-white"}`}>
          <div class="text-md font-custom mt-16 text-4xl font-black underline">
            About
          </div>
          <div
            class={`text-md  font-custom text-3xl scroll-mt-16  ${
              isDay() ? "text-black" : "text-white"
            }`}
            id="about"
          >
            Hi, my name is <b>Gil</b> <br /> I'm a Software Developer from
            Portugal
          </div>
        </div>

        <Canvas day={isDay} />

        <Projects isDay={isDay()} />

        <Sun
          isDay={isDay()}
          x={bodyTrajectory().sun.x}
          y={bodyTrajectory().sun.y}
          horizonY={bodyTrajectory().sun.horizonY}
          ref={(el) => (sunRef = el)}
        />
        <Moon
          isDay={isDay()}
          x={bodyTrajectory().moon.x}
          y={bodyTrajectory().moon.y}
          ref={(el) => (moonRef = el)}
        />

        <Footer
          weather={weather()}
          isDay={isDay()}
          setWeather={setWeatherFromUser}
          daySliderValue={daySliderValue()}
          setDaySliderValue={setDaySliderValue}
          sunRef={sunRef}
          moonRef={moonRef}
        />
      </div>
    </>
  );
}

export default App;
