type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  labels?: Partial<Record<T, string>>;
  disabled?: boolean;
};

export function MultiOptionSwitch<T extends string>({
  options,
  value,
  onChange,
  labels,
  disabled,
}: Props<T>) {
  const activeIndex = Math.max(options.indexOf(value), 0);
  const numOptions = options.length;

  return (
    <div className="relative flex rounded-full bg-gray-200 p-1 w-fit min-w-fit">
      {/* Sliding thumb */}
      <span
        className="absolute top-1 bottom-1 left-1 rounded-full bg-white shadow transition-transform duration-200"
        style={{
          width: `calc((100% - ${numOptions * 0.5}rem) / ${numOptions})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`relative z-10 flex-1 px-4 py-1 text-sm whitespace-nowrap rounded-full transition-colors ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : value === option
                ? "text-purple-700 font-semibold"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {labels?.[option] ?? option}
        </button>
      ))}
    </div>
  );
}
