// Tooltip.tsx
import type { ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  align?: keyof AlignmentClassMap;
};

type AlignmentClassMap = Record<
  "center" | "right" | "left",
  { [key: string]: string }
>;

export default function Tooltip({ content, children, align }: TooltipProps) {
  const alignment = align ?? "center";
  const positionClasses = {
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
    left: "left-0",
  }[alignment];

  return (
    <span className="group relative inline-flex cursor-help">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-md border border-gray-600 bg-gray-900 px-2 py-1 text-xs font-normal text-gray-100 shadow-lg group-hover:block ${positionClasses}`}
      >
        {content}
      </span>
    </span>
  );
}
