export const INPUT_CLASS =
  "h-9 rounded border border-gray-400 bg-white px-2 text-gray-900";

type RemoveButtonProps = {
  label: string;
  onClick: () => void;
};

export function RemoveButton({ label, onClick }: RemoveButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-4 items-center justify-center rounded-full bg-stone-600 text-xs text-white hover:bg-red-700"
    >
      ×
    </button>
  );
}
