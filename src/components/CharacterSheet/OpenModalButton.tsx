interface OpenModalButtonProps {
  label: string;
  isHighlighted?: boolean;
  className?: string;
}

export default function OpenModalButton({
  label,
  isHighlighted = false,
  className = "",
}: OpenModalButtonProps) {
  return (
    <button
      className={`w-full px-2 py-1.5 rounded-md text-sm font-medium text-white ${
        isHighlighted ? "bg-green-500" : "bg-teal-700"
      } ${className}`}
    >
      {label}
    </button>
  );
}
