/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
const About = ({ day }) => {
  return (
    <>
      <div className={`absolute px-4  ${day ? "text-black" : "text-white"}`}>
        <div className="text-md font-custom mt-16 p-4 text-4xl font-black underline">
          About
        </div>
        <div
          className={`text-md p-4  font-custom text-3xl scroll-mt-16  ${
            day ? "text-black" : "text-white"
          }`}
          id="about"
        >
          Hi, my name is <b>Gil</b> <br /> I'm a Software Developer from
          Portugal
        </div>
        <div className="text-md font-custom p-4 text-3xl">
          <a
            className={`p-4 rounded-xl border-2 border-black  ${
              day ? "text-black border-black" : "text-white border-white"
            } `}
            href="#contact"
          >
            Contact Me
          </a>
        </div>
      </div>
    </>
  );
};

export default About;
