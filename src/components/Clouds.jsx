/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { clouds, nightclouds, rainclouds } from "../assets/index.js";

const sources = { day: clouds, night: nightclouds, rain: rainclouds };

// const Cloud = ({ opacity = 100, scale = 1, velocityMod = 3, type }) => {
//   const [position, setPosition] = useState(-800);
//   const [source, setSource] = useState(sources[type]);
//   const [index, setIndex] = useState(Math.floor(Math.random() * clouds.length));
//   const ref = useRef(null);
//   const imageRef = useRef(null);
//   const animationRef = useRef(0);

//   const moveDiv = () => {
//     setPosition((prevPosition) => prevPosition + velocityMod * 3); // Increment position
//     if (ref.current && imageRef.current) {
//       if (ref.current.getBoundingClientRect().right < 0) {
//         setIndex(Math.floor(Math.random() * clouds.length));
//         setPosition(-800);
//       }
//     }
//     animationRef.current = requestAnimationFrame(moveDiv); // Request next frame
//   };

//   // Start animation on component mount
//   useEffect(() => {
//     animationRef.current = requestAnimationFrame(moveDiv);

//     // Cleanup function to cancel animation frame
//     return () => cancelAnimationFrame(animationRef.current);
//   });

//   useEffect(() => {
//     setSource(sources[type]);
//   }, [type]);

//   return (
//     <div ref={ref} className="absolute w-full" style={{ right: position }}>
//       <img
//         ref={imageRef}
//         src={source[index]}
//         alt="Moving Cloud"
//         className={`absolute right-0 opacity-${opacity}`}
//         width={800 * scale}
//         height={300 * scale}
//       />
//     </div>
//   );
// };

const Cloud = ({ opacity = 100, scale = 1, animationDuration = 10, type }) => {
  const source = useRef(sources[type]);

  const ref = useRef(null);

  useEffect(() => {
    source.current = sources[type];
  }, [type]);

  return (
    <div
      className="relative"
      style={{
        animation: `move ${animationDuration}s linear infinite`,
        animationDelay: `${Math.floor(Math.random() * 5)}s`,
        right: "-20%",
      }}
      onAnimationIteration={() => {
        ref.current.src =
          source.current[Math.floor(Math.random() * source.current.length)];
      }}
    >
      <img
        ref={ref}
        src={source.current[0]}
        alt="Moving Cloud"
        className={`absolute right-0 opacity-${opacity}`}
        width={800 * scale}
        height={300 * scale}
      />
    </div>
  );
};

const Clouds = ({ day, rain }) => {
  const [type, setType] = useState("day");

  useEffect(() => {
    if (rain) {
      setType("rain");
    } else {
      if (day) {
        setType("day");
      } else {
        setType("night");
      }
    }
  }, [day, rain]);

  return (
    <>
      <Cloud
        opacity={50}
        scale={0.1}
        velocityMod={0.3}
        day={day}
        rain={rain}
        type={type}
      />
      <Cloud scale={0.5} velocityMod={0.5} type={type} />
      <Cloud scale={1} velocityMod={1} type={type} />
    </>
  );
};

export default Clouds;
