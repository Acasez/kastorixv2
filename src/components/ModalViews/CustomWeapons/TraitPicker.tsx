import { useMemo, useState, type KeyboardEvent } from "react";
import weaponTraits from "../../../data/weaponTraits";
import { parseWeaponTrait } from "../../../data/weapons";
import type { WeaponTrait } from "../../../types/Weapons";
import WeaponTraitComponent from "../../CommonCreatureComponents/WeaponTraitComponent";
import { RemoveButton, INPUT_CLASS } from "./RemoveButton";
import { traitLabel } from "./TraitLabel";

type TraitPickerProps = {
  traits: WeaponTrait[];
  onChange: (traits: WeaponTrait[]) => void;
};

export default function TraitPicker({ traits, onChange }: TraitPickerProps) {
  const [query, setQuery] = useState("");
  // The trait currently awaiting a parameter value, e.g. the "Volley (X)" definition
  const [pendingTrait, setPendingTrait] = useState<WeaponTrait | null>(null);
  const [parameterInput, setParameterInput] = useState("");

  const matchingTraits = useMemo(() => {
    const base = query.trim().split("(")[0].trim().toLowerCase();
    return weaponTraits.filter(
      (trait) =>
        trait.name.toLowerCase().includes(base) &&
        !traits.some((selected) => selected.name === trait.name),
    );
  }, [query, traits]);

  const isParameterized = (trait: WeaponTrait) => trait.parameter === "X";

  const addParsedTrait = (trait: WeaponTrait) => {
    if (
      !trait.name ||
      traits.some(
        (t) => t.name === trait.name && t.parameter === trait.parameter,
      )
    ) {
      return;
    }
    onChange([...traits, trait]);
    setQuery("");
    setPendingTrait(null);
    setParameterInput("");
  };

  const addTrait = (raw: string) => {
    addParsedTrait(parseWeaponTrait(raw));
  };

  const selectTrait = (trait: WeaponTrait) => {
    if (isParameterized(trait)) {
      setPendingTrait(trait);
      setParameterInput("");
      return;
    }
    addParsedTrait({ ...trait, parameter: undefined });
  };

  const confirmParameter = () => {
    if (!pendingTrait) return;
    addParsedTrait({
      ...pendingTrait,
      parameter: parameterInput.trim() || undefined,
    });
  };

  const handleParameterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setPendingTrait(null);
      return;
    }
    if (event.key !== "Enter") return;
    event.preventDefault();
    confirmParameter();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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
          onKeyDown={handleSearchKeyDown}
          placeholder="Search or type a trait, then press Enter"
          aria-label="Search weapon traits"
          className={`${INPUT_CLASS} h-11`}
        />
      </label>

      {pendingTrait && (
        <div className="flex flex-wrap items-center gap-2 rounded border border-blue-500 bg-stone-900 p-2">
          <span className="text-sm text-white">{pendingTrait.name} value:</span>
          <input
            autoFocus
            type="string"
            value={parameterInput}
            onChange={(e) => setParameterInput(e.target.value)}
            onKeyDown={handleParameterKeyDown}
            aria-label={`Parameter value for ${pendingTrait.name}`}
            placeholder="e.g., 4"
            className={`${INPUT_CLASS} w-24`}
          />
          <button
            type="button"
            onClick={confirmParameter}
            className="h-9 rounded bg-blue-600 px-3 text-white hover:bg-blue-500"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setPendingTrait(null)}
            className="text-sm text-gray-400 underline hover:text-white"
          >
            Cancel
          </button>
          <span className="w-full text-xs text-gray-400">
            {pendingTrait.effect}
          </span>
        </div>
      )}

      {!pendingTrait && query.trim() && (
        <div
          aria-label="Matching weapon traits"
          className="max-h-40 overflow-y-auto rounded border border-stone-500 bg-stone-900"
        >
          {matchingTraits.map((trait) => (
            <button
              type="button"
              key={trait.name}
              onClick={() => selectTrait(trait)}
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
