import { useEffect, useMemo, useState } from "react";
import { useCharacter } from "../../../contexts/CharacterContext";
import { ThreeOptionSwitch } from "../../ThreeOptionSwitch";
import type { SomaticComponent, VerbalComponent } from "../../../types/Spells";
import { SPELL_RANKS } from "../../../constants/SpellRanks";
import SpellRankSection from "./SpellRankSection";
import ModalWrapper from "../../ModalViews/ModalWrapper";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import spells from "../../../JSON/spells.json";

export default function SpellsSection() {
  const { character, updateCharacter } = useCharacter();
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);
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

  const openSpellModal = (rankName: string) => {
    openSpellModalForReplacement(rankName);
  };

  const openSpellModalForReplacement = (
    rankName: string,
    replaceSpell?: string,
  ) => {
    setModalRequest({
      type: "spell",
      title: replaceSpell
        ? `Replace ${replaceSpell}`
        : `Select ${rankName} Spell`,
      selectionKey: "",
      level: 0,
      rank: rankName,
      replaceSpell,
    });
  };

  return (
    <div className="p-4 text-white">
      <div className="flex flex-row gap-3 mb-4">
        <h1 className="text-2xl">
          Base Spellshaping bonus: {spellshapingBonus}
        </h1>
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
      <div className="flex flex-col gap-3">
        {SPELL_RANKS.map((rank) => (
          <SpellRankSection
            key={rank.name}
            rankName={rank.name}
            baseDC={rank.DC}
            manaCost={rank.manaCost}
            baseSpellshapingBonus={spellshapingBonus}
            selectedSpells={spells.filter(
              (spell) =>
                spell.rank.endsWith(` ${rank.name}`) &&
                character.knownSpells.includes(spell.name),
            )}
            onAddSpell={openSpellModal}
            onReplaceSpell={openSpellModalForReplacement}
          />
        ))}
      </div>
      {modalRequest && (
        <ModalWrapper
          request={modalRequest}
          closeModal={() => setModalRequest(null)}
        />
      )}
    </div>
  );
}
