import { For } from "solid-js";
import { angular, python, react, solidjs, typescript } from "../assets/icons";
import { gg, inouno, portfolio, radiostation } from "../assets/projects";
import Tooltip from "./Tooltip";

export interface Project {
  title: string;
  description: string[];
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
    description: [
      "Browse radio stations from around the world through an interactive map. Pick a country, drop a pin, and tune in to stream metadata and live audio in a single click.",
      "Stations are pulled from a public radio directory REST API and rendered on the front-end with Angular and PrimeNG. The map handles panning, zooming, and clustering the station markers by region.",
      "A built-in player keeps the stream alive while you explore, and a side panel shows the currently playing track and genre.",
    ],
    thumbnail: radiostation,
    url: "https://gilmarques.github.io/radio-station/",
    code: "https://github.com/GilMarques/radio-station",
    types: [ProjectType.Angular],
    background: "#dbeafe",
    oss: true,
  },
  {
    title: "Ino Uno",
    description: [
      "A 3D reimagining of the classic UNO card game, built as a learning project for real-time web multiplayer.",
      "The board, cards, and animations are rendered in Three.js on top of a React front-end that drives the game state. A Python FastAPI backend with WebSocket connections handles multiplayer turns, validation, and game-room management.",

    ],
    thumbnail: inouno,
    url: "https://gilmarques.github.io/ino-uno-vite/",
    code: "https://github.com/GilMarques/ino-uno-vite",
    types: [ProjectType.Python, ProjectType.React],
    background: "#ffc9c9",
    oss: true,
  },
  {
    title: "GG",
    description: [
      "A mobile workout tracker for logging sets, reps, and progress over time, aimed at people who want a simple log without the bloat of full fitness apps.",
      "The first version was written in React Native, but the current rewrite is in Angular and Ionic for a smoother cross-platform feel and faster iteration.",
      "Create routines, track working weight over time, and mark personal records as you hit them. Still in active development, with exercise history, PR detection, and a stats screen next on the list.",
    ],
    thumbnail: gg,
    url: "https://github.com/GilMarques/gym-genius-rn",
    code: "https://github.com/GilMarques/gym-genius-rn",
    types: [ProjectType.TypeScript, ProjectType.Angular],
    background: "#b9f8cf",
    oss: false,
  },
  {
    title: "Personal Portfolio",
    description: [
      "The very site you're scrolling through. A retro-inspired portfolio built with SolidJS and Tailwind, with a pixel-art aesthetic throughout.",
      "The sky shifts between day and night as the sun moves across the page, with animated clouds, rain, and snow changing to match. An animated cloud drifts in the background and reacts to scrolling.",
      "It pulls live weather data from the OpenWeather API so the sky reflects the actual time of day and current conditions in your location. A slider and buttons let you override everything manually.",
    ],
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
        <Tooltip text="React">
          <div
            class={`w-8 h-8 flex items-center justify-center rounded-full overflow-hidden bg-blue-200 `}
            style={{
              "border": "2px solid #61DAFB",
              "box-shadow": "-2px 2px 0 #61DAFB",
            }}
          >
            <img src={react} alt="React" class="w-6 h-6" />
          </div>
        </Tooltip>
      );
    case ProjectType.Angular:
      return (
        <Tooltip text="Angular">
          <div
            class={`w-8 h-8 flex items-center justify-center rounded-full overflow-hidden bg-pink-300 `}
            style={{
              "border": "2px solid #be185d",
              "box-shadow": "-2px 2px 0 #be185d",
            }}
          >
            <img src={angular} alt="Angular" class="w-6 h-6" />
          </div>
        </Tooltip>
      );
    case ProjectType.Python:
      return (
        <Tooltip text="Python">
          <div
            class={`w-8 h-8 flex items-center justify-center rounded-full overflow-hidden bg-yellow-200 `}
            style={{
              "border": "2px solid #eab308",
              "box-shadow": "-2px 2px 0 #eab308",
            }}
          >
            <img src={python} alt="Python" class="w-6 h-6" />
          </div>
        </Tooltip>
      );
    case ProjectType.TypeScript:
      return (
        <Tooltip text="TypeScript">
          <div
            class={`w-8 h-8 flex items-center justify-center rounded-full overflow-hidden `}
            style={{
              "background-color": "#3178C6",
              "border": "2px solid #1e3a8a",
              "box-shadow": "-2px 2px 0 #1e3a8a",
            }}
          >
            <img src={typescript} alt="Typescript" class="w-6 h-6" />
          </div>
        </Tooltip>
      );
    case ProjectType.SolidJS:
      return (
        <Tooltip text="SolidJS">
          <div
            class={`w-8 h-8 flex items-center justify-center rounded-full overflow-hidden`}
            style={{
              "background-color": "#5C95D4",
              "border": "2px solid #2C4F7C",
              "box-shadow": "-2px 2px 0 #2C4F7C",
            }}
          >
            <img src={solidjs} alt="SolidJS" class="w-6 h-6" />
          </div>
        </Tooltip>
      );
    default:
      return null;
  }
};

