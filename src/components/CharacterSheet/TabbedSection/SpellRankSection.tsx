import { useCharacter } from "../../../hooks/useCharacter";
import type { Spell } from "../../../types/Spells";
import SpellComponent from "../../CommonCreatureComponents/SpellComponent";
import { getCharacterSpellGrant } from "../../../utils/characterSpellGrants";
import SectionLimitText from "./SectionLimitText";
import AddButton from "./AddButton";

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
  const maxKnownSpells = Math.max(
    (character.level >= unlockedAtLevel ? character.baseStats.INT : 0) +
      getCharacterSpellGrant(character, rankName),
    0,
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg underline">{rankName} Spells</span>

        <p>
          DC {baseDC}, Complex DC {baseDC + 3}, Mana Cost {manaCost}
        </p>
        <div className="flex flex-row gap-2">
          <SectionLimitText
            text="Selected Spells"
            current={selectedSpells.length}
            max={maxKnownSpells}
          />

          <AddButton onClick={() => onAddSpell(rankName)} variable={rankName} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedSpells.map((spell) => (
          <SpellComponent
            key={spell.name}
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
