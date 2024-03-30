/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { clouds } from "../assets/index.js";

const source = clouds[Math.floor(Math.random() * clouds.length)];
const Cloud = ({ opacity = 100, scale = 1, velocityMod = 3 }) => {
  const [position, setPosition] = useState(-800);
  const ref = useRef(null);
  const imageRef = useRef(null);
  const animationRef = useRef(0);

  const moveDiv = () => {
    setPosition((prevPosition) => prevPosition + velocityMod * 3); // Increment position
    if (ref.current && imageRef.current) {
      if (ref.current.getBoundingClientRect().right < 0) {
        imageRef.current.src =
          clouds[Math.floor(Math.random() * clouds.length)];
        setPosition(-800);
      }
    }
    animationRef.current = requestAnimationFrame(moveDiv); // Request next frame
  };

  // Start animation on component mount
  useEffect(() => {
    animationRef.current = requestAnimationFrame(moveDiv);

    // Cleanup function to cancel animation frame
    return () => cancelAnimationFrame(animationRef.current);
  });

  return (
    <div ref={ref} className="relative" style={{ right: position }}>
      <img
        ref={imageRef}
        src={source}
        alt="Moving Cloud"
        className={`absolute right-0 opacity-${opacity}`}
        width={800 * scale}
        height={300 * scale}
      />
    </div>
  );
};

const Clouds = () => {
  return (
    <>
      <Cloud opacity={50} scale={0.1} velocityMod={0.3} />
      <Cloud scale={0.5} velocityMod={0.5} />
      <Cloud scale={1} velocityMod={1} />
    </>
  );
};

export default Clouds;
