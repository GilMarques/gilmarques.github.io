import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import "./App.css";
import About from "./components/About";
import Clouds from "./components/Clouds";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Stars from "./components/Stars";
import Canvas from "./models/Canvas";

const daytimes = {
  sunrise:
    "linear-gradient(to bottom,#000000 0% , #000000 20%,#ffc19f 50%,#f0bbc9 100%)",
  day: "linear-gradient(to bottom,#000000 0% , #000000 20%,#94dfff 50%,#b7eaff 100%)",
  sunset:
    "linear-gradient(to bottom,#000000 0% , #000000 20%,#FD5E53 50%,#FFD580 100%)",
  night:
    "linear-gradient(to bottom,#000000 0% , #000000 20% ,#00001f 50%,#00001f 100%)",
};

function App() {
  const [{ background }, api] = useSpring(() => ({
    background: daytimes["day"],
  }));

  const [spawnClouds, setSpawnClouds] = useState(false);

  useEffect(() => {
    setSpawnClouds(true);
  }, []);

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
      <animated.div className="relative min-w-full" style={{ background }}>
        <Stars />
        {/* <Moon /> */}
        <div className="text-md top-0 z-10 mt-20 p-4 text-center font-custom text-3xl text-white">
          Hi, my name is <b>Gil</b> <br /> I'm a Software Developer from
          Portugal
        </div>

        <About />

        <Projects />
        <Canvas />
        {spawnClouds && <Clouds />}
        <Skills />

        <Footer />
      </animated.div>
      <Navbar />
    </>
  );
}

export default App;
