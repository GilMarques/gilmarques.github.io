import { Stage } from "@pixi/react";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SimpleRope, Sprite, useApp, useTick } from "@pixi/react";
import { Point } from "pixi.js";
import { nimbus, tail } from "../assets/sprites/nimbus";

const ROPE_SEGMENT = 60;
const REPEL_STRENGTH = 4200;
const REPEL_SOFT = 90;
const MAX_REPEL_OFFSET = 140;
const SMOOTH = 0.12;
/** Stage pixels: repulsion only when cursor is within this distance of the cloud. */
const INTERACTION_RADIUS = 260;
const BOUNCE_KICK = -38;
const BOUNCE_SPRING = 0.52;
const BOUNCE_DRAG = 0.34;

type MouseNormRef = MutableRefObject<{ nx: number; ny: number } | null>;

const MovingCloud = ({ mouseNormRef }: { mouseNormRef: MouseNormRef }) => {
  const cloudRef = useRef<any>(null);
  const ropeRef = useRef<any>(null);
  const t = useRef(0);
  const bounceY = useRef(0);
  const bounceVel = useRef(0);
  const app = useApp();
  const x0 = app.screen.width / 2;
  const y0 = 300;

  const onCloudPointerTap = useCallback(() => {
    bounceVel.current += BOUNCE_KICK;
  }, []);

  const initialPoints = useMemo(() => {
    const points: Point[] = [];
    for (let i = 0; i < 10; i++) points.push(new Point(-i * ROPE_SEGMENT, 0));
    return points;
  }, []);

  const [points, setPoints] = useState<Point[]>(initialPoints);

  const dispX = useRef(0);
  const dispY = useRef(0);

  useTick((deltaTime) => {
    const m = mouseNormRef.current;
    const iter = (t.current += 0.1 * deltaTime);
    const bob = 2 * Math.sin(-iter);

    const decay = () => {
      dispX.current *= 0.94;
      dispY.current *= 0.94;
    };

    if (!m) {
      decay();
    } else {
      const mx = m.nx * app.screen.width;
      const my = m.ny * app.screen.height;

      const px = x0 + dispX.current;
      const py = y0 + dispY.current;

      const distToCloud = Math.hypot(mx - px, my - py);

      if (distToCloud > INTERACTION_RADIUS) {
        decay();
      } else {
        let dx = px - mx;
        let dy = py - my;
        let dist = Math.hypot(dx, dy);
        if (dist < 1e-4) {
          dx = 1;
          dy = 0;
          dist = 1;
        }

        const edge =
          distToCloud > 1e-6
            ? Math.min(1, 1 - distToCloud / INTERACTION_RADIUS)
            : 1;

        const inv = (REPEL_STRENGTH / (dist + REPEL_SOFT)) * edge * edge;
        const tx = (dx / dist) * Math.min(inv, MAX_REPEL_OFFSET);
        const ty = (dy / dist) * Math.min(inv, MAX_REPEL_OFFSET);

        dispX.current += (tx - dispX.current) * SMOOTH * deltaTime;
        dispY.current += (ty - dispY.current) * SMOOTH * deltaTime;
      }
    }

    const bx = dispX.current;
    const by = dispY.current;

    bounceVel.current +=
      (-bounceY.current * BOUNCE_SPRING - bounceVel.current * BOUNCE_DRAG) *
      deltaTime;
    bounceY.current += bounceVel.current * deltaTime;

    const byB = bounceY.current;

    if (cloudRef.current) {
      cloudRef.current.x = x0 + bx;
      cloudRef.current.y = y0 + bob + by + byB;
    }

    if (ropeRef.current) {
      ropeRef.current.x = x0 + 110 + bx;
      ropeRef.current.y = y0 + 46 + bob + by + byB;
    }

    setPoints((prev) => {
      const np = [...prev];
      for (let j = 0; j < np.length; j++) {
        np[j].y = Math.sin(-iter + (j * Math.PI) / 2) * (0.3 * j);
        np[j].x = -j * ROPE_SEGMENT;
      }
      return np;
    });
  });

  return (
    <>
      <SimpleRope
        ref={ropeRef}
        image={tail}
        anchor={{ x: 0, y: -1 }}
        scale={{ x: 1, y: -1 }}
        /* @ts-expect-error Pixi rope points type */
        points={points}
        x={x0 + 110}
        y={y0 + 46}
      />
      <Sprite
        ref={cloudRef}
        x={x0}
        y={y0}
        image={nimbus}
        interactive={true}
        cursor="pointer"
        pointertap={onCloudPointerTap}
      />
    </>
  );
};

const Canvas = ({ day }: { day: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const mouseNormRef = useRef<{ nx: number; ny: number } | null>(null);

  const handleResize = () => {
    if (!containerRef.current || !stageRef.current) return;

    const parent = stageRef.current.app.view.parentNode;
    stageRef.current.app.renderer.resize(
      parent.clientWidth,
      parent.clientHeight
    );
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const setFromEvent = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      mouseNormRef.current = {
        nx: (e.clientX - r.left) / r.width,
        ny: (e.clientY - r.top) / r.height,
      };
    };

    const clear = () => {
      mouseNormRef.current = null;
    };

    el.addEventListener("pointermove", setFromEvent, { passive: true });
    el.addEventListener("pointerleave", clear);
    el.addEventListener("pointercancel", clear);

    return () => {
      el.removeEventListener("pointermove", setFromEvent);
      el.removeEventListener("pointerleave", clear);
      el.removeEventListener("pointercancel", clear);
    };
  }, []);

  return (
    <div
      className="pointer-events-auto"
      ref={containerRef}
      style={{ filter: day ? "none" : "brightness(0.6)" }}
    >
      <Stage
        options={{ antialias: true, backgroundAlpha: 0 }}
        ref={stageRef}
        className="m-auto w-full"
      >
        <MovingCloud mouseNormRef={mouseNormRef} />
      </Stage>
    </div>
  );
};

export default Canvas;
