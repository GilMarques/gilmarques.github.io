import type { RefObject } from "react";
import { useLayoutEffect, useRef } from "react";
import { terrain, terrainSnow } from "../assets/sprites/terrain";
import { SUN_SIZE } from "./Sun";

const OCEAN_COLOR = 0x3994e6;
const PIXEL_DENSITY = 0.2;
const CANVAS_WIDTH = Math.round(350 * PIXEL_DENSITY);
const CANVAS_HEIGHT = Math.round(960 * PIXEL_DENSITY);
const MAX_CANVAS_CSS_HEIGHT = 600;
const HORIZON_Y = 0;
const REFLECTION_MIN_Y = 2;
const POINTER_MAX_Y = CANVAS_HEIGHT - 1;
const SOURCE_TOP_LIMIT_Y = HORIZON_Y - 70;
const SOURCE_MIN_Y = HORIZON_Y - 40;
const SOURCE_MAX_Y = HORIZON_Y + 2;

const REFLECTION = {
  sourceYOffset: 6,
  startYOffset: 3,
  rows: 32,
  extraRows: 30,
  rowStep: 2,
  minHalfWidth: 12,
  maxHalfWidth: 40,
  extraHalfWidth: 20,
  spreadCurve: 0.5,
  taper: 0.28,
  fade: 0.7,
  density: 0.78,
  sparkle: 0.22,
  pushDownMax: 16,
  pushDownCurve: 1.1,
  belowHorizonRange: 24,
  belowHorizonBrightnessFade: 0.75,
  belowHorizonWidthNarrow: 0.18,
} as const;

const MOTION = {
  speed: 1,
  driftX: 2.4,
  widthPulse: 0.2,
  densityPulse: 0.18,
  brightnessPulse: 0.12,
} as const;

/** Terrain tiles: one draw per 350px of canvas width (dest size / step from tuned drawImage). */
const TERRAIN_TILE_STEP_X = 350;
const TERRAIN_DEST_DX = 0;
const TERRAIN_DEST_DY = 60;
const TERRAIN_DEST_DW = 350;
const TERRAIN_DEST_DH = 160;

