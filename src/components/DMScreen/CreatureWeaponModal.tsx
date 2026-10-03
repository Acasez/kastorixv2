import { useState, type FormEvent } from "react";
import damageTypes from "../../JSON/damage_types.json";
import type { Weapon } from "../../types/Weapons";
import ChoiceModalFrame from "../ModalViews/ChoiceModalFrame";

type CreatureWeaponModalProps = {
  initialWeapon?: Weapon;
  closeModal: () => void;
  onSave: (weapon: Weapon) => boolean;
};

const WEAPON_TYPES = ["Unarmed", "Simple", "Martial", "Advanced", "Artificer"];
const WEAPON_GROUPS = [
  "Axe",
  "Bow",
  "Club",
  "Crossbow",
  "Flail",
  "Hammer",
  "Knife",
  "Polearm",
  "Runegun",
  "Shield",
  "Sling",
  "Spear",
  "Staff",
  "Sword",
  "Unarmed",
];

const EMPTY_WEAPON: Weapon = {
  name: "",
  dice: "",
  damageType: "Piercing",
  hands: "1",
  range: "1",
  traits: "",
  description: "",
  price: "",
  type: "Simple",
  weaponGroup: "Unarmed",
};

export default function CreatureWeaponModal({
  initialWeapon,
  closeModal,
  onSave,
}: CreatureWeaponModalProps) {
  const [weapon, setWeapon] = useState<Weapon>(
    () => initialWeapon ?? EMPTY_WEAPON,
  );
  const isEditing = Boolean(initialWeapon);

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
          <label className="flex min-w-0 flex-col gap-1 font-semibold text-white">
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
          <label className="flex min-w-0 flex-col gap-1 font-semibold text-white">
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
          <label className="flex flex-col gap-1 font-semibold text-white">
            <span>Damage Type</span>
            <select
              value={weapon.damageType}
              onChange={(event) =>
                setWeapon({ ...weapon, damageType: event.target.value })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            >
              {damageTypes.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 font-semibold text-white">
            <span>Hands</span>
            <input
              type="number"
              min={1}
              value={weapon.hands}
              onChange={(event) =>
                setWeapon({ ...weapon, hands: event.target.value })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 font-semibold text-white">
            <span>Range</span>
            <input
              type="number"
              min={0}
              value={weapon.range}
              onChange={(event) =>
                setWeapon({ ...weapon, range: event.target.value })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 font-semibold text-white">
          <span>Traits</span>
          <input
            value={weapon.traits}
            onChange={(event) =>
              setWeapon({ ...weapon, traits: event.target.value })
            }
            placeholder="Type or select traits..."
            className="h-11 rounded border border-gray-400 bg-white px-2 text-gray-900"
          />
        </label>

        <label className="flex flex-col gap-1 font-semibold text-white">
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
          <label className="flex flex-col gap-1 font-semibold text-white">
            <span>Price</span>
            <input
              value={weapon.price}
              onChange={(event) =>
                setWeapon({ ...weapon, price: event.target.value })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 font-semibold text-white">
            <span>Type</span>
            <select
              value={weapon.type}
              onChange={(event) =>
                setWeapon({ ...weapon, type: event.target.value })
              }
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            >
              {WEAPON_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 font-semibold text-white">
            <span>Weapon Group</span>
            <select
              value={weapon.weaponGroup}
              onChange={(event) =>
                setWeapon({ ...weapon, weaponGroup: event.target.value })
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
            className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-500"
          >
            {isEditing ? "Save Weapon" : "Add Weapon"}
          </button>
        </div>
      </form>
    </ChoiceModalFrame>
  );
}
