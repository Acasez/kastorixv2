import type { MouseEventHandler } from "react";

interface OpenModalButtonProps {
  label: string;
  isHighlighted?: boolean;
  className?: string;
  onClick?: () => void;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
  itemChosen?: boolean;
}

export default function OpenModalButton({
  label,
  isHighlighted = false,
  className = "",
  onClick = () => {},
  itemChosen = false,
  onContextMenu,
}: OpenModalButtonProps) {
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`w-full px-2 py-1 rounded-md text-base font-medium text-white ${
        isHighlighted
          ? "bg-green-500"
          : itemChosen
            ? "bg-blue-500"
            : "bg-teal-700"
      } ${className}`}
    >
      {label}
    </button>
  );
}
