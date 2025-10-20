import { animated, useSpring } from "@react-spring/web";
import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Weather from "./components/Weather";

import Projects from "./components/Projects";

const daytimes = {
  sunrise: "linear-gradient(to bottom,#ffc19f 50%,#f0bbc9  80%, #ffffff 100%)",
  day: "linear-gradient(to bottom,#94dfff 0%,#b7eaff 80%, #ffffff 100%)",
  sunset: "linear-gradient(to bottom,#FD5E53 50%,#FFD580  80%, #ffffff 100%)",
  night: "linear-gradient(to bottom,#000000 0%, #00001f 80%, #000837 100%)",
  cloudy: "linear-gradient(to bottom,#a0b0af 0%, #35545e 80%, #b0b0b0 100%)",
};

export type WeatherType = "rain" | "drizzle" | "snow" | "clear" | "clouds";

export type DaytimeType = "day" | "sunrise" | "sunset" | "night" | "cloudy";

function App() {
  const ref = useRef(null);
  const [{ background }, animationApi] = useSpring(() => ({
    background: daytimes["cloudy"],
    config: { duration: 300 },
  }));

  const [spawnClouds, setSpawnClouds] = useState(true);
  // const [cloudLevel, setCloudLevel] = useState(0);
  const [weather, setWeather] = useState<WeatherType>("rain");
  const [daytime, setDaytime] = useState<DaytimeType>("cloudy");
  const isDay = useMemo(() => daytime !== "night", [daytime]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${41.55}&lon=${-8.42}&appid=${apiUrl}`
      )
        .then((response) => response.json())
        .then((data) => {
          //https://openweathermap.org/weather-conditions
          const id = data.weather[0].id;

          let r: WeatherType | "clear" = "clear";
          if (id >= 200 && id <= 232) {
            r = "rain";
          }
          if (id >= 300 && id <= 321) {
            r = "drizzle";
          }
          if (id >= 500 && id <= 531) {
            r = "rain";
          }
          if (id >= 600 && id <= 622) {
            r = "snow";
          }

          if (id >= 701 && id <= 781) {
            r = "clear";
          }
          if (id === 800) {
            r = "clear";
          }
          if (id >= 801 && id <= 804) {
            r = "clouds";
          }

          setWeather(r);
        });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, []);

  useEffect(() => {
    animationApi({
      background: daytimes[daytime],
    });
  }, [daytime, animationApi]);

  return (
    <>
      <Navbar />
      <animated.div
        ref={ref}
        className="front-row relative z-10 min-w-full"
        style={{ background }}
      >
        <Weather
          weather={weather}
          daytime={daytime}
          spawnClouds={spawnClouds}
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

        <div className="flex justify-center text-md font-custom text-3xl">
          <a
            className={`eightbit-button ${
              isDay ? "text-black border-black" : "text-white border-white "
            } `}
            href="#contact"
          >
            Contact Me
          </a>
        </div>

        <Projects isDay={isDay} />

        <Footer isDay={isDay} setDaytime={setDaytime} setWeather={setWeather} />
      </animated.div>
    </>
  );
}

export default App;
