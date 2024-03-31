import { SimpleRope, Sprite, useApp, useTick } from "@pixi/react";
import { Point } from "pixi.js";
import { useMemo, useRef, useState } from "react";
import { cloud, tail } from "../assets/index.js";
const MovingCloud = () => {
  const ref = useRef(null);
  const t = useRef(0);
  const ropeLength = useRef(60);
  const app = useApp();
  const x0 = app.screen.width / 2;
  const y0 = 300;

  const initialPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 10; i++)
      points.push(new Point(-i * ropeLength.current, 0));
    return points;
  }, []);

  const [points, setPoints] = useState(initialPoints);
  const scrollY = useRef(window.scrollY);
  const instantaneousRate = useRef(0);
  const rateOfChange = useRef(0);
  const smoothingFactor = 0.005;

  useTick((deltaTime) => {
    const newScrollY = window.scrollY;
    const delta = newScrollY - scrollY.current;

    // Calculate instantaneous rate of change
    instantaneousRate.current = Math.abs(delta) / deltaTime;

    // Exponential smoothing
    rateOfChange.current =
      smoothingFactor * instantaneousRate.current +
      (1 - smoothingFactor) * rateOfChange.current;
    scrollY.current = newScrollY;

    ropeLength.current = 60 + rateOfChange.current * 10;

    const iter = (t.current += 0.1 * deltaTime);

    if (ref.current) {
      ref.current.y = (2 / (rateOfChange.current + 1)) * Math.sin(-iter) + y0;
    }

    const np = [...points];

    for (let j = 0; j < np.length; j++) {
      np[j].y = Math.sin(-iter + (j * Math.PI) / 2) * (0.3 * j);
      np[j].x = -j * ropeLength.current;
    }

    setPoints(np);
  });

  return (
    <>
      <SimpleRope
        image={tail}
        anchor={{ x: 0, y: -1 }}
        scale={{ x: 1, y: -1 }}
        points={points}
        x={x0 + 110}
        y={y0 + 46}
      />
      <Sprite ref={ref} x={x0} y={y0} image={cloud} />
    </>
  );
};

export default MovingCloud;
