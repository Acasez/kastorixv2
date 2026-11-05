import { useMemo, useState } from "react";
import actions from "../../../data/actions";
import ActionRow from "./ActionComponent";
import { useCharacter } from "../../../hooks/useCharacter";

const ACTION_COSTS = ["All", "0", "1", "2", "3", "Reaction"] as const;
type ActionCost = (typeof ACTION_COSTS)[number];

export default function ActionsSection() {
  const [search, setSearch] = useState("");
  const [costFilter, setCostFilter] = useState<ActionCost>("All");
  const [sortDescending, setSortDescending] = useState(false);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const { character } = useCharacter();

  const availableActions = useMemo(() => {
    // Create a Set for fast lookup of unlocked action names
    const unlockedActionNames = new Set(character.unlockedActions);

    // Show actions that are either Base OR in unlockedActions
    return actions.filter(
      (action) =>
        action.sourceType === "Base" || unlockedActionNames.has(action.name),
    );
  }, [character.unlockedActions]);

  const filteredActions = useMemo(
    () =>
      availableActions
        .filter((action) => {
          const searchValue = search.trim().toLowerCase();
          if (!searchValue) return true;
          return `${action.name} ${action.description} ${action.traits}`
            .toLowerCase()
            .includes(searchValue);
        })
        .filter(
          (action) => costFilter === "All" || action.actions === costFilter,
        )
        .sort((first, second) => {
          const comparison = first.name.localeCompare(second.name);
          return sortDescending ? -comparison : comparison;
        }),
    [availableActions, costFilter, search, sortDescending],
  );

  return (
    <div className="bg-bg-obsidian text-text-light px-5 py-2">
      <h1 className="text-2xl font-bold underline">Available Actions List</h1>
      <div className="mb-5 flex flex-col gap-3 border-b border-[#3a4350] pb-4 lg:flex-row lg:items-end">
        <label className="flex-1 text-sm text-text-light">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, trait, or text"
            className="mt-1 block w-full border border-[#3a4350] bg-[#293340] px-3 py-2 text-base text-white outline-none placeholder:text-gray-400 focus:border-text-calm"
          />
        </label>
        <label className="text-sm text-text-light">
          Sort
          <select
            value={sortDescending ? "descending" : "ascending"}
            onChange={(event) =>
              setSortDescending(event.target.value === "descending")
            }
            className="mt-1 block border border-[#3a4350] bg-[#293340] px-3 py-2 text-base text-white outline-none focus:border-text-calm"
          >
            <option value="ascending">Names A-Z</option>
            <option value="descending">Names Z-A</option>
          </select>
        </label>
      </div>

      <div
        className="mb-4 flex flex-wrap items-center gap-2"
        aria-label="Filter by action cost"
      >
        <span className="mr-1 text-sm text-gray-300">Cost</span>
        {ACTION_COSTS.map((cost) => (
          <button
            key={cost}
            type="button"
            onClick={() => setCostFilter(cost)}
            aria-pressed={costFilter === cost}
            className={`border px-3 py-1 text-sm transition-colors ${
              costFilter === cost
                ? "border-text-calm bg-[#33475d] text-white"
                : "border-[#3a4350] text-gray-300 hover:border-text-calm"
            }`}
          >
            {cost === "All"
              ? cost
              : cost === "Reaction"
                ? cost
                : `${cost} action${cost === "1" ? "" : "s"}`}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">
          {filteredActions.length}{" "}
          {filteredActions.length === 1 ? "action" : "actions"}
        </span>
      </div>

      <div className="divide-y divide-[#343d49] border-y border-[#343d49]">
        {filteredActions.map((action) => (
          <ActionRow
            key={action.name}
            action={action}
            isExpanded={expandedAction === action.name}
            onToggle={(name) =>
              setExpandedAction((current) => (current === name ? null : name))
            }
          />
        ))}
      </div>

      {filteredActions.length === 0 && (
        <p className="py-8 text-center text-gray-400">
          No available actions match these filters.
        </p>
      )}
    </div>
  );
}
