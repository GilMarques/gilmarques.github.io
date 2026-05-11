import { useLayoutEffect, useRef } from "react";

const OCEAN_COLOR = 0x3994e6;
const REFLECTION_CORE_COLOR = "#fff6b8";
const CANVAS_WIDTH = 90;
const CANVAS_HEIGHT = 180;
const HORIZON_Y = 60;
const SOURCE_MIN_Y = HORIZON_Y - 40;
const SOURCE_MAX_Y = HORIZON_Y + 2;

const REFLECTION = {
  sourceRadius: 7,
  sourceYOffset: 6,
  startYOffset: 3,
  rows: 32,
  extraRows: 30,
  rowStep: 2,
  minHalfWidth: 2,
  maxHalfWidth: 40,
  extraHalfWidth: 32,
  spreadCurve: 0.5,
  taper: 0.28,
  fade: 0.7,
  density: 0.78,
  sparkle: 0.22,
} as const;

const Ocean = ({ isDay }: { isDay: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    canvas.style.imageRendering = "pixelated";
    canvas.style.display = "block";

    let px = canvas.width * 0.5;
    let py = HORIZON_Y - REFLECTION.sourceYOffset;

    const oceanHex = `#${OCEAN_COLOR.toString(16)}`;
    const oceanRgb = {
      r: (OCEAN_COLOR >> 16) & 0xff,
      g: (OCEAN_COLOR >> 8) & 0xff,
      b: OCEAN_COLOR & 0xff,
    };
    const highlightRgb = { r: 255, g: 246, b: 184 };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const mixColor = (
      from: { r: number; g: number; b: number },
      to: { r: number; g: number; b: number },
      t: number
    ) =>
      `rgb(${Math.round(lerp(from.r, to.r, t))},${Math.round(
        lerp(from.g, to.g, t)
      )},${Math.round(lerp(from.b, to.b, t))})`;

    function drawPixelDisk(
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      color: string
    ) {
      const x0 = Math.round(cx);
      const y0 = Math.round(cy);
      const r = Math.max(1, Math.round(radius));
      const r2 = r * r;

      ctx.fillStyle = color;

      for (let y = -r; y <= r; y += 1) {
        for (let x = -r; x <= r; x += 1) {
          if (x * x + y * y <= r2) {
            ctx.fillRect(x0 + x, y0 + y, 1, 1);
          }
        }
      }
    }

    const hash2d = (x: number, y: number) => {
      const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };

    const getHeightSpread = (sourceY: number) => {
      const span = SOURCE_MAX_Y - SOURCE_MIN_Y;
      const clampedY = Math.min(SOURCE_MAX_Y, Math.max(SOURCE_MIN_Y, sourceY));
      return span <= 0 ? 0 : (clampedY - SOURCE_MIN_Y) / span;
    };

    const drawReflection = (cx: number, spreadByHeight: number) => {
      const dynamicRows = Math.round(
        REFLECTION.rows + REFLECTION.extraRows * spreadByHeight
      );
      const maxWidth =
        REFLECTION.maxHalfWidth + REFLECTION.extraHalfWidth * spreadByHeight;
      const dynamicFade = Math.max(
        0.35,
        REFLECTION.fade - 0.18 * spreadByHeight
      );

      for (let row = 0; row < dynamicRows; row += 1) {
        const t = row / Math.max(1, dynamicRows - 1);
        const y =
          HORIZON_Y + REFLECTION.startYOffset + row * REFLECTION.rowStep;
        if (y >= canvas.height) break;

        const spreadT = Math.pow(t, REFLECTION.spreadCurve);
        const halfWidth =
          REFLECTION.minHalfWidth +
          (maxWidth - REFLECTION.minHalfWidth) * spreadT;
        const taperedHalfWidth = Math.max(
          1,
          halfWidth * (1 - REFLECTION.taper * t)
        );

        const brightness = Math.max(0.12, 1 - dynamicFade * t);

        for (
          let x = -Math.ceil(taperedHalfWidth);
          x <= Math.ceil(taperedHalfWidth);
          x += 1
        ) {
          const nx = Math.abs(x) / taperedHalfWidth;
          if (nx > 1) continue;

          const core = 1 - nx;
          const edgeDistance = Math.min(1, Math.sqrt(nx * nx + t * t));
          const distanceFade = Math.max(0, 1 - edgeDistance);
          const probability =
            REFLECTION.density *
              core *
              brightness *
              (0.55 + 0.45 * distanceFade) +
            hash2d(x + row * 3, y) * REFLECTION.sparkle;

          if (probability < 0.35) continue;

          const sparkleMix = hash2d(x + y, row * 17) > 0.75 ? 0.12 : 0;
          const colorMix = Math.max(
            0.05,
            brightness * distanceFade + sparkleMix
          );
          ctx.fillStyle = mixColor(oceanRgb, highlightRgb, colorMix);
          ctx.fillRect(Math.round(cx + x), Math.round(y), 1, 1);
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = oceanHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, HORIZON_Y, canvas.width, 1);

      drawPixelDisk(
        ctx,
        px,
        py,
        REFLECTION.sourceRadius,
        REFLECTION_CORE_COLOR
      );
      const spreadByHeight = getHeightSpread(py);
      drawReflection(px, spreadByHeight);
    };

    const pointerToCanvas = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const sx = canvas.width / r.width;
      const sy = canvas.height / r.height;
      return {
        x: (e.clientX - r.left) * sx,
        y: (e.clientY - r.top) * sy,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = pointerToCanvas(e);
      px = x;
      py = Math.min(SOURCE_MAX_Y, Math.max(SOURCE_MIN_Y, y));
      draw();
    };

    const onPointerLeave = () => {
      px = canvas.width * 0.5;
      py = HORIZON_Y - REFLECTION.sourceYOffset;
      draw();
    };

    function resizeCanvas() {
      let scale = Math.min(
        window.innerWidth / canvas!.width,
        window.innerHeight / canvas!.height
      );

      scale = Math.floor(scale);

      canvas!.style.width = `${Math.round(scale * canvas!.width)}px`;
      canvas!.style.height = `${Math.round(scale * canvas!.height)}px`;
    }

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      className="flex h-screen w-screen items-center justify-center overflow-hidden bg-black"
      style={{
        filter: isDay ? "none" : "brightness(0.6)",
      }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="pointer-events-auto block"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

export default Ocean;
