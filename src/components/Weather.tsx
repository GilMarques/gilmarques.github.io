//https://codepen.io/arickle/pen/XKjMZY
import { useMemo, useRef } from "react";
import { DaytimeType } from "../App.js";

import {
  clouds,
  grayclouds,
  nightclouds,
  rainclouds,
} from "../assets/clouds/index.js";
import { WeatherType } from "../hooks/useWeather.js";
import type { CloudLayerConfig } from "../utils/cloudDensity.js";
import { CloudDensityLevel } from "../utils/cloudDensity.js";

const Rain = ({ intensity }: { intensity: "light" | "heavy" }) => {
  /** Scan full width (0–100%); light rain keeps ~half the drops. */
  const keepProbability = intensity === "heavy" ? 1 : 0.5;

  var increment = 0;
  var drops = [];

  while (increment < 100) {
    var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    increment += randoFiver;
    if (Math.random() < keepProbability) {
      drops.push({ increment, randoFiver, randoHundo });
    }
  }

  return (
    <div className="rain pointer-events-none fixed top-0 min-h-full min-w-full">
      {drops.map((drop, i) => (
        <div
          key={`${i}-${drop.increment}`}
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

const sources = {
  day: clouds,
  night: nightclouds,
  cloudy: grayclouds,
  rain: rainclouds,
} as const;

function cloudSpriteKind(
  daytime: DaytimeType,
  level: CloudDensityLevel
): keyof typeof sources {
  switch (level) {
    case CloudDensityLevel.HeavyRain:
      return "rain";
    case CloudDensityLevel.LightRain:
      return "cloudy";
    case CloudDensityLevel.Clear:
    default:
      return daytime === "night" ? "night" : "day";
  }
}

const Cloud = ({
  opacityPct = 100,
  scale = 1,
  animationDuration,
  type,
  delay,
}: {
  opacityPct?: number;
  scale?: number;
  animationDuration: number;
  type: keyof typeof sources;
  delay: number;
}) => {
  const source = useMemo(() => sources[type], [type]);
  const cloudShapeIndex = useRef(
    Math.floor(Math.random() * Math.max(1, source.length))
  );

  return (
    <div
      className="relative"
      style={{
        opacity: opacityPct / 100,
        animation: `move ${animationDuration}s linear infinite`,
        animationDelay: `-${delay}s`,
        right: "-20%",
      }}
      onAnimationIteration={() => {
        cloudShapeIndex.current = Math.floor(
          Math.random() * Math.max(1, source.length)
        );
      }}
    >
      <img
        src={source[cloudShapeIndex.current]}
        alt="Moving Cloud"
        className="absolute right-0"
        width={800 * scale}
        height={300 * scale}
      />
    </div>
  );
};

const Clouds = ({
  daytime,
  cloudLevel,
  layers,
}: {
  daytime: DaytimeType;
  cloudLevel: CloudDensityLevel;
  layers: CloudLayerConfig[];
}) => {
  const type = useMemo(
    () => cloudSpriteKind(daytime, cloudLevel),
    [daytime, cloudLevel]
  );

  return (
    <>
      {layers.map((layer, i) => (
        <Cloud
          key={`${cloudLevel}-${i}-${layer.delay}`}
          opacityPct={layer.opacityPct}
          scale={layer.scale}
          type={type}
          animationDuration={layer.animationDuration}
          delay={layer.delay}
        />
      ))}
    </>
  );
};

const Weather = ({
  weather,
  daytime,
  spawnClouds = true,
  cloudLevel,
  cloudLayers,
}: {
  weather: WeatherType;
  daytime: DaytimeType;
  spawnClouds?: boolean;
  cloudLevel: CloudDensityLevel;
  cloudLayers: CloudLayerConfig[];
}) => {
  const showRain =
    weather === WeatherType.Drizzle || weather === WeatherType.Rain;

  const rainIntensity = weather === WeatherType.Drizzle ? "light" : "heavy";

  return (
    <>
      {weather === WeatherType.Snow && (
        <div className="snow_wrap pointer-events-none">
          <div className="snow"></div>
        </div>
      )}
      {showRain && <Rain intensity={rainIntensity} />}
      <>
        {/*<div
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
        </div>*/}
      </>

      {spawnClouds && (
        <Clouds
          daytime={daytime}
          cloudLevel={cloudLevel}
          layers={cloudLayers}
        />
      )}
    </>
  );
};

export default Weather;
