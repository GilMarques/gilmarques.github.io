/* eslint-disable react/no-unescaped-entities */
const About = ({ day }) => {
  return (
    <>
      <div
        className={`text-md relative top-0 mt-20 p-4 text-center font-custom text-3xl ${
          day ? "text-black" : "text-white"
        }`}
      >
        Hi, my name is <b>Gil</b> <br /> I'm a Software Developer from Portugal
      </div>
      <div className={`relative px-4  ${day ? "text-black" : "text-white"}`}>
        <div
          className="text-md mt-16 scroll-mt-16 p-4 font-custom text-4xl font-black underline"
          id="about"
        >
          About
        </div>
        <div className="text-md p-4 font-custom text-3xl">
          I'm a software developer with experience in Javascript, and expertise
          in frameworks like React, Node.js. I'm a quick learner and collaborate
          closely with clients to create efficeient, scalable, and user-friendly
          solutions that solve real-world problems. Let's work together to bring
          your ideas to life!
        </div>
      </div>
    </>
  );
};

export default About;
