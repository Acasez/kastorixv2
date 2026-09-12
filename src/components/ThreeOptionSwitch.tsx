type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  labels?: Partial<Record<T, string>>; // optional friendlier display text
};

export function ThreeOptionSwitch<T extends string>({
  options,
  value,
  onChange,
  labels,
}: Props<T>) {
  const activeIndex = Math.max(options.indexOf(value), 0);

  return (
    <div className="relative flex rounded-full bg-gray-200 p-1 w-fit">
      <span
        className="absolute top-1 bottom-1 left-1 rounded-full bg-white shadow transition-transform duration-200"
        style={{
          width: "calc((100% - 0.5rem) / 3)",
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`relative z-10 px-4 py-1 text-sm whitespace-nowrap rounded-full transition-colors flex-1 ${
            value === option
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
