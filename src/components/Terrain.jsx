import { terrain } from "../assets/index.js";

const Terrain = () => {
  return (
    <div
      className="relative bottom-0 -mt-20 min-h-[400px] min-w-full"
      style={{
        backgroundImage: `url(${terrain[0]})`,

        backgroundRepeat: "repeat-x",
        // mixBlendMode: "multiply",
      }}
    ></div>
  );
};

export default Terrain;
