import { useState } from "react";
import weapons from "../../JSON/weapons.json";
import { useCreature } from "../../contexts/CreatureContext";
import type { ProficiencyTierName } from "../../constants/Proficiency";
import type { Weapon } from "../../types/Weapons";
import WeaponComponent from "../CharacterSheet/TabbedSection/WeaponComponent";
import ChoiceModal from "../ModalViews/ChoiceModal";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import { getWeaponChoiceItems } from "../ModalViews/choiceData";
import CreatureSectionHeader from "./CreatureSectionHeader";
import CreatureWeaponModal from "./CustomWeaponModal";
import type { ChoiceItem } from "../ModalViews/ChoiceModal";

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
  const [isCustomWeaponModalOpen, setIsCustomWeaponModalOpen] = useState(false);
  const [weaponToEdit, setWeaponToEdit] = useState<Weapon | undefined>();
  const customWeapons = creature.customWeapons ?? [];
  const availableWeapons: Weapon[] = [
    ...weapons.filter((weapon) => weapon.type !== "Golem"),
    ...customWeapons,
  ];
  const selectedWeapons = creature.strikes
    .map((weaponName) =>
      availableWeapons.find((weapon) => weapon.name === weaponName),
    )
    .filter((weapon): weapon is Weapon => weapon !== undefined);
  const customWeaponNames = new Set(customWeapons.map(({ name }) => name));
  const customChoiceItems: ChoiceItem[] = customWeapons.map((weapon) => ({
    ...weapon,
    details: [
      { label: "Damage", value: `${weapon.dice} ${weapon.damageType}` },
      { label: "Hands", value: weapon.hands },
      { label: "Range", value: weapon.range },
      { label: "Traits", value: weapon.traits },
      { label: "Description", value: weapon.description },
      { label: "Price", value: weapon.price },
      { label: "Type", value: weapon.type },
      { label: "Weapon Group", value: weapon.weaponGroup },
    ].filter(({ value }) => value.trim() !== ""),
  }));
  const weaponChoices = [...weaponChoiceItems, ...customChoiceItems];

  const closeWeaponModal = () => {
    setIsWeaponModalOpen(false);
    setWeaponToReplace(null);
  };

  const openWeaponModal = (replaceWeapon: string | null = null) => {
    setWeaponToReplace(replaceWeapon);
    setIsWeaponModalOpen(true);
  };

  const closeCustomWeaponModal = () => {
    setIsCustomWeaponModalOpen(false);
    setWeaponToEdit(undefined);
  };

  const openCustomWeaponModal = (weapon?: Weapon) => {
    setWeaponToEdit(weapon);
    setIsCustomWeaponModalOpen(true);
  };

  const saveCustomWeapon = (weapon: Weapon): boolean => {
    const duplicateExists = availableWeapons.some(
      (existing) =>
        existing.name.toLowerCase() === weapon.name.toLowerCase() &&
        existing.name !== weaponToEdit?.name,
    );
    if (duplicateExists) {
      window.alert("A weapon with that name already exists.");
      return false;
    }

    if (weaponToEdit) {
      const strikesProficiencies = {
        ...(creature.strikesProficiencies ?? {}),
      };
      const renamed = weaponToEdit.name !== weapon.name;
      const previousProficiency = strikesProficiencies[weaponToEdit.name];
      if (renamed) {
        delete strikesProficiencies[weaponToEdit.name];
        if (previousProficiency) {
          strikesProficiencies[weapon.name] = previousProficiency;
        }
      }
      updateCreature({
        customWeapons: customWeapons.map((existing) =>
          existing.name === weaponToEdit.name ? weapon : existing,
        ),
        ...(renamed
          ? {
              strikes: creature.strikes.map((name) =>
                name === weaponToEdit.name ? weapon.name : name,
              ),
              strikesProficiencies,
            }
          : {}),
      });
    } else {
      updateCreature({
        customWeapons: [...customWeapons, weapon],
        strikes: [...creature.strikes, weapon.name],
        strikesProficiencies: {
          ...(creature.strikesProficiencies ?? {}),
          [weapon.name]: "Trained",
        },
      });
    }
    closeCustomWeaponModal();
    return true;
  };

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
      updateCreature({
        strikes: [...creature.strikes, weaponName],
        strikesProficiencies: {
          ...strikesProficiencies,
          [weaponName]: "Trained",
        },
      });
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

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <CreatureSectionHeader title="Weapons" />
        </div>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood"
          onClick={() => openWeaponModal()}
          aria-label="Add weapon"
          title="Add weapon"
        >
          +
        </button>
        <button
          type="button"
          className="shrink-0 rounded border border-stone-500 px-2 py-1.5 text-sm text-white hover:bg-stone-700"
          onClick={() => openCustomWeaponModal()}
        >
          Custom
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedWeapons.map((weapon) => {
          const isCustomWeapon = customWeaponNames.has(weapon.name);
          return (
            <div className="relative w-full" key={weapon.name}>
              <WeaponComponent
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
              {isCustomWeapon && (
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded bg-stone-700 px-2 py-1 text-xs text-white hover:bg-stone-600"
                  onClick={() => openCustomWeaponModal(weapon)}
                  aria-label={`Edit ${weapon.name}`}
                >
                  Edit
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isWeaponModalOpen && (
        <ChoiceModalFrame
          title={
            weaponToReplace ? `Replace ${weaponToReplace}` : "Select Weapon"
          }
          closeModal={closeWeaponModal}
        >
          <ChoiceModal
            items={weaponChoices}
            confirmLabel={weaponToReplace ? "Replace Weapon" : "Add Strike"}
            initialValue={weaponToReplace}
            maxLevel={Infinity}
            disabledNames={creature.strikes.filter(
              (weaponName) => weaponName !== weaponToReplace,
            )}
            filterFields={weaponFilters}
            onConfirm={confirmWeapon}
          />
        </ChoiceModalFrame>
      )}

      {isCustomWeaponModalOpen && (
        <CreatureWeaponModal
          initialWeapon={weaponToEdit}
          closeModal={closeCustomWeaponModal}
          onSave={saveCustomWeapon}
        />
      )}
    </section>
  );
}
