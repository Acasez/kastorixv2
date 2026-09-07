import type { StatKey } from "../../constants/StatKey";
import { STAT_COLORS } from "../../constants/Stats";
import { useCharacter } from "../../contexts/CharacterContext";
import NumberInput from "../NumberInput";

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
    <div className="flex gap-3">
      {STATS.map(({ key, name }) => (
        <div
          key={key}
          className="rounded-lg border border-blue-400 p-2 text-center"
        >
          <div className="mb-1 font-semibold text-blue-400">{name}</div>
          <div className="flex items-center gap-2">
            <span className="font-bold" style={{ color: STAT_COLORS[key] }}>
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
  );
}
