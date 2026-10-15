import { useState } from "react";
import { createDamageInstances, damageTypes } from "../../../data/damageTypes";
import type { DamageInstance } from "../../../types/DamageTypes"; // adjust to your actual type name
import { INPUT_CLASS, RemoveButton } from "./formBits";

type DamageEditorProps = {
  weaponName: string;
  dice: DamageInstance[];
  onChange: (dice: DamageInstance[]) => void;
};

export default function DamageEditor({
  weaponName,
  dice,
  onChange,
}: DamageEditorProps) {
  const [damageInput, setDamageInput] = useState("");
  const [selectedDamageType, setSelectedDamageType] = useState(
    damageTypes[0] ?? null,
  );

  const handleAddDamage = () => {
    if (!damageInput.trim() || !selectedDamageType) return;
    const instances = createDamageInstances(
      damageInput,
      selectedDamageType.name,
      `weapon ${weaponName}`,
    );
    onChange([...dice, ...instances]);
    setDamageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    handleAddDamage();
  };

  return (
    <label className="flex min-w-0 flex-col gap-1 text-white">
      <span>Damage</span>
      <div className="flex gap-2">
        <input
          value={damageInput}
          onChange={(e) => setDamageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 1d8 or 2d6+1"
          className={`${INPUT_CLASS} flex-1`}
        />
        <select
          value={selectedDamageType?.name ?? ""}
          onChange={(e) => {
            const damageType = damageTypes.find(
              (dt) => dt.name === e.target.value,
            );
            if (damageType) setSelectedDamageType(damageType);
          }}
          className={INPUT_CLASS}
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

      {dice.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 rounded border border-stone-600 bg-stone-900 p-2">
          {dice.map((instance, index) => {
            const { amount, name } = instance;
            const label = `${amount.amount}d${amount.diceSize}${
              amount.bonus ? `+${amount.bonus}` : ""
            } ${name.name}`;
            return (
              <span
                key={`${label}-${index}`}
                className="inline-flex items-center gap-1 rounded bg-stone-800 px-2 py-1"
              >
                <span className="text-white">{label}</span>
                <RemoveButton
                  label={`Remove ${label}`}
                  onClick={() => onChange(dice.filter((_, i) => i !== index))}
                />
              </span>
            );
          })}
        </div>
      )}
    </label>
  );
}
