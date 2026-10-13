import type { SetStateAction } from "react";
import type { ChoiceItem } from "./ModalViews/ChoiceModal";

interface DropDownMenuProps {
  field: { label: string; value: string };
  filters: Record<string, string>;
  setFilters: (value: SetStateAction<Record<string, string>>) => void;
  items: ChoiceItem[];
  getFilterValues(value: unknown): string[];
}

export default function DropDownMenu({
  field,
  filters,
  setFilters,
  items,
  getFilterValues,
}: DropDownMenuProps) {
  return (
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
  );
}
