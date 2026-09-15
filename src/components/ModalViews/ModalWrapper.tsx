import SpeciesModal from "./SpeciesModal";
import ChoiceModal, { type ChoiceItem } from "./ChoiceModal";
import type { ModalRequest } from "./modalTypes";
import { useCharacter } from "../../contexts/CharacterContext";
import backgrounds from "../../JSON/backgrounds.json";
import generalFeats from "../../JSON/general_feats.json";
import arcaneFeats from "../../JSON/arcane_feats.json";
import advantages from "../../JSON/advantages.json";
import ancestryFeats from "../../JSON/ancestry_feats.json";
import spells from "../../JSON/spells.json";
import weapons from "../../JSON/weapons.json";

interface ModalWrapperProps {
  request: ModalRequest;
  closeModal: () => void;
}

export default function ModalWrapper({
  request,
  closeModal,
}: ModalWrapperProps) {
  const { character, updateCharacter } = useCharacter();

  const choiceData: Record<
    Exclude<ModalRequest["type"], "species" | "baseStats">,
    ChoiceItem[]
  > = {
    background: backgrounds,
    generalFeat: generalFeats,
    arcaneFeat: arcaneFeats,
    advantage: advantages,
    ancestryFeat: ancestryFeats,
    spell: spells,
    weapon: weapons,
  };

  const getCurrentValue = () => {
    if (request.type === "background") return character.background;
    if (request.type === "generalFeat")
      return character.generalFeats[0] ?? null;
    if (request.type === "arcaneFeat") return character.arcaneFeats[0] ?? null;
    if (request.type === "advantage") return character.advantages[0] ?? null;
    if (request.type === "ancestryFeat")
      return character.ancestryFeats[0] ?? null;
    if (request.type === "spell") return character.knownSpells[0] ?? null;
    if (request.type === "weapon") return character.weapons[0] ?? null;
    return null;
  };

  const confirmChoice = (value: string) => {
    if (request.type === "background") updateCharacter({ background: value });
    if (request.type === "generalFeat")
      updateCharacter({ generalFeats: [value] });
    if (request.type === "arcaneFeat")
      updateCharacter({ arcaneFeats: [value] });
    if (request.type === "advantage") updateCharacter({ advantages: [value] });
    if (request.type === "ancestryFeat")
      updateCharacter({ ancestryFeats: [value] });
    if (request.type === "spell") updateCharacter({ knownSpells: [value] });
    if (request.type === "weapon") updateCharacter({ weapons: [value] });
    console.log("Updated character", character);
    closeModal();
  };

  const renderModalContent = () => {
    if (request.type === "species") {
      return <SpeciesModal closeModal={closeModal} />;
    }

    if (request.type !== "baseStats") {
      return (
        <ChoiceModal
          items={choiceData[request.type]}
          confirmLabel={request.title}
          initialValue={getCurrentValue()}
          onConfirm={confirmChoice}
        />
      );
    }

    return (
      <div className="border-amber-200 border-2 p-4">
        <p className="text-gray-700">
          The {request.title.toLowerCase()} selector is not implemented yet.
        </p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-6xl w-11/12 h-[85vh] overflow-auto shadow-2xl border border-gray-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b-2 border-striking">
          <h2 className="text-3xl font-bold text-gray-800">{request.title}</h2>
          <button
            type="button"
            className="text-2xl text-gray-600 hover:text-gray-900"
            onClick={closeModal}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {renderModalContent()}
      </div>
    </div>
  );
}
