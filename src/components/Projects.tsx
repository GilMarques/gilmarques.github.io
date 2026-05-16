/* eslint-disable react/prop-types */

import { angular, python, react, typescript } from "../assets/icons";
import { gg, inouno, portfolio, radiostation } from "../assets/projects";

export interface Project {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  code: string;
  types?: ProjectType[];
  background?: string;
}

export enum ProjectType {
  React = "react",
  Angular = "angular",
  Python = "python",
  TypeScript = "typescript",
}

const projects: Project[] = [
  {
    title: "Radio Station",
    description:
      "Explore radio stations around the world using an interactive map",
    thumbnail: radiostation,
    url: "https://gilmarques.github.io/radio-station/",
    code: "https://github.com/GilMarques/radio-station",
    types: [ProjectType.Angular],
    background: "bg-blue-100",
  },
  {
    title: "Ino Uno",
    description: "A clone of the popular game UNO (server is down)",
    thumbnail: inouno,
    url: "https://gilmarques.github.io/ino-uno-vite/",
    code: "https://github.com/GilMarques/ino-uno-vite",
    types: [ProjectType.Python, ProjectType.React],
    background: "bg-red-200",
  },
  {
    title: "GG",
    description: "A Workout Log (Under Development)",
    thumbnail: gg,
    url: "https://github.com/GilMarques/gym-genius-rn",
    code: "https://github.com/GilMarques/gym-genius-rn",
    types: [ProjectType.TypeScript, ProjectType.Angular],
    background: "bg-green-200",
  },
  {
    title: "Personal Portfolio",
    description: "Retro Style Portfolio",
    thumbnail: portfolio,
    url: "https://gilmarques.github.io/",
    code: "https://github.com/GilMarques/portfolio",
    types: [ProjectType.React],
    background: "bg-blue-100",
  },
];

const ProjectIcon = ({ type }: { type: ProjectType }) => {
  const className = "w-4 h-4";

  switch (type) {
    case ProjectType.React:
      return (
        <div
          className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-200   shadow-blue-400"
          style={{ boxShadow: "-2px 2px 0 #60a5fa" }}
        >
          <img src={react} alt="React" className={className} />
        </div>
      );
    case ProjectType.Angular:
      return (
        <div
          className="w-6 h-6 flex items-center justify-center rounded-full bg-pink-300    "
          style={{ boxShadow: "-2px 2px 0 #f472b2" }}
        >
          <img src={angular} alt="Angular" className={className} />
        </div>
      );
    case ProjectType.Python:
      return (
        <div
          className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-200   "
          style={{ boxShadow: "-2px 2px 0 #fde047" }}
        >
          <img src={python} alt="Python" className={className} />
        </div>
      );
    case ProjectType.TypeScript:
      return (
        <div
          className="w-6 h-6 flex items-center justify-center rounded-full"
          style={{
            backgroundColor: "#3178C6",
            
            boxShadow: "-2px 2px 0 #1d4ed8",
          }}
        >
          <img src={typescript} alt="Typescript" className={className} />
        </div>
      );
    default:
      return null;
  }
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="relative hover:-translate-x-2 hover:-translate-y-5 hover:scale-105 hover:drop-shadow-xl">
      <a className="pixel-corners w-[300px] p-2" href={project.url}>
        <div
          className={`pixel-corners w-[300px] h-[400px] cursor-pointer flex flex-col justify-between gap-2 px-2 py-6 ${project.background}`}
          // style={{ aspectRatio: "3/4" }}
        >
          <div>
            <img
              src={project.thumbnail}
              alt={`${project.title}`}
              className="h-[150px] w-[220px] bg-cover object-cover"
              style={{
                border: "6px   solid #000000",
                borderRadius: "8px 8px 32px 8px",
              }}
              draggable="false"
            />

            <div className="w-[220px] rounded-sm text-black font-custom mt-2">
              <h1 className="text-3xl">{project.title}</h1>
              <p className="text-xl">{project.description}</p>
            </div>
          </div>
          <div className=" w-[220px] flex justify-between items-center justify-self-end">
            <button
              onClick={() => window.open(project.code, "_blank")}
              className=" font-custom text-sm bottom-5 bg-stone-400  rounded-full px-2 py-1 text-center text-black"
              style={{ boxShadow: "-2px 2px 0 #78716c" }}
            >
              &#x3c;&#x3e; Source
            </button>
            <div className="flex gap-1 justify-end items-center">
              <div className="bg-stone-500 w-1 h-1 rounded-lg"></div>
              <div className="bg-stone-500 w-1 h-1 rounded-lg"></div>
              <div className="bg-stone-500 w-1 h-1 rounded-lg"></div>
            </div>
            <div className="flex gap-2">
              {project.types?.map((type, index) => (
                <ProjectIcon key={index} type={type} />
              ))}
            </div>
          </div>
        </div>
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
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        <div className="font-custom mt-8 text-center text-3xl text-black">
          <a
            className={`eightbit-button text-black border-black`}
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
