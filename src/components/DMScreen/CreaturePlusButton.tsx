interface CreaturePlusButtonProps {
  onAdd: () => void;
  itemLabel: string;
  isAdding?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function CreaturePlusButton({
  onAdd,
  itemLabel,
  isAdding,
  disabled,
  className = "",
}: CreaturePlusButtonProps) {
  return (
    <button
      type="button"
      className={`flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${className}`}
      onClick={onAdd}
      disabled={disabled}
      aria-label={isAdding ? `Cancel adding ${itemLabel}` : `Add ${itemLabel}`}
      title={isAdding ? `Cancel adding ${itemLabel}` : `Add ${itemLabel}`}
      aria-expanded={isAdding}
    >
      {isAdding ? "×" : "+"}
    </button>
  );
}
