import { useState } from "react";
import type { DetailField } from "./choiceData";
import ChoiceItemDetail from "./ChoiceItemDetail";
import SearchField from "../SearchField";
import DropDownMenu from "../DropDownMenu";
import ModalItemButton from "./ModalItemButton";

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
              <DropDownMenu
                key={field.label}
                field={field}
                filters={filters}
                setFilters={setFilters}
                items={items}
                getFilterValues={getFilterValues}
              />
            ))}
          </div>
        )}
      </div>
      {/* Key change: Wrap content area with constrained height */}
      <div className="flex flex-row gap-3 h-155">
        {/* List panel - scrollable */}
        <div className="flex flex-col w-56 gap-1 overflow-y-auto pr-1">
          {filteredItems.map((item) => (
            <ModalItemButton
              key={item.name + " ModalItem"}
              item={item}
              isDisabled={isDisabled}
              selectedName={selectedName}
              setSelectedName={setSelectedName}
              setSelectedChoiceName={setSelectedChoiceName}
              initialValue={initialValue}
              initialChoice={initialChoice}
            />
          ))}
          {filteredItems.length === 0 && (
            <p className="text-gray-600">No matching choices.</p>
          )}
        </div>
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
