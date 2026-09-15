import { useState } from "react";

export interface ChoiceItem {
  name: string;
  description?: string;
  effect?: string;
  level?: number | string;
}

interface ChoiceModalProps {
  items: ChoiceItem[];
  confirmLabel: string;
  initialValue: string | null;
  maxLevel: number;
  onConfirm: (value: string) => void;
}

export default function ChoiceModal({
  items,
  confirmLabel,
  initialValue,
  maxLevel,
  onConfirm,
}: ChoiceModalProps) {
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState(
    () => initialValue ?? items[0]?.name ?? "",
  );

  const availableItems = items.filter(
    (item) => item.level === undefined || Number(item.level) <= maxLevel,
  );
  const filteredItems = availableItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedItem = availableItems.find(
    (item) => item.name === selectedName,
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name"
        aria-label="Search choices"
        className="border-2 border-gray-300 rounded-md px-3 py-2"
      />
      <div className="flex flex-row gap-3 min-h-80">
        <div className="flex flex-col w-56 gap-1 overflow-y-auto">
          {filteredItems.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`text-left border-2 px-2 py-1 ${
                selectedName === item.name
                  ? "border-purple-500 bg-purple-100"
                  : "border-amber-200 bg-bg-rules"
              } text-text-dark`}
              onClick={() => setSelectedName(item.name)}
            >
              {item.name}
              {item.level !== undefined && ` [Level ${item.level}]`}
            </button>
          ))}
          {filteredItems.length === 0 && (
            <p className="text-gray-600">No matching choices.</p>
          )}
        </div>
        <div className="border-amber-200 border-2 p-3 flex-1">
          {selectedItem ? (
            <>
              <h3 className="text-2xl underline">{selectedItem.name}</h3>
              <p className="mt-3 whitespace-pre-line">
                {selectedItem.description ??
                  selectedItem.effect ??
                  "No description available."}
              </p>
              <button
                type="button"
                className="bg-lime-300 p-1 rounded-md mt-4"
                onClick={() => onConfirm(selectedItem.name)}
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            <p>Select a choice from the list.</p>
          )}
        </div>
      </div>
    </div>
  );
}
