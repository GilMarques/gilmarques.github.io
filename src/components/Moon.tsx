import { forwardRef } from "react";
import { moon } from "../assets/sprites/sun_dial";

type MoonProps = {
  isDay: boolean;
  x: number;
  y: number;
};

const Moon = forwardRef<HTMLDivElement, MoonProps>(({ isDay, x, y }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute h-32 w-32 rounded-full -z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        filter: isDay ? "contrast(0.7) saturate(0.5)" : "brightness(1.2)",
        mixBlendMode: isDay ? "multiply" : "normal",
      }}
    >
      <img src={moon} alt="Moon" />
    </div>
  );
});

Moon.displayName = "Moon";

export default Moon;
