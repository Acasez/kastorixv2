import type { Metamagic } from "../../../types/Spells";
import MetamagicComponent from "./MetamagicComponent";
import { useCharacter } from "../../../contexts/CharacterContext";
import { getCharacterMetamagicGrant } from "../../../utils/characterSpellGrants";

interface MetamagicProps {
  onAddMetamagic: () => void;
  onReplaceMetamagic: (metamagicName: string) => void;
  onRemoveMetamagic: (metamagicName: string) => void;
  selectedMetamagics: Metamagic[];
}

export default function MetamagicsSection({
  onAddMetamagic,
  onReplaceMetamagic,
  onRemoveMetamagic,
  selectedMetamagics,
}: MetamagicProps) {
  const { character } = useCharacter();
  const maxKnownMetamagics = getCharacterMetamagicGrant(character);
  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-3">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg underline">Metamagics</span>
        <div className="flex flex-row gap-2">
          <p
            className={`text-right ${
              selectedMetamagics.length > maxKnownMetamagics
                ? "text-red-500"
                : selectedMetamagics.length < maxKnownMetamagics
                  ? "text-green-500"
                  : "text-text-light"
            }`}
          >
            Metamagics Chosen ({selectedMetamagics.length}/{maxKnownMetamagics})
          </p>
          <button
            type="button"
            className="bg-gray-600 text-white px-3 py-1 rounded border-2 border-button-add"
            onClick={() => onAddMetamagic()}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedMetamagics.map((metamagic) => (
          <MetamagicComponent
            metamagic={metamagic}
            onReplaceMetamagic={onReplaceMetamagic}
            onRemoveMetamagic={onRemoveMetamagic}
          />
        ))}
      </div>
    </div>
  );
}
