import { useEffect, useState } from "react";
import {
  useCharacter,
  type Character,
} from "../../../contexts/CharacterContext";

export default function SpellsSection() {
  const { character, updateCharacter } = useCharacter();

  // Local state for toggle boxes (optional: could also use `character.spellShaping.verbal/somatic` directly)
  const [useVerbal, setUseVerbal] = useState(character.spellShaping.verbal);
  const [useSomatic, setUseSomatic] = useState(character.spellShaping.somatic);

  // Calculate the spellshaping bonus
  const calculateBonus = () => {
    const proficiency = parseInt(character.spellShaping.proficiency) || 0;
    const verbalBonus = useVerbal ? character.baseStats.INT : 0;
    const somaticBonus = useSomatic ? character.baseStats.DEX : 0;
    return proficiency + verbalBonus + somaticBonus;
  };

  const spellshapingBonus = calculateBonus();

  // Update the character's spellShaping.totalBonus and toggles
  useEffect(() => {
    const patch: Partial<Character> = {
      spellShaping: {
        ...character.spellShaping,
        verbal: useVerbal,
        somatic: useSomatic,
        totalBonus: spellshapingBonus.toString(),
      },
    };
    updateCharacter(patch);
  }, [
    useVerbal,
    useSomatic,
    spellshapingBonus,
    character.spellShaping,
    updateCharacter,
  ]);

  return (
    <div className="p-4 text-white">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl">Spellshaping Bonus: {spellshapingBonus}</h2>
        <div className="flex gap-2">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={useVerbal}
              onChange={() => setUseVerbal(!useVerbal)}
              className="w-4 h-4"
            />
            Verbal (INT)
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={useSomatic}
              onChange={() => setUseSomatic(!useSomatic)}
              className="w-4 h-4"
            />
            Somatic (DEX)
          </label>
        </div>
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
