import { ocean, social } from "../assets";

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

import { terrain } from "../assets";

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

const Footer = () => {
  return (
    <>
      <Ocean />
      <Terrain />
      <div className="absolute bottom-[40px] min-w-full font-custom">
        <p className="text-center text-3xl">Contact Me</p>
        <div className="flex items-center justify-center gap-x-4">
          {social.map((x) => (
            <a
              className="flex flex-col items-center"
              href={x.link}
              key={x.name}
            >
              <img
                key={x.name}
                src={x.src}
                alt="logo"
                className="m-auto inline-block h-[50px] w-[60px]"
                draggable="false"
              />
              <p>{x.name}</p>
            </a>
          ))}
        </div>
        <hr className="m-auto w-1/2 rounded-sm border-2 border-black" />
        <div className="text-center font-custom text-xl">
          Copyright&ensp;2024&ensp; &bull;&ensp; Gil&ensp;Marques
        </div>
      </div>
    </>
  );
};

export default Footer;
