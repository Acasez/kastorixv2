/* CoreStatsSection.tsx; */
import { getProficiency } from "../../../constants/Proficiency";
import { STRING_TO_STATKEY } from "../../../constants/StatKey";
import { useCharacter } from "../../../contexts/CharacterContext";
import ProficiencyMarker from "../../ProficiencyMarker";

export default function SavingThrowDisplay() {
  const { character } = useCharacter();
  return (
    <div>
      <h1 className="text-3xl text-striking text-center underline mb-2">
        Saving Throws
      </h1>
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
              className="flex items-center gap-1.5 rounded border-2 border-red-500 px-2 py-1 text-lg"
            >
              <span className="text-sky-500 font-semibold">
                {save.name} ({save.stat}):
              </span>
              <ProficiencyMarker skillName={save.name} category="saves" />
              <span className="text-2xl text-text-light">{bonus}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
