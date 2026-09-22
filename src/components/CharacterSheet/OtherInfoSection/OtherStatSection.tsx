import { useState } from "react";
import { useCharacter } from "../../../contexts/CharacterContext";
import { getChoiceItem } from "../../ModalViews/choiceData";
import ChoiceTooltip from "../../ModalViews/ChoiceTooltip";
import OpenModalButton from "../OpenModalButton";
import ConditionDisplay from "./ConditionDisplay";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import ModalWrapper from "../../ModalViews/ModalWrapper";
import { getCompactResistances } from "../../../utils/characterResistances";

export default function OtherStatSection() {
  const { character, passivePerception, passiveManasense } = useCharacter();
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);
  const closeModal = () => setModalRequest(null);
  return (
    <div className="flex flex-col bg-gray-800 h-90 w-165 gap-3 border-x-2 rounded-lg -mt-2">
      <h1 className="text-striking text-center text-3xl underline">
        Status effects
      </h1>
      <ConditionDisplay />
      <div className="flex flex-row justify-between mx-5">
        <div>
          <h1 className="text-striking text-center text-3xl underline">
            Speed
          </h1>
          <div className="flex flex-row m-2 gap-2">
            <div className="flex flex-row m-2 gap-2">
              {Object.entries(character.speeds)
                .filter(([, value]) => value > 0)
                .map(([type, value]) => (
                  <h2 key={type} className="text-text-light text-lg">
                    {type}: {value}
                  </h2>
                ))}
            </div>
          </div>

          {Object.keys(getCompactResistances(character.resistances)).length >
            0 && (
            <div>
              <h1 className="text-striking text-center text-3xl underline">
                Resistances
              </h1>
              <div className="m-2 h-7 overflow-x-auto">
                <div className="flex w-max flex-nowrap gap-2">
                  {Object.entries(getCompactResistances(character.resistances))
                    .filter(([, value]) => value > 0)
                    .map(([type, value]) => (
                      <h2
                        key={type}
                        className="whitespace-nowrap text-text-light text-lg"
                      >
                        {type}: {value}
                      </h2>
                    ))}
                </div>
              </div>
            </div>
          )}
          <OpenModalButton
            label={character.armor ?? "Select Armor"}
            itemChosen={Boolean(character.armor)}
            tooltipContent={
              character.armor
                ? (() => {
                    const item = getChoiceItem("armor", character.armor);
                    return item ? <ChoiceTooltip item={item} /> : undefined;
                  })()
                : undefined
            }
            onClick={() =>
              setModalRequest({
                type: "armor",
                title: "Select Armor",
                selectionKey: "Armor",
                level: 1,
              })
            }
          />
        </div>
        <div>
          <h1 className="text-striking text-center text-3xl underline">
            Senses
          </h1>
          <div className="flex flex-col m-2 gap-2">
            <h2 className="text-text-light text-lg">
              Passive Perception: {passivePerception}
            </h2>
            <h2 className="text-text-light text-lg">
              Passive Manasense: {passiveManasense}
            </h2>
          </div>
        </div>
      </div>
      {modalRequest && (
        <ModalWrapper request={modalRequest} closeModal={closeModal} />
      )}
    </div>
  );
}
