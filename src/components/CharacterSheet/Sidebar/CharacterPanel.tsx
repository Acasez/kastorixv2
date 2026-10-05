import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import { useCharacter } from "../../../hooks/useCharacter";
import ModalWrapper from "../../ModalViews/ModalWrapper";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import ChoiceTooltip from "../../ModalViews/ChoiceTooltip";
import { getChoiceItem } from "../../ModalViews/choiceData";
import species from "../../../JSON/species.json";

export default function CharacterPanel() {
  const { character, handleNameChange, handleLevelChange, updateCharacter } =
    useCharacter();
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);
  const speciesFeatKey = "species:unlocked:0";
  const selectedSpecies = species.find(
    (item) => item.name === character.species,
  );
  const hasGeneralFeatUnlock = selectedSpecies?.unlockedFeats
    .split(",")
    .some((feat) => /^General Feat\s*-\s*Level 1$/i.test(feat.trim()));
  const selectedSpeciesFeat = character.selections[speciesFeatKey];

  const closeModal = () => setModalRequest(null);

  return (
    <div className="bg-blue-100 rounded-lg p-2 mb-4 shadow-sm border border-blue-300 w-full">
      <div className="mb-3">
        <input
          type="text"
          value={character.name}
          onChange={handleNameChange}
          placeholder="Character Name"
          className="w-full px-2 py-1 rounded-lg border-2 border-blue-400 text-xl font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1 flex flex-col">
        <OpenModalButton
          label={character.species ?? "Select Species"}
          itemChosen={Boolean(character.species)}
          tooltipContent={
            character.species
              ? (() => {
                  const item = getChoiceItem("species", character.species);
                  return item ? <ChoiceTooltip item={item} /> : undefined;
                })()
              : undefined
          }
          onClick={() =>
            setModalRequest({ type: "species", title: "Select Species" })
          }
        />
        {hasGeneralFeatUnlock && (
          <OpenModalButton
            label={selectedSpeciesFeat ?? "Select General Feat - Level 1"}
            itemChosen={Boolean(selectedSpeciesFeat)}
            onClick={() =>
              setModalRequest({
                type: "generalFeat",
                title: "Select General Feat",
                selectionKey: speciesFeatKey,
                level: 1,
              })
            }
            onContextMenu={(event) => {
              event.preventDefault();
              const selections = Object.fromEntries(
                Object.entries(character.selections).filter(
                  ([key]) => key !== speciesFeatKey,
                ),
              );
              updateCharacter({ selections });
            }}
            tooltipContent={
              selectedSpeciesFeat
                ? (() => {
                    const item = getChoiceItem(
                      "generalFeat",
                      selectedSpeciesFeat,
                    );
                    return item ? <ChoiceTooltip item={item} /> : undefined;
                  })()
                : undefined
            }
          />
        )}
        <OpenModalButton
          label={character.baseStatsSet ? "Base Stats Set" : "Set Base Stats"}
          itemChosen={character.baseStatsSet}
          onClick={() =>
            setModalRequest({ type: "baseStats", title: "Set Base Stats" })
          }
        />
      </div>

      <div className="flex items-center justify-center space-x-3 mt-2 p-1 bg-blue-200 rounded-lg border border-blue-400">
        <span className="text-xl font-bold text-gray-800">Level</span>
        <input
          type="number"
          value={character.level}
          onChange={handleLevelChange}
          min="0"
          max="20"
          className="w-20 px-2 py-2 rounded-md border-2 border-blue-400 text-xl font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Modal Overlay */}
      {modalRequest && (
        <ModalWrapper request={modalRequest} closeModal={closeModal} />
      )}
    </div>
  );
}
