interface OpenModalButtonProps {
  label: string;
  isHighlighted?: boolean;
  className?: string;
  onClick?: () => void;
  itemChosen?: boolean;
}

export default function OpenModalButton({
  label,
  isHighlighted = false,
  className = "",
  onClick = () => {},
  itemChosen = false,
}: OpenModalButtonProps) {
  return (
    <button
      onClick={onClick}
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
