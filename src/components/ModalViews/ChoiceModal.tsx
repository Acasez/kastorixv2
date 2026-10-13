import { useState } from "react";
import type { DetailField } from "./choiceData";
import ChoiceItemDetail from "./ChoiceItemDetail";
import SearchField from "../SearchField";

export interface ChoiceItem {
  name: string;
  description?: string;
  effect?: string;
  actionIcons?: string[];
  details?: DetailField[];
  aspects?: string;
  traits?: string;
  type?: string;
  weaponGroup?: string;
  requirement?: string;
  level?: number | string;
  repeatable?: string | number | boolean;
  unlockedAction?: string;
  actionCost?: string;
  choice?: string;
  choiceOptions?: ChoiceItem[];
}
interface ChoiceModalProps {
  items: ChoiceItem[];
  confirmLabel: string;
  initialValue: string | null;
  initialChoice?: string | null;
  maxLevel: number;
  disabledNames?: string[];
  filterFields?: { label: string; value: string }[];
  onConfirm: (value: string, choice?: string) => void;
}

function getFilterValues(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) {
    return value === undefined || value === null ? [] : [String(value)];
  }

  return value.flatMap((entry) => {
    if (typeof entry === "string") {
      return entry
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    }
    if (!entry || typeof entry !== "object") return [];

    const namedEntry = entry as {
      name?: unknown;
      parameter?: unknown;
      label?: unknown;
      value?: unknown;
    };
    const label = namedEntry.name ?? namedEntry.label ?? namedEntry.value;
    if (label === undefined || label === null) return [];
    const parameter = namedEntry.parameter;
    return [
      parameter === undefined || parameter === null || parameter === ""
        ? String(label)
        : `${String(label)} (${String(parameter)})`,
    ];
  });
}

export default function ChoiceModal({
  items,
  confirmLabel,
  initialValue,
  initialChoice = null,
  maxLevel,
  disabledNames = [],
  filterFields = [],
  onConfirm,
}: ChoiceModalProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const effectiveMaxLevel = Math.max(1, maxLevel);
  const disabledNameSet = new Set(disabledNames);
  const isWithinLevel = (item: ChoiceItem) =>
    item.level === undefined || Number(item.level) <= effectiveMaxLevel;
  const isDisabled = (item: ChoiceItem) => {
    const duplicateBlocked =
      disabledNameSet.has(item.name) && item.name !== initialValue;
    return !isWithinLevel(item) || duplicateBlocked;
  };
  const firstSelectableItem = items.find((item) => !isDisabled(item));
  const [selectedName, setSelectedName] = useState(
    () => initialValue ?? firstSelectableItem?.name ?? items[0]?.name ?? "",
  );
  const [selectedChoiceName, setSelectedChoiceName] = useState(
    () => (initialValue ? initialChoice : null) ?? "",
  );

  const filteredItems = items.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilters = filterFields.every(({ value }) => {
      const selectedFilter = filters[value] ?? "";
      if (!selectedFilter) return true;
      const itemValue: unknown = item[value as keyof ChoiceItem];
      return getFilterValues(itemValue)
        .map((part) => part.toLowerCase())
        .includes(selectedFilter.toLowerCase());
    });
    return matchesName && matchesFilters;
  });
  const selectedItem = items.find((item) => item.name === selectedName);
  const selectedChoice = selectedItem?.choiceOptions?.find(
    (choice) => choice.name === selectedChoiceName,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-w-0 flex-row gap-2">
        <SearchField search={search} setSearch={setSearch} />
        {filterFields.length > 0 && (
          <div className="flex shrink-0 flex-nowrap gap-1">
            {filterFields.map((field) => (
              <select
                key={field.value}
                value={filters[field.value] ?? ""}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    [field.value]: event.target.value,
                  }))
                }
                aria-label={`Filter by ${field.label}`}
                className="rounded-md border-2 border-gray-300 px-3 py-2 text-text-black"
              >
                <option value="">All {field.label}</option>
                {Array.from(
                  new Set(
                    items.flatMap((item) =>
                      getFilterValues(item[field.value as keyof ChoiceItem]),
                    ),
                  ),
                )
                  .sort()
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            ))}
          </div>
        )}
      </div>
      {/* Key change: Wrap content area with constrained height */}
      <div className="flex flex-row gap-3 h-155">
        {/* List panel - scrollable */}
        <div className="flex flex-col w-56 gap-1 overflow-y-auto pr-1">
          {filteredItems.map((item) => (
            <button
              type="button"
              key={item.name}
              disabled={isDisabled(item)}
              className={`text-left text-text-black border-2 px-2 py-1 ${
                isDisabled(item)
                  ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
                  : selectedName === item.name
                    ? "border-purple-500 bg-purple-100"
                    : "border-amber-200 bg-bg-rules text-text-dark"
              }`}
              onClick={() => {
                setSelectedName(item.name);
                setSelectedChoiceName(
                  item.name === initialValue ? (initialChoice ?? "") : "",
                );
              }}
            >
              <span className="flex items-center gap-1">
                {item.name}
                {item.actionIcons?.map((icon, index) => (
                  <img
                    key={`${item.name}-action-${index}`}
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5 object-contain"
                  />
                ))}
                {item.level !== undefined && ` [${item.level}]`}
              </span>
            </button>
          ))}
          {filteredItems.length === 0 && (
            <p className="text-gray-600">No matching choices.</p>
          )}
        </div>
        {/* Description panel - NO scroll, static height */}
        <ChoiceItemDetail
          selectedItem={selectedItem}
          selectedChoiceName={selectedChoiceName}
          setSelectedChoiceName={setSelectedChoiceName}
          selectedChoice={selectedChoice}
          isDisabled={isDisabled}
          onConfirm={onConfirm}
          confirmLabel={confirmLabel}
        />
      </div>
    </div>
  );
}
