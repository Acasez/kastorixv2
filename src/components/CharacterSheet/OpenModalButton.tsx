import type { MouseEventHandler, ReactNode } from "react";
import Tooltip from "../Tooltip";

interface OpenModalButtonProps {
  label: string;
  isHighlighted?: boolean;
  className?: string;
  onClick?: () => void;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
  itemChosen?: boolean;
  fixedChoice?: boolean;
  tooltipContent?: ReactNode;
}

export default function OpenModalButton({
  label,
  isHighlighted = false,
  className = "",
  onClick = () => {},
  itemChosen = false,
  fixedChoice = false,
  onContextMenu,
  tooltipContent,
}: OpenModalButtonProps) {
  return (
    <>
      <Tooltip content={tooltipContent ?? label}>
        <button
          onClick={onClick}
          onContextMenu={onContextMenu}
          className={`w-full px-2 py-1 rounded-md text-base font-medium text-white ${
            isHighlighted
              ? "bg-green-500"
              : fixedChoice
                ? "bg-lime-500"
                : itemChosen
                  ? "bg-blue-500"
                  : "bg-teal-700"
          } ${className}`}
        >
          {label}
        </button>
      </Tooltip>
    </>
  );
}
