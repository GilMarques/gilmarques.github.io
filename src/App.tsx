import "./App.css";
import Footer from "./components/Footer";
import Weather from "./components/Weather";

import { createEffect, createMemo, createSignal, onCleanup, Show } from "solid-js";

import { github, linkedin, mail } from "./assets/icons";
import Canvas from "./components/Canvas";
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
  const [viewportHeight, setViewportHeight] = createSignal(
    typeof window !== "undefined" ? window.innerHeight : 800,
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
    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);
    onCleanup(() => window.removeEventListener("resize", onResize));
  });

  const bodyTrajectory = createMemo(() => {
    const normalized = Math.min(1, Math.max(0, daySliderValue() / 100));
    const leftMargin = 48;
    const rightMargin = 48;
    const travel = Math.max(0, viewportWidth() - leftMargin - rightMargin);

    // Footer band at the bottom of the 100vh viewport. The ocean canvas
    // (Ocean.tsx) is capped at MAX_CANVAS_CSS_HEIGHT = 200, and the contact
    // div is absolutely positioned, so the grid's bottom row is ~200px tall.
    // The horizon (where the sun sets) sits at the top of that band.
    const FOOTER_HEIGHT = 200;
    const vh = viewportHeight();
    const horizonY = Math.max(0, vh - FOOTER_HEIGHT);
    // Peak height the body reaches above the horizon at noon.
    const arcPeak = Math.max(0, horizonY * 0.7);

    const projectArc = (phase: number, peak = arcPeak, baseline = horizonY) => {
      const x = leftMargin + travel * phase;
      const y = baseline - Math.sin(Math.PI * phase) * peak;
      return { x: Math.round(x), y: Math.round(y) };
    };

    const seasonalNormalized = seasonalDayLength().normalized; // 0 = shortest day, 1 = longest
    const seasonalShift = (seasonalNormalized - 0.5) * 0.18; // +/- 0.09 around default
    const sunNoonPhase = 0.375;
    const sunSetPhase = Math.min(0.9, Math.max(0.58, 0.75 + seasonalShift));
    const sunsetTargetY = horizonY;
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
      moon: projectArc(moonPhase),
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

  const isLarge = createMemo(() => viewportWidth() >= 1024);

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
    <div class="h-screen w-screen flex flex-col overflow-hidden">
      <div
        class="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_2fr] grid-rows-[auto_1fr_auto] lg:grid-rows-[1fr_auto] flex-1 min-h-0 overflow-hidden"
        style={{ background: skyGradient() }}
      >
        <Show when={!isLarge()}>
          <div class="absolute inset-0 -z-10">
            <Canvas day={isDay} />
          </div>
        </Show>
        <Sun
          isDay={isDay()}
          x={bodyTrajectory().sun.x}
          y={bodyTrajectory().sun.y}
          horizonY={bodyTrajectory().sun.horizonY}
          ref={(el) => (sunRef = el)}
        />
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <Weather
            weather={weather()}
            daytime={daytime()}
            spawnClouds={spawnClouds()}
            cloudLevel={cloudLevel()}
            cloudLayers={cloudLayers()}
          />
        </div>

        <div id="about" class="relative z-10 flex flex-col min-h-0 overflow-hidden">
          <div class="p-6">
            <h2
              class={`font-custom text-3xl font-black underline ${
                isDay() ? "text-black" : "text-white"
              }`}
            >
              About
            </h2>

            <div class="flex flex-col gap-4 mt-4">
              <a
                class="w-[200px] eightbit-button text-black flex items-center"
                href="mailto:gilmmm4@gmail.com"
                draggable="false"
              >
                <img src={mail} alt="Email" class="h-6 pixelated" />
                <span class="grow text-2xl text-center">Email</span>
              </a>

              <a
                class="w-[200px] eightbit-button text-black flex items-center"
                href="https://github.com/GilMarques"
                draggable="false"
              >
                <img src={github} alt="Github" class="w-6 h-6 pixelated" />
                <span class="grow text-2xl text-center">Github</span>
              </a>

              <a
                class="w-[200px] eightbit-button text-black flex items-center"
                href="https://www.linkedin.com/in/gil-marques-ab86a524b/"
                draggable="false"
              >
                <img src={linkedin} alt="LinkedIn" class="w-6 h-6 pixelated" />
                <span class="grow text-2xl text-center">LinkedIn</span>
              </a>
            </div>

            <p
              class={`font-custom text-2xl ${
                isDay() ? "text-black" : "text-white"
              }`}
            >
              Hi, my name is <b>Gil</b> <br /> I'm a software developer from
              Portugal
            </p>
          </div>

          <Show when={isLarge()}>
            <div class="flex-1 min-h-0 mt-4">
              <Canvas day={isDay} />
            </div>
          </Show>
        </div>

        <div id="projects" class="relative z-10 overflow-y-auto p-6">
          <Projects isDay={isDay()} />
        </div>

        <div id="contact" class="col-span-1 row-start-3 lg:col-span-2 lg:row-start-2 relative min-h-0">
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
      </div>
    </div>
  );
}

export default App;
