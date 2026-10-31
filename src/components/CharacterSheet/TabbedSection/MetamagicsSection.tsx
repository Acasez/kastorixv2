import MetamagicComponent from "./MetamagicComponent";
import { useCharacter } from "../../../hooks/useCharacter";
import { getCharacterMetamagicGrant } from "../../../utils/characterSpellGrants";
import { useMetamagicModal } from "../../../hooks/useModalActions";
import metamagics from "../../../data/metamagics";
import SectionLimitText from "./SectionLimitText";
import AddButton from "./AddButton";

export default function MetamagicsSection() {
  const { character, updateCharacter } = useCharacter();
  const { openMetamagicModal } = useMetamagicModal();
  const maxKnownMetamagics = getCharacterMetamagicGrant(character);
  const selectedMetamagics = metamagics.filter((metamagic) =>
    character.metamagics.includes(metamagic.name),
  );

  const removeMetamagic = (metamagic: string) => {
    updateCharacter({
      metamagics: character.metamagics.filter((name) => name !== metamagic),
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-3">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg underline">Metamagics</span>
        <div className="flex flex-row gap-2">
          <SectionLimitText
            text="Metamagics Chosen"
            current={selectedMetamagics.length}
            max={maxKnownMetamagics}
          />
          <AddButton onClick={() => openMetamagicModal(character)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedMetamagics.map((metamagic) => (
          <MetamagicComponent
            key={metamagic.name}
            metamagic={metamagic}
            onReplaceMetamagic={() => openMetamagicModal(character)}
            onRemoveMetamagic={removeMetamagic}
          />
        ))}
      </div>
    </div>
  );
}
