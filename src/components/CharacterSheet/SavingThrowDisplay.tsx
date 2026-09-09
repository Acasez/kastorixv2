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
              className="flex items-center gap-1.5 rounded border border-blue-300 px-2 py-1 text-sm"
            >
              <span className="text-blue-300">{save.name}</span>
              <ProficiencyMarker skillName={save.name} category="saves" />
              <span>{bonus}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
