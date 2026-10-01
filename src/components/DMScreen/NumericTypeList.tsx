import { useState } from "react";
import CreatureHeader from "./CreatureHeader";

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
  const [isAdding, setIsAdding] = useState(false);
  const selectedTypes = options
    .filter((type) => type in values)
    .sort((first, second) => (values[second] ?? 0) - (values[first] ?? 0));
  const availableTypes = options.filter((type) => !(type in values));

  const addType = (type: T) => {
    if (!availableTypes.includes(type)) return;
    onChange({ ...values, [type]: 0 });
    setIsAdding(false);
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
      <div className="flex items-center gap-2">
        <div className="w-full">
          <CreatureHeader title={title} />
        </div>
        <div className="relative">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            onClick={() => setIsAdding((open) => !open)}
            disabled={availableTypes.length === 0}
            aria-label={`Add ${itemLabel}`}
            title={isAdding ? `Cancel adding ${itemLabel}` : `Add ${itemLabel}`}
            aria-expanded={isAdding}
          >
            +
          </button>
          {isAdding && (
            <div
              role="listbox"
              aria-label={`Choose ${itemLabel} to add`}
              className="absolute -left-20 top-full z-30 mt-1 max-h-[60vh] w-30 overflow-y-auto rounded-lg border border-gray-600 bg-gray-700 py-1 shadow-lg"
            >
              {availableTypes.map((type) => (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  key={type}
                  onClick={() => addType(type)}
                  className="w-full px-4 py-2 text-left text-sm text-text-light hover:bg-gray-600 focus-visible:bg-gray-600 focus-visible:outline-none"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
      </div>
    </section>
  );
}
