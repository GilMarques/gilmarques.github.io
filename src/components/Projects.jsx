import { projects } from "../assets";

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
          <div className="pixel-corners mb-2 p-1">
            <img
              src={thumbnail}
              alt="Project thumbnail"
              className="pixel-corners rounded-lg border-[5px] border-black"
              width={200}
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
      <p className="text-md mt-16 scroll-mt-16 font-custom text-3xl font-black text-white underline">
        My Work
      </p>
      <div className="text-md font-custom text-3xl text-white" id="projects">
        <p className="mb-8">Check out my projects</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Project
            title={"Ino Uno"}
            description={"A clone of the popular game UNO"}
            thumbnail={projects[0]}
            url={"https://gilmarques.github.io/ino-uno-vite/"}
          />
          <Project
            title={"Ino Uno"}
            description={"A clone of the popular game UNO"}
            thumbnail={projects[0]}
            url={"https://gilmarques.github.io/ino-uno-vite/"}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
