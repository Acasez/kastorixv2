import { useState } from "react";
import armors from "../../JSON/armors.json";
import { useCreature } from "../../hooks/useCreature";
import {
  getCharacterResistances,
  getCompactResistances,
} from "../../utils/characterResistances";
import ChoiceModal from "../ModalViews/ChoiceModal";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import { getArmorChoiceItems } from "../ModalViews/choiceData";

const armorChoiceItems = getArmorChoiceItems();

type CreatureArmorSelectorProps = {
  blockId: number;
};

export default function CreatureArmorSelector({
  blockId,
}: CreatureArmorSelectorProps) {
  const { creature, updateCreature } = useCreature(blockId);
  const [isArmorModalOpen, setIsArmorModalOpen] = useState(false);
  const selectedArmor = armors.find((armor) => armor.name === creature.armor);

  return (
    <section className="flex h-full mt-2.5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="rounded border border-stone-500 bg-stone-800 px-3 py-1.5 text-sm text-white hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={() => setIsArmorModalOpen(true)}
          aria-label={
            selectedArmor
              ? `Change armor from ${selectedArmor.name}`
              : "Select armor"
          }
        >
          {selectedArmor?.name || "Select Armor"}
        </button>
      </div>

      {isArmorModalOpen && (
        <ChoiceModalFrame
          title="Select Armor"
          closeModal={() => setIsArmorModalOpen(false)}
        >
          <ChoiceModal
            items={armorChoiceItems}
            confirmLabel="Select Armor"
            initialValue={creature.armor || null}
            maxLevel={Infinity}
            onConfirm={(armor) => {
              const armorResistances = getCharacterResistances({
                armor,
                species: null,
                selections: {},
              });
              const compactResistances =
                getCompactResistances(armorResistances);
              updateCreature({
                armor,
                resistances: Object.fromEntries(
                  Object.entries(compactResistances).filter(
                    ([, value]) => value > 0,
                  ),
                ),
              });
              setIsArmorModalOpen(false);
            }}
          />
        </ChoiceModalFrame>
      )}
    </section>
  );
}
