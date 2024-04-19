/* eslint-disable react/prop-types */
import { projects, source } from "../assets/index.js";

const Project = ({ title, description, thumbnail, url, code }) => {
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
              alt={`${title} thumbnail`}
              className="pixel-corners min-h-full min-w-full rounded-lg border-[5px] border-black object-cover"
              draggable="false"
            />
          </div>
          <div className="w-[250px] rounded-sm bg-stone-400 p-4">
            <div className="font-custom text-3xl text-black">{title}</div>
            <div className="font-custom text-xl text-black">{description}</div>
          </div>
        </div>
      </a>
      <a href={code} className="absolute bottom-2 right-5">
        <img src={source} alt="Source code" width={40} height={40} />
      </a>
    </div>
  );
};

const Projects = ({ day }) => {
  return (
    <div className="px-8">
      <p
        className={`text-md mt-16 scroll-mt-16 font-custom text-3xl font-black ${
          day ? "text-black" : "text-white"
        } underline`}
        id="projects"
      >
        My Work
      </p>
      <div
        className={`font-custom text-3xl ${day ? "text-black" : "text-white"}`}
      >
        <p className="mb-8">Check out my featured projects</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {projects.map((project) => (
            <Project key={project.title} {...project} />
          ))}
        </div>
        <p className="text-md font-custom mt-8 text-center text-3xl text-black">
          <a
            className={`eightbit-button ${
              day ? "text-black border-black" : "text-white border-white"
            } `}
            href="https://github.com/GilMarques"
          >
            More on my GitHub page
          </a>
        </p>
      </div>
    </div>
  );
};

export default Projects;
