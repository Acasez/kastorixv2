export default function ActionButton({
  label,
  isHighlighted = false,
}: {
  label: string;
  isHighlighted?: boolean;
}) {
  return (
    <button
      className={`w-full px-4 py-2 rounded-md text-sm font-medium text-white mb-2 {
        ${isHighlighted ? "bg-green-500" : "bg-teal-700"}
      }`}
    >
      {label}
    </button>
  );
}
