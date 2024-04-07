/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
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
}) => {
  const source = useRef(sources[type]);
  const index = useRef(Math.floor(Math.random() * clouds.length));
  const ref = useRef(null);

  useEffect(() => {
    source.current = sources[type];
    ref.current.src = source.current[index.current];
  }, [type]);

  return (
    <div
      className={`relative opacity-${opacity}`}
      style={{
        animation: `move ${animationDuration}s linear infinite`,
        animationDelay: `-${delay}s`,
        right: "-20%",
      }}
      onAnimationIteration={() => {
        index.current = Math.floor(Math.random() * clouds.length);
        ref.current.src = source.current[index.current];
      }}
    >
      <img
        ref={ref}
        src={source.current[index.current]}
        alt="Moving Cloud"
        className={`absolute right-0`}
        width={800 * scale}
        height={300 * scale}
      />
    </div>
  );
};

const Clouds = ({ daytime, rain, level }) => {
  const [type, setType] = useState("day");

  useEffect(() => {
    if (rain) {
      return setType("rain");
    }

    if (daytime === "night") {
      return setType("night");
    }

    if (daytime === "cloudy") {
      return setType("cloudy");
    }

    if (daytime === "sunrise" || daytime === "sunset" || daytime === "day") {
      return setType("day");
    }
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

export default Clouds;
