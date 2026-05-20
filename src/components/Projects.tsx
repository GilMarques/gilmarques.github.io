import { For } from "solid-js";
import { angular, python, react, solidjs, typescript } from "../assets/icons";
import { gg, inouno, portfolio, radiostation } from "../assets/projects";

export interface Project {
  title: string;
  description: string;
  thumbnail: string;
  url?: string;
  code: string;
  types: ProjectType[];
  background?: string;
  oss: boolean;
}

export enum ProjectType {
  React = "react",
  Angular = "angular",
  Python = "python",
  TypeScript = "typescript",
  SolidJS = "solidjs",
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
    background: "#dbeafe",
    oss: true,
  },
  {
    title: "Ino Uno",
    description: "A clone of the popular game UNO (server is down)",
    thumbnail: inouno,
    url: "https://gilmarques.github.io/ino-uno-vite/",
    code: "https://github.com/GilMarques/ino-uno-vite",
    types: [ProjectType.Python, ProjectType.React],
    background: "#ffc9c9",
    oss: true,
  },
  {
    title: "GG",
    description: "A Workout Log (Under Development)",
    thumbnail: gg,
    url: "https://github.com/GilMarques/gym-genius-rn",
    code: "https://github.com/GilMarques/gym-genius-rn",
    types: [ProjectType.TypeScript, ProjectType.Angular],
    background: "#b9f8cf",
    oss: false,
  },
  {
    title: "Personal Portfolio",
    description: "Retro Style Portfolio",
    thumbnail: portfolio,
    url: "https://gilmarques.github.io/",
    code: "https://github.com/GilMarques/portfolio",
    types: [ProjectType.SolidJS],
    background: "#fff",
    oss: true,
  },
];

const ProjectIcon = ({ type }: { type: ProjectType }) => {
  switch (type) {
    case ProjectType.React:
      return (
        <div
          class={`w-6 h-6 flex items-center justify-center rounded-full bg-blue-200 shadow-blue-400 `}
          style={{ "box-shadow": "-2px 2px 0 #60a5fa" }}
          data-tooltip="React"
        >
          <img src={react} alt="React" class="w-4 h-4" />
        </div>
      );
    case ProjectType.Angular:
      return (
        <div
          class={`w-6 h-6 flex items-center justify-center rounded-full bg-pink-300 `}
          style={{ "box-shadow": "-2px 2px 0 #f472b6" }}
          data-tooltip="Angular"
        >
          <img src={angular} alt="Angular" class="w-4 h-4" />
        </div>
      );
    case ProjectType.Python:
      return (
        <div
          class={`w-6 h-6 flex items-center justify-center rounded-full bg-yellow-200 `}
          style={{ "box-shadow": "-2px 2px 0 #fde047" }}
          data-tooltip="Python"
        >
          <img src={python} alt="Python" class="w-4 h-4" />
        </div>
      );
    case ProjectType.TypeScript:
      return (
        <div
          class={`w-6 h-6 flex items-center justify-center rounded-full `}
          style={{
            "background-color": "#3178C6",
            "box-shadow": "-2px 2px 0 #1d4ed8",
          }}
          data-tooltip="TypeScript"
        >
          <img src={typescript} alt="Typescript" class="w-4 h-4" />
        </div>
      );
    case ProjectType.SolidJS:
      return (
        <div
          class={`w-6 h-6 flex items-center justify-center rounded-full`}
          style={{
            "background-color": "#5C95D4",
            "box-shadow": "-2px 2px 0 #3178C6",
          }}
          data-tooltip="SolidJS"
        >
          <img src={solidjs} alt="SolidJS" class="w-4 h-4" />
        </div>
      );
    default:
      return null;
  }
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div class="relative hover:-translate-x-2 hover:-translate-y-5 hover:scale-105 hover:drop-shadow-xl">
      <a class="pixel-corners w-75 p-2" href={project.url}>
        <div
          class={`pixel-corners w-75 h-100 cursor-pointer flex flex-col justify-between gap-2 px-2 py-6 `}
          style={{ background: project.background }}
        >
          <div>
            <img
              src={project.thumbnail}
              alt={`${project.title}`}
              class="h-37.5 w-55 bg-cover object-cover"
              style={{
                border: "8px solid #000000",
                "border-radius": "8px 8px 32px 8px",
              }}
              draggable="false"
            />

            <div class="w-55 rounded-sm text-black font-custom mt-2">
              <h1 class="text-3xl">{project.title}</h1>
              <p class="text-xl">{project.description}</p>
            </div>
          </div>
          <div class=" w-55 flex justify-between items-center justify-self-end">
            {project.oss && (
              <a
                href={project.code}
                class=" font-custom text-sm bottom-5 bg-stone-400  rounded-full px-2 py-1 text-center text-black"
                style={{ "box-shadow": "-2px 2px 0 #78716c" }}
              >
                &#x3c;&#x3e; Source
              </a>
            )}

            {!project.oss && (
              <a
                href={project.code}
                class=" font-custom text-sm bottom-5 bg-stone-400  rounded-full px-2 py-1 text-center text-black"
                style={{ "box-shadow": "-2px 2px 0 #78716c" }}
              >
                &#x3e; Page
              </a>
            )}

            <div class="flex gap-1 justify-end items-center">
              <div class="bg-stone-500 w-1 h-1 rounded-lg"></div>
              <div class="bg-stone-500 w-1 h-1 rounded-lg"></div>
              <div class="bg-stone-500 w-1 h-1 rounded-lg"></div>
            </div>
            <div class="flex gap-2">
              <For each={project.types}>
                {(type) => <ProjectIcon type={type} />}
              </For>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

const Projects = (props: { isDay: boolean }) => {
  return (
    <div class="px-8">
      <p
        class={`text-md mt-16 scroll-mt-16 font-custom text-3xl font-black ${
          props.isDay ? "text-black" : "text-white"
        } underline`}
        id="projects"
      >
        Projects
      </p>
      <div
        class={`font-custom text-3xl ${props.isDay ? "text-black" : "text-white"}`}
      >
        <p class="mb-8">Check out my featured projects</p>
        <div class="flex flex-wrap items-center justify-center gap-8">
          <For each={projects}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </div>
        <div class="font-custom mt-8 text-center text-3xl text-black">
          <a
            class={`eightbit-button text-black border-black`}
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
