import { useMemo, useState } from "react";
import { useCharacter } from "../../../contexts/CharacterContext";
import actions from "../../../json/actions.json";
import advantages from "../../../JSON/advantages.json";
import ancestryFeats from "../../../JSON/ancestry_feats.json";
import arcaneFeats from "../../../JSON/arcane_feats.json";
import generalFeats from "../../../JSON/general_feats.json";
import species from "../../../JSON/species.json";
import { getActionIcons } from "../../../utils/actionUtils";

const ACTION_COSTS = ["All", "0", "1", "2", "3", "Reaction"] as const;
type ActionCost = (typeof ACTION_COSTS)[number];

export default function ActionsSection() {
  const { character } = useCharacter();
  const [search, setSearch] = useState("");
  const [costFilter, setCostFilter] = useState<ActionCost>("All");
  const [sortDescending, setSortDescending] = useState(false);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  const unlockedActionNames = useMemo(() => {
    const selectedNamesByType = {
      "General Feat": new Set([
        ...character.generalFeats,
        ...Object.entries(character.selections)
          .filter(([key]) => key.startsWith("generalFeat:"))
          .map(([, value]) => value),
      ]),
      "Arcane Feat": new Set([
        ...character.arcaneFeats,
        ...Object.entries(character.selections)
          .filter(([key]) => key.startsWith("arcaneFeat:"))
          .map(([, value]) => value),
      ]),
      Advantage: new Set([
        ...character.advantages,
        ...Object.entries(character.selections)
          .filter(([key]) => key.startsWith("advantage:"))
          .map(([, value]) => value),
      ]),
      "Ancestry Feat": new Set([
        ...character.ancestryFeats,
        ...Object.entries(character.selections)
          .filter(([key]) => key.startsWith("ancestryFeat:"))
          .map(([, value]) => value),
      ]),
    };

    const featSources = [
      ["General Feat", generalFeats],
      ["Arcane Feat", arcaneFeats],
      ["Advantage", advantages],
      ["Ancestry Feat", ancestryFeats],
    ] as const;

    const selectedSpecies = species.find(
      (speciesOption) => speciesOption.name === character.species,
    );
    const unlockedFeatActions = featSources.flatMap(([sourceType, featList]) =>
      featList
        .filter((feat) => selectedNamesByType[sourceType].has(feat.name))
        .map((feat) => feat.unlockedAction)
        .filter(Boolean),
    );

    return new Set(
      selectedSpecies?.unlockedAction
        ? [...unlockedFeatActions, selectedSpecies.unlockedAction]
        : unlockedFeatActions,
    );
  }, [
    character.advantages,
    character.arcaneFeats,
    character.ancestryFeats,
    character.generalFeats,
    character.selections,
    character.species,
  ]);

  const availableActions = useMemo(
    () =>
      actions.filter(
        (action) =>
          action.sourceType === "Base" || unlockedActionNames.has(action.name),
      ),
    [unlockedActionNames],
  );

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
              className="mt-1 block w-full border border-[#3a4350] bg-[#293340] px-3 py-2 text-base text-white outline-none placeholder:text-gray-400 focus:border-text-calm"
            />
          </label>
          <label className="text-sm text-gray-300">
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
          {filteredActions.map((action) => {
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
                    {isExpanded ? "-" : "+"}
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
                    {action.sourceType !== "Base" && action.source && (
                      <p className="mt-2 text-gray-400">
                        Source: {action.sourceType} - {action.source}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filteredActions.length === 0 && (
          <p className="py-8 text-center text-gray-400">
            No available actions match these filters.
          </p>
        )}
      </div>
    </section>
  );
}
