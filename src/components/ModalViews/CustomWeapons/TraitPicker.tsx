import { useMemo, useState, type KeyboardEvent } from "react";
import weaponTraits from "../../../data/weaponTraits";
import { parseWeaponTrait } from "../../../data/weapons";
import type { WeaponTrait } from "../../../types/Weapons";
import WeaponTraitComponent from "../../CommonCreatureComponents/WeaponTraitComponent";
import { RemoveButton } from "./formBits";
import { traitLabel } from "./TraitLabel";

type TraitPickerProps = {
  traits: WeaponTrait[];
  onChange: (traits: WeaponTrait[]) => void;
};

export default function TraitPicker({ traits, onChange }: TraitPickerProps) {
  const [query, setQuery] = useState("");

  const matchingTraits = useMemo(() => {
    const base = query.trim().split("(")[0].trim().toLowerCase();
    return weaponTraits.filter(
      (trait) =>
        trait.name.toLowerCase().includes(base) &&
        !traits.some((selected) => selected.name === trait.name),
    );
  }, [query, traits]);

  const addTrait = (raw: string) => {
    const parsed = parseWeaponTrait(raw);
    if (
      !parsed.name ||
      traits.some(
        (t) => t.name === parsed.name && t.parameter === parsed.parameter,
      )
    ) {
      return;
    }
    onChange([...traits, parsed]);
    setQuery("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !query.trim()) return;
    event.preventDefault();
    addTrait(query);
  };

  return (
    <div className="space-y-2">
      <label className="flex flex-col gap-1 font-semibold text-white">
        <span>Traits</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search or type a trait, then press Enter"
          aria-label="Search weapon traits"
          className="h-11 rounded border border-gray-400 bg-white px-2 text-gray-900"
        />
      </label>

      {query.trim() && (
        <div
          aria-label="Matching weapon traits"
          className="max-h-40 overflow-y-auto rounded border border-stone-500 bg-stone-900"
        >
          {matchingTraits.map((trait) => (
            <button
              type="button"
              key={trait.name}
              onClick={() => addTrait(traitLabel(trait))}
              className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-stone-700"
            >
              {traitLabel(trait)}
            </button>
          ))}
          {!matchingTraits.some(
            (trait) =>
              traitLabel(trait).toLowerCase() === query.trim().toLowerCase(),
          ) && (
            <button
              type="button"
              onClick={() => addTrait(query)}
              className="block w-full border-t border-stone-700 px-3 py-2 text-left text-sm text-orange-200 hover:bg-stone-700"
            >
              Add custom trait: {query.trim()}
            </button>
          )}
        </div>
      )}

      {traits.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded border border-stone-600 bg-stone-900 p-2">
          {traits.map((trait, index) => (
            <span
              key={`${trait.name}-${trait.parameter ?? ""}-${index}`}
              className="inline-flex items-center gap-1"
            >
              <WeaponTraitComponent trait={trait} />
              <RemoveButton
                label={`Remove ${traitLabel(trait)} trait`}
                onClick={() => onChange(traits.filter((_, i) => i !== index))}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