const SpeakerGrille = () => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="currentColor"
    class="text-black/30"
    style={{ "shape-rendering": "crispEdges" }}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Row 0 */}
    <rect x="12" y="0" width="3" height="3" />
    {/* Row 1 */}
    <rect x="8" y="4" width="3" height="3" />
    <rect x="12" y="4" width="3" height="3" />
    <rect x="16" y="4" width="3" height="3" />
    {/* Row 2 */}
    <rect x="4" y="8" width="3" height="3" />
    <rect x="8" y="8" width="3" height="3" />
    <rect x="12" y="8" width="3" height="3" />
    <rect x="16" y="8" width="3" height="3" />
    <rect x="20" y="8" width="3" height="3" />
    {/* Row 3 — right edge missing for organic feel */}
    <rect x="0" y="12" width="3" height="3" />
    <rect x="4" y="12" width="3" height="3" />
    <rect x="8" y="12" width="3" height="3" />
    <rect x="12" y="12" width="3" height="3" />
    <rect x="16" y="12" width="3" height="3" />
    <rect x="20" y="12" width="3" height="3" />
    <rect x="0" y="16" width="3" height="3" />
    <rect x="4" y="16" width="3" height="3" />
    <rect x="8" y="16" width="3" height="3" />
    <rect x="12" y="16" width="3" height="3" />
    <rect x="16" y="16" width="3" height="3" />
    <rect x="20" y="16" width="3" height="3" />
    {/* Row 5 — tapered */}
    <rect x="4" y="20" width="3" height="3" />
    <rect x="8" y="20" width="3" height="3" />
    <rect x="12" y="20" width="3" height="3" />
    <rect x="16" y="20" width="3" height="3" />
    {/* Row 6 — stray */}
    <rect x="12" y="24" width="3" height="3" />
  </svg>
);

const ConsoleButtons = () => (
  <div class="flex gap-1.5">
    <div
      class="w-5 h-2 bg-stone-700 border-2 border-stone-800"
      style={{ "box-shadow": "inset 0 -1px 0 rgba(0,0,0,0.4)" }}
    ></div>
    <div
      class="w-5 h-2 bg-stone-700 border-2 border-stone-800"
      style={{ "box-shadow": "inset 0 -1px 0 rgba(0,0,0,0.4)" }}
    ></div>
  </div>
);

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div class="flex flex-col gap-6 lg:gap-10 py-5 lg:py-8 w-full max-w-5xl">
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div class="self-center lg:self-center flex justify-center">
          <div class="relative hover:-translate-x-2 hover:-translate-y-5 hover:scale-105 hover:drop-shadow-xl w-full max-w-xs lg:w-fit">
            <a class="pixel-corners p-2 flex flex-col items-center" href={project.url}>
              <div
                class={`device-body pixel-corners aspect-[4/3] cursor-pointer flex flex-col w-full lg:aspect-3/4 lg:w-55 p-4 gap-2`}
                style={{ background: project.background }}
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  class="device-screen h-32 w-full object-cover lg:h-37.5"
                  style={{
                    border: "8px solid #000000",
                    "border-radius": "8px 8px 32px 8px",
                  }}
                  draggable="false"
                />
                <div class="w-full flex justify-between items-center lg:w-55 px-3 mt-auto">
                  {project.oss && (
                    <a
                      href={project.code}
                      class="bit-button font-custom text-sm rounded-full px-2 py-1 text-center"
                    >
                      &#x3c;&#x3e; Source
                    </a>
                  )}

                  {!project.oss && (
                    <a
                      href={project.code}
                      class="bit-button font-custom text-sm rounded-full px-2 py-1 text-center"
                    >
                      &#x3e; Page
                    </a>
                  )}

                  <div class="flex gap-2">
                    <For each={project.types}>
                      {(type, index) => (
                        <div
                          class={
                            project.types.length === 2
                              ? index() === 0
                                ? "translate-y-2"
                                : "-translate-y-1"
                              : ""
                          }
                        >
                          <ProjectIcon type={type} />
                        </div>
                      )}
                    </For>
                  </div>
                </div>
                <div class="w-full grid grid-cols-3 items-end">
                  <div />
                  <div class="flex justify-center">
                    <ConsoleButtons />
                  </div>
                  <div class="flex justify-end">
                    <SpeakerGrille />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="font-custom flex-1 min-w-0 flex flex-col gap-3">
          <For each={project.description}>
            {(para) => (
              <p class="text-base lg:text-xl leading-relaxed">{para}</p>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

const Projects = (props: { isDay: boolean }) => {
  return (
    <div class="px-4 lg:px-8">
      <div class={`font-custom ${props.isDay ? "text-black" : "text-white"}`}>
        <div class="flex flex-col items-center gap-6 lg:gap-4">
          <For each={projects}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </div>
      </div>
    </div>
  );
};

export default Projects;
