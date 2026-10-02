import { useState } from "react";
import weapons from "../../JSON/weapons.json";
import { useCreature } from "../../contexts/CreatureContext";
import type { ProficiencyTierName } from "../../constants/Proficiency";
import WeaponComponent from "../CharacterSheet/TabbedSection/WeaponComponent";
import ChoiceModal from "../ModalViews/ChoiceModal";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import { getWeaponChoiceItems } from "../ModalViews/choiceData";
import CreatureSectionHeader from "./CreatureSectionHeader";

const weaponChoiceItems = getWeaponChoiceItems(["Golem"]);
const weaponFilters = [
  { label: "Traits", value: "traits" },
  { label: "Types", value: "type" },
  { label: "Weapon Groups", value: "weaponGroup" },
];

export default function CreatureStrikeList() {
  const { creature, updateCreature } = useCreature();
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
  const [weaponToReplace, setWeaponToReplace] = useState<string | null>(null);
  const selectedWeapons = weapons.filter((weapon) =>
    creature.strikes.includes(weapon.name),
  );
  const confirmWeapon = (weaponName: string) => {
    const strikesProficiencies = { ...(creature.strikesProficiencies ?? {}) };
    if (weaponToReplace) {
      if (
        weaponName !== weaponToReplace &&
        creature.strikes.includes(weaponName)
      ) {
        return;
      }
      const proficiency = strikesProficiencies[weaponToReplace] ?? "Trained";
      delete strikesProficiencies[weaponToReplace];
      strikesProficiencies[weaponName] = proficiency;
      updateCreature({
        strikes: creature.strikes.map((name) =>
          name === weaponToReplace ? weaponName : name,
        ),
        strikesProficiencies,
      });
    } else {
      if (creature.strikes.includes(weaponName)) return;
      updateCreature({ strikes: [...creature.strikes, weaponName] });
    }

    closeWeaponModal();
  };

  const removeWeapon = (weaponName: string) => {
    const strikesProficiencies = { ...(creature.strikesProficiencies ?? {}) };
    delete strikesProficiencies[weaponName];
    updateCreature({
      strikes: creature.strikes.filter((name) => name !== weaponName),
      strikesProficiencies,
    });
  };

  const setWeaponProficiency = (
    weaponName: string,
    proficiency: ProficiencyTierName,
  ) =>
    updateCreature({
      strikesProficiencies: {
        ...(creature.strikesProficiencies ?? {}),
        [weaponName]: proficiency,
      },
    });

  const openWeaponModal = (replaceWeapon: string | null = null) => {
    setWeaponToReplace(replaceWeapon);
    setIsWeaponModalOpen(true);
  };

  const closeWeaponModal = () => {
    setIsWeaponModalOpen(false);
    setWeaponToReplace(null);
  };

  return (
    <section className="space-y-3">
      <CreatureSectionHeader
        title="Weapons"
        onAdd={() => openWeaponModal()}
        addLabel="Add weapon"
      />

      <div className="flex items-center gap-2"></div>

      <div className="flex flex-wrap gap-2">
        {selectedWeapons.map((weapon) => (
          <WeaponComponent
            key={weapon.name}
            weapon={weapon}
            onReplaceWeapon={(weaponName) => openWeaponModal(weaponName)}
            onRemoveWeapon={removeWeapon}
            proficiency={
              creature.strikesProficiencies?.[weapon.name] ?? "Trained"
            }
            creatureStats={creature.stats}
            onProficiencyChange={(proficiency) =>
              setWeaponProficiency(weapon.name, proficiency)
            }
          />
        ))}
      </div>
      {isWeaponModalOpen && (
        <ChoiceModalFrame
          title="Select Weapon"
          closeModal={() => setIsWeaponModalOpen(false)}
        >
          <ChoiceModal
            items={weaponChoiceItems}
            confirmLabel={weaponToReplace ? "Replace Spell" : "Add Strike"}
            initialValue={weaponToReplace}
            maxLevel={Infinity}
            disabledNames={creature.strikes.filter(
              (spellName) => spellName !== weaponToReplace,
            )}
            filterFields={weaponFilters}
            onConfirm={confirmWeapon}
          />
        </ChoiceModalFrame>
      )}
    </section>
  );
}
