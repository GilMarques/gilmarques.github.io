/* eslint-disable react/prop-types */

import { starry_sky } from "../assets";

//https://codepen.io/arickle/pen/XKjMZY
const Rain = () => {
  var increment = 0;
  var drops = [];

  while (increment < 100) {
    //couple random numbers to use for various randomizations
    //random number between 98 and 1
    var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    //random number between 5 and 2
    var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    //increment
    increment += randoFiver;
    //add in a new raindrop with various randomizations to certain CSS properties
    drops.push({ increment, randoFiver, randoHundo });
    // '<div class="drop" style="left: ' +
  }

  return (
    <div className="rain pointer-events-none fixed top-0 min-h-full min-w-full">
      {drops.map((drop) => (
        <div
          key={drop.increment}
          className="drop"
          style={{
            left: `${drop.increment}%`,
            bottom: `${drop.randoFiver + 85}%`,
            animationDelay: `-0.${drop.randoHundo}s`,
            animationDuration: `0.5${drop.randoHundo}s`,
          }}
        >
          <div
            className="stem"
            style={{
              animationDelay: `-0.${drop.randoHundo}s`,
              animationDuration: `0.5${drop.randoHundo}s`,
            }}
          ></div>
          <div
            className="splat"
            style={{
              animationDelay: `-0.${drop.randoHundo}s`,
              animationDuration: `0.5${drop.randoHundo}s`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

import { useMemo, useRef } from "react";
import { DaytimeType, WeatherType } from "../App.js";
import {
  clouds,
  grayclouds,
  nightclouds,
  rainclouds,
} from "../assets/index.js";

const sources = {
  day: clouds,
  night: nightclouds,
  cloudy: grayclouds,
  rain: rainclouds,
};

const Cloud = ({
  opacity = 100,
  scale = 1,
  animationDuration,
  type,
  delay,
}: {
  opacity?: number;
  scale?: number;
  animationDuration: number;
  type: "day" | "night" | "cloudy" | "rain";
  delay: number;
}) => {
  const source = useMemo(() => sources[type], [type]);
  const cloudShapeIndex = useRef(Math.floor(Math.random() * clouds.length));

  return (
    <div
      className={`relative opacity-${opacity}`}
      style={{
        animation: `move ${animationDuration}s linear infinite`,
        animationDelay: `-${delay}s`,
        right: "-20%",
      }}
      onAnimationIteration={() => {
        cloudShapeIndex.current = Math.floor(Math.random() * clouds.length);
      }}
    >
      <img
        src={source[cloudShapeIndex.current]}
        alt="Moving Cloud"
        className={`absolute right-0`}
        width={800 * scale}
        height={300 * scale}
      />
    </div>
  );
};

const Clouds = ({
  daytime,
  rain,
  cloudDensity,
}: {
  daytime: DaytimeType;
  rain: boolean;
  cloudDensity: number;
}) => {
  const type = useMemo(() => {
    if (rain) return "rain";
    if (daytime === "night") return "night";
    if (daytime === "cloudy") return "cloudy";
    if (["sunrise", "sunset", "day"].includes(daytime)) return "day";
    return "day";
  }, [daytime, rain]);

  return (
    <>
      <Cloud
        opacity={30}
        scale={0.1}
        type={type}
        animationDuration={15}
        delay={10}
      />
      <Cloud scale={0.5} type={type} animationDuration={10} delay={4} />
      <Cloud scale={0.6} type={type} animationDuration={8} delay={0} />
    </>
  );
};

/* eslint-disable react/no-unescaped-entities */
const Weather = ({
  weather,
  daytime,

  spawnClouds = true,
  cloudDensity = 0,
}: {
  weather: WeatherType;
  daytime: DaytimeType;

  spawnClouds?: boolean;
  cloudDensity?: number;
}) => {
  return (
    <>
      {weather === "snow" && (
        <div className="snow_wrap pointer-events-none">
          <div className="snow"></div>
        </div>
      )}
      {weather === "rain" && <Rain />}
      <>
        <div
          className="relative h-[300px]"
          style={{
            backgroundImage: daytime == "night" ? `url(${starry_sky})` : "none",
          }}
        >
          {daytime === "night" && (
            <div
              className="relative h-full text-white"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
              }}
            ></div>
          )}
        </div>
      </>

      {spawnClouds && (
        <Clouds
          daytime={daytime}
          rain={weather === "rain"}
          cloudDensity={cloudDensity}
        />
      )}
    </>
  );
};

export default Weather;
