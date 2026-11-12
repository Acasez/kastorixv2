import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Trait } from "../../types/Trait";
import { createPortal } from "react-dom";

export default function TraitTooltip({
  trait,
  children,
}: {
  trait: Trait;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: -9999, left: -9999 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const margin = 8;

    const update = () => {
      const t = trigger.getBoundingClientRect();
      const w = tooltip.offsetWidth;
      const h = tooltip.offsetHeight;

      // center on trigger, clamp to viewport
      let left = t.left + t.width / 2 - w / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));

      // prefer above, flip below if no room
      let top = t.top - h - 6;
      if (top < margin) top = t.bottom + 6;

      setPos({ top, left });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const show = () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setOpen(true), 150);
  };
  const hide = () => {
    window.clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="cursor-help underline decoration-dotted underline-offset-4"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <span
            ref={tooltipRef}
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className="z-50 w-90 rounded-lg bg-bg-obsidian p-3 text-left
                       text-sm text-text-light shadow-lg"
          >
            <span className="mb-1 block font-bold text-white">
              {trait.name}
            </span>
            <span className="block italic">{trait.flavor}</span>
            <span className="mt-1 block">{trait.effect}</span>
          </span>,
          document.body,
        )}
    </>
  );
}
