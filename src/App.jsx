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
};

function App() {
  const ref = useRef(null);
  const [{ background }, api] = useSpring(() => ({
    background: daytimes["day"],
    config: { duration: 300 },
  }));

  const [spawnClouds, setSpawnClouds] = useState(false);
  const [weather, setWeather] = useState("");
  const [daytime, setDaytime] = useState("");
  const [isDay, setIsDay] = useState(true);
  const [isRaining, setisRaining] = useState(false);
  useEffect(() => {
    setSpawnClouds(true);
  }, []);

  // useEffect(() => {
  //   fetch(
  //     `https://api.openweathermap.org/data/2.5/weather?lat=${41.55}&lon=${-8.42}&appid=${
  //       import.meta.env.VITE_API_KEY
  //     }`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       //https://openweathermap.org/weather-conditions
  //       const id = data.weather[0].id;
  //       console.log(data);
  //       let r;
  //       if (id >= 200 && id <= 232) {
  //         r = "thunderstorm";
  //       }
  //       if (id >= 300 && id <= 321) {
  //         r = "drizzle";
  //       }
  //       if (id >= 500 && id <= 531) {
  //         r = "rain";
  //       }
  //       if (id >= 600 && id <= 622) {
  //         r = "snow";
  //       }

  //       if (id >= 701 && id <= 781) {
  //         r = "clear";
  //       }
  //       if (id === 800) {
  //         r = "clear";
  //       }
  //       if (id >= 801 && id <= 804) {
  //         r = "clouds";
  //       }

  //       setWeather(r);
  //     });
  // }, []);

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
  }, [daytime]);

  return (
    <>
      <animated.div
        ref={ref}
        className="front-row relative z-50 min-w-full"
        style={{ background }}
      >
        <Snow />
        {isRaining && <Rain />}
        <Stars day={isDay} />

        {spawnClouds && <Clouds day={isDay} rain={isRaining} />}

        {/* <Moon /> */}

        <About day={isDay} />

        <Projects day={isDay} />
        <Canvas day={isDay} />

        <Skills day={isDay} />

        <Footer day={isDay} setDaytime={setDaytime} setWeather={setWeather} />
      </animated.div>
      <Navbar />
    </>
  );
}

export default App;
