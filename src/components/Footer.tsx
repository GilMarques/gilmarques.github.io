/* eslint-disable react/prop-types */
import {
  button,
  github_icon,
  heart,
  linkedin_icon,
  mail_icon,
  terrain,
  terrainSnow,
} from "../assets/index.js";

import { useEffect, useState } from "react";

import { WeatherType } from "../hooks/useWeather.js";
import SunDial from "./SunDial.js";

const Footer = ({
  isDay,
  weather,
  setWeather,
  daySliderValue,
  setDaySliderValue,
}: {
  isDay: boolean;
  weather: WeatherType;
  setWeather: (weather: WeatherType) => void;
  daySliderValue: number;
  setDaySliderValue: (value: number) => void;
}) => {
  useEffect(() => {
    for (const src of [terrain, terrainSnow]) {
      const img = new Image();
      img.src = src;
    }
  }, []);

  return (
    <>
      <div
        className="relative bottom-0 -mt-0 min-h-[600px] w-[200%] min-w-[3620px]"
        style={{
          backgroundImage:
            weather == WeatherType.Snow
              ? `url(${terrainSnow})`
              : `url(${terrain})`,

          mixBlendMode: "multiply",
        }}
      ></div>

      <div
        id="contact"
        className={`absolute bottom-[16px] min-w-full font-custom ${
          isDay ? "text-black" : "text-white"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <SunDial
              weather={weather}
              value={daySliderValue}
              onChange={setDaySliderValue}
              setWeather={setWeather}
            />
          </div>

          <div className="relative text-center ">
            <p className="text-3xl mb-2">Contact Me</p>

            <div className="flex flex-wrap justify-center align-center gap-4">
              <a
                className="w-[200px] eightbit-button p-2 text-black flex items-center"
                href="mailto:gilmmm4@gmail.com"
              >
                <img src={mail_icon} alt="Email" className="h-10 pixelated" />
                <span className="flex-grow text-center">Email</span>
              </a>

              <a
                className="w-[200px] eightbit-button p-2 text-black flex items-center"
                href="https://github.com/GilMarques"
              >
                <img
                  src={github_icon}
                  alt="Github"
                  className="w-10 h-10 pixelated"
                />
                <span className="flex-grow text-center">Github</span>
              </a>

              <a
                className="w-[200px] eightbit-button p-2 text-black flex items-center"
                href="https://www.linkedin.com/in/gil-marques-ab86a524b/"
              >
                <img
                  src={linkedin_icon}
                  alt="LinkedIn"
                  className="w-10 h-10 pixelated"
                />
                <span className="flex-grow text-center">LinkedIn</span>
              </a>
            </div>
          </div>
          <div className="font-custom text-xl">
            <span>Made with</span>
            <img
              src={heart}
              alt="heart"
              className="inline-block h-3 w-3 mx-2"
            />
            <span>
              by <strong>Gil Marques</strong>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
