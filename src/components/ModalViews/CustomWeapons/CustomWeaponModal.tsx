import { useMemo, useState, type FormEvent } from "react";
import { WEAPON_TYPES, WEAPON_GROUPS } from "../../../constants/Weapons";
import type { Weapon, WeaponGroup, WeaponType } from "../../../types/Weapons";
import ChoiceModalFrame from "../ChoiceModalFrame";
import DamageEditor from "./DamageEditor";
import TraitPicker from "./TraitPicker";
import { INPUT_CLASS } from "./RemoveButton";
import weapons from "../../../data/weapons";
import { formatPrice, parsePrice } from "../../../data/prices";

type CustomWeaponModalProps = {
  initialWeapon?: Weapon;
  closeModal: () => void;
  onSave: (weapon: Weapon) => boolean;
};

const EMPTY_WEAPON: Weapon = {
  name: "",
  dice: [],
  hands: 1,
  range: 1,
  traits: [],
  description: "",
  price: parsePrice("0 gp"),
  type: "Simple",
  weaponGroup: "Unarmed",
};

export default function CustomWeaponModal({
  initialWeapon,
  closeModal,
  onSave,
}: CustomWeaponModalProps) {
  const [weapon, setWeapon] = useState(() => initialWeapon ?? EMPTY_WEAPON);
  const [baseWeaponName, setBaseWeaponName] = useState("");
  const isEditing = Boolean(initialWeapon);

  const updateWeapon = (patch: Partial<Weapon>) =>
    setWeapon((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSave({ ...weapon, name: weapon.name.trim() })) closeModal();
  };

  const existingWeapons = useMemo(
    () => [...weapons].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const handleBaseWeaponChange = (name: string) => {
    setBaseWeaponName(name);
    if (!name) return; // back to "(start from scratch)"
    const base = existingWeapons.find((w) => w.name === name);
    if (!base) return;
    // Keep the user's name if they've typed one; otherwise adopt the base's name
    setWeapon((prev) => ({
      ...base,
      name: prev.name.trim() ? prev.name : base.name,
    }));
  };

  return (
    <ChoiceModalFrame
      title={isEditing ? `Edit ${initialWeapon?.name}` : "Create Custom Weapon"}
      closeModal={closeModal}
    >
      <form
        className="space-y-5 rounded bg-[#242321] p-4"
        onSubmit={handleSubmit}
      >
        {!isEditing && (
          <label className="flex flex-col gap-1 text-white">
            <span>Start from existing weapon</span>
            <select
              value={baseWeaponName}
              onChange={(e) => handleBaseWeaponChange(e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">— Start from scratch —</option>
              {existingWeapons.map((w) => (
                <option key={w.name} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="flex flex-row justify-between gap-5">
          <label className="flex min-w-50 w-full flex-col gap-1 text-white">
            <span>Name</span>
            <input
              required
              autoFocus
              value={weapon.name}
              onChange={(e) => updateWeapon({ name: e.target.value })}
              className={`${INPUT_CLASS} min-w-0`}
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Hands</span>
            <input
              type="number"
              min={0}
              value={weapon.hands}
              onChange={(e) => updateWeapon({ hands: Number(e.target.value) })}
              className={INPUT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Range</span>
            <input
              type="number"
              min={0}
              value={weapon.range}
              onChange={(e) => updateWeapon({ range: Number(e.target.value) })}
              className={INPUT_CLASS}
            />
          </label>
        </div>
        <DamageEditor
          weaponName={weapon.name}
          dice={weapon.dice}
          onChange={(dice) => updateWeapon({ dice })}
        />
        <TraitPicker
          traits={weapon.traits}
          onChange={(traits) => updateWeapon({ traits })}
        />

        <label className="flex flex-col gap-1 text-white">
          <span>Description</span>
          <textarea
            rows={3}
            value={weapon.description}
            onChange={(e) => updateWeapon({ description: e.target.value })}
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
              value={String(formatPrice(weapon.price) ?? "")}
              onChange={(e) =>
                updateWeapon({ price: parsePrice(e.target.value) })
              }
              className={INPUT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Type</span>
            <select
              value={weapon.type}
              onChange={(e) =>
                updateWeapon({ type: e.target.value as WeaponType })
              }
              className={INPUT_CLASS}
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
              onChange={(e) =>
                updateWeapon({ weaponGroup: e.target.value as WeaponGroup })
              }
              className={INPUT_CLASS}
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
