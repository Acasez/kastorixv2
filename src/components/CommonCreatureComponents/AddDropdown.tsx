interface AddDropdownProps<T extends string> {
  availableTypes: readonly T[];
  itemLabel: string;
  onSelect: (type: T) => void;
}

export default function AddDropDown<T extends string>({
  availableTypes,
  itemLabel,
  onSelect,
}: AddDropdownProps<T>) {
  return (
    <div
      role="listbox"
      aria-label={`Choose ${itemLabel} to add`}
      className="absolute top-full -left-22 z-30 w-30 overflow-y-auto rounded-lg border border-bg-stone-border bg-bg-stone py-1 shadow-lg"
    >
      {availableTypes.map((type) => (
        <button
          type="button"
          role="option"
          aria-selected="false"
          key={type}
          onClick={() => onSelect(type)}
          className="w-full px-4 py-2 text-left text-sm text-text-light hover:bg-bg-stone-border focus-visible:bg-bg-stone-border focus-visible:outline-none"
        >
          {type}
        </button>
      ))}
    </div>
  );
}
