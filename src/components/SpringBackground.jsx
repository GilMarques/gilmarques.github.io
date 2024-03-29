/* eslint-disable react/prop-types */
import { animated, useSpring } from "@react-spring/web";
import { useEffect } from "react";

const daytimes = {
  morning: "linear-gradient(to bottom,#000000 0% ,#94dfff 50%,#b7eaff 100%)",
  sunset: "linear-gradient(to bottom,#000000 0% ,#FD5E53 0%,	#FFD580 100%)",
  night: "linear-gradient(to bottom,	#000000 0%,		#00001f 100%)",
};

const SpringBackground = ({ daytime = "morning" }) => {
  const [{ background }, api] = useSpring(() => ({
    background: daytimes[daytime],
  }));
  useEffect(() => {
    switch (daytime) {
      case "morning":
        api.start({
          background: daytimes.morning,
        });
        break;
      case "sunset":
        api.start({
          background: daytimes.sunset,
        });
        break;
      case "night":
        api.start({
          background: daytimes.night,
        });
        break;

      default:
        break;
    }
  }, [api, daytime]);
  // useEffect(() => {
  //   document.body.style.background =
  //     "linear-gradient(to bottom,#000000 0% ,#94dfff 50%,#b7eaff 100%)";
  //   return () => {
  //     document.body.classList.remove("bg-black");
  //   };
  // });
  return (
    <animated.div
      className="sky-gradient absolute -z-10 h-full w-full border-[50px] border-amber-400"
      style={{ background: background }}
    ></animated.div>
  );
};

export default SpringBackground;
