import { useState, type FormEvent, type KeyboardEvent } from "react";
import damageTypes from "../../JSON/damage_types.json";
import weaponTraits from "../../data/weaponTraits";
import { parseWeaponTrait } from "../../data/weapons";
import type {
  Weapon,
  WeaponGroup,
  WeaponTrait,
  WeaponType,
} from "../../types/Weapons";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";
import WeaponTraitComponent from "../CreatureComponents/WeaponTraitComponent";
import { WEAPON_TYPES, WEAPON_GROUPS } from "../../constants/Weapons";

type CustomWeaponModalProps = {
  initialWeapon?: Weapon;
  closeModal: () => void;
  onSave: (weapon: Weapon) => boolean;
};

const EMPTY_WEAPON: Weapon = {
  name: "",
  dice: "",
  damageType: "piercing",
  hands: 1,
  range: 1,
  traits: [],
  description: "",
  price: 0,
  type: "Simple",
  weaponGroup: "Unarmed",
};

export default function CustomWeaponModal({
  initialWeapon,
  closeModal,
  onSave,
}: CustomWeaponModalProps) {
  const [weapon, setWeapon] = useState<Weapon>(
    () => initialWeapon ?? EMPTY_WEAPON,
  );
  const [traitQuery, setTraitQuery] = useState("");
  const isEditing = Boolean(initialWeapon);
  const selectedTraits = weapon.traits;
  const traitQueryBase = traitQuery.trim().split("(")[0].trim().toLowerCase();
  const matchingTraits = weaponTraits.filter(
    (trait) =>
      trait.name.toLowerCase().includes(traitQueryBase) &&
      !selectedTraits.some((selected) => selected.name === trait.name),
  );

  const setTraits = (traits: WeaponTrait[]) => setWeapon({ ...weapon, traits });

  const addTrait = (trait: string) => {
    const parsedTrait = parseWeaponTrait(trait);
    if (
      !parsedTrait.name ||
      selectedTraits.some(
        (selected) =>
          selected.name === parsedTrait.name &&
          selected.parameter === parsedTrait.parameter,
      )
    ) {
      return;
    }
    setTraits([...selectedTraits, parsedTrait]);
    setTraitQuery("");
  };

  const traitLabel = (trait: WeaponTrait) =>
    trait.parameter ? `${trait.name} (${trait.parameter})` : trait.name;

  const handleTraitKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !traitQuery.trim()) return;
    event.preventDefault();
    addTrait(traitQuery);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSave({ ...weapon, name: weapon.name.trim() })) closeModal();
  };

  return (
    <ChoiceModalFrame
      title={isEditing ? `Edit ${initialWeapon?.name}` : "Create Custom Weapon"}
      closeModal={closeModal}
    >
      <form className="space-y-5 rounded bg-[#242321] p-4" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label className="flex min-w-0 flex-col gap-1 text-white">
            <span>Name</span>
            <input
              required
              autoFocus
              value={weapon.name}
              onChange={(event) =>
                setWeapon({ ...weapon, name: event.target.value })
              }
              className="h-9 min-w-0 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-white">
            <span>Damage</span>
            <input
              required
              value={weapon.dice}
              onChange={(event) =>
                setWeapon({ ...weapon, dice: event.target.value })
              }
              placeholder="e.g., 2d6"
              className="h-9 min-w-0 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Damage Type</span>
            <select
              value={weapon.damageType}
              onChange={(event) =>
                setWeapon({ ...weapon, damageType: event.target.value })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            >
              {damageTypes.map(({ name }) => (
                <option key={name} value={name.toLowerCase()}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-white">
            <span>Hands</span>
            <input
              type="number"
              min={0}
              value={weapon.hands}
              onChange={(event) =>
                setWeapon({ ...weapon, hands: Number(event.target.value) })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1  text-white">
            <span>Range</span>
            <input
              type="number"
              min={0}
              value={weapon.range}
              onChange={(event) =>
                setWeapon({ ...weapon, range: Number(event.target.value) })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="flex flex-col gap-1 font-semibold text-white">
            <span>Traits</span>
            <input
              value={traitQuery}
              onChange={(event) => setTraitQuery(event.target.value)}
              onKeyDown={handleTraitKeyDown}
              placeholder="Search or type a trait, then press Enter"
              className="h-11 rounded border border-gray-400 bg-white px-2 text-gray-900"
              aria-label="Search weapon traits"
            />
          </label>
          {traitQuery.trim() && (
            <div
              role="listbox"
              aria-label="Matching weapon traits"
              className="max-h-40 overflow-y-auto rounded border border-stone-500 bg-stone-900"
            >
              {matchingTraits.map((trait) => (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  key={trait.name}
                  onClick={() =>
                    addTrait(
                      trait.parameter
                        ? `${trait.name} (${trait.parameter})`
                        : trait.name,
                    )
                  }
                  className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-stone-700"
                >
                  {traitLabel(trait)}
                </button>
              ))}
              {!matchingTraits.some(
                (trait) =>
                  traitLabel(trait).toLowerCase() ===
                  traitQuery.trim().toLowerCase(),
              ) && (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => addTrait(traitQuery)}
                  className="block w-full border-t border-stone-700 px-3 py-2 text-left text-sm text-orange-200 hover:bg-stone-700"
                >
                  Add custom trait: {traitQuery.trim()}
                </button>
              )}
            </div>
          )}
          {selectedTraits.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded border border-stone-600 bg-stone-900 p-2">
              {selectedTraits.map((trait, index) => (
                <span
                  className="inline-flex items-center gap-1"
                  key={`${trait.name}-${trait.parameter ?? ""}-${index}`}
                >
                  <WeaponTraitComponent trait={trait} />
                  <button
                    type="button"
                    className="flex size-4 items-center justify-center rounded-full bg-stone-600 text-xs text-white hover:bg-red-700"
                    onClick={() =>
                      setTraits(selectedTraits.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove ${traitLabel(trait)} trait`}
                    title={`Remove ${traitLabel(trait)}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <label className="flex flex-col gap-1 text-white">
          <span>Description</span>
          <textarea
            rows={3}
            value={weapon.description}
            onChange={(event) =>
              setWeapon({ ...weapon, description: event.target.value })
            }
            className="resize-y rounded border border-gray-400 bg-white px-2 py-1.5 text-gray-900"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-white">
            <span>Price</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={weapon.price}
              onChange={(event) =>
                setWeapon({ ...weapon, price: Number(event.target.value) })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Type</span>
            <select
              value={weapon.type}
              onChange={(event) =>
                setWeapon({ ...weapon, type: event.target.value as WeaponType })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            >
              {WEAPON_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Weapon Group</span>
            <select
              value={weapon.weaponGroup}
              onChange={(event) =>
                setWeapon({
                  ...weapon,
                  weaponGroup: event.target.value as WeaponGroup,
                })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            >
              {WEAPON_GROUPS.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded border border-gray-500 px-4 py-2 text-white hover:bg-gray-700"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
          >
            {isEditing ? "Save Weapon" : "Add Weapon"}
          </button>
        </div>
      </form>
    </ChoiceModalFrame>
  );
}
