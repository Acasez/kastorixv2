/* CoreStatsSection.tsx; */
import { getProficiency } from "../../constants/Proficiency";
import { STRING_TO_STATKEY } from "../../constants/StatKey";
import { useCharacter } from "../../contexts/CharacterContext";
import ProficiencyMarker from "./ProficiencyMarker";

export default function SavingThrowDisplay() {
  const { character } = useCharacter();
  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        {[
          { name: "Fortitude", stat: "PHY" },
          { name: "Reflex", stat: "DEX" },
          { name: "Will", stat: "WIL" },
        ].map((save) => {
          const tierName =
            character.saveProficiencies[save.name] ?? "Untrained";
          const tier = getProficiency(tierName);
          const stat = character.baseStats[STRING_TO_STATKEY[save.stat]] ?? 0;
          const bonus = stat + tier.bonus;
          return (
            <div
              key={save.name}
              className="flex items-center gap-1.5 rounded border border-striking px-2 py-1 text-lg"
            >
              <span className="text-text-calm text-2xl">{save.name}</span>
              <ProficiencyMarker
                text-gray-200
                skillName={save.name}
                category="saves"
              />
              <span className="text-text-light text-2xl">{bonus}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
