import Konva from "konva";
import { createEffect, onCleanup, onMount } from "solid-js";
import { nimbus } from "../assets/sprites";

const CLOUD_CENTER_Y = 300;
const TAIL_POINTS_COUNT = 60;

// Idle Y bob: very long period, low amplitude.
const Y_BOB_PERIOD_MS = 45_000;
const Y_BOB_AMPLITUDE = 12;

// Scroll-driven Y nudge: impulse → decaying offset that pulls the cloud off
// the sine baseline, then springs back.
const SCROLL_WHEEL_GAIN = 0.05;
const SCROLL_TOUCH_GAIN = 0.15;
const SCROLL_OFFSET_DAMPING = 0.95;
const SCROLL_OFFSET_MAX = 120;

class CloudScene {
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private anim!: Konva.Animation;
  private cloudSprite!: Konva.Image;
  private tailLine!: Konva.Line;
  private tailPoints: { x: number; y: number }[] = [];
  private cloudHistory: { x: number; y: number }[] = [];

  // Cloud is stationary in X. Y is the only moving axis.
  private cloudX = 0;
  private cloudY = CLOUD_CENTER_Y;
  private scrollOffsetY = 0; // Y offset from scroll, decays back to 0
  private elapsedMs = 0; // accumulated frame deltas, drives the idle sine

  // Scroll input — accumulated per frame, applied then reset.
  private scrollImpulse = 0;
  private lastTouchY: number | null = null;

  // Cleanup refs.
  private wheelHandler?: (e: WheelEvent) => void;
  private touchStartHandler?: (e: TouchEvent) => void;
  private touchMoveHandler?: (e: TouchEvent) => void;
  private touchEndHandler?: (e: TouchEvent) => void;

  private getRopeSegment(): number {
    const maxDim = Math.max(
      this.stage?.width() ?? 800,
      this.stage?.height() ?? 600,
    );
    return Math.max(maxDim * 0.15, 100);
  }

  constructor(private containerRef: HTMLDivElement) {}

