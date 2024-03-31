/* eslint-disable react/prop-types */
import { useState } from "react";
import { clouds, nightclouds, rainclouds } from "../assets/index.js";

const sources = { day: clouds, night: nightclouds, rain: rainclouds };

const Cloud = ({ opacity = 100, scale = 1, animationDuration = 5, type }) => {
  const [source, setSource] = useState(
    sources[type][Math.floor(Math.random() * 10)]
  );

  return (
    <div
      className="relative"
      style={{
        animation: `move ${animationDuration}s linear infinite`,
      }}
      onAnimationIteration={() => {
        setSource(sources[type][Math.floor(Math.random() * 10)]);
      }}
    >
      <img
        src={source}
        alt="Moving Cloud"
        className={`absolute right-0 opacity-${opacity}`}
        width={800 * scale}
        height={300 * scale}
      />
    </div>
  );
};

const Clouds = ({ type }) => {
  return (
    <>
      <Cloud opacity={50} scale={0.1} velocityMod={0.3} type={type} />
      {/* <Cloud scale={0.5} velocityMod={0.5} type={type} />
      <Cloud scale={1} velocityMod={1} type={type} /> */}
    </>
  );
};

export default Clouds;
