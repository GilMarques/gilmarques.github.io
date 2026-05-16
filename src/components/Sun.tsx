import { forwardRef } from "react";

export const SUN_SIZE = 112;

type SunProps = {
  isDay: boolean;
  x: number;
  y: number;
  horizonY: number;
};

const Sun = forwardRef<HTMLDivElement, SunProps>(
  ({ isDay, x, y, horizonY }, ref) => {
    const visibleHeight = Math.max(
      0,
      Math.min(SUN_SIZE, horizonY - y - SUN_SIZE / 2 - 1)
    );

    return (
      <div className="absolute -z-10" style={{ left: `${x}px`, top: `${y}px` }}>
        <div
          className="overflow-hidden"
          style={{
            width: `${SUN_SIZE}px`,
            height: `${SUN_SIZE}px`,
            maxHeight: `${visibleHeight}px`,
          }}
        >
          <div
            ref={ref}
            className="rounded-full bg-yellow-200"
            style={{
              width: `${SUN_SIZE}px`,
              height: `${SUN_SIZE}px`,
              filter: "blur(2px)",
              opacity: isDay ? 1 : 0.45,
            }}
          />
        </div>
      </div>
    );
  }
);

Sun.displayName = "Sun";

export default Sun;
