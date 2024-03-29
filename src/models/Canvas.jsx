import { Stage } from "@pixi/react";
import { useEffect, useRef } from "react";
import MovingCloud from "./MovingCloud";
const Canvas = () => {
  const ref = useRef(null);

  const stageRef = useRef(null);

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
    <div className="relative" ref={ref}>
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
