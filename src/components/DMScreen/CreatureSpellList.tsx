import { useState } from "react";
import spells from "../../JSON/spells.json";
import type { ProficiencyTierName } from "../../constants/Proficiency";
import { useCreature } from "../../contexts/CreatureContext";
import ChoiceModal from "../ModalViews/ChoiceModal";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import { getSpellChoiceItems } from "../ModalViews/choiceData";
import SpellComponent from "../CharacterSheet/TabbedSection/SpellComponent";
import { MultiOptionSwitch } from "../Buttons/MultiOptionSwitch";
import type { SomaticComponent, VerbalComponent } from "../../types/Spells";
import CreatureSectionHeader from "./CreatureSectionHeader";

const spellChoiceItems = getSpellChoiceItems();
const spellFilters = [
  { label: "Aspects", value: "aspects" },
  { label: "Traits", value: "traits" },
];

export default function CreatureSpellList() {
  const { creature, updateCreature } = useCreature();
  const [isSpellModalOpen, setIsSpellModalOpen] = useState(false);
  const [spellToReplace, setSpellToReplace] = useState<string | null>(null);
  const { verbal, somatic } = creature.spellShaping;
  const spellshapingBonus =
    (verbal === "Standard"
      ? creature.stats.INT
      : verbal === "Attuned"
        ? creature.stats.WIL
        : 0) +
    (somatic === "One Handed"
      ? Math.floor(creature.stats.DEX / 2)
      : somatic === "Two Handed"
        ? creature.stats.DEX
        : 0);
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
    <section>
      <CreatureSectionHeader
        title="Spells"
        onAdd={openSpellModal}
        addLabel="Add spell"
      />
      {creature.spells.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 items-center">
          <MultiOptionSwitch<VerbalComponent>
            options={["None", "Standard", "Attuned"]}
            value={verbal}
            onChange={(nextVerbal) =>
              updateCreature({
                spellShaping: {
                  ...creature.spellShaping,
                  verbal: nextVerbal,
                },
              })
            }
          />
          <MultiOptionSwitch<SomaticComponent>
            options={["None", "One Handed", "Two Handed"]}
            value={somatic}
            onChange={(nextSomatic) =>
              updateCreature({
                spellShaping: {
                  ...creature.spellShaping,
                  somatic: nextSomatic,
                },
              })
            }
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {selectedSpells.map((spell) => (
          <SpellComponent
            key={spell.name}
            spell={spell}
            onReplaceSpell={(_rankName, spellName) => openSpellModal(spellName)}
            onRemoveSpell={removeSpell}
            baseSpellshapingBonus={spellshapingBonus}
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