const Ocean = ({
  isDay,
  isSnow,
  sunRef,
  moonRef,
}: {
  isDay: boolean;
  isSnow: boolean;
  sunRef: RefObject<HTMLDivElement | null>;
  moonRef: RefObject<HTMLDivElement | null>;
}) => {
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
    const highlightRgb = isDay
      ? { r: 255, g: 246, b: 184 }
      : { r: 255, g: 255, b: 255 };
    const terrainDayImage = new Image();
    terrainDayImage.src = terrain;
    const terrainSnowImage = new Image();
    terrainSnowImage.src = terrainSnow;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const mixColor = (
      from: { r: number; g: number; b: number },
      to: { r: number; g: number; b: number },
      t: number
    ) =>
      `rgb(${Math.round(lerp(from.r, to.r, t))},${Math.round(
        lerp(from.g, to.g, t)
      )},${Math.round(lerp(from.b, to.b, t))})`;

    const hash2d = (x: number, y: number) => {
      const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };

    const layeredNoise = (row: number, timeMs: number) => {
      const t = timeMs * 0.001 * MOTION.speed;
      const n1 = Math.sin(row * 0.28 + t * 1.3);
      const n2 = Math.sin(row * 0.11 - t * 0.8);
      const n3 = Math.sin(row * 0.47 + t * 0.45);
      // normalize to [-1, 1]
      return (n1 + n2 * 0.65 + n3 * 0.35) / 2;
    };

    const getHeightSpread = (sourceY: number) => {
      const span = SOURCE_MAX_Y - SOURCE_MIN_Y;
      const clampedY = Math.min(SOURCE_MAX_Y, Math.max(SOURCE_MIN_Y, sourceY));
      return span <= 0 ? 0 : (clampedY - SOURCE_MIN_Y) / span;
    };

    const getPushDownByHeight = (sourceY: number) => {
      if (sourceY >= SOURCE_MIN_Y) return 0;
      const span = SOURCE_MIN_Y - SOURCE_TOP_LIMIT_Y;
      if (span <= 0) return 0;
      const t = Math.max(0, (SOURCE_MIN_Y - sourceY) / span);
      return REFLECTION.pushDownMax * Math.pow(t, REFLECTION.pushDownCurve);
    };

    const drawReflection = (
      cx: number,
      spreadByHeight: number,
      pushDownByHeight: number,
      belowHorizonFade: number,
      belowHorizonWidthScale: number,
      timeMs: number
    ) => {
      const dynamicRows = Math.round(
        REFLECTION.rows + REFLECTION.extraRows * spreadByHeight
      );
      const maxWidth =
        (REFLECTION.maxHalfWidth + REFLECTION.extraHalfWidth * spreadByHeight) *
        belowHorizonWidthScale;
      const dynamicFade = Math.max(
        0.35,
        REFLECTION.fade - 0.18 * spreadByHeight
      );

      for (let row = 0; row < dynamicRows; row += 1) {
        const t = row / Math.max(1, dynamicRows - 1);
        const driftNoise = layeredNoise(row, timeMs);
        const pulseNoise = layeredNoise(row + 37, timeMs * 0.75);
        const centerX = cx + driftNoise * MOTION.driftX * (0.3 + 0.7 * t);
        const y = Math.max(
          REFLECTION_MIN_Y,
          HORIZON_Y +
            REFLECTION.startYOffset +
            pushDownByHeight +
            row * REFLECTION.rowStep
        );
        if (y >= canvas.height) break;

        const spreadT = Math.pow(t, REFLECTION.spreadCurve);
        const halfWidth =
          REFLECTION.minHalfWidth +
          (maxWidth - REFLECTION.minHalfWidth) * spreadT;
        const taperedHalfWidth = Math.max(
          1,
          halfWidth * (1 - REFLECTION.taper * t)
        );

        const animatedHalfWidth = Math.max(
          1,
          taperedHalfWidth * (1 + MOTION.widthPulse * pulseNoise * (0.2 + t))
        );
        const brightness = Math.max(
          0.12,
          (1 - dynamicFade * t) *
            (1 + MOTION.brightnessPulse * pulseNoise * (0.4 + 0.6 * t)) *
            belowHorizonFade
        );
        const rowDensityScale = 1 + MOTION.densityPulse * driftNoise;

        for (
          let x = -Math.ceil(animatedHalfWidth);
          x <= Math.ceil(animatedHalfWidth);
          x += 1
        ) {
          const nx = Math.abs(x) / animatedHalfWidth;
          if (nx > 1) continue;

          const core = 1 - nx;
          const edgeDistance = Math.min(1, Math.sqrt(nx * nx + t * t));
          const distanceFade = Math.max(0, 1 - edgeDistance);
          const probability =
            REFLECTION.density *
              rowDensityScale *
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
          ctx.fillRect(Math.round(centerX + x), Math.round(y), 1, 1);
        }
      }
    };

    const drawTerrain = () => {
      const img = isSnow ? terrainSnowImage : terrainDayImage;
      if (!img.complete || img.naturalWidth <= 0 || img.naturalHeight <= 0) {
        return;
      }

      ctx.imageSmoothingEnabled = false;

      const sx = 0;
      const sy = 0;
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;

      const tileCount = Math.ceil(canvas.width / TERRAIN_TILE_STEP_X) + 1;

      for (let i = 0; i < tileCount; i += 1) {
        const dx = i * TERRAIN_TILE_STEP_X;
        ctx.drawImage(
          img,
          sx,
          sy,
          sw,
          sh,
          dx + TERRAIN_DEST_DX,
          TERRAIN_DEST_DY,
          TERRAIN_DEST_DW,
          TERRAIN_DEST_DH
        );
      }
    };

    const draw = (timeMs: number) => {
      ctx.fillStyle = oceanHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, HORIZON_Y, canvas.width, 2);

      const spreadByHeight = getHeightSpread(py);
      const pushDownByHeight = getPushDownByHeight(py);
      const belowHorizonDistance = Math.max(0, py - HORIZON_Y);
      const belowHorizonT = Math.min(
        1,
        belowHorizonDistance / REFLECTION.belowHorizonRange
      );
      const belowHorizonFade =
        1 - belowHorizonT * REFLECTION.belowHorizonBrightnessFade;
      const belowHorizonWidthScale =
        1 - belowHorizonT * REFLECTION.belowHorizonWidthNarrow;
      drawReflection(
        px,
        spreadByHeight,
        pushDownByHeight,
        belowHorizonFade,
        belowHorizonWidthScale,
        timeMs
      );
      drawTerrain();
    };

    const viewportToCanvas = (x: number, y: number) => {
      const r = canvas.getBoundingClientRect();
      const sx = canvas.width / r.width;
      const sy = canvas.height / r.height;
      return {
        x: (x - r.left) * sx,
        y: (y - r.top) * sy,
      };
    };

    const getBodyCanvasPosition = () => {
      const target = isDay ? sunRef.current : moonRef.current;
      if (!target) return null;
      const rect = target.getBoundingClientRect();
      return viewportToCanvas(
        rect.left + rect.width * 0.5,
        rect.top + rect.height * 0.5 - SUN_SIZE
      );
    };

    function resizeCanvas() {
      const cssWidth = Math.max(1, Math.floor(window.innerWidth));
      const cssHeight = Math.max(
        1,
        Math.floor(Math.min(window.innerHeight, MAX_CANVAS_CSS_HEIGHT))
      );
      const uniformScale = cssHeight / CANVAS_HEIGHT;
      const renderWidth = Math.max(
        CANVAS_WIDTH,
        Math.round(cssWidth / Math.max(0.001, uniformScale))
      );

      if (canvas!.width !== renderWidth || canvas!.height !== CANVAS_HEIGHT) {
        canvas!.width = renderWidth;
        canvas!.height = CANVAS_HEIGHT;
        ctx.imageSmoothingEnabled = false;
      }

      canvas!.style.width = `${cssWidth}px`;
      canvas!.style.height = `${cssHeight}px`;
    }

    resizeCanvas();
    let rafId = 0;
    const frame = (timeMs: number) => {
      const mapped = getBodyCanvasPosition();
      if (mapped) {
        px = Math.min(canvas.width - 1, Math.max(0, mapped.x));
        py = Math.min(POINTER_MAX_Y, mapped.y);
      } else {
        px = canvas.width * 0.5;
        py = HORIZON_Y - REFLECTION.sourceYOffset;
      }

      draw(timeMs);
      rafId = window.requestAnimationFrame(frame);
    };
    rafId = window.requestAnimationFrame(frame);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isDay, isSnow, moonRef, sunRef]);

  return (
    <div
      className="flex w-screen items-center justify-center overflow-hidden bg-black"
      style={{
        height: `min(100vh, ${MAX_CANVAS_CSS_HEIGHT}px)`,
        mixBlendMode: "multiply",
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
