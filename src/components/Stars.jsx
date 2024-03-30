import { sky } from "../assets/index.js";

const Stars = () => {
  return (
    <>
      <div
        className="relative h-[200px]"
        style={{ backgroundImage: `url(${sky})` }}
      ></div>
      <div
        className="relative bottom-[100px] h-[100px] text-white"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        hello
      </div>
    </>
  );
};

export default Stars;
