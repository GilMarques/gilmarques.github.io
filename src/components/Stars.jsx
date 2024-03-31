import { sky } from "../assets/index.js";

const Stars = () => {
  return (
    <>
      <div
        className="relative h-[300px]"
        style={{ backgroundImage: `url(${sky})` }}
      >
        <div
          className="relative h-full text-white"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        ></div>
      </div>
    </>
  );
};

export default Stars;
