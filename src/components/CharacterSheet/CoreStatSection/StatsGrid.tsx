import type { StatKey } from "../../../types/StatKey";
import { STAT_COLORS } from "../../../constants/Stats";
import { useCharacter } from "../../../contexts/CharacterContext";
import NumberInput from "../../NumberInput";

// StatsGrid.tsx
const STATS: { key: StatKey; name: string }[] = [
  { key: "PHY", name: "Physique" },
  { key: "DEX", name: "Dexterity" },
  { key: "INT", name: "Intelligence" },
  { key: "WIL", name: "Willpower" },
];

export default function StatsSection() {
  const { character, updateCharacter } = useCharacter();

  return (
    <div>
      <h1 className="text-3xl text-striking text-center underline mb-2">
        Stats
      </h1>
      <div className="grid grid-cols-4 gap-4 px-4">
        {STATS.map(({ key, name }) => (
          <div
            key={key}
            className="rounded-md border-2 border-orange-400 bg-sky-100 p-2 text-center"
          >
            <div className="mb-1 font-semibold text-sky-600 text-xl">
              {name}
            </div>
            <div className="flex items-center justify-between gap-2 rounded bg-white px-2 py-1">
              <span className={`font-bold text-lg ${STAT_COLORS[key]}`}>
                {key}
              </span>
              <NumberInput
                value={character.baseStats[key] ?? 0}
                onChange={(value) =>
                  updateCharacter({
                    baseStats: { ...character.baseStats, [key]: value },
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
