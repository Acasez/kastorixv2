import { useEffect, useMemo } from "react";
import { useCharacter } from "../../../contexts/CharacterContext";
import { ThreeOptionSwitch } from "../../ThreeOptionSwitch";
import type {
  SomaticComponent,
  VerbalComponent,
} from "../../../types/Spellshaping";

export default function SpellsSection() {
  const { character, updateCharacter } = useCharacter();
  const { verbal, somatic } = character.spellShaping;

  // Derived, never stored in local state
  const spellshapingBonus = useMemo(() => {
    const proficiency = parseInt(character.spellShaping.proficiency) || 0;
    const verbalBonus =
      verbal === "Standard"
        ? character.baseStats.INT
        : verbal === "Attuned"
          ? character.baseStats.WIL
          : 0;
    const somaticBonus =
      somatic === "One Handed"
        ? character.baseStats.DEX / 2
        : somatic === "Two Handed"
          ? character.baseStats.DEX
          : 0;
    return proficiency + verbalBonus + somaticBonus;
  }, [
    character.spellShaping.proficiency,
    verbal,
    somatic,
    character.baseStats,
  ]);

  // Only sync when the computed bonus actually differs
  const bonusStr = String(spellshapingBonus);
  useEffect(() => {
    if (character.spellShaping.totalBonus === bonusStr) return;
    updateCharacter({
      spellShaping: { ...character.spellShaping, totalBonus: bonusStr },
    });
  }, [bonusStr, character.spellShaping, updateCharacter]);

  return (
    <div className="p-4 text-white">
      <div className="flex flex-row gap-3 mb-4">
        <h1 className="text-2xl">Spellshaping bonus: {spellshapingBonus}</h1>
        <ThreeOptionSwitch<VerbalComponent>
          options={["None", "Standard", "Attuned"]}
          value={verbal}
          onChange={(v) =>
            updateCharacter({
              spellShaping: { ...character.spellShaping, verbal: v },
            })
          }
        />
        <ThreeOptionSwitch<SomaticComponent>
          options={["None", "One Handed", "Two Handed"]}
          value={somatic}
          onChange={(v) =>
            updateCharacter({
              spellShaping: { ...character.spellShaping, somatic: v },
            })
          }
        />
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg">Apprentice Spells</span>
          <button className="bg-gray-600 text-white px-3 py-1 rounded">
            +
          </button>
        </div>
        <p>DC 12, Complex DC 15, Mana Cost 3</p>
        <p>Selected Spells (0/0)</p>
      </div>
    </div>
  );
}
