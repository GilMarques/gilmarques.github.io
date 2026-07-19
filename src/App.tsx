import "./App.css";
import Footer from "./components/Footer";
import Weather from "./components/Weather";

import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

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
    // Linear sun trajectory. The slider drives a single descent:
    //   0   -> 0.25: sun is above the viewport (offscreen up)
    //   0.25-> 0.5 : sun descends from the top of the viewport to the
    //                middle (peak of the arc, "noon")
    //   0.5 -> 0.75: sun keeps descending to the horizon
    //   0.75-> 1   : sun is below the horizon (offscreen down)
    // Noon (peak) is at 0.5; the horizon is crossed at 0.75.
    const sunNoonPhase = 0.5;
    const sunSetPhase = 0.75 + seasonalShift * 0; // kept for downstream consumers
    const sunsetTargetY = horizonY;
    const sunTrackX = viewportWidth() - 180;
    const sunDelta = Math.min(
      1,
      Math.abs(normalized - sunNoonPhase) / (sunSetPhase - sunNoonPhase),
    );
    const sunY = (2 * normalized - 0.5) * horizonY;

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
        class="relative z-10 flex flex-col flex-1 min-h-0"
        style={{ background: skyGradient() }}
      >
        <div class="absolute inset-0 -z-10">
          <Canvas day={isDay} />
        </div>
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

        <nav class="absolute top-0 left-0 right-0 z-20 p-3">
          <div class="eightbit-button flex items-center gap-1 hover:!bg-[#d6d3d1]">
            <a
              href="mailto:gilmmm4@gmail.com"
              draggable="false"
              class="flex items-center gap-2 px-3 py-2 transition-colors  hover:bg-white text-black"
            >
              <img src={mail} alt="Email" class="h-5 pixelated" />
              <span class="font-custom text-lg">Email</span>
            </a>
            <a
              href="https://github.com/GilMarques"
              draggable="false"
              class="flex items-center gap-2 px-3 py-2 transition-colors  hover:bg-white text-black"
            >
              <img src={github} alt="Github" class="h-5 pixelated" />
              <span class="font-custom text-lg">Github</span>
            </a>
            <a
              href="https://www.linkedin.com/in/gil-marques-ab86a524b/"
              draggable="false"
              class="flex items-center gap-2 px-3 py-2 transition-colors  hover:bg-white text-black"
            >
              <img src={linkedin} alt="LinkedIn" class="h-5 pixelated" />
              <span class="font-custom text-lg">LinkedIn</span>
            </a>
          </div>
        </nav>

        <div
          id="main-scroll"
          class="flex-1 min-h-0 overflow-y-auto pt-24 relative z-10"
        >
          <div id="about" class="p-4 lg:p-6">
            <h2
              class={`font-custom text-3xl font-black underline ${
                isDay() ? "text-black" : "text-white"
              }`}
            >
              About
            </h2>
            <p
              class={`font-custom text-2xl ${
                isDay() ? "text-black" : "text-white"
              }`}
            >
              Hi, I'm <b>Gil</b>, a Full Stack Developer from Portugal.
              <br />I build web apps with 3D, complex UIs, and engineering
              tooling.
            </p>
          </div>

          <div id="projects" class="p-4 lg:p-6">
            <Projects isDay={isDay()} />
          </div>
        </div>

        <div id="contact" class="relative min-h-0 z-10">
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
