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
      "Browse radio stations from around the world through an interactive map. Pick a country, drop a pin, and tune in — stream metadata and live audio in a single click. Stations are pulled from a public radio directory REST API and rendered on the front-end with Angular and PrimeNG. The map handles panning, zooming, and clustering the station markers by region. A built-in player keeps the stream alive while you explore, and a side panel shows the currently playing track and genre.",
    thumbnail: radiostation,
    url: "https://gilmarques.github.io/radio-station/",
    code: "https://github.com/GilMarques/radio-station",
    types: [ProjectType.Angular],
    background: "#dbeafe",
    oss: true,
  },
  {
    title: "Ino Uno",
    description:
      "A 3D reimagining of the classic UNO card game, built as a learning project for real-time web multiplayer. The board, cards, and animations are rendered in Three.js on top of a React front-end that drives the game state. A Python FastAPI backend with WebSocket connections handles multiplayer turns, validation, and game-room management. Play solo against a simple bot, or open a room and invite a friend for a match. Card physics, turn highlighting, and the UNO call are all hand-implemented.",
    thumbnail: inouno,
    url: "https://gilmarques.github.io/ino-uno-vite/",
    code: "https://github.com/GilMarques/ino-uno-vite",
    types: [ProjectType.Python, ProjectType.React],
    background: "#ffc9c9",
    oss: true,
  },
  {
    title: "GG",
    description:
      "A mobile workout tracker for logging sets, reps, and progress over time — aimed at people who want a simple log without the bloat of full fitness apps. The first version was written in React Native, but the current rewrite is in Angular + Ionic for a smoother cross-platform feel and faster iteration. Create routines, track working weight over time, and mark personal records as you hit them. Still in active development — exercise history, PR detection, and a stats screen are next on the list.",
    thumbnail: gg,
    url: "https://github.com/GilMarques/gym-genius-rn",
    code: "https://github.com/GilMarques/gym-genius-rn",
    types: [ProjectType.TypeScript, ProjectType.Angular],
    background: "#b9f8cf",
    oss: false,
  },
  {
    title: "Personal Portfolio",
    description:
      "The very site you're scrolling through. A retro-inspired portfolio built with SolidJS for reactivity, Konva for the canvas work, and Tailwind for the layout — with the pixel-art UI (buttons, panels, animations) hand-rolled in CSS. The animated day/night sky, the draggable cloud with spring-physics tail, the rain and snow weather effects, and the responsive layout are all custom-built. It even pulls live weather data from the OpenWeather API, so the sky reflects the actual time of day and current conditions in your location.",
    thumbnail: portfolio,
    url: "https://gilmarques.github.io/",
    code: "https://github.com/GilMarques/gilmarques.github.io",
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
    <div class="flex flex-col gap-6 lg:gap-10 py-10 lg:py-16 lg:min-h-[70vh] w-full max-w-5xl">
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div class="lg:sticky lg:top-1/2 lg:-translate-y-1/2 self-center lg:self-start flex justify-center">
          <div class="relative hover:-translate-x-2 hover:-translate-y-5 hover:scale-105 hover:drop-shadow-xl w-full max-w-xs lg:w-fit">
            <a class="pixel-corners p-2 block" href={project.url}>
              <div
                class={`pixel-corners aspect-[4/3] cursor-pointer flex flex-col justify-between gap-2 px-2 py-6 w-full lg:aspect-3/4 lg:w-55`}
                style={{ background: project.background }}
              >
                <div>
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    class="h-32 w-full object-cover lg:h-37.5 lg:w-55"
                    style={{
                      border: "8px solid #000000",
                      "border-radius": "8px 8px 32px 8px",
                    }}
                    draggable="false"
                  />
                </div>
                <div class="w-full flex justify-between items-center lg:w-55">
                  {project.oss && (
                    <a
                      href={project.code}
                      class="font-custom text-sm bottom-5 bg-stone-400 rounded-full px-2 py-1 text-center text-black"
                      style={{ "box-shadow": "-2px 2px 0 #78716c" }}
                    >
                      &#x3c;&#x3e; Source
                    </a>
                  )}

                  {!project.oss && (
                    <a
                      href={project.code}
                      class="font-custom text-sm bottom-5 bg-stone-400 rounded-full px-2 py-1 text-center text-black"
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
        </div>
        <div class="font-custom flex-1 min-w-0">
          <p class="text-base lg:text-xl leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const Projects = (props: { isDay: boolean }) => {
  return (
    <div class="px-4 lg:px-8">
      <div class={`font-custom ${props.isDay ? "text-black" : "text-white"}`}>
        <div class="flex flex-col items-center gap-12 lg:gap-8">
          <For each={projects}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </div>
      </div>
    </div>
  );
};

export default Projects;
