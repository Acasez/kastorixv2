import { useCharacter } from "../../../hooks/useCharacter";
import gadgets from "../../../data/gadgets";
import { getCharacterGadgetGrant } from "../../../utils/characterSpellGrants";
import GadgetComponent from "./GadgetComponent";
import { skillModifier } from "../../../constants/Proficiency";
import { useGadgetModal } from "../../../hooks/useModalActions";
import SectionLimitText from "./SectionLimitText";
import AddButton from "./AddButton";

export default function GadgetSection() {
  const { character, updateCharacter } = useCharacter();
  const maxKnownGadgets = getCharacterGadgetGrant(character);
  const { openGadgetModal } = useGadgetModal();

  const onRemoveGadget = (gadget: string) => {
    updateCharacter({
      gadgets: character.gadgets.filter((name) => name !== gadget),
    });
  };
  return (
    <div className="p-4 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl mb-2">Gadgets</h2>
        <p className="text-xl mb-2">
          Gadget Bonus:{" "}
          {skillModifier(character, "Crafting", "INT") +
            character.baseStats.DEX}
        </p>
        <div className="flex items-center gap-3">
          <SectionLimitText
            text="Gadgets Crafted"
            current={character.gadgets.length}
            max={maxKnownGadgets}
          />
          <AddButton onClick={() => openGadgetModal(character)} />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2 mt-3">
          {gadgets
            .filter((gadget) => character.gadgets.includes(gadget.name))
            .map((gadget) => (
              <GadgetComponent
                key={gadget.name}
                gadget={gadget}
                character={character}
                onReplaceGadget={(character, gadgetName) =>
                  openGadgetModal(character, gadgetName)
                }
                onRemoveGadget={onRemoveGadget}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
