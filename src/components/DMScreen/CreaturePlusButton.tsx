import type { SetStateAction } from "react";

interface CreaturePlusButtonProps<T extends string> {
  setIsAdding: (value: SetStateAction<boolean>) => void;
  availableTypes?: readonly T[];
  itemLabel: string;
  isAdding: boolean;
}

export default function CreaturePlusButton<T extends string>({
  setIsAdding,
  availableTypes,
  itemLabel,
  isAdding,
}: CreaturePlusButtonProps<T>) {
  return (
    <button
      type="button"
      className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
      onClick={() => setIsAdding((open) => !open)}
      disabled={availableTypes && availableTypes.length === 0}
      aria-label={`Add ${itemLabel}`}
      title={isAdding ? `Cancel adding ${itemLabel}` : `Add ${itemLabel}`}
      aria-expanded={isAdding}
    >
      {isAdding ? "×" : "+"}
    </button>
  );
}