  async init() {
    const rect = this.containerRef.getBoundingClientRect();
    this.stage = new Konva.Stage({
      container: this.containerRef,
      width: rect.width || 800,
      height: rect.height || 600,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    await this.createTail();
    await this.createCloud();

    // Stationary X, centered. Y starts at the sine baseline.
    this.cloudX = this.stage.width() / 2;
    this.cloudY = CLOUD_CENTER_Y;
    // Seed history at the current position so the tail starts as a point.
    this.cloudHistory = Array.from({ length: TAIL_POINTS_COUNT }, () => ({
      x: this.cloudX,
      y: this.cloudY,
    }));
    this.cloudSprite.x(this.cloudX);
    this.cloudSprite.y(this.cloudY);

    this.anim = new Konva.Animation((frame) => {
      if (!this.cloudSprite || !this.tailLine) return;

      // Y: long-period sine bob + scroll-driven offset that decays back.
      // NOTE: frame.time in Konva is Date.now() (Unix timestamp), not elapsed
      // time. Using it directly loses precision in Math.sin. Accumulate
      // frame.timeDiff (per-frame delta) instead.
      this.elapsedMs += frame.timeDiff;
      const phase = (this.elapsedMs * 2 * Math.PI) / Y_BOB_PERIOD_MS;
      const bob = Math.sin(phase) * Y_BOB_AMPLITUDE;

      this.scrollOffsetY += this.scrollImpulse;
      this.scrollImpulse = 0;
      this.scrollOffsetY *= SCROLL_OFFSET_DAMPING;
      if (this.scrollOffsetY > SCROLL_OFFSET_MAX)
        this.scrollOffsetY = SCROLL_OFFSET_MAX;
      if (this.scrollOffsetY < -SCROLL_OFFSET_MAX)
        this.scrollOffsetY = -SCROLL_OFFSET_MAX;

      this.cloudY = CLOUD_CENTER_Y + bob + this.scrollOffsetY;

      this.cloudSprite.x(this.cloudX);
      this.cloudSprite.y(this.cloudY);

      // Tail history (unchanged from original — left as future work).
      this.cloudHistory.unshift({ x: this.cloudX, y: this.cloudY });
      if (this.cloudHistory.length > TAIL_POINTS_COUNT) {
        this.cloudHistory.pop();
      }
      for (let i = 0; i < this.tailPoints.length; i++) {
        this.tailPoints[i].x =
          this.cloudHistory[i].x - i * 0.2 * this.getRopeSegment();
        this.tailPoints[i].y = this.cloudHistory[i].y;
      }
      this.tailLine.points(this.tailPoints.flatMap((p) => [p.x, p.y]));
      this.tailLine.position({ x: 0, y: 0 });
    }, this.layer);

    this.anim.start();
    this.bindScrollInputs();

    const resizeObserver = new ResizeObserver(() => this.handleResize());
    resizeObserver.observe(this.containerRef);
  }

  private bindScrollInputs() {
    // Desktop: wheel. deltaY > 0 (scroll down/forward) → push cloud DOWN.
    // deltaY < 0 (scroll up/back) → push cloud UP.
    this.wheelHandler = (e: WheelEvent) => {
      this.scrollImpulse += e.deltaY * SCROLL_WHEEL_GAIN;
    };
    window.addEventListener("wheel", this.wheelHandler, { passive: true });

    // Mobile: track finger Y between touchstart and touchend, accumulate deltaY.
    this.touchStartHandler = (e: TouchEvent) => {
      if (e.touches.length > 0) this.lastTouchY = e.touches[0].clientY;
    };
    this.touchMoveHandler = (e: TouchEvent) => {
      if (e.touches.length > 0 && this.lastTouchY !== null) {
        const currentY = e.touches[0].clientY;
        // Finger moves up (currentY decreases) → forward scroll → push down.
        const deltaY = this.lastTouchY - currentY;
        this.scrollImpulse += deltaY * SCROLL_TOUCH_GAIN;
        this.lastTouchY = currentY;
      }
    };
    this.touchEndHandler = () => {
      this.lastTouchY = null;
    };
    window.addEventListener("touchstart", this.touchStartHandler, {
      passive: true,
    });
    window.addEventListener("touchmove", this.touchMoveHandler, {
      passive: true,
    });
    window.addEventListener("touchend", this.touchEndHandler, {
      passive: true,
    });
    window.addEventListener("touchcancel", this.touchEndHandler, {
      passive: true,
    });
  }

  private handleResize() {
    const rect = this.containerRef.getBoundingClientRect();
    this.stage.width(rect.width);
    this.stage.height(rect.height);
  }

  private async createTail() {
    this.tailPoints = Array.from({ length: TAIL_POINTS_COUNT }, () => ({
      x: 0,
      y: CLOUD_CENTER_Y,
    }));

    this.tailLine = new Konva.Line({
      points: this.tailPoints.flatMap((p) => [p.x, p.y]),
      stroke: "#d8b301",
      strokeWidth: 30,
      lineCap: "round",
      lineJoin: "round",
      tension: 0.5,
    });

    this.layer.add(this.tailLine);
  }

  private async createCloud() {
    const cloudImg = new Image();
    cloudImg.src = nimbus;
    await new Promise((resolve) => (cloudImg.onload = resolve));

    const halfWidth = cloudImg.width / 2;
    const halfHeight = cloudImg.height / 2;

    this.cloudSprite = new Konva.Image({
      image: cloudImg,
      x: 0,
      y: CLOUD_CENTER_Y,
      offsetX: halfWidth,
      offsetY: halfHeight,
      // no draggable: cursor interaction removed
    });

    this.layer.add(this.cloudSprite);
  }

  setDayMode(isDay: boolean) {
    if (!this.cloudSprite || !this.tailLine) return;
    if (isDay) {
      this.cloudSprite.filters([]);
      this.tailLine.filters([]);
      // The tail's `points` are a data property, so caching it freezes the
      // rendered snapshot. Clear the cache so the live points render every
      // frame. (The cloud's cache is fine — its x()/y() are transform
      // properties and the cached snapshot moves with the node.)
      this.tailLine.clearCache();
    } else {
      this.cloudSprite.filters([Konva.Filters.Brighten]);
      this.cloudSprite.brightness(-0.4);
      this.tailLine.filters([Konva.Filters.Brighten]);
      this.tailLine.brightness(-0.4);
      this.tailLine.cache();
    }
    this.cloudSprite.cache();
    this.tailLine.getLayer()?.batchDraw();
  }

  destroy() {
    this.anim.stop();
    if (this.wheelHandler) window.removeEventListener("wheel", this.wheelHandler);
    if (this.touchStartHandler)
      window.removeEventListener("touchstart", this.touchStartHandler);
    if (this.touchMoveHandler)
      window.removeEventListener("touchmove", this.touchMoveHandler);
    if (this.touchEndHandler) {
      window.removeEventListener("touchend", this.touchEndHandler);
      window.removeEventListener("touchcancel", this.touchEndHandler);
    }
    this.stage.destroy();
  }
}

const Canvas = (props: { day: () => boolean }) => {
  let containerRef: HTMLDivElement | undefined;
  let scene: CloudScene | undefined;

  onMount(async () => {
    if (!containerRef) return;

    scene = new CloudScene(containerRef);
    await scene.init();

    createEffect(() => {
      scene?.setDayMode(props.day());
    });

    onCleanup(() => {
      scene?.destroy();
    });
  });

  return <div class="w-full h-full" ref={containerRef} />;
};

export default Canvas;
