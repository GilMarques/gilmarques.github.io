import Konva from "konva";
import { createEffect, onCleanup, onMount } from "solid-js";
import { nimbus } from "../assets/sprites";

const CLOUD_CENTER_Y = 300;
const SPRING_STIFFNESS = 0.15;
const TAIL_POINTS_COUNT = 60;

class CloudScene {
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private anim!: Konva.Animation;
  private cloudSprite!: Konva.Image;
  private tailLine!: Konva.Line;
  private tailPoints: { x: number; y: number }[] = [];
  private cloudHistory: { x: number; y: number }[] = [];
  private disposed = false;
  private wavePhase = 0;

  private getRopeSegment(): number {
    const maxDim = Math.max(
      this.stage?.width() ?? 800,
      this.stage?.height() ?? 600,
    );
    return Math.max(maxDim * 0.15, 100);
  }

  private isDragging = false;
  private lastDragTime = 0;
  private lastDragX = 0;
  private lastDragY = 0;
  private cloudX = 0;
  private cloudY = CLOUD_CENTER_Y;
  private velocityX = 0;
  private velocityY = 0;
  private currentScale = 1;
  private targetScale = 1;

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

    this.cloudX = this.stage.width() / 2;
    this.cloudY = CLOUD_CENTER_Y;
    this.layoutCentered();

    this.anim = new Konva.Animation((frame) => {
      this.wavePhase = frame.time * 0.004;

      if (!this.cloudSprite || !this.tailLine) return;

      const bob = Math.sin(-this.wavePhase);

      if (!this.isDragging) {
        const centerX = this.stage.width() / 2;
        const centerY = CLOUD_CENTER_Y;

        // Velocity friction
        this.velocityX *= 0.97;
        this.velocityY *= 0.97;

        // Spring physics on Y to return to center
        const springK_y = 0.02;
        const damping_y = 1;

        this.velocityY += (centerY - this.cloudY + bob) * springK_y;
        this.velocityY *= damping_y;
        this.cloudY += this.velocityY;

        // Linear return to center on X
        const xReturnSpeed = 0.1;
        if (this.cloudX > centerX + 10) {
          this.velocityX -= xReturnSpeed;
        } else if (this.cloudX < centerX - 10) {
          this.velocityX += xReturnSpeed;
        }
        this.cloudX += this.velocityX;
      } else {
        // Track velocity during drag
        const now = performance.now();
        const dt = Math.max(16, now - this.lastDragTime);
        const rawVelX = this.cloudSprite.x() - this.lastDragX;
        const rawVelY = this.cloudSprite.y() - this.lastDragY;

        // Blend with existing velocity for smoother transitions
        this.velocityX = this.velocityX * 0.3 + (rawVelX / dt) * 0.7;
        this.velocityY = this.velocityY * 0.3 + (rawVelY / dt) * 0.7;

        this.lastDragTime = now;
        this.lastDragX = this.cloudSprite.x();
        this.lastDragY = this.cloudSprite.y();

        this.cloudX = this.cloudSprite.x();
        this.cloudY = this.cloudSprite.y();
      }

      this.cloudSprite.x(this.cloudX);
      this.cloudSprite.y(this.cloudY);

      const scaleSpeed = 0.08;
      if (this.currentScale < this.targetScale) {
        this.currentScale = Math.min(
          this.targetScale,
          this.currentScale + scaleSpeed,
        );
      } else {
        this.currentScale = Math.max(
          this.targetScale,
          this.currentScale - scaleSpeed,
        );
      }
      this.cloudSprite.scale({ x: this.currentScale, y: this.currentScale });

      // Save current position to history
      this.cloudHistory.unshift({ x: this.cloudX, y: this.cloudY });
      if (this.cloudHistory.length > TAIL_POINTS_COUNT) {
        this.cloudHistory.pop();
      }

      // Apply history positions to tail points (point 0 = current, point 59 = oldest)
      for (let i = 0; i < this.tailPoints.length; i++) {
        this.tailPoints[i].x =
          this.cloudHistory[i].x - i * 0.2 * this.getRopeSegment();
        this.tailPoints[i].y = this.cloudHistory[i].y;
      }

      this.tailLine.points(this.tailPoints.flatMap((p) => [p.x, p.y]));
      this.tailLine.position({ x: 0, y: 0 });
    }, this.layer);

    this.anim.start();

    const resizeObserver = new ResizeObserver(() => this.handleResize());
    resizeObserver.observe(this.containerRef);
  }

  private handleResize() {
    const rect = this.containerRef.getBoundingClientRect();
    this.stage.width(rect.width);
    this.stage.height(rect.height);
    this.layoutCentered();
  }

  private async createTail() {
    this.tailPoints = Array.from({ length: TAIL_POINTS_COUNT }, () => ({
      x: 0,
      y: CLOUD_CENTER_Y,
    }));
    this.cloudHistory = Array.from({ length: TAIL_POINTS_COUNT }, () => ({
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
      draggable: true,
    });

    // Constrain drag within canvas bounds
    this.cloudSprite.dragBoundFunc((pos) => {
      const minX = halfWidth;
      const maxX = this.stage.width() - halfWidth;
      const minY = halfHeight;
      const maxY = this.stage.height() - halfHeight;

      return {
        x: Math.max(minX, Math.min(maxX, pos.x)),
        y: Math.max(minY, Math.min(maxY, pos.y)),
      };
    });

    this.cloudSprite.on("mousedown", () => {
      this.targetScale = 1.2;
    });

    this.cloudSprite.on("mouseup", () => {
      this.targetScale = 1;
    });

    this.cloudSprite.on("dragstart", () => {
      this.isDragging = true;
      this.lastDragTime = performance.now();
      this.lastDragX = this.cloudSprite.x();
      this.lastDragY = this.cloudSprite.y();
      // Dampen velocity at drag start
      this.velocityX *= 0.5;
      this.velocityY *= 0.5;
    });

    this.cloudSprite.on("dragend", () => {
      this.isDragging = false;
      this.targetScale = 1;
    });

    this.layer.add(this.cloudSprite);
  }

  private layoutCentered() {
    if (!this.stage || !this.cloudSprite) return;
    if (!this.isDragging) {
      this.cloudSprite.x(this.stage.width() / 2);
    }
  }

  setDayMode(isDay: boolean) {
    if (!this.cloudSprite || !this.tailLine) return;
    if (isDay) {
      this.cloudSprite.filters([]);
      this.tailLine.filters([]);
    } else {
      this.cloudSprite.filters([Konva.Filters.Brighten]);
      this.cloudSprite.brightness(-0.4);
      this.tailLine.filters([Konva.Filters.Brighten]);
      this.tailLine.brightness(-0.4);
    }
    this.cloudSprite.cache();
    this.tailLine.cache();
    this.tailLine.getLayer()?.batchDraw();
  }

  destroy() {
    this.disposed = true;
    this.anim.stop();
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
