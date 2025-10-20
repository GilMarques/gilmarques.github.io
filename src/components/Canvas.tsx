/* eslint-disable react/prop-types */
import { Stage } from "@pixi/react";
import { useEffect, useRef } from "react";
import MovingCloud from "./MovingCloud";

const Canvas = ({ day }: { day: boolean }) => {
  const ref = useRef(null);
  const stageRef = useRef<any>(null);

  const handleResize = () => {
    if (!ref.current || !stageRef.current) return;

    const parent = stageRef.current.app.view.parentNode;
    stageRef.current.app.renderer.resize(
      parent.clientWidth,
      parent.clientHeight
    );
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="pointer-events-none"
      ref={ref}
      style={{ filter: day ? "none" : "brightness(0.6)" }}
    >
      <Stage
        options={{ antialias: true, backgroundAlpha: 0 }}
        ref={stageRef}
        className="m-auto w-full"
      >
        <MovingCloud />
      </Stage>
    </div>
  );
};

export default Canvas;
