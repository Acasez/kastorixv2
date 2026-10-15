import { useState, type FormEvent, type KeyboardEvent } from "react";
import weaponTraits from "../../data/weaponTraits";
import { parseWeaponTrait } from "../../data/weapons";
import { createDamageInstances, damageTypes } from "../../data/damageTypes";
import type {
  Weapon,
  WeaponGroup,
  WeaponTrait,
  WeaponType,
} from "../../types/Weapons";
import type { DamageType } from "../../types/DamageTypes";
import ChoiceModalFrame from "./ChoiceModalFrame";
import WeaponTraitComponent from "../CommonCreatureComponents/WeaponTraitComponent";
import { WEAPON_TYPES, WEAPON_GROUPS } from "../../constants/Weapons";

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
  const [damageInput, setDamageInput] = useState("");
  const [selectedDamageType, setSelectedDamageType] =
    useState<DamageType | null>(damageTypes[0] || null);
  const isEditing = Boolean(initialWeapon);
  const selectedTraits = weapon.traits;
  const traitQueryBase = traitQuery.trim().split("(")[0].trim().toLowerCase();
  const matchingTraits = weaponTraits.filter(
    (trait) =>
      trait.name.toLowerCase().includes(traitQueryBase) &&
      !selectedTraits.some((selected) => selected.name === trait.name),
  );
  const updateWeapon = (patch: Partial<Weapon>) =>
    setWeapon((prev) => ({ ...prev, ...patch }));

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

  const handleDamageTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedName = event.target.value;
    const selected = damageTypes.find(
      (dt) => dt.name.toLowerCase() === selectedName.toLowerCase(),
    );
    if (selected) {
      setSelectedDamageType(selected);
    }
  };

  const handleAddDamage = () => {
    if (!damageInput.trim() || !selectedDamageType) return;

    const newDamageInstances = createDamageInstances(
      damageInput,
      selectedDamageType.name,
      `weapon ${weapon.name}`,
    );

    setWeapon({
      ...weapon,
      dice: [...weapon.dice, ...newDamageInstances],
    });
    setDamageInput("");
  };

  const handleRemoveDamage = (index: number) => {
    setWeapon({
      ...weapon,
      dice: weapon.dice.filter((_, i) => i !== index),
    });
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
              onChange={(e) => updateWeapon({ name: e.target.value })}
              className="h-9 min-w-0 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-white">
            <span>Damage</span>
            <div className="flex gap-2">
              <input
                value={damageInput}
                onChange={(event) => setDamageInput(event.target.value)}
                placeholder="e.g., 1d8 or 2d6+1"
                className="h-9 flex-1 rounded border border-gray-400 bg-white px-2 text-gray-900"
                onKeyDown={(e) => e.key === "Enter"}
              />
              <select
                value={selectedDamageType?.name || ""}
                onChange={handleDamageTypeChange}
                className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
              >
                {damageTypes.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddDamage}
                className="h-9 rounded bg-blue-600 px-3 text-white hover:bg-blue-500"
              >
                Add
              </button>
            </div>
          </label>
        </div>

        {/* Display existing damage instances */}
        {weapon.dice.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded border border-stone-600 bg-stone-900 p-2">
            {weapon.dice.map((damageInstance, index) => (
              <span
                className="inline-flex items-center gap-1 rounded bg-stone-800 px-2 py-1"
                key={`${damageInstance.name.name}-${damageInstance.amount.diceSize}-${damageInstance.amount.amount}-${index}`}
              >
                <span className="text-white">
                  {damageInstance.amount.amount}d
                  {damageInstance.amount.diceSize}
                  {damageInstance.amount.bonus
                    ? `+${damageInstance.amount.bonus}`
                    : ""}{" "}
                  {damageInstance.name.name}
                </span>
                <button
                  type="button"
                  className="flex size-4 items-center justify-center rounded-full bg-stone-600 text-xs text-white hover:bg-red-700"
                  onClick={() => handleRemoveDamage(index)}
                  aria-label="Remove damage instance"
                  title="Remove damage instance"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-white">
            <span>Hands</span>
            <input
              type="number"
              min={0}
              value={weapon.hands}
              onChange={(e) => updateWeapon({ hands: Number(e.target.value) })}
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Range</span>
            <input
              type="number"
              min={0}
              value={weapon.range}
              onChange={(e) => updateWeapon({ range: Number(e.target.value) })}
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
              aria-label="Matching weapon traits"
              className="max-h-40 overflow-y-auto rounded border border-stone-500 bg-stone-900"
            >
              {matchingTraits.map((trait) => (
                <button
                  type="button"
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
              value={weapon.price}
              onChange={(e) => updateWeapon({ price: Number(e.target.value) })}
              className="h-9 rounded border border-gray-400 bg-white px-2 text-gray-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-white">
            <span>Type</span>
            <select
              value={weapon.type}
              onChange={(e) =>
                updateWeapon({ type: e.target.value as WeaponType })
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
              onChange={(e) =>
                updateWeapon({ weaponGroup: e.target.value as WeaponGroup })
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
