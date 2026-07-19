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
        class={`absolute bottom-2 min-w-full font-custom ${
          props.isDay ? "text-black" : "text-white"
        }`}
      >
        <div class="flex flex-col items-center  gap-2">
          <SunDial
            weather={props.weather}
            value={props.daySliderValue}
            onChange={props.setDaySliderValue}
            setWeather={props.setWeather}
          />

          <div class="font-custom text-xs">
            <span>Made with</span>
            <img src={heart} alt="heart" class="inline-block h-2.5 w-2.5 mx-1.5" />
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
