import {
  Application,
  Assets,
  ColorMatrixFilter,
  Container,
  MeshRope,
  Point,
  RopeGeometry,
  Sprite,
  type Ticker,
} from "pixi.js";

import { createEffect, onCleanup, onMount } from "solid-js";
import { nimbus, tail } from "../assets/sprites/nimbus";

const ROPE_SEGMENT = 60;
const REPEL_STRENGTH = 4200;
const REPEL_SOFT = 90;
const MAX_REPEL_OFFSET = 140;
const SMOOTH = 0.12;
const INTERACTION_RADIUS = 260;
const BOUNCE_KICK = -38;
const BOUNCE_SPRING = 0.52;
const BOUNCE_DRAG = 0.34;

class CloudRopeSystem {
  private app!: Application;
  private container!: Container;
  private cloudSprite!: Sprite;
  private rope!: MeshRope;
  private ropeGeometry!: RopeGeometry;
  private points!: Point[];

  private time = 0;
  private bounceY = 0;
  private bounceVel = 0;
  private dispX = 0;
  private dispY = 0;
  private mousePos: { x: number; y: number } | null = null;

  private host!: HTMLDivElement;
  private resizeObserver!: ResizeObserver;
  private onPointerMove!: (e: PointerEvent) => void;
  private onPointerLeave!: () => void;

  static async create(
    container: HTMLDivElement,
    day: () => boolean,
  ): Promise<CloudRopeSystem> {
    const system = new CloudRopeSystem();
    await system.init(container, day);
    return system;
  }

  private async init(container: HTMLDivElement, day: () => boolean) {
    this.host = container;

    this.app = new Application();
    await this.app.init({
      antialias: true,
      backgroundAlpha: 0,
      resizeTo: container,
    });

    container.appendChild(this.app.canvas);
    this.container = new Container();
    this.app.stage.addChild(this.container);

    this.points = Array.from(
      { length: 10 },
      (_, i) => new Point(-i * ROPE_SEGMENT, 0),
    );

    const ropeTexture = await Assets.load(tail);
    this.rope = new MeshRope({ texture: ropeTexture, points: this.points });
    this.rope.autoUpdate = false;
    this.ropeGeometry = this.rope.geometry as RopeGeometry;
    this.rope.scale.set(1, -1);
    this.container.addChild(this.rope);

    const cloudTexture = await Assets.load(nimbus);
    this.cloudSprite = new Sprite(cloudTexture);
    this.cloudSprite.eventMode = "static";
    this.cloudSprite.cursor = "pointer";
    this.cloudSprite.on("pointertap", () => {
      this.bounceVel += BOUNCE_KICK;
    });
    this.container.addChild(this.cloudSprite);

    const centerX = this.app.screen.width / 2;
    const centerY = 300;
    this.cloudSprite.position.set(centerX, centerY);
    this.rope.position.set(centerX + 110, centerY + 46);

    this.app.ticker.add(this.tick);

    this.resizeObserver = new ResizeObserver(() => {
      const newCenterX = this.app.screen.width / 2;
      const newCenterY = 300;
      this.cloudSprite.position.set(
        newCenterX + this.dispX,
        newCenterY + this.dispY,
      );
      this.rope.position.set(
        newCenterX + 110 + this.dispX,
        newCenterY + 46 + this.dispY,
      );
    });
    this.resizeObserver.observe(container);

    this.onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = {
        x: ((e.clientX - rect.left) / rect.width) * this.app.screen.width,
        y: ((e.clientY - rect.top) / rect.height) * this.app.screen.height,
      };
    };
    this.onPointerLeave = () => {
      this.mousePos = null;
    };

    container.addEventListener("pointermove", this.onPointerMove);
    container.addEventListener("pointerleave", this.onPointerLeave);

    createEffect(() => {
      if (day()) {
        this.container.filters = [];
      } else {
        const colorMatrix = new ColorMatrixFilter();
        colorMatrix.brightness(0.6, false);
        this.container.filters = [colorMatrix];
      }
    });
  }

  private tick = (ticker: Ticker) => {
    const delta = Math.min(0.033, ticker.deltaMS / 1000);
    this.update(delta > 0 ? delta : 0.016);
  };

  destroy() {
    if (this.app?.renderer) {
      this.app.ticker.remove(this.tick);
      this.app.destroy(true, { children: true });
    }
    this.resizeObserver?.disconnect();
    this.host?.removeEventListener("pointermove", this.onPointerMove);
    this.host?.removeEventListener("pointerleave", this.onPointerLeave);
  }

  private update(deltaTime: number) {
    this.time += 0.1 * deltaTime;
    const iter = this.time;
    const bob = 2 * Math.sin(-iter);

    if (this.mousePos) {
      const cloudX = this.cloudSprite.position.x;
      const cloudY = this.cloudSprite.position.y;
      const distToCloud = Math.hypot(
        this.mousePos.x - cloudX,
        this.mousePos.y - cloudY,
      );

      if (distToCloud <= INTERACTION_RADIUS) {
        let dx = cloudX - this.mousePos.x;
        let dy = cloudY - this.mousePos.y;
        let dist = Math.hypot(dx, dy);

        if (dist < 0.001) {
          dx = 1;
          dy = 0;
          dist = 1;
        }

        const edge = Math.max(0, 1 - distToCloud / INTERACTION_RADIUS);
        const inv = (REPEL_STRENGTH / (dist + REPEL_SOFT)) * edge * edge;
        const tx = (dx / dist) * Math.min(inv, MAX_REPEL_OFFSET);
        const ty = (dy / dist) * Math.min(inv, MAX_REPEL_OFFSET);

        this.dispX += (tx - this.dispX) * SMOOTH * deltaTime;
        this.dispY += (ty - this.dispY) * SMOOTH * deltaTime;
      } else {
        this.dispX *= 0.94;
        this.dispY *= 0.94;
      }
    } else {
      this.dispX *= 0.94;
      this.dispY *= 0.94;
    }

    this.bounceVel +=
      (-this.bounceY * BOUNCE_SPRING - this.bounceVel * BOUNCE_DRAG) *
      deltaTime;
    this.bounceY += this.bounceVel * deltaTime;

    const centerX = this.app.screen.width / 2;
    const centerY = 300;

    this.cloudSprite.position.x = centerX + this.dispX;
    this.cloudSprite.position.y = centerY + bob + this.dispY + this.bounceY;

    this.rope.position.x = centerX + 110 + this.dispX;
    this.rope.position.y = centerY + 46 + bob + this.dispY + this.bounceY;

    for (let i = 0; i < this.points.length; i++) {
      this.points[i].y = Math.sin(-iter + (i * Math.PI) / 2) * (0.3 * i);
      this.points[i].x = -i * ROPE_SEGMENT;
    }

    this.ropeGeometry.update();
  }
}

const Canvas = (props: { day: () => boolean }) => {
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!containerRef) return;

    let disposed = false;
    let cloudSystem: CloudRopeSystem | undefined;

    void CloudRopeSystem.create(containerRef, props.day).then((system) => {
      if (disposed) {
        system.destroy();
        return;
      }
      cloudSystem = system;
    });

    onCleanup(() => {
      disposed = true;
      cloudSystem?.destroy();
    });
  });

  return <div class="pointer-events-auto w-full h-full" ref={containerRef} />;
};

export default Canvas;
