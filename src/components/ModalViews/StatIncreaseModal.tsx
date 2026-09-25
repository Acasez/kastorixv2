import { useState } from "react";
import { STAT_COLORS } from "../../constants/Stats";
import type { StatKey } from "../../types/StatKey";
import { useCharacter } from "../../contexts/CharacterContext";

const STATS: { key: StatKey; label: string }[] = [
  { key: "PHY", label: "Physique" },
  { key: "DEX", label: "Dexterity" },
  { key: "INT", label: "Intelligence" },
  { key: "WIL", label: "Willpower" },
];

const isStatKey = (value: string | undefined): value is StatKey =>
  value !== undefined && STATS.some(({ key }) => key === value);

export function StatIncreaseModal({
  selectionKey,
  closeModal,
}: {
  selectionKey: string;
  closeModal: () => void;
}) {
  const { character, updateCharacter } = useCharacter();
  const statIncreaseSelections = Object.entries(character.selections)
    .filter(([key]) => key.startsWith("statIncrease:"))
    .sort(
      ([firstKey], [secondKey]) =>
        Number(firstKey.split(":")[1]) - Number(secondKey.split(":")[1]),
    );
  const currentIndex = statIncreaseSelections.findIndex(
    ([key]) => key === selectionKey,
  );
  const adjacentSelections = [
    currentIndex > 0
      ? statIncreaseSelections[currentIndex - 1]?.[1]
      : currentIndex === -1
        ? statIncreaseSelections.at(-1)?.[1]
        : undefined,
    currentIndex >= 0
      ? statIncreaseSelections[currentIndex + 1]?.[1]
      : undefined,
  ];
  const adjacentStats = new Set(adjacentSelections.filter(isStatKey));
  const [selectedStat, setSelectedStat] = useState<StatKey | null>(() => {
    const selected = character.selections[selectionKey];
    return isStatKey(selected) ? (selected as StatKey) : null;
  });

  const confirmIncrease = () => {
    if (!selectedStat || adjacentStats.has(selectedStat)) return;

    const previousSelection = character.selections[selectionKey];
    const previousStat = isStatKey(previousSelection)
      ? (previousSelection as StatKey)
      : null;

    if (previousStat === selectedStat) {
      closeModal();
      return;
    }

    const baseStats = { ...character.baseStats };
    if (previousStat) {
      baseStats[previousStat] = (baseStats[previousStat] ?? 0) - 1;
    }
    baseStats[selectedStat] = (baseStats[selectedStat] ?? 0) + 1;

    updateCharacter({
      baseStats,
      selections: {
        ...character.selections,
        [selectionKey]: selectedStat,
      },
    });
    closeModal();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {STATS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedStat(key)}
            disabled={adjacentStats.has(key)}
            className={`flex items-center justify-between rounded-md border-2 p-3 text-left transition ${
              adjacentStats.has(key)
                ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                : selectedStat === key
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-200 bg-sky-100 hover:border-orange-400 hover:bg-sky-200"
            }`}
          >
            <span className="font-semibold text-gray-800">
              <span className={`mr-2 font-bold ${STAT_COLORS[key]}`}>
                {key}
              </span>
              {label}
            </span>
            <span className="rounded-md bg-white px-3 py-1 text-lg font-bold text-gray-800">
              {character.baseStats[key] ?? 0}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={confirmIncrease}
        disabled={selectedStat === null}
      >
        Increase Selected Stat
      </button>
    </div>
  );
}
