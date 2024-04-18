/* eslint-disable react/prop-types */
import { useState } from "react";
import { orb, technologies } from "../assets/index.js";

const l = 70;
const Orb = ({ technology, i, setName }) => {
  return (
    <div
      className="absolute flex items-center justify-center p-8"
      style={{
        animation: `spin ${20}s linear infinite`,
        animationDelay: `${-(20 * i) / 7}s`,
      }}
      onMouseEnter={() => setName(technology.name)}
      onMouseLeave={() => setName("")}
    >
      <div className="absolute">
        <img
          src={orb}
          alt="Orb"
          style={{ minHeight: l, minWidth: l, maxHeight: l, maxWidth: l }}
        />
      </div>
      <div className="absolute h-[35px] w-[35px]">
        <img
          src={technology.src}
          alt={technology.name}
          className="opacity-80"
          draggable="false"
          style={{
            minHeight: l / 2,
            minWidth: l / 2,
            maxHeight: l / 2,
            maxWidth: l / 2,
            animation: "spin2 20s linear infinite",
            animationDelay: `${-(20 * i) / 7}s`,
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
      <div className="text-md font-custom mt-20 p-4 text-4xl font-black underline">
        Skills
      </div>

      <div className="text-md font-custom left-1/2 mt-[200px] flex select-none justify-center">
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
