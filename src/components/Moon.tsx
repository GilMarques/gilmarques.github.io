import { moon } from "../assets/sprites/sun_dial";

type MoonProps = {
  isDay: boolean;
  x: number;
  y: number;
  ref?: (el: HTMLDivElement) => void;
};

function Moon(props: MoonProps) {
  return (
    <div
      ref={props.ref}
      class="absolute h-32 w-32 rounded-full -z-50"
      style={{
        left: `${props.x}px`,
        top: `${props.y}px`,
        filter: props.isDay ? "contrast(0.7) saturate(0.5)" : "brightness(1.2)",
        "mix-blend-mode": props.isDay ? "multiply" : "normal",
      }}
    >
      <img src={moon} alt="Moon" />
    </div>
  );
}

// No displayName needed in Solid typically
export default Moon;
