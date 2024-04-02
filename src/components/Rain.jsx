import { useRef } from "react";
//https://codepen.io/arickle/pen/XKjMZY
const Rain = () => {
  const ref = useRef(null);

  var increment = 0;
  var drops = [];

  while (increment < 100) {
    //couple random numbers to use for various randomizations
    //random number between 98 and 1
    var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    //random number between 5 and 2
    var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    //increment
    increment += randoFiver;
    //add in a new raindrop with various randomizations to certain CSS properties
    drops.push({ increment, randoFiver, randoHundo });
    // '<div class="drop" style="left: ' +
  }

  return (
    <div
      ref={ref}
      className="rain pointer-events-none fixed top-0 min-h-full min-w-full"
    >
      {drops.map((drop) => (
        <div
          key={drop.increment}
          className="drop"
          style={{
            left: `${drop.increment}%`,
            bottom: `${drop.randoFiver + 90}%`,
            animationDelay: `0.${drop.randoHundo}s`,
            animationDuration: `0.5${drop.randoHundo}s`,
          }}
        >
          <div
            className="stem"
            style={{
              animationDelay: `0.${drop.randoHundo}s`,
              animationDuration: `0.5${drop.randoHundo}s`,
            }}
          ></div>
          <div
            className="splat"
            style={{
              animationDelay: `0.${drop.randoHundo}s`,
              animationDuration: `0.5${drop.randoHundo}s`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Rain;
