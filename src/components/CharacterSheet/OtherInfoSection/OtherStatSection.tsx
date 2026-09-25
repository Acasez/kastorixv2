import { useState } from "react";
import { useCharacter } from "../../../contexts/CharacterContext";
import { getChoiceItem } from "../../ModalViews/choiceData";
import ChoiceTooltip from "../../ModalViews/ChoiceTooltip";
import OpenModalButton from "../OpenModalButton";
import ConditionDisplay from "./ConditionDisplay";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import ModalWrapper from "../../ModalViews/ModalWrapper";
import { getCompactResistances } from "../../../utils/characterResistances";
import { MANA_DENSITY } from "../../../constants/ManaDensity";
import armors from "../../../JSON/armors.json";

function getManaRecoveryMultiplier(manaRecovery: string | undefined) {
  if (!manaRecovery) return 1;

  const [numerator, denominator] = manaRecovery.split("/").map(Number);
  return denominator > 0 ? numerator / denominator : 1;
}

export default function OtherStatSection() {
  const { character, passivePerception, passiveManasense, updateCharacter } =
    useCharacter();
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);
  const [manaDensityMenuOpen, setManaDensityMenuOpen] = useState(false);
  const closeModal = () => setModalRequest(null);
  const selectedManaDensity =
    MANA_DENSITY.find((zone) => zone.name === character.manaDensity) ??
    MANA_DENSITY.find((zone) => zone.name === "Normal")!;
  const selectedArmor = armors.find((armor) => armor.name === character.armor);
  const manaRecoveryMultiplier = getManaRecoveryMultiplier(
    selectedArmor?.manaRecovery,
  );
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
            label={character.armor != "" ? character.armor : "Select Armor"}
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
          <div className="flex flex-col gap-2">
            <button
              className="bg-blue-500 text-text-light rounded-xl px-2 py-1"
              onClick={() =>
                updateCharacter({
                  health: {
                    ...character.health,
                    current: character.health.max,
                  },
                  mana: { ...character.mana, current: character.mana.max },
                  aura: { ...character.aura, current: character.aura.max },
                })
              }
            >
              Long Rest
            </button>
            <button
              className="bg-blue-500 text-text-light rounded-xl px-2 py-1"
              onClick={() =>
                updateCharacter({
                  mana: {
                    ...character.mana,
                    current: Math.min(
                      character.mana.max,
                      character.mana.current +
                        Math.floor(
                          selectedManaDensity.hourlyRate *
                            manaRecoveryMultiplier,
                        ),
                    ),
                  },
                })
              }
              type="button"
            >
              Short Rest
            </button>
            <div className="relative">
              <button
                className="bg-blue-200 text-text-black rounded-xl px-2 py-1 w-full"
                onClick={() => setManaDensityMenuOpen((isOpen) => !isOpen)}
                type="button"
              >
                Mana Density: {selectedManaDensity.name}
              </button>
              {manaDensityMenuOpen && (
                <div className="absolute z-10 mt-1 flex w-full flex-col gap-1 rounded-lg bg-gray-700 p-1">
                  {MANA_DENSITY.map((zone) => (
                    <button
                      className="rounded-lg px-2 py-1 text-left text-text-light hover:bg-blue-200"
                      key={zone.name}
                      onClick={() => {
                        updateCharacter({ manaDensity: zone.name });
                        setManaDensityMenuOpen(false);
                      }}
                      type="button"
                    >
                      {zone.name} ({zone.hourlyRate} mana/hour)
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalRequest && (
        <ModalWrapper request={modalRequest} closeModal={closeModal} />
      )}
    </div>
  );
}
