import { useEffect, useMemo } from "react";
import { useCharacter } from "../../../hooks/useCharacter";
import type { SomaticComponent, VerbalComponent } from "../../../types/Spells";
import { SPELL_RANKS } from "../../../constants/SpellRanks";
import SpellRankSection from "./SpellRankSection";
import spells from "../../../data/spells";
import MetamagicsSection from "./MetamagicsSection";
import { MultiOptionSwitch } from "../../CommonCreatureComponents/MultiOptionSwitch";
import { useSpellModal } from "../../../hooks/useModalActions";

export default function SpellsSection() {
  const { character, updateCharacter } = useCharacter();
  const { openSpellModal } = useSpellModal();
  const { verbal, somatic } = character.spellShaping;

  // Derived, never stored in local state
  const spellshapingBonus = useMemo(() => {
    const verbalBonus =
      verbal === "Standard"
        ? character.baseStats.INT
        : verbal === "Attuned"
          ? character.baseStats.WIL
          : 0;
    const somaticBonus =
      somatic === "One Handed"
        ? Math.floor(character.baseStats.DEX / 2)
        : somatic === "Two Handed"
          ? character.baseStats.DEX
          : 0;
    return verbalBonus + somaticBonus;
  }, [verbal, somatic, character.baseStats]);

  // Only sync when the computed bonus actually differs
  const bonusStr = String(spellshapingBonus);
  useEffect(() => {
    if (character.spellShaping.totalBonus === bonusStr) return;
    updateCharacter({
      spellShaping: { ...character.spellShaping, totalBonus: bonusStr },
    });
  }, [bonusStr, character.spellShaping, updateCharacter]);

  const removeSpell = (spellName: string) => {
    updateCharacter({
      knownSpells: character.knownSpells.filter((name) => name !== spellName),
    });
  };

  return (
    <div className="p-4 text-white">
      <div className="flex flex-row gap-3 mb-4">
        <h1 className="text-2xl">
          Base Spellshaping bonus: {spellshapingBonus}
        </h1>
        <MultiOptionSwitch<VerbalComponent>
          options={["None", "Standard", "Attuned"]}
          value={verbal}
          onChange={(v) =>
            updateCharacter({
              spellShaping: { ...character.spellShaping, verbal: v },
            })
          }
        />
        <MultiOptionSwitch<SomaticComponent>
          options={["None", "One Handed", "Two Handed"]}
          value={somatic}
          onChange={(v) =>
            updateCharacter({
              spellShaping: { ...character.spellShaping, somatic: v },
            })
          }
        />
      </div>
      <div className="flex flex-col gap-3">
        {SPELL_RANKS.map((rank) => (
          <SpellRankSection
            key={rank.name}
            rankName={rank.name}
            baseDC={rank.DC}
            manaCost={rank.manaCost}
            unlockedAtLevel={rank.unlockedAtLevel}
            baseSpellshapingBonus={spellshapingBonus}
            selectedSpells={spells.filter(
              (spell) =>
                spell.rank === `(${rank.rank}) ${rank.name}` &&
                character.knownSpells.includes(spell.name),
            )}
            onAddSpell={(rankName) => openSpellModal(rankName)}
            onReplaceSpell={(rankName, replaceSpell) =>
              openSpellModal(rankName, replaceSpell)
            }
            onRemoveSpell={removeSpell}
          />
        ))}
      </div>
      <MetamagicsSection />
    </div>
  );
}
