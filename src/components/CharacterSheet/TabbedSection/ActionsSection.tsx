import { useMemo, useState } from "react";
import actions from "../../../json/actions.json";
import { getActionIcons } from "../../../utils/actionUtils";

const ACTION_COSTS = ["All", "0", "1", "2", "3", "Reaction"] as const;
type ActionCost = (typeof ACTION_COSTS)[number];

export default function ActionsSection() {
  const [search, setSearch] = useState("");
  const [costFilter, setCostFilter] = useState<ActionCost>("All");
  const [sortDescending, setSortDescending] = useState(false);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  const baseActions = useMemo(
    () =>
      actions
        .filter((action) => action.sourceType === "Base")
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
    [costFilter, search, sortDescending],
  );

  return (
    <section className="bg-[#20262f] px-4 py-5 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 border-b border-[#3a4350] pb-4 lg:flex-row lg:items-end">
          <label className="flex-1 text-sm text-gray-300">
            Search actions
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, trait, or text"
              className="mt-1 block w-full border border-[#3a4350] bg-[#293340] px-3 py-2 text-base text-white outline-none placeholder:text-gray-400 focus:border-[#4da6ff]"
            />
          </label>
          <label className="text-sm text-gray-300">
            Sort
            <select
              value={sortDescending ? "descending" : "ascending"}
              onChange={(event) =>
                setSortDescending(event.target.value === "descending")
              }
              className="mt-1 block border border-[#3a4350] bg-[#293340] px-3 py-2 text-base text-white outline-none focus:border-[#4da6ff]"
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
                  ? "border-[#4da6ff] bg-[#33475d] text-white"
                  : "border-[#3a4350] text-gray-300 hover:border-[#4da6ff]"
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
            {baseActions.length}{" "}
            {baseActions.length === 1 ? "action" : "actions"}
          </span>
        </div>

        <div className="divide-y divide-[#343d49] border-y border-[#343d49]">
          {baseActions.map((action) => {
            const isExpanded = expandedAction === action.name;
            const actionIcons = getActionIcons(action.actions);

            return (
              <article key={action.name}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedAction(isExpanded ? null : action.name)
                  }
                  aria-expanded={isExpanded}
                  className="flex w-full items-center gap-3 px-2 py-3 text-left hover:bg-[#293340]"
                >
                  <span className="flex min-w-20 items-center gap-1">
                    {actionIcons.map((icon, index) => (
                      <img
                        key={`${action.name}-${index}`}
                        src={icon}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    ))}
                  </span>
                  <span className="flex-1 font-semibold">{action.name}</span>
                  <span className="text-sm text-gray-400">
                    {action.actions}
                  </span>
                  <span aria-hidden="true" className="text-gray-400">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#343d49] bg-[#242b34] px-5 py-4 text-sm leading-6 text-gray-200">
                    {action.trigger && (
                      <p>
                        <strong className="text-white">Trigger:</strong>{" "}
                        {action.trigger}
                      </p>
                    )}
                    {action.requirement && (
                      <p>
                        <strong className="text-white">Requirement:</strong>{" "}
                        {action.requirement}
                      </p>
                    )}
                    <div className="mt-2 whitespace-pre-line">
                      {action.description}
                    </div>
                    {action.traits && (
                      <p className="mt-3 text-gray-400">
                        <strong className="text-gray-300">Traits:</strong>{" "}
                        {action.traits}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {baseActions.length === 0 && (
          <p className="py-8 text-center text-gray-400">
            No Base actions match these filters.
          </p>
        )}
      </div>
    </section>
  );
}
