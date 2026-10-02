import type { ChangeEvent, RefObject } from "react";
import MetaButton from "../CharacterSheet/MetaMenu/MetaButton";

export const STORAGE_PREFIX = "dm-creature:";

interface CreatureMetaProps {
  selectedKey: string;
  setSelectedKey: (selectedKey: string) => void;
  savedCreatures: string[];
  saveCreature: () => void;
  loadCreature: () => void;
  deleteCreature: () => void;
  importInputRef: RefObject<HTMLInputElement | null>;
  exportCreature: () => void;
  onRemove: () => void;
  importCreature: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function CreatureMeta({
  selectedKey,
  setSelectedKey,
  savedCreatures,
  saveCreature,
  loadCreature,
  deleteCreature,
  importInputRef,
  exportCreature,
  onRemove,
  importCreature,
}: CreatureMetaProps) {
  return (
    <header className="flex flex-row items-center bg-stone-900 p-3 px-5 border-b-2 border-black justify-between">
      <MetaButton
        label="Save Creature"
        onClick={saveCreature}
        variant="dmScreen"
      />
      <div className="flex flex-col">
        <select
          aria-label="Saved creatures"
          value={selectedKey}
          onChange={(event) => setSelectedKey(event.target.value)}
          className="min-w-40 flex-1 rounded bg-stone-700 px-3 py-2 text-sm"
        >
          <option value="">Saved creatures</option>
          {savedCreatures.map((key) => (
            <option key={key} value={key}>
              {key.slice(STORAGE_PREFIX.length)}
            </option>
          ))}
        </select>
        <MetaButton
          label="Load Creature"
          onClick={loadCreature}
          variant="dmScreen"
        />
      </div>

      <MetaButton label="Delete" onClick={deleteCreature} variant="dmScreen" />
      <MetaButton
        label="Import"
        onClick={() => importInputRef.current?.click()}
        variant="dmScreen"
      />
      <MetaButton label="Export" onClick={exportCreature} variant="dmScreen" />
      <MetaButton label="Close" onClick={onRemove} variant="dmScreen" />
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        onChange={importCreature}
        className="hidden"
      />
    </header>
  );
}
