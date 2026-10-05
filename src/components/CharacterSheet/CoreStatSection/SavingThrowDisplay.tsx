/* CoreStatsSection.tsx; */
import { getProficiency } from "../../../constants/Proficiency";
import { STRING_TO_STATKEY } from "../../../types/StatKey";
import { useCharacter } from "../../../hooks/useCharacter";
import ProficiencyMarker from "../../Buttons/ProficiencyMarker";
import armors from "../../../JSON/armors.json";
import Tooltip from "../../Tooltip";

export default function SavingThrowDisplay() {
  const { character } = useCharacter();
  const selectedArmor = armors.find((armor) => armor.name === character.armor);
  const heavyArmorPenalty =
    selectedArmor?.type === "Heavy" ? Number(selectedArmor.penalties) : 0;
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
          const bonus =
            stat +
            tier.bonus +
            (save.name === "Reflex" ? heavyArmorPenalty : 0);
          return (
            <div
              key={save.name}
              className="flex items-center gap-1.5 rounded border-2 border-red-500 px-2 py-1 text-lg"
            >
              <span className="text-sky-500 font-semibold">
                {save.name} ({save.stat}):
              </span>
              <ProficiencyMarker skillName={save.name} category="saves" />
              <Tooltip
                align="center"
                content={`${save.stat} ${bonus} + ${tier.fullName} ${tier.bonus}${save.name === "Reflex" ? ` + ${character.armor} ${heavyArmorPenalty}` : ""}`}
              >
                <span className="text-2xl text-text-light">{bonus}</span>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}
