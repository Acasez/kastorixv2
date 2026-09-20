// Tooltip.tsx
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  align?: keyof AlignmentClassMap;
  contentClassName?: string;
};

type AlignmentClassMap = Record<
  "center" | "right" | "left",
  { [key: string]: string }
>;

export default function Tooltip({
  content,
  children,
  align,
  contentClassName = "",
}: TooltipProps) {
  const alignment = align ?? "center";
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const horizontalPosition =
        alignment === "left"
          ? triggerRect.left
          : alignment === "right"
            ? triggerRect.right - tooltipRect.width
            : triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      const left = Math.min(
        Math.max(8, horizontalPosition),
        Math.max(8, window.innerWidth - tooltipRect.width - 8),
      );
      const aboveTop = triggerRect.top - tooltipRect.height - 8;
      const top = aboveTop >= 8 ? aboveTop : triggerRect.bottom + 8;

      setPosition({ left, top });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [alignment, content, contentClassName, isVisible]);

  return (
    <span
      ref={triggerRef}
      className="inline-flex cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible &&
        createPortal(
          <span
            ref={tooltipRef}
            role="tooltip"
            className={`pointer-events-none fixed z-1000 max-w-[calc(100vw-1rem)] rounded-md border border-gray-600 bg-gray-900 px-2 py-1 text-xs font-normal text-gray-100 shadow-lg ${contentClassName}`}
            style={{ left: position.left, top: position.top }}
          >
            {content}
          </span>,
          document.body,
        )}
    </span>
  );
}
