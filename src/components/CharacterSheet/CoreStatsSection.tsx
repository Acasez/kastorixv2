/* CoreStatsSection.tsx; */
/* import { getProficiency } from "../../constants/Proficiency";
import { useCharacter } from "../../contexts/CharacterContext";
import ProficiencyMarker from "./ProficiencyMarker"; */
import StatsGrid from "./StatsGrid";

export default function CoreStatSection() {
  /* const { character, updateCharacter } = useCharacter(); */
  return (
    <div>
      <StatsGrid />
      {/* <div className="flex items-center justify-center gap-3">
        {[
          { name: "Fortitude", stat: "PHY" },
          { name: "Reflex", stat: "DEX" },
          { name: "Will", stat: "WIL" },
        ].map((save) => {
          const tierName =
            character.saveProficiencies[save.name] ?? "Untrained";
          const tier = getProficiency(tierName);
          const stat = character.baseStats[save.stat] ?? 0;

          return (
            <div
              key={save.name}
              className="flex items-center gap-1.5 rounded border border-blue-300 px-2 py-1 text-sm"
            >
              <span className="text-blue-300">{save.name}</span>
              <ProficiencyMarker skillName={save.name} />
              <span>{clampToDice(save.bonus)}</span>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
