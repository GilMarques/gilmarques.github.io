/* eslint-disable react/prop-types */
import { projects } from "../assets/index.js";

const Project = ({ title, description, thumbnail, url }) => {
  return (
    <a
      className="hover:-translate-x-2 hover:-translate-y-5 hover:scale-105 hover:drop-shadow-xl"
      style={{
        transition: "all 0.3s",
      }}
      href={url}
    >
      <div className="pixel-corners w-[300px] p-2">
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
      </div>
    </a>
  );
};

const Projects = () => {
  return (
    <div className="px-8">
      <p
        className="text-md mt-16 scroll-mt-16 font-custom text-3xl font-black text-white underline"
        style={{ mixBlendMode: "difference" }}
      >
        My Work
      </p>
      <div className="font-custom text-3xl text-white" id="projects">
        <p className="mb-8">Check out my projects</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {projects.map((project) => (
            <Project
              key={project.title}
              title={project.title}
              description={project.description}
              thumbnail={project.thumbnail}
              url={project.url}
            />
          ))}
        </div>
        <p className="text-md mt-8 text-center font-custom text-3xl text-black">
          And yet more to come...
        </p>
      </div>
    </div>
  );
};

export default Projects;
