/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { orb, technologies } from "../assets/index.js";

//TODO: reflections
//ToDO: animations wheel
const l = 70;
const Orb = ({ technology, i, setName }) => {
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
      onMouseEnter={() => setName(technology.name)}
      onMouseLeave={() => setName("")}
    >
      <div className="absolute">
        <img src={orb} alt="Orb" width={l} height={l} />
      </div>
      <div className="absolute">
        <img
          src={technology.src}
          alt={technology.name}
          width={l * 0.5}
          height={l * 0.5}
          className="opacity-80"
          draggable="false"
          style={{ transform: `rotate(${-angle * i - position}deg)` }}
        />
      </div>
    </div>
  );
};

const Skills = ({ day }) => {
  const [name, setName] = useState("");

  return (
    <div
      className={`relative h-[700px] px-4 ${day ? "text-black" : "text-white"}`}
    >
      <div className="text-md mt-20 p-4 font-custom text-4xl font-black underline">
        Skills
      </div>
      <div className="text-md mt-[200px] flex select-none justify-center font-custom">
        <div className="mt-6">{name}</div>
        {technologies.map((technology, index) => (
          <Orb
            key={technology.name}
            technology={technology}
            i={index}
            setName={setName}
          />
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default Skills;
