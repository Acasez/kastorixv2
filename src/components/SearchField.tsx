import type { SetStateAction } from "react";

interface SearchFieldProps {
  search: string;
  setSearch: (value: SetStateAction<string>) => void;
}

export default function SearchField({ search, setSearch }: SearchFieldProps) {
  return (
    <input
      type="search"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search by name"
      aria-label="Search choices"
      className="min-w-0 flex-1 border-2 border-gray-300 rounded-md px-3 py-2 text-text-black"
    />
  );
}
