import { useEffect, useRef, useState } from "react";
import { blinking_star } from "../assets/index.js";

const BlinkingStar = () => {
  const x = useRef(Math.floor(8000 * Math.random()));
  const y = useRef(Math.floor(200 * Math.random()));
  const [frame, setFrame] = useState(Math.random() > 0.5 ? 0 : 1);
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((frame + 1) % 2);
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <div
      className={"absolute"}
      style={{ top: `${y.current}px`, left: `${x.current}px` }}
    >
      {frame ? (
        <img src={blinking_star[0]} alt="Star" className="h-16 w-16" />
      ) : (
        <img src={blinking_star[1]} alt="Star" className="h-16 w-16" />
      )}
    </div>
  );
};

const Stars = () => {
  const n = 200;
  return (
    <div className="relative h-[200px]">
      {Array.from(Array(n)).map((_p, index) => (
        <BlinkingStar key={index} />
      ))}
    </div>
  );
};

export default Stars;
