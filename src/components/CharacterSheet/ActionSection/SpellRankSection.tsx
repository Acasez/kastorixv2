import { useCharacter } from "../../../contexts/CharacterContext";
import type { Spell } from "../../../types/Spells";
import SpellComponent from "./SpellComponent";

interface SpellRankSectionProps {
  rankName: string;
  baseDC: number;
  manaCost: number;
  unlockedAtLevel: number;
  onAddSpell: (rankName: string) => void;
  onReplaceSpell: (rankName: string, spellName: string) => void;
  onRemoveSpell: (spellName: string) => void;
  selectedSpells: Spell[];
  baseSpellshapingBonus: number;
}

export default function SpellRankSection({
  rankName,
  baseDC,
  manaCost,
  unlockedAtLevel,
  onAddSpell,
  onReplaceSpell,
  onRemoveSpell,
  selectedSpells,
  baseSpellshapingBonus,
}: SpellRankSectionProps) {
  const { character } = useCharacter();
  const maxKnownSpells =
    character.level >= unlockedAtLevel ? character.baseStats.INT : 0;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg underline">{rankName} Spells</span>

        <p>
          DC {baseDC}, Complex DC {baseDC + 3}, Mana Cost {manaCost}
        </p>
        <div className="flex flex-row gap-2">
          <p
            className={`text-right ${
              selectedSpells.length > maxKnownSpells
                ? "text-red-500"
                : selectedSpells.length < maxKnownSpells
                  ? "text-green-500"
                  : "text-text-light"
            }`}
          >
            Selected Spells ({selectedSpells.length}/{maxKnownSpells})
          </p>

          <button
            type="button"
            className="bg-gray-600 text-white px-3 py-1 rounded"
            onClick={() => onAddSpell(rankName)}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedSpells.map((spell) => (
          <SpellComponent
            spell={spell}
            onRemoveSpell={onRemoveSpell}
            onReplaceSpell={onReplaceSpell}
            baseSpellshapingBonus={baseSpellshapingBonus}
            rankName={rankName}
          />
        ))}
      </div>
    </div>
  );
}
