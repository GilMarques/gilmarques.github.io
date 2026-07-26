import { createSignal, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";

interface TooltipProps {
  text: string;
  children: JSX.Element;
}

/**
 * Tooltip rendered through a Portal so it escapes any ancestor
 * clip-path (the pixel-corners borders on the project card).
 * Position is computed from the trigger's bounding rect on hover.
 */
const Tooltip = (props: TooltipProps) => {
  const [show, setShow] = createSignal(false);
  const [pos, setPos] = createSignal({ x: 0, y: 0 });
  let triggerRef: HTMLSpanElement | undefined;

  const updatePos = () => {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    setPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => {
          updatePos();
          setShow(true);
        }}
        onMouseLeave={() => setShow(false)}
        class="inline-block"
      >
        {props.children}
      </span>
      <Portal>
        <Show when={show()}>
          <div
            class="fixed z-[1000] pointer-events-none font-custom"
            style={{
              left: `${pos().x}px`,
              top: `${pos().y}px`,
              transform: "translateX(-50%) translateY(calc(-100% - 6px))",
            }}
          >
            <div class="border-2 border-black bg-black text-white text-base px-1 whitespace-nowrap">
              {props.text}
            </div>
          </div>
        </Show>
      </Portal>
    </>
  );
};

export default Tooltip;
