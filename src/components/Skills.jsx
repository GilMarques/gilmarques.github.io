/* eslint-disable react/prop-types */
import { useState } from "react";
import { orb, technologies } from "../assets/index.js";

//TODO: reflections
//ToDO: animations wheel
const l = 70;
const Orb = ({ technology, i, setName }) => {
  return (
    <div
      className="absolute flex items-center justify-center p-8"
      style={{
        animation: `spin ${10}s linear infinite`,
        animationDelay: `${-(10 * i) / 7}s`,
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
          style={{
            animation: "spin2 10s linear infinite",
            animationDelay: `${-(10 * i) / 7}s`,
          }}
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

      <div className="text-md left-1/2 mt-[200px] flex select-none justify-center font-custom">
        <div className="text-3xl">{name}</div>
        {technologies.map((technology, index) => (
          <Orb
            key={technology.name}
            technology={technology}
            i={index}
            setName={setName}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;
