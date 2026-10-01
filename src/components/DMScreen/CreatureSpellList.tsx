import { useState } from "react";
import spells from "../../JSON/spells.json";
import type { ProficiencyTierName } from "../../constants/Proficiency";
import { useCreature } from "../../contexts/CreatureContext";
import ChoiceModal from "../ModalViews/ChoiceModal";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import { getSpellChoiceItems } from "../ModalViews/choiceData";
import SpellComponent from "../CharacterSheet/TabbedSection/SpellComponent";

const spellChoiceItems = getSpellChoiceItems();
const spellFilters = [
  { label: "Aspects", value: "aspects" },
  { label: "Traits", value: "traits" },
];

export default function CreatureSpellList() {
  const { creature, updateCreature } = useCreature();
  const [isSpellModalOpen, setIsSpellModalOpen] = useState(false);
  const [spellToReplace, setSpellToReplace] = useState<string | null>(null);
  const selectedSpells = spells.filter((spell) =>
    creature.spells.includes(spell.name),
  );

  const closeSpellModal = () => {
    setIsSpellModalOpen(false);
    setSpellToReplace(null);
  };

  const openSpellModal = (replaceSpell: string | null = null) => {
    setSpellToReplace(replaceSpell);
    setIsSpellModalOpen(true);
  };

  const confirmSpell = (spellName: string) => {
    const spellProficiencies = { ...(creature.spellProficiencies ?? {}) };

    if (spellToReplace) {
      if (spellName !== spellToReplace && creature.spells.includes(spellName)) {
        return;
      }
      const proficiency = spellProficiencies[spellToReplace] ?? "Trained";
      delete spellProficiencies[spellToReplace];
      spellProficiencies[spellName] = proficiency;
      updateCreature({
        spells: creature.spells.map((name) =>
          name === spellToReplace ? spellName : name,
        ),
        spellProficiencies,
      });
    } else {
      if (creature.spells.includes(spellName)) return;
      updateCreature({ spells: [...creature.spells, spellName] });
    }

    closeSpellModal();
  };

  const removeSpell = (spellName: string) => {
    const spellProficiencies = { ...(creature.spellProficiencies ?? {}) };
    delete spellProficiencies[spellName];
    updateCreature({
      spells: creature.spells.filter((name) => name !== spellName),
      spellProficiencies,
    });
  };

  const setSpellProficiency = (
    spellName: string,
    proficiency: ProficiencyTierName,
  ) =>
    updateCreature({
      spellProficiencies: {
        ...(creature.spellProficiencies ?? {}),
        [spellName]: proficiency,
      },
    });

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="mb-[0.65rem] flex-1 border-b border-[#3c3935] pb-[0.35rem] text-center text-xl font-bold leading-6 text-[#ff7043]">
          Spells
        </h2>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={() => openSpellModal()}
          aria-label="Add spell"
          title="Add spell"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedSpells.map((spell) => (
          <SpellComponent
            key={spell.name}
            spell={spell}
            onReplaceSpell={(_rankName, spellName) => openSpellModal(spellName)}
            onRemoveSpell={removeSpell}
            baseSpellshapingBonus={0}
            rankName={spell.rank}
            proficiency={creature.spellProficiencies?.[spell.name] ?? "Trained"}
            onProficiencyChange={(proficiency) =>
              setSpellProficiency(spell.name, proficiency)
            }
          />
        ))}
      </div>

      {isSpellModalOpen && (
        <ChoiceModalFrame title="Select Spell" closeModal={closeSpellModal}>
          <ChoiceModal
            items={spellChoiceItems}
            confirmLabel={spellToReplace ? "Replace Spell" : "Add Spell"}
            initialValue={spellToReplace}
            maxLevel={Infinity}
            disabledNames={creature.spells.filter(
              (spellName) => spellName !== spellToReplace,
            )}
            filterFields={spellFilters}
            onConfirm={confirmSpell}
          />
        </ChoiceModalFrame>
      )}
    </section>
  );
}
