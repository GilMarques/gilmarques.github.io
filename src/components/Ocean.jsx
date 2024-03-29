import { ocean } from "../assets/index.js";

const Ocean = () => {
  return (
    <div
      className="relative bottom-0 min-h-[200px] min-w-full"
      style={{
        backgroundImage: `url(${ocean})`,

        backgroundRepeat: "repeat-x",
      }}
    ></div>
  );
};

export default Ocean;
