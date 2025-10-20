/* eslint-disable react/prop-types */
import { button, terrain } from "../assets/index.js";

import { useState } from "react";
import { DaytimeType, WeatherType } from "../App";

import {
  CloudRain,
  CloudSnow,
  Cloudy,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";

const Button = ({
  onClick,
  children,
  pressed,
}: {
  onClick: () => void;
  children: React.ReactNode;
  pressed: boolean;
}) => {
  return (
    <button onClick={onClick}>
      <div
        className={`absolute min-w-[50px] flex justify-center items-center ${
          pressed ? " h-[50px]" : " h-[45px]"
        }  `}
      >
        {children}
      </div>
      <img
        src={pressed ? button[0] : button[1]}
        style={{
          minHeight: 50,
          minWidth: 50,
          maxHeight: 50,
          maxWidth: 50,
        }}
      />
    </button>
  );
};

const Footer = ({
  isDay,
  setWeather,
  setDaytime,
}: {
  isDay: boolean;
  setWeather: (weather: WeatherType) => void;
  setDaytime: (daytime: DaytimeType) => void;
}) => {
  const [pressedDay, setPressedDay] = useState<DaytimeType | null>(null);
  const [pressedWeather, setPressedWeather] = useState<WeatherType | null>(
    null
  );

  const handleDayPress = (daytime: DaytimeType) => {
    if (pressedDay === daytime) {
      setDaytime("day");
      return setPressedDay(null);
    }
    setDaytime(daytime);
    setPressedDay(daytime);
  };

  const handleWeatherPress = (weather: WeatherType) => {
    if (pressedWeather === weather) {
      setWeather("clear");
      return setPressedWeather(null);
    }
    setWeather(weather);
    setPressedWeather(weather);
  };

  return (
    <>
      <div
        className="relative bottom-0 -mt-0 min-h-[600px] w-[200%] min-w-[3620px]"
        style={{
          backgroundImage: `url(${terrain[0]})`,
          right: 0,
          backgroundRepeat: "repeat-x",
          animation: `moveTerrain ${10}s linear infinite`,
          mixBlendMode: "multiply",
        }}
      ></div>

      <div
        id="contact"
        className={`absolute bottom-[40px] min-w-full font-custom ${
          isDay ? "text-black" : "text-white"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative text-center ">
            <p className="text-3xl">Contact Me</p>

            <div className="flex flex-wrap justify-center align-center gap-4">
              <a
                className="w-[200px] eightbit-button p-2 text-black flex items-center"
                href="mailto:gilmmm4@gmail.com"
              >
                <Mail />
                <span className="flex-grow text-center">Email</span>
              </a>

              <a
                className="w-[200px] eightbit-button p-2 text-black flex items-center"
                href="https://github.com/GilMarques"
              >
                <Github />
                <span className="flex-grow text-center">Github</span>
              </a>

              <a
                className="w-[200px] eightbit-button p-2 text-black flex items-center"
                href="https://www.linkedin.com/in/gil-marques-ab86a524b/"
              >
                <Linkedin />
                <span className="flex-grow text-center">LinkedIn</span>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            <div>
              <Button
                onClick={() => handleDayPress("sunset")}
                pressed={pressedDay === "sunset"}
              >
                <Sunset />
              </Button>

              <Button
                onClick={() => handleDayPress("day")}
                pressed={pressedDay === "day"}
              >
                <Sun />
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handleDayPress("sunrise")}
                pressed={pressedDay === "sunrise"}
              >
                <Sunrise />
              </Button>
              <Button
                onClick={() => handleDayPress("night")}
                pressed={pressedDay === "night"}
              >
                <Moon />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center">
            <div>
              <Button
                onClick={() => handleWeatherPress("clouds")}
                pressed={pressedWeather === "clouds"}
              >
                <Cloudy />
              </Button>
              <Button
                onClick={() => handleWeatherPress("rain")}
                pressed={pressedWeather === "rain"}
              >
                <CloudRain />
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handleWeatherPress("snow")}
                pressed={pressedWeather === "snow"}
              >
                <CloudSnow />
              </Button>
            </div>
          </div>
        </div>
        <hr
          className={`m-auto w-2/3 rounded-sm border-2  ${
            isDay ? "border-black" : "border-white"
          }`}
        />
        <div className="font-custom text-center text-xl">
          2025&ensp; &bull;&ensp; Gil&ensp;Marques
        </div>
      </div>
    </>
  );
};

export default Footer;
