import { useState } from "react";
import spells from "../../JSON/spells.json";
import { useCreature } from "../../contexts/CreatureContext";
import ChoiceModal from "../ModalViews/ChoiceModal";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import { getSpellChoiceItems } from "../ModalViews/choiceData";

const spellChoiceItems = getSpellChoiceItems();
const spellFilters = [
  { label: "Aspects", value: "aspects" },
  { label: "Traits", value: "traits" },
];

export default function CreatureSpellList() {
  const { creature, updateCreature } = useCreature();
  const [isSpellModalOpen, setIsSpellModalOpen] = useState(false);
  const selectedSpells = spells.filter((spell) =>
    creature.spells.includes(spell.name),
  );

  const addSpell = (spellName: string) => {
    if (creature.spells.includes(spellName)) return;
    updateCreature({ spells: [...creature.spells, spellName] });
    setIsSpellModalOpen(false);
  };

  const removeSpell = (spellName: string) =>
    updateCreature({
      spells: creature.spells.filter((name) => name !== spellName),
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
          onClick={() => setIsSpellModalOpen(true)}
          aria-label="Add spell"
          title="Add spell"
        >
          +
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {selectedSpells.map((spell) => (
          <div
            className="flex items-center justify-between gap-3 rounded border border-stone-600 bg-stone-800 px-3 py-2"
            key={spell.name}
          >
            <div className="min-w-0">
              <h3 className="font-semibold text-white">{spell.name}</h3>
              <p className="text-xs text-stone-300">
                {spell.rank} | {spell.aspects} | {spell.traits}
              </p>
            </div>
            <button
              type="button"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold leading-none text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              onClick={() => removeSpell(spell.name)}
              aria-label={`Remove ${spell.name} spell`}
              title={`Remove ${spell.name} spell`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {isSpellModalOpen && (
        <ChoiceModalFrame
          title="Select Spell"
          closeModal={() => setIsSpellModalOpen(false)}
        >
          <ChoiceModal
            items={spellChoiceItems}
            confirmLabel="Add Spell"
            initialValue={null}
            maxLevel={Infinity}
            disabledNames={creature.spells}
            filterFields={spellFilters}
            onConfirm={addSpell}
          />
        </ChoiceModalFrame>
      )}
    </section>
  );
}
