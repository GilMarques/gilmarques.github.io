/* eslint-disable react/prop-types */
import { projects } from "../assets/index.js";
const Project = ({
  title,
  description,
  thumbnail,
  url,
  code,
}: {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  code: string;
}) => {
  return (
    <div
      className="relative hover:-translate-x-2 hover:-translate-y-5 hover:scale-105 hover:drop-shadow-xl"
      style={{
        transition: "all 0.3s",
      }}
    >
      <a className="pixel-corners w-[300px] p-2" href={url}>
        <div
          className="pixel-corners w-[300px] cursor-pointer flex-col bg-stone-300 p-2 shadow-2xl"
          style={{ aspectRatio: "3/4" }}
        >
          <div className="pixel-corners mb-2 h-[150px] w-[200px] p-1">
            <img
              src={thumbnail}
              alt={`${title}`}
              className="pixel-corners min-h-full min-w-full rounded-lg border-[5px] border-black bg-cover object-cover"
              draggable="false"
            />
          </div>
          <div className="w-[250px] rounded-sm bg-stone-400 p-4 text-black font-custom ">
            <div className="text-3xl">{title}</div>
            <div className="text-xl">{description}</div>
          </div>
        </div>
      </a>
      <a
        href={code}
        className="absolute font-custom text-sm bottom-5 bg-stone-300 right-5 p-1 hover:bg-stone-200"
      >
        &#x3c;&#x3e; Source
      </a>
    </div>
  );
};

const Projects = ({ isDay }: { isDay: boolean }) => {
  return (
    <div className="px-8">
      <p
        className={`text-md mt-16 scroll-mt-16 font-custom text-3xl font-black ${
          isDay ? "text-black" : "text-white"
        } underline`}
        id="projects"
      >
        Projects
      </p>
      <div
        className={`font-custom text-3xl ${
          isDay ? "text-black" : "text-white"
        }`}
      >
        <p className="mb-8">Check out my featured projects</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {projects.map((project) => (
            <Project key={project.title} {...project} />
          ))}
        </div>
        <div className="font-custom mt-8 text-center text-3xl text-black">
          <a
            className={`eightbit-button ${
              isDay ? "text-black border-black" : "text-white border-white"
            } `}
            href="https://github.com/GilMarques"
          >
            More on my GitHub page
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;
