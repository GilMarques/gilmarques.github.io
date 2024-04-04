/* eslint-disable react/prop-types */
import { social, terrain, weatherLogos } from "../assets/index.js";

import { useEffect, useRef, useState } from "react";

const Terrain = ({ day }) => {
  const [position, setPosition] = useState(0);
  const ref = useRef(null);

  const animationRef = useRef(0);

  // const moveDiv = () => {
  //   setPosition((prevPosition) => (prevPosition > 1820 ? 0 : prevPosition + 2)); // Increment position

  //   animationRef.current = requestAnimationFrame(moveDiv); // Request next frame
  // };

  // // Start animation on component mount
  // useEffect(() => {
  //   animationRef.current = requestAnimationFrame(moveDiv);

  //   // Cleanup function to cancel animation frame
  //   return () => cancelAnimationFrame(animationRef.current);
  // }, []);

  return (
    <div
      ref={ref}
      className="relative bottom-0 -mt-0 min-h-[600px] w-[600%]"
      style={{
        backgroundImage: `url(${terrain[0]})`,
        right: position,
        backgroundRepeat: "repeat-x",
        animation: `moveTerrain ${10}s linear infinite`,
        mixBlendMode: "multiply",
      }}
    ></div>
  );
};

import { button, dayLogos } from "../assets/index.js";
const DayButton = ({ id, src, pressed, setPressed }) => {
  const handleClick = () => {
    if (pressed === id) {
      setPressed(-1);
    } else setPressed(id);
  };
  return (
    <button onClick={handleClick}>
      <div className="absolute">
        <img src={dayLogos[id].src} alt="" width={50} height={50} />
      </div>
      <img
        src={pressed === id ? src[0] : src[1]}
        alt={src}
        width={50}
        height={50}
      />
    </button>
  );
};

const DayButtons = ({ setDaytime }) => {
  const [pressed, setPressed] = useState(-1);
  useEffect(() => {
    if (pressed === -1) {
      setDaytime("day");
      return;
    }
    setDaytime(dayLogos[pressed].name);
  }, [pressed, setDaytime]);

  return (
    <div className="bottom-0 flex flex-row flex-wrap justify-center">
      <div>
        <DayButton
          id={0}
          src={button}
          pressed={pressed}
          setPressed={setPressed}
        />
        <DayButton
          id={1}
          src={button}
          pressed={pressed}
          setPressed={setPressed}
        />
      </div>
      <div>
        <DayButton
          id={2}
          src={button}
          pressed={pressed}
          setPressed={setPressed}
        />
        <DayButton
          id={3}
          src={button}
          pressed={pressed}
          setPressed={setPressed}
        />
      </div>
    </div>
  );
};

const WeatherButton = ({ id, src, pressed, setPressed }) => {
  const handleClick = () => {
    if (pressed === id) {
      setPressed(-1);
    } else setPressed(id);
  };
  return (
    <button onClick={handleClick}>
      <div className="absolute">
        <img src={weatherLogos[id].src} alt="" width={50} height={50} />
      </div>
      <img
        src={pressed === id ? src[0] : src[1]}
        alt={src}
        width={50}
        height={50}
      />
    </button>
  );
};

const WeatherButtons = ({ setWeather }) => {
  const [pressed, setPressed] = useState(-1);

  useEffect(() => {
    if (pressed === -1) {
      setWeather("clear");
      return;
    }
    setWeather(weatherLogos[pressed].name);
  }, [pressed, setWeather]);

  return (
    <div className="text-center">
      <div className="flex flex-row flex-wrap justify-center">
        <div>
          <WeatherButton
            id={0}
            src={button}
            pressed={pressed}
            setPressed={setPressed}
          />
          <WeatherButton
            id={1}
            src={button}
            pressed={pressed}
            setPressed={setPressed}
          />
        </div>
        <div>
          <WeatherButton
            id={2}
            src={button}
            pressed={pressed}
            setPressed={setPressed}
          />
          <WeatherButton
            id={3}
            src={button}
            pressed={pressed}
            setPressed={setPressed}
          />
        </div>
      </div>
    </div>
  );
};

const Footer = ({ day, setWeather, setDaytime }) => {
  return (
    <>
      <Terrain day={day} />

      <div
        className={`absolute bottom-[40px] min-w-full font-custom ${
          day ? "text-black" : "text-white"
        }`}
        id="contact"
      >
        <div className="mx-8 flex items-center justify-center gap-x-4">
          <DayButtons setDaytime={setDaytime} />
          <WeatherButtons setWeather={setWeather} />
          <div className="relative">
            <p className="text-center text-3xl">Contact Me</p>
            {social.map((x) => (
              <a className="flex items-center" href={x.link} key={x.name}>
                <img
                  key={x.name}
                  src={x.src}
                  alt="logo"
                  className="left-0 inline-block h-[50px] w-[60px]"
                  draggable="false"
                />
                <p className="absolute left-1/2">{x.name}</p>
              </a>
            ))}
          </div>
        </div>
        <hr
          className={`m-auto w-2/3 rounded-sm border-2  ${
            day ? "border-black" : "border-white"
          }`}
        />
        <div className="text-center font-custom text-xl">
          Copyright&ensp;2024&ensp; &bull;&ensp; Gil&ensp;Marques
        </div>
      </div>
    </>
  );
};

export default Footer;
