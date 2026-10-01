import { useState } from "react";
import weapons from "../../JSON/weapons.json";
import { useCreature } from "../../contexts/CreatureContext";
import type { ProficiencyTierName } from "../../constants/Proficiency";
import WeaponComponent from "../CharacterSheet/TabbedSection/WeaponComponent";
import ChoiceModal from "../ModalViews/ChoiceModal";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import { getWeaponChoiceItems } from "../ModalViews/choiceData";

const weaponChoiceItems = getWeaponChoiceItems(["Golem"]);
const weaponFilters = [
  { label: "Traits", value: "traits" },
  { label: "Types", value: "type" },
  { label: "Weapon Groups", value: "weaponGroup" },
];

export default function CreatureStrikeList() {
  const { creature, updateCreature } = useCreature();
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
  const selectedWeapons = Object.keys(creature.strikes);

  const addWeapon = (weaponName: string) => {
    if (selectedWeapons.includes(weaponName)) return;
    updateCreature({
      strikes: { ...creature.strikes, [weaponName]: "Trained" },
    });
    setIsWeaponModalOpen(false);
  };

  const removeWeapon = (weaponName: string) => {
    const strikes = { ...creature.strikes };
    delete strikes[weaponName];
    updateCreature({ strikes });
  };

  const setWeaponProficiency = (
    weaponName: string,
    proficiency: ProficiencyTierName,
  ) =>
    updateCreature({
      strikes: { ...creature.strikes, [weaponName]: proficiency },
    });

  return (
    <section className="space-y-3">
      <h2 className="mb-[0.65rem] border-b border-[#3c3935] pb-[0.35rem] text-center text-xl font-bold leading-6 text-[#ff7043]">
        Strikes
      </h2>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={() => setIsWeaponModalOpen(true)}
          aria-label="Add strike"
          title="Add strike"
        >
          +
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {selectedWeapons.map((weaponName) => {
          const weapon = weapons.find((entry) => entry.name === weaponName);
          if (!weapon) return null;

          return (
            <div className="relative pr-7" key={weaponName}>
              <WeaponComponent
                weapon={weapon}
                creatureStats={creature.stats}
                proficiency={creature.strikes[weaponName] ?? "Trained"}
                onProficiencyChange={(proficiency) =>
                  setWeaponProficiency(weaponName, proficiency)
                }
              />
              <button
                type="button"
                className="absolute right-0 top-2 flex size-6 items-center justify-center rounded-full bg-red-600 text-sm font-bold leading-none text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                onClick={() => removeWeapon(weaponName)}
                aria-label={`Remove ${weaponName} strike`}
                title={`Remove ${weaponName} strike`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      {isWeaponModalOpen && (
        <ChoiceModalFrame
          title="Select Weapon"
          closeModal={() => setIsWeaponModalOpen(false)}
        >
          <ChoiceModal
            items={weaponChoiceItems}
            confirmLabel="Add Strike"
            initialValue={null}
            maxLevel={Infinity}
            disabledNames={selectedWeapons}
            filterFields={weaponFilters}
            onConfirm={addWeapon}
          />
        </ChoiceModalFrame>
      )}
    </section>
  );
}
