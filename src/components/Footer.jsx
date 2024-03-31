import { ocean, social, terrain } from "../assets/index.js";

const Ocean = () => {
  return (
    <div
      className="relative bottom-0 mt-[100px] min-h-[200px] min-w-full"
      style={{
        backgroundImage: `url(${ocean})`,

        backgroundRepeat: "repeat-x",
        filter: "brightness(0.2)",
      }}
    ></div>
  );
};

import { useEffect, useRef, useState } from "react";

const Terrain = () => {
  const [position, setPosition] = useState(0);
  const ref = useRef(null);

  const animationRef = useRef(0);

  const moveDiv = () => {
    setPosition((prevPosition) => (prevPosition > 1820 ? 0 : prevPosition + 2)); // Increment position

    animationRef.current = requestAnimationFrame(moveDiv); // Request next frame
  };

  // Start animation on component mount
  useEffect(() => {
    animationRef.current = requestAnimationFrame(moveDiv);

    // Cleanup function to cancel animation frame
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div
      ref={ref}
      className="relative bottom-0 -mt-20 min-h-[400px] w-[600%]"
      style={{
        backgroundImage: `url(${terrain[0]})`,
        right: position,
        backgroundRepeat: "repeat-x",
        filter: "brightness(0.2)",
      }}
    ></div>
  );
};
const Footer = () => {
  return (
    <>
      <Ocean />
      <Terrain />
      <div className="absolute bottom-[40px] min-w-full font-custom">
        <p className="text-center text-3xl">Contact Me</p>
        <div className="flex items-center justify-center gap-x-4">
          {social.map((x) => (
            <a
              className="flex flex-col items-center"
              href={x.link}
              key={x.name}
            >
              <img
                key={x.name}
                src={x.src}
                alt="logo"
                className="m-auto inline-block h-[50px] w-[60px]"
                draggable="false"
              />
              <p>{x.name}</p>
            </a>
          ))}
        </div>
        <hr className="m-auto w-1/2 rounded-sm border-2 border-black" />
        <div className="text-center font-custom text-xl">
          Copyright&ensp;2024&ensp; &bull;&ensp; Gil&ensp;Marques
        </div>
      </div>
    </>
  );
};

export default Footer;
