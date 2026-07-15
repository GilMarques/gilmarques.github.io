//https://codepen.io/arickle/pen/XKjMZY

import { createMemo, For } from "solid-js";

import { DaytimeType } from "../App.jsx";
import {
  clouds,
  grayclouds,
  nightclouds,
  rainclouds,
} from "../assets/sprites/clouds/index.js";
import { WeatherType } from "../hooks/useWeather.js";
import type { CloudLayerConfig } from "../utils/cloudDensity.js";
import { CloudDensityLevel } from "../utils/cloudDensity.js";

const Rain = ({ intensity }: { intensity: "light" | "heavy" }) => {
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
    <div class={"rain pointer-events-none fixed top-0 min-h-full min-w-full"}>
      <For each={drops}>
        {(drop) => (
          <div
            class="drop"
            style={{
              left: `${drop.increment}%`,
              bottom: `${drop.randoFiver + 85}%`,
              "animation-delay": `-0.${drop.randoHundo}s`,
              "animation-duration": `0.5${drop.randoHundo}s`,
            }}
          >
            <div
              class="stem"
              style={{
                "animation-delay": `-0.${drop.randoHundo}s`,
                "animation-duration": `0.5${drop.randoHundo}s`,
              }}
            ></div>
            <div
              class="splat"
              style={{
                "animation-delay": `-0.${drop.randoHundo}s`,
                "animation-duration": `0.5${drop.randoHundo}s`,
              }}
            ></div>
          </div>
        )}
      </For>
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
  level: CloudDensityLevel,
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

type CloudProps = {
  opacityPct?: number;
  scale?: number;
  animationDuration: number;
  type: keyof typeof sources;
  delay: number;
};

const Cloud = (props: CloudProps) => {
  const opacityPct = () => props.opacityPct ?? 100;
  const scale = () => props.scale ?? 1;
  const source = createMemo(() => sources[props.type]);
  let cloudShapeIndex = Math.floor(Math.random() * Math.max(1, source.length));

  return (
    <div
      class="relative"
      style={{
        opacity: opacityPct() / 100,
        animation: `move ${props.animationDuration}s linear infinite`,
        "animation-delay": `-${props.delay}s`,
        right: "-20%",
        "z-index": -10,
      }}
      onAnimationIteration={() => {
        cloudShapeIndex = Math.floor(
          Math.random() * Math.max(1, source.length),
        );
      }}
    >
      <img
        src={source()[cloudShapeIndex]}
        alt="Moving Cloud"
        class="absolute right-0"
        width={800 * scale()}
        height={300 * scale()}
        draggable={false}
      />
    </div>
  );
};

type CloudsProps = {
  daytime: DaytimeType;
  cloudLevel: CloudDensityLevel;
  layers: CloudLayerConfig[];
};

const Clouds = (props: CloudsProps) => {
  const type = createMemo(() =>
    cloudSpriteKind(props.daytime, props.cloudLevel),
  );

  return (
    <For each={props.layers}>
      {(layer, i) => (
        <Cloud
          opacityPct={layer.opacityPct}
          scale={layer.scale}
          type={type()}
          animationDuration={layer.animationDuration}
          delay={layer.delay}
        />
      )}
    </For>
  );
};

type WeatherProps = {
  weather: WeatherType;
  daytime: DaytimeType;
  spawnClouds?: boolean;
  cloudLevel: CloudDensityLevel;
  cloudLayers: CloudLayerConfig[];
};

const Weather = (props: WeatherProps) => {
  const showRain = () =>
    props.weather === WeatherType.Drizzle || props.weather === WeatherType.Rain;

  const rainIntensity = () =>
    props.weather === WeatherType.Drizzle ? "light" : "heavy";

  return (
    <>
      {props.weather === WeatherType.Snow && (
        <div class="snow_wrap pointer-events-none">
          <div class="snow"></div>
        </div>
      )}
      {showRain() && <Rain intensity={rainIntensity()} />}
      <>
        <div
          class="relative h-1/3"
          // style={{
          //   "background-image":
          //     props.daytime == "night" ? `url(${terrain})` : "none",
          // }}
        >
          {/*{props.daytime === "night" && (
            <div
              class="relative h-full text-white"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
              }}
            ></div>
          )}*/}
        </div>
      </>

      {(props.spawnClouds ?? true) && (
        <Clouds
          daytime={props.daytime}
          cloudLevel={props.cloudLevel}
          layers={props.cloudLayers}
        />
      )}
    </>
  );
};

export default Weather;
