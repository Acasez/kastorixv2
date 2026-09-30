type NumericTypeListProps<T extends string> = {
  title: string;
  itemLabel: string;
  options: readonly T[];
  values: Partial<Record<T, number>>;
  onChange: (values: Partial<Record<T, number>>) => void;
  typeWidthClass: string;
  allowNegative: boolean;
};

export default function NumericTypeList<T extends string>({
  title,
  itemLabel,
  options,
  values,
  onChange,
  typeWidthClass,
  allowNegative,
}: NumericTypeListProps<T>) {
  const selectedTypes = options.filter((type) => type in values);
  const availableTypes = options.filter((type) => !(type in values));

  const addType = () => {
    const type = availableTypes[0];
    if (type) onChange({ ...values, [type]: 0 });
  };

  const changeType = (currentType: T, nextType: T) => {
    if (currentType === nextType || nextType in values) return;
    const nextValues = { ...values };
    const value = nextValues[currentType] ?? 0;
    delete nextValues[currentType];
    nextValues[nextType] = value;
    onChange(nextValues);
  };

  const changeValue = (type: T, value: number) =>
    onChange({
      ...values,
      [type]: allowNegative ? value : Math.max(0, value),
    });

  const removeType = (type: T) => {
    const nextValues = { ...values };
    delete nextValues[type];
    onChange(nextValues);
  };

  return (
    <section>
      <h2 className="mb-[0.65rem] border-b border-[#3c3935] pb-[0.35rem] text-center text-xl font-bold leading-6 text-[#ff7043]">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        {selectedTypes.map((type) => (
          <div
            className="relative inline-flex items-center gap-2 rounded border border-stone-600 bg-stone-800 p-2 pr-3"
            key={type}
          >
            <label>
              <span className="sr-only">
                {type} {itemLabel} type
              </span>
              <select
                aria-label={`${type} ${itemLabel} type`}
                value={type}
                onChange={(event) => changeType(type, event.target.value as T)}
                className={`h-8 rounded border border-stone-500 bg-stone-900 px-1 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${typeWidthClass}`}
              >
                {options
                  .filter((option) => option === type || !(option in values))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span className="sr-only">
                {type} {itemLabel} value
              </span>
              <input
                type="number"
                min={allowNegative ? undefined : 0}
                value={values[type] ?? 0}
                aria-label={`${type} ${itemLabel} value`}
                onChange={(event) =>
                  changeValue(type, Number(event.target.value))
                }
                className="h-8 w-16 rounded border border-stone-500 bg-stone-900 px-1 text-center text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              />
            </label>
            <button
              type="button"
              className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold leading-none text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              onClick={() => removeType(type)}
              aria-label={`Remove ${type} ${itemLabel}`}
              title={`Remove ${type} ${itemLabel}`}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={addType}
          disabled={availableTypes.length === 0}
          aria-label={`Add ${itemLabel}`}
          title={`Add ${itemLabel}`}
        >
          +
        </button>
      </div>
    </section>
  );
}
