import { getActionIcons } from "../../../utils/actionUtils";
import ProficiencyMarker from "../../ProficiencyMarker";
import { getProficiency } from "../../../constants/Proficiency";
import { useCharacter } from "../../../contexts/CharacterContext";

interface SpellRankSectionProps {
  rankName: string;
  baseDC: number;
  manaCost: number;
  onAddSpell: (rankName: string) => void;
  onReplaceSpell: (rankName: string, spellName: string) => void;
  onRemoveSpell: (spellName: string) => void;
  selectedSpells: { name: string; actions: string }[];
  baseSpellshapingBonus: number;
}

export default function SpellRankSection({
  rankName,
  baseDC,
  manaCost,
  onAddSpell,
  onReplaceSpell,
  onRemoveSpell,
  selectedSpells,
  baseSpellshapingBonus,
}: SpellRankSectionProps) {
  const { character } = useCharacter();
  const maxKnownSpells = character.baseStats.INT;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg underline">{rankName} Spells</span>
        <button
          type="button"
          className="bg-gray-600 text-white px-3 py-1 rounded"
          onClick={() => onAddSpell(rankName)}
        >
          +
        </button>
      </div>
      <p>
        DC {baseDC}, Complex DC {baseDC + 3}, Mana Cost {manaCost}
      </p>

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
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedSpells.map((spell) => (
          <div
            key={spell.name}
            role="button"
            tabIndex={0}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              onReplaceSpell(rankName, spell.name);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onReplaceSpell(rankName, spell.name);
              }
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              if ((event.target as HTMLElement).closest("button")) return;
              onRemoveSpell(spell.name);
            }}
            className="flex items-center gap-1 border border-gray-400 rounded px-2 py-1"
          >
            <span>{spell.name}</span>
            {getActionIcons(spell.actions).map((icon, index) => (
              <img
                key={`${spell.name}-action-${index}`}
                src={icon}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain"
              />
            ))}
            <ProficiencyMarker skillName={spell.name} defaultTier="Trained" />
            <span>
              {`(+${
                baseSpellshapingBonus +
                getProficiency(
                  character.skillProficiencies[spell.name] ?? "Trained",
                ).bonus
              })`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
