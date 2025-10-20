import cloud0 from "./clouds/sprite_0.png";
import cloud1 from "./clouds/sprite_1.png";

import cloud2 from "./clouds/sprite_2.png";
import cloud3 from "./clouds/sprite_3.png";
import cloud4 from "./clouds/sprite_4.png";
import cloud5 from "./clouds/sprite_5.png";
import cloud6 from "./clouds/sprite_6.png";
import cloud7 from "./clouds/sprite_7.png";

import nightcloud0 from "./clouds_night/sprite_0.png";
import nightcloud1 from "./clouds_night/sprite_1.png";
import nightcloud2 from "./clouds_night/sprite_2.png";
import nightcloud3 from "./clouds_night/sprite_3.png";
import nightcloud4 from "./clouds_night/sprite_4.png";
import nightcloud5 from "./clouds_night/sprite_5.png";
import nightcloud6 from "./clouds_night/sprite_6.png";
import nightcloud7 from "./clouds_night/sprite_7.png";

import raincloud0 from "./clouds_rain/sprite_0.png";
import raincloud1 from "./clouds_rain/sprite_1.png";
import raincloud2 from "./clouds_rain/sprite_2.png";
import raincloud3 from "./clouds_rain/sprite_3.png";
import raincloud4 from "./clouds_rain/sprite_4.png";
import raincloud5 from "./clouds_rain/sprite_5.png";
import raincloud6 from "./clouds_rain/sprite_6.png";
import raincloud7 from "./clouds_rain/sprite_7.png";

import graycloud0 from "./clouds_grayscale/sprite_0.png";
import graycloud1 from "./clouds_grayscale/sprite_1.png";
import graycloud2 from "./clouds_grayscale/sprite_2.png";
import graycloud3 from "./clouds_grayscale/sprite_3.png";
import graycloud4 from "./clouds_grayscale/sprite_4.png";
import graycloud5 from "./clouds_grayscale/sprite_5.png";
import graycloud6 from "./clouds_grayscale/sprite_6.png";
import graycloud7 from "./clouds_grayscale/sprite_7.png";

const clouds = [cloud0, cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7];

const nightclouds = [
  nightcloud0,
  nightcloud1,
  nightcloud2,
  nightcloud3,
  nightcloud4,
  nightcloud5,
  nightcloud6,
  nightcloud7,
];

const rainclouds = [
  raincloud0,
  raincloud1,
  raincloud2,
  raincloud3,
  raincloud4,
  raincloud5,
  raincloud6,
  raincloud7,
];

const grayclouds = [
  graycloud0,
  graycloud1,
  graycloud2,
  graycloud3,
  graycloud4,
  graycloud5,
  graycloud6,
  graycloud7,
];

import tail from "./tail.png";

// index.js

import terrain0 from "./terrain.png";

const terrain = [terrain0];

import gymgenius from "./projects/gymgenius.png";
import inouno from "./projects/inouno.png";
import portfolio from "./projects/portfolio.png";
import radiostation from "./projects/radiostation.png";
const projects = [
  {
    title: "Radio Station",
    description:
      "App that lets you explore radio stations around the world using an interactive map. It pulls data from the radio-browser.info API.",
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
    title: "Gym Genius",
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

import starry_sky from "./starry_sky.gif";

import button0 from "./button/0.png";
import button1 from "./button/1.png";

import cloud from "./cloud.png";

const button = [button0, button1];

export {
  button,
  cloud,
  clouds,
  grayclouds,
  nightclouds,
  projects,
  rainclouds,
  starry_sky,
  tail,
  terrain,
};
