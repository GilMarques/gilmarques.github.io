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
import Stars from "./components/Stars";
import Canvas from "./models/Canvas";

const daytimes = {
  sunrise: "linear-gradient(to bottom,#ffc19f 50%,#f0bbc9 100%)",
  day: "linear-gradient(to bottom,#94dfff 0%,#b7eaff 100%)",
  sunset: "linear-gradient(to bottom,#FD5E53 50%,#FFD580 100%)",
  night: "linear-gradient(to bottom,#000000 0% ,#00001f 100%)",
};

function App() {
  const ref = useRef(null);
  const [{ background }, api] = useSpring(() => ({
    background: daytimes["night"],
  }));

  const [spawnClouds, setSpawnClouds] = useState(false);
  const [weather, setWeather] = useState("");
  useEffect(() => {
    setSpawnClouds(true);
  }, []);

  // useEffect(() => {
  //   console.log(
  //     `https://api.openweathermap.org/data/2.5/weather?lat=${41.55}&lon=${-8.42}&appid=${
  //       import.meta.env.VITE_API_KEY
  //     }`
  //   );
  //   fetch(
  //     `https://api.openweathermap.org/data/2.5/weather?lat=${41.55}&lon=${-8.42}&appid=${
  //       import.meta.env.VITE_API_KEY
  //     }`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       //https://openweathermap.org/weather-conditions
  //       const id = data.weather[0].id
  //       let r;
  //       if (id >= 200 && id <= 232) {
  //         r = "thunderstorm";
  //       }
  //       if (id >= 300 && id <= 321) {
  //         r =  "drizzle";
  //       }
  //       if (id >= 500 && id <= 531) {
  //         r =  "rain";
  //       }
  //       if (id >= 600 && id <= 622) {
  //         r =  "snow";
  //       }

  //       if (id >= 701 && id <= 781) {
  //         r =  "clear";
  //       }
  //       if (id === 800) {
  //         r =  "clear";
  //       }
  //       if (id >= 801 && id <= 804) {
  //         r =  "clouds";
  //       }

  //       setWeather(r);
  //     });

  // }, []);

  // useEffect(() => {
  //   const getCurrentTimeOfDay = () => {
  //     const hour = new Date().getHours();
  //     if (hour >= 6 && hour < 8) {
  //       api.start({
  //         background: daytimes["sunrise"],
  //       });
  //     } else if (hour >= 8 && hour < 17) {
  //       api.start({
  //         background: daytimes["day"],
  //       });
  //     } else if (hour >= 17 && hour < 19) {
  //       api.start({
  //         background: daytimes["sunset"],
  //       });
  //     } else {
  //       api.start({
  //         background: daytimes["night"],
  //       });
  //     }
  //   };

  //   getCurrentTimeOfDay();

  //   const interval = setInterval(getCurrentTimeOfDay, 60000); // Update every minute

  //   // Clean up interval on component unmount
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <animated.div
        ref={ref}
        className="front-row relative z-50 min-w-full"
        style={{ background }}
      >
        <Rain />

        <Stars />
        {spawnClouds && <Clouds type={"night"} />}

        {/* <Moon /> */}
        <div className="text-md top-0 z-10 mt-20 p-4 text-center font-custom text-3xl text-white">
          Hi, my name is <b>Gil</b> <br /> I'm a Software Developer from
          Portugal
        </div>

        <About />

        <Projects />
        <Canvas />

        <Skills />

        <Footer />
      </animated.div>
      <Navbar />
    </>
  );
}

export default App;
