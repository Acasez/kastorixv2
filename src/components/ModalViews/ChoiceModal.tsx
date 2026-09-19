import { useState } from "react";
import ActionBox from "../ActionBox";
import actions from "../../json/actions.json";

export interface ChoiceItem {
  name: string;
  description?: string;
  effect?: string;
  level?: number | string;
  repeatable?: string | number | boolean;
  unlockedAction?: string;
  actionCost?: string;
}

interface ChoiceModalProps {
  items: ChoiceItem[];
  confirmLabel: string;
  initialValue: string | null;
  maxLevel: number;
  disabledNames?: string[];
  onConfirm: (value: string) => void;
}

export default function ChoiceModal({
  items,
  confirmLabel,
  initialValue,
  maxLevel,
  disabledNames = [],
  onConfirm,
}: ChoiceModalProps) {
  const [search, setSearch] = useState("");
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

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedItem = items.find((item) => item.name === selectedName);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name"
        aria-label="Search choices"
        className="border-2 border-gray-300 rounded-md px-3 py-2 text-text-black"
      />
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
              onClick={() => setSelectedName(item.name)}
            >
              {item.name}
              {/* {item.action} */}
              {item.level !== undefined && ` [${item.level}]`}
            </button>
          ))}
          {filteredItems.length === 0 && (
            <p className="text-gray-600">No matching choices.</p>
          )}
        </div>
        {/* Description panel - NO scroll, static height */}
        <div className="border-amber-200 border-2 p-3 flex-1 overflow-hidden  text-text-black">
          {selectedItem ? (
            <div className="flex flex-col h-full">
              <h3 className="text-2xl underline">{selectedItem.name}</h3>
              <p className="mt-3 whitespace-pre-line flex-1 overflow-y-auto">
                {selectedItem.description ??
                  selectedItem.effect ??
                  "No description available."}
              </p>
              {selectedItem.unlockedAction && (
                <ActionBox
                  action={selectedItem.unlockedAction}
                  actionsList={actions}
                />
              )}
              <button
                type="button"
                disabled={isDisabled(selectedItem)}
                className="bg-lime-300 p-1 rounded-md mt-4 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed self-start"
                onClick={() => onConfirm(selectedItem.name)}
              >
                {confirmLabel}
              </button>
            </div>
          ) : (
            <p>Select a choice from the list.</p>
          )}
        </div>
      </div>
    </div>
  );
}
