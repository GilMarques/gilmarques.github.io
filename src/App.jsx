import { animated, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import About from "./components/About";
import Clouds from "./components/Clouds";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Rain from "./components/Rain";
import Skills from "./components/Skills";
import Snow from "./components/Snow";
import Stars from "./components/Stars";
import Canvas from "./models/Canvas";
const daytimes = {
  sunrise: "linear-gradient(to bottom,#ffc19f 50%,#f0bbc9  80%, #ffffff 100%)",
  day: "linear-gradient(to bottom,#94dfff 0%,#b7eaff 80%, #ffffff 100%)",
  sunset: "linear-gradient(to bottom,#FD5E53 50%,#FFD580  80%, #ffffff 100%)",
  night: "linear-gradient(to bottom,#000000 0%, #00001f 80%, #000837 100%)",
  cloudy: "linear-gradient(to bottom,#a0b0af 0%, #35545e 80%, #b0b0b0 100%)",
};

function App() {
  const ref = useRef(null);
  const [{ background }, api] = useSpring(() => ({
    background: daytimes["cloudy"],
    config: { duration: 300 },
  }));

  const [spawnClouds, setSpawnClouds] = useState(false);
  const [cloudLevel, setCloudLevel] = useState(0);
  const [weather, setWeather] = useState("rain");
  const [daytime, setDaytime] = useState("cloudy");
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    setSpawnClouds(true);
  }, []);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${41.55}&lon=${-8.42}&appid=${
        import.meta.env.VITE_API_KEY
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        //https://openweathermap.org/weather-conditions
        const id = data.weather[0].id;

        let r;
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
  }, []);

  useEffect(() => {
    api({
      background: daytimes[daytime],
    });

    if (daytime === "night") {
      setIsDay(false);
      return;
    } else {
      setIsDay(true);
      return;
    }
  }, [daytime, api]);

  return (
    <>
      <animated.div
        ref={ref}
        className="front-row relative z-50 min-w-full"
        style={{ background }}
      >
        {weather === "snow" && <Snow />}
        {weather === "rain" && <Rain />}
        <Stars day={isDay} />

        {spawnClouds && (
          <Clouds
            daytime={daytime}
            rain={weather === "rain"}
            level={cloudLevel}
          />
        )}
        <About day={isDay} />
        <Canvas day={isDay} />

        {/* <Moon /> */}

        <Projects day={isDay} />

        <Skills day={isDay} />

        <Footer day={isDay} setDaytime={setDaytime} setWeather={setWeather} />
      </animated.div>
      <Navbar />
    </>
  );
}

export default App;
