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

import cloud from "./cloud.png";
import moon from "./moon.png";
import tail from "./tail.png";

// index.js

import terraingif from "./terrain.gif";
import terrain0 from "./terrain.png";

const terrain = [terrain0];

import blinkingstar0 from "./blinking_star/frame0.png";
import blinkingstar1 from "./blinking_star/frame1.png";
const blinking_star = [blinkingstar0, blinkingstar1];

import ocean from "./ocean.png";

import c from "./technologies/c.png";
import css from "./technologies/css.png";
import html from "./technologies/html.png";
import java from "./technologies/java.png";
import javascript from "./technologies/javascript.png";
import python from "./technologies/python.png";
import react from "./technologies/react.png";
const technologies = [
  {
    name: "HTML",
    src: html,
  },
  { name: "CSS", src: css },
  { name: "JavaScript", src: javascript },
  { name: "React", src: react },
  { name: "Python", src: python },
  { name: "Java", src: java },
  { name: "C", src: c },
];

import orb from "./orb.png";

import gymgenius from "./projects/gymgenius.png";
import inouno from "./projects/inouno.png";
import portfolio from "./projects/portfolio.png";
const projects = [
  {
    title: "Ino Uno",
    description: "A clone of the popular game UNO",
    thumbnail: inouno,
    url: "https://gilmarques.github.io/ino-uno-vite/",
    code: "https://github.com/GilMarques/ino-uno-vite",
  },

  {
    title: "Personal Portfolio",
    description: "Retro Style Portfolio",
    thumbnail: portfolio,
    url: "https://gilmarques.github.io/",
    code: "https://github.com/GilMarques/portfolio",
  },

  {
    title: "Gym Genius",
    description: "A Workout Log",
    thumbnail: gymgenius,
    url: "https://github.com/GilMarques/gym-genius-rn",
    code: "https://github.com/GilMarques/gym-genius-rn",
  },
];

import email from "./logos/email.png";
import github from "./logos/github.png";
import linkedin from "./logos/linkedin.png";

const social = [
  { name: "Email", src: email, link: "mailto:gilmmm4@gmail.com" },
  { name: "GitHub", src: github, link: "https://github.com/GilMarques" },
  {
    name: "Linkedin",
    src: linkedin,
    link: "https://www.linkedin.com/in/gil-marques-ab86a524b/",
  },
];

import sky from "./sky.gif";

import button0 from "./button/0.png";
import button1 from "./button/1.png";

const button = [button0, button1];

import day from "./day_logos/day.png";
import night from "./day_logos/night.png";
import sunrise from "./day_logos/sunrise.png";
import sunset from "./day_logos/sunset.png";

const dayLogos = [
  { name: "sunrise", src: sunrise },
  { name: "day", src: day },
  { name: "sunset", src: sunset },
  { name: "night", src: night },
];

import clear from "./weather_logos/clear.png";
import rain from "./weather_logos/rain.png";
import snow from "./weather_logos/snow.png";

const weatherLogos = [
  { name: "cloudy", src: clear },
  { name: "rain", src: rain },
  { name: "snow", src: snow },
];

import source from "./source.png";

export {
  blinking_star,
  button,
  cloud,
  clouds,
  dayLogos,
  grayclouds,
  moon,
  nightclouds,
  ocean,
  orb,
  projects,
  rainclouds,
  sky,
  social,
  source,
  tail,
  technologies,
  terrain,
  terraingif,
  weatherLogos,
};
