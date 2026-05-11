import { useCallback, useMemo, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Footer from "./components/Footer";
import Weather from "./components/Weather";

import Ocean from "./components/Ocean";
import Projects from "./components/Projects";
import useSkyAtmosphere from "./hooks/useSkyAtmosphere";
import useWeather, { WeatherType } from "./hooks/useWeather";

export type DaytimeType = "day" | "sunrise" | "sunset" | "night" | "cloudy";

/** Discrete phase for Weather / Canvas; gradient itself is smooth from the slider. */
function daytimeFromSliderForEffects(percent: number): DaytimeType {
  if (percent >= 75) return "night";
  if (percent >= 50) return "sunset";
  if (percent >= 25) return "day";
  return "sunrise";
}

function App() {
  const [spawnClouds, setSpawnClouds] = useState(true);

  const [weather, setWeather] = useState<WeatherType>(WeatherType.Snow);
  const [daySliderValue, setDaySliderValue] = useState(50);
  const [cloudsAll, setCloudsAll] = useState<number | undefined>();
  const [weatherConditionId, setWeatherConditionId] = useState<
    number | undefined
  >();

  const daytime = useMemo(
    () => daytimeFromSliderForEffects(daySliderValue),
    [daySliderValue]
  );
  const isDay = useMemo(() => daySliderValue < 75, [daySliderValue]);

  const { skyGradient, cloudLevel, cloudLayers } = useSkyAtmosphere({
    daySliderPercent: daySliderValue,
    weather,
    cloudsAll,
    weatherConditionId,
  });

  useWeather({
    setWeather,
    setDaySliderValue,
    setCloudsAll,
    setWeatherConditionId,
  });

  const setWeatherFromUser = useCallback((next: WeatherType) => {
    setWeather(next);
    setWeatherConditionId(undefined);
    setCloudsAll(undefined);
  }, []);

  return (
    <>
      <div className="navbar z-20 flex justify-end text-nowrap border-b-4 border-r-4 border-black bg-stone-300 px-8 py-4">
        <div className="flex gap-8 font-custom text-xl">
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="#projects" className="hover:underline">
            Projects
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
      <div
        className="front-row relative z-10 min-w-full"
        style={{ background: skyGradient }}
      >
        <Weather
          weather={weather}
          daytime={daytime}
          spawnClouds={spawnClouds}
          cloudLevel={cloudLevel}
          cloudLayers={cloudLayers}
        />

        <>
          <div
            className={`absolute px-8  ${isDay ? "text-black" : "text-white"}`}
          >
            <div className="text-md font-custom mt-16 text-4xl font-black underline">
              About
            </div>
            <div
              className={`text-md  font-custom text-3xl scroll-mt-16  ${
                isDay ? "text-black" : "text-white"
              }`}
              id="about"
            >
              Hi, my name is <b>Gil</b> <br /> I'm a Software Developer from
              Portugal
            </div>
          </div>
        </>
        <Canvas day={isDay} />

        <Projects isDay={isDay} />

        <Ocean isDay={isDay} />

        <Footer
          weather={weather}
          isDay={isDay}
          setWeather={setWeatherFromUser}
          daySliderValue={daySliderValue}
          setDaySliderValue={setDaySliderValue}
        />
      </div>
    </>
  );
}

export default App;
