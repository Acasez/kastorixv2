import { useState } from "react";
import { useCharacter } from "../../../hooks/useCharacter";
import { MANA_DENSITY } from "../../../constants/ManaDensity";
import armors from "../../../JSON/armors.json";

function getManaRecoveryMultiplier(manaRecovery: string | undefined) {
  if (!manaRecovery) return 1;

  const [numerator, denominator] = manaRecovery.split("/").map(Number);
  return denominator > 0 ? numerator / denominator : 1;
}

export default function RestMenu() {
  const { character, updateCharacter } = useCharacter();

  const [manaDensityMenuOpen, setManaDensityMenuOpen] = useState(false);
  const selectedManaDensity =
    MANA_DENSITY.find((zone) => zone.name === character.manaDensity) ??
    MANA_DENSITY.find((zone) => zone.name === "Normal")!;
  const selectedArmor = armors.find((armor) => armor.name === character.armor);
  const manaRecoveryMultiplier = getManaRecoveryMultiplier(
    selectedArmor?.manaRecovery,
  );
  return (
    <div className="flex flex-col gap-2">
      <button
        className="bg-blue-500 text-text-light rounded-xl px-2 py-1"
        onClick={() =>
          updateCharacter({
            health: {
              ...character.health,
              current: character.health.max,
            },
            mana: { ...character.mana, current: character.mana.max },
            aura: { ...character.aura, current: character.aura.max },
          })
        }
      >
        Long Rest
      </button>
      <button
        className="bg-blue-500 text-text-light rounded-xl px-2 py-1"
        onClick={() =>
          updateCharacter({
            mana: {
              ...character.mana,
              current: Math.min(
                character.mana.max,
                character.mana.current +
                  Math.floor(
                    selectedManaDensity.hourlyRate * manaRecoveryMultiplier,
                  ),
              ),
            },
          })
        }
        type="button"
      >
        Short Rest
      </button>
      <div className="relative">
        <button
          className="bg-blue-200 text-text-black rounded-xl px-2 py-1 w-full"
          onClick={() => setManaDensityMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          Mana Density: {selectedManaDensity.name}
        </button>
        {manaDensityMenuOpen && (
          <div className="absolute z-10 mt-1 flex w-full flex-col gap-1 rounded-lg bg-gray-700 p-1">
            {MANA_DENSITY.map((zone) => (
              <button
                className="rounded-lg px-2 py-1 text-left text-text-light hover:bg-blue-200"
                key={zone.name}
                onClick={() => {
                  updateCharacter({ manaDensity: zone.name });
                  setManaDensityMenuOpen(false);
                }}
                type="button"
              >
                {zone.name} ({zone.hourlyRate} mana/hour)
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
