/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { orb, technologies } from "../assets/index.js";

//TODO: reflections
//ToDO: animations wheel

const Orb = ({ technology, i }) => {
  const l = 50;
  const angle = 360 / 7;
  const [position, setPosition] = useState(0);

  const animationRef = useRef(0);
  const moveDiv = () => {
    setPosition((prevPosition) => prevPosition + 0.01); // Increment position

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
      className="absolute flex items-center justify-center p-8"
      style={{
        transform: `rotate(${angle * i + position}deg) translate(0%, -300%)`,
      }}
    >
      <div className="absolute">
        <img src={orb} alt="Orb" width={l} height={l} />
      </div>
      <div className="absolute">
        <img
          src={technology}
          alt={technology}
          width={l * 0.6}
          height={l * 0.6}
          className="opacity-80"
          style={{ transform: `rotate(${-angle * i - position}deg)` }}
          draggable="false"
        />
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <div className="relative h-[700px] px-4 text-white">
      <div className="text-md mt-20 p-4 font-custom text-4xl font-black underline">
        Skills
      </div>
      <div className="text-md relative mt-[200px] flex select-none justify-center">
        {technologies.map((technology, index) => (
          <Orb key={technology} technology={technology} i={index} />
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default Skills;
