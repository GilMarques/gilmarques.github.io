export const SUN_SIZE = 112;

type SunProps = {
  isDay: boolean;
  x: number;
  y: number;
  horizonY: number;
  ref?: (el: HTMLDivElement) => void;
};

function Sun(props: SunProps) {
  const visibleHeight = () =>
    Math.max(
      0,
      Math.min(SUN_SIZE, props.horizonY - props.y),
    );

  return (
    <div class="absolute -z-10" style={{ left: `${props.x}px`, top: `${props.y}px` }}>
      <div
        class="overflow-hidden"
        style={{
          width: `${SUN_SIZE}px`,
          height: `${SUN_SIZE}px`,
          "max-height": `${visibleHeight()}px`,
        }}
      >
        <div
          ref={props.ref}
          class="rounded-full bg-yellow-200"
          style={{
            width: `${SUN_SIZE}px`,
            height: `${SUN_SIZE}px`,
            filter: "blur(2px)",
            opacity: props.isDay ? 1 : 0.45,
          }}
        />
      </div>
    </div>
  );
}

Sun.displayName = "Sun";

export default Sun;
