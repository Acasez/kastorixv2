import { useContext } from "react";
import { getProficiency } from "../../constants/Proficiency";
import type { ProficiencyTierName } from "../../constants/Proficiency";
import { CharacterContext } from "../../contexts/CharacterContext";
import type { Spell } from "../../types/Spells";
import { getActionIcons } from "../../utils/actionUtils";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import Tooltip from "../Tooltip";

interface SpellComponentProps {
  spell: Spell;
  onReplaceSpell: (rankName: string, spellName: string) => void;
  onRemoveSpell: (spellName: string) => void;
  baseSpellshapingBonus: number;
  rankName: string;
  proficiency?: ProficiencyTierName;
  onProficiencyChange?: (proficiency: ProficiencyTierName) => void;
}

export default function SpellComponent({
  spell,
  onReplaceSpell,
  onRemoveSpell,
  baseSpellshapingBonus,
  rankName,
  proficiency,
  onProficiencyChange,
}: SpellComponentProps) {
  const characterContext = useContext(CharacterContext);
  if (Boolean(proficiency) !== Boolean(onProficiencyChange)) {
    throw new Error(
      "SpellComponent requires both proficiency and onProficiencyChange in controlled mode",
    );
  }
  if (!onProficiencyChange && !characterContext) {
    throw new Error(
      "SpellComponent requires CharacterContext in character mode",
    );
  }
  const proficiencyTier =
    proficiency ??
    characterContext?.character.skillProficiencies[spell.name] ??
    "Trained";
  return (
    <Tooltip
      key={spell.name}
      content={
        <div className="w-96 max-w-[calc(100vw-2rem)] text-center">
          <h3 className="mb-2 text-base font-normal text-yellow-300 underline">
            {spell.name}
          </h3>
          <p className="flex justify-center">
            <strong>Actions:</strong>{" "}
            {getActionIcons(spell.actions).map((icon, index) => (
              <img
                key={`${spell.name}-action-${index}`}
                src={icon}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain"
              />
            ))}
          </p>
          <p>
            <strong>Aspects:</strong> {spell.aspects}
          </p>
          <p>
            <strong>Traits:</strong> {spell.traits}
          </p>
          <p>
            <strong>Range:</strong> {spell.range}
          </p>
          <p>
            <strong>Target:</strong> {spell.target}
          </p>
          {spell.duration && (
            <p>
              <strong>Duration:</strong> {spell.duration}
            </p>
          )}
          <p className="mt-2 whitespace-pre-line">
            <strong>Effect:</strong> {spell.effect}
          </p>
          {spell.upcast && (
            <p className="mt-2 whitespace-pre-line">
              <strong>Upcast:</strong> {spell.upcast}
            </p>
          )}
          <p>
            <strong>Rank:</strong> {spell.rank}
          </p>
        </div>
      }
      contentClassName="whitespace-normal"
    >
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
        {onProficiencyChange ? (
          <ProficiencyMarker
            skillName={spell.name}
            proficiency={proficiencyTier}
            onProficiencyChange={onProficiencyChange}
          />
        ) : (
          <ProficiencyMarker skillName={spell.name} defaultTier="Trained" />
        )}
        <span>
          {`(+${
            baseSpellshapingBonus + getProficiency(proficiencyTier).bonus
          })`}
        </span>
      </div>
    </Tooltip>
  );
}
