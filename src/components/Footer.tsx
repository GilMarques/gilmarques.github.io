import { github, linkedin, mail } from "../assets/icons/index.js";
import { heart } from "../assets/sprites/index.js";
import { WeatherType } from "../hooks/useWeather.js";
import Ocean from "./Ocean.js";
import SunDial from "./SunDial.js";

type FooterProps = {
  isDay: boolean;
  weather: WeatherType;
  setWeather: (weather: WeatherType) => void;
  daySliderValue: number;
  setDaySliderValue: (value: number) => void;
  sunRef: HTMLDivElement | undefined;
  moonRef: HTMLDivElement | undefined;
};

const Footer = (props: FooterProps) => {
  return (
    <footer>
      <div
        class="relative bottom-0 -z-10"
        style={{ "mix-blend-mode": "multiply" }}
      >
        <Ocean
          isDay={props.isDay}
          isSnow={props.weather === WeatherType.Snow}
          sunRef={props.sunRef}
          moonRef={props.moonRef}
        />
      </div>

      <div
        id="contact"
        class={`absolute bottom-4 min-w-full font-custom ${
          props.isDay ? "text-black" : "text-white"
        }`}
      >
        <div class="flex flex-col items-center gap-4">
          <div class="flex flex-col items-center">
            <SunDial
              weather={props.weather}
              value={props.daySliderValue}
              onChange={props.setDaySliderValue}
              setWeather={props.setWeather}
            />
          </div>

          <div class="relative text-center ">
            <p class="text-3xl mb-2">Contact Me</p>

            <div class="flex flex-wrap justify-center align-center gap-4">
              <a
                class="w-50 eightbit-button p-2 text-black flex items-center"
                href="mailto:gilmmm4@gmail.com"
              >
                <img src={mail} alt="Email" class="h-10 pixelated" />
                <span class="grow text-center">Email</span>
              </a>

              <a
                class="w-50 eightbit-button p-2 text-black flex items-center"
                href="https://github.com/GilMarques"
              >
                <img src={github} alt="Github" class="w-10 h-10 pixelated" />
                <span class="grow text-center">Github</span>
              </a>

              <a
                class="w-50 eightbit-button p-2 text-black flex items-center"
                href="https://www.linkedin.com/in/gil-marques-ab86a524b/"
              >
                <img
                  src={linkedin}
                  alt="LinkedIn"
                  class="w-10 h-10 pixelated"
                />
                <span class="grow text-center">LinkedIn</span>
              </a>
            </div>
          </div>
          <div class="font-custom text-xl">
            <span>Made with</span>
            <img src={heart} alt="heart" class="inline-block h-3 w-3 mx-2" />
            <span>
              by <strong>Gil Marques</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
