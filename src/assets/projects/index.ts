import gymgenius from "./gymgenius.png";
import inouno from "./inouno.png";
import portfolio from "./portfolio.png";
import radiostation from "./radiostation.png";

const projects = [
  {
    title: "Radio Station",
    description:
      "App that lets you explore radio stations around the world using an interactive map",
    thumbnail: radiostation,
    url: "https://gilmarques.github.io/radio-station/",
    code: "https://github.com/GilMarques/radio-station",
  },
  {
    title: "Ino Uno",
    description: "A clone of the popular game UNO (server is down)",
    thumbnail: inouno,
    url: "https://gilmarques.github.io/ino-uno-vite/",
    code: "https://github.com/GilMarques/ino-uno-vite",
  },
  {
    title: "GG",
    description: "A Workout Log (Under Development)",
    thumbnail: gymgenius,
    url: "https://github.com/GilMarques/gym-genius-rn",
    code: "https://github.com/GilMarques/gym-genius-rn",
  },
  {
    title: "Personal Portfolio",
    description: "Retro Style Portfolio",
    thumbnail: portfolio,
    url: "https://gilmarques.github.io/",
    code: "https://github.com/GilMarques/portfolio",
  },
];

export { gymgenius, inouno, portfolio, projects, radiostation };
