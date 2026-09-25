import { STAT_COLORS } from "../../constants/Stats";
import { useCharacter } from "../../contexts/CharacterContext";
import type { StatKey } from "../../types/StatKey";
import { useState } from "react";

type BaseStatArray = 3 | 1 | 0 | -1;

const BASE_STAT_VALUES: BaseStatArray[] = [3, 1, 0, -1];

const BASE_STAT_KEYS: { key: StatKey; label: string }[] = [
  { key: "PHY", label: "Physique" },
  { key: "DEX", label: "Dexterity" },
  { key: "INT", label: "Intelligence" },
  { key: "WIL", label: "Willpower" },
];

const formatValue = (value: BaseStatArray) =>
  value > 0 ? `+${value}` : `${value}`;

/**
 * Builds a valid assignment from a partial one:
 * values not explicitly assigned are handed out (in BASE_STAT_VALUES
 * order) to the stats that don't have one yet. The result is always a
 * permutation of BASE_STAT_VALUES.
 */
function buildAssignment(
  assigned: Partial<Record<StatKey, BaseStatArray>>,
): Record<StatKey, BaseStatArray> {
  const used = new Set(Object.values(assigned));
  const remaining = BASE_STAT_VALUES.filter((v) => !used.has(v));
  let i = 0;
  return Object.fromEntries(
    BASE_STAT_KEYS.map(({ key }) => [key, assigned[key] ?? remaining[i++]]),
  ) as Record<StatKey, BaseStatArray>;
}

function normalizeBaseStats(
  stats: Record<StatKey, number>,
): Record<StatKey, BaseStatArray> {
  const values = BASE_STAT_KEYS.map(({ key }) => stats[key]);
  const isValid =
    values.every((v) => BASE_STAT_VALUES.includes(v as BaseStatArray)) &&
    new Set(values).size === BASE_STAT_VALUES.length;

  return isValid
    ? (Object.fromEntries(
        BASE_STAT_KEYS.map(({ key }) => [key, stats[key] as BaseStatArray]),
      ) as Record<StatKey, BaseStatArray>)
    : buildAssignment({});
}

export function BaseStatsEditor({ closeModal }: { closeModal: () => void }) {
  const { character, updateCharacter } = useCharacter();
  const [baseStats, setBaseStats] = useState<Record<StatKey, BaseStatArray>>(
    () => normalizeBaseStats(character.baseStats),
  );
  const [selectedValue, setSelectedValue] = useState<BaseStatArray | null>(
    null,
  );

  const statOwningValue = (value: BaseStatArray) =>
    BASE_STAT_KEYS.find(({ key }) => baseStats[key] === value)?.key;

  /**
   * Two-tap assignment: tap a value in the pool, then tap a stat.
   * The stat's previous value returns to the pool.
   */
  const assignTo = (key: StatKey) => {
    if (selectedValue === null) return;
    setBaseStats((current) => {
      const next = { ...current };
      const displaced = current[key];
      next[key] = selectedValue;
      // Give the displaced value to whoever held the selected value, if anyone.
      const previousOwner = BASE_STAT_KEYS.find(
        ({ key: k }) => k !== key && next[k] === selectedValue,
      )?.key;
      if (previousOwner) {
        next[previousOwner] = displaced;
      }
      return next;
    });
    setSelectedValue(null);
  };

  const resetToDefault = () => {
    setBaseStats(buildAssignment({}));
    setSelectedValue(null);
  };

  const confirmStats = () => {
    updateCharacter({ baseStats });
    closeModal();
  };

  return (
    <div className="space-y-4">
      {/* Value pool: tap one, then tap a stat below to place it. */}
      <div className="flex items-center justify-center gap-2">
        {BASE_STAT_VALUES.map((value) => {
          const owner = statOwningValue(value);
          const isSelected = selectedValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedValue(isSelected ? null : value)}
              className={`rounded-md border-2 px-3 py-2 text-lg font-bold transition ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : owner
                    ? "border-gray-300 bg-gray-100 text-gray-500"
                    : "border-blue-400 bg-white text-blue-700 hover:bg-blue-50"
              }`}
              title={owner ? `Currently on ${owner}` : "Unassigned"}
            >
              {formatValue(value)}
              {owner && !isSelected && (
                <span className="ml-1 text-xs font-semibold">{owner}</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-600">
        {selectedValue === null
          ? "Tap a value above, then tap a stat to place it."
          : `Placing ${formatValue(selectedValue)} — tap a stat below.`}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {BASE_STAT_KEYS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => assignTo(key)}
            className={`flex items-center justify-between gap-4 rounded-md border-2 p-3 text-left transition ${
              selectedValue !== null
                ? "border-orange-400 bg-sky-100 hover:bg-sky-200"
                : "border-gray-200 bg-sky-100 opacity-80"
            }`}
          >
            <span className="font-semibold text-gray-800">
              <span className={`mr-2 font-bold ${STAT_COLORS[key]}`}>
                {key}
              </span>
              {label}
            </span>
            <span className="rounded-md bg-white px-3 py-1 text-lg font-bold text-gray-800">
              {formatValue(baseStats[key])}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={confirmStats}
        >
          Set Base Stats
        </button>
        <button
          type="button"
          className="rounded-md border-2 border-blue-400 px-4 py-2 font-bold text-blue-700 hover:bg-blue-50"
          onClick={resetToDefault}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
