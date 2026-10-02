import { getProficiency } from "../../constants/Proficiency";
import { useCreature } from "../../contexts/CreatureContext";
import armors from "../../JSON/armors.json";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import CreatureHeader from "./CreatureHeader";

const SAVING_THROWS = [
  { name: "Fortitude", stat: "PHY" },
  { name: "Reflex", stat: "DEX" },
  { name: "Will", stat: "WIL" },
] as const;

export default function CreatureSavingThrows() {
  const { creature, updateCreature } = useCreature();
  const selectedArmor = armors.find((armor) => armor.name === creature.armor);
  const reflexPenalty =
    selectedArmor?.type === "Heavy" ? Number(selectedArmor.penalties) : 0;

  return (
    <section>
      <CreatureHeader title="Saving Throws" />
      <div className="grid grid-cols-3 gap-3">
        {SAVING_THROWS.map((save) => {
          const tierName = creature.savingThrows[save.name];
          const tier = getProficiency(tierName);
          const bonus =
            creature.stats[save.stat] +
            tier.bonus +
            (save.name === "Reflex" ? reflexPenalty : 0);

          return (
            <div
              className="flex items-center justify-center gap-1 rounded border-2 border-red-500 px-2 py-1 text-sm"
              key={save.name}
            >
              <span className="font-semibold text-sky-500">
                {save.name} ({save.stat})
              </span>
              <ProficiencyMarker
                skillName={save.name}
                proficiency={tierName}
                onProficiencyChange={(proficiency) =>
                  updateCreature({
                    savingThrows: {
                      ...creature.savingThrows,
                      [save.name]: proficiency,
                    },
                  })
                }
              />
              <span
                className="text-xl text-text-light"
                aria-label={`${save.name} bonus ${bonus}`}
              >
                {bonus > 0 ? `+${bonus}` : bonus}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
