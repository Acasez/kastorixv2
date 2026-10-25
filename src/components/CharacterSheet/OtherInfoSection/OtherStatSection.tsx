import { useCharacter } from "../../../hooks/useCharacter";
import { getChoiceItem } from "../../ModalViews/choiceData";
import ChoiceTooltip from "../../ModalViews/ChoiceTooltip";
import OpenModalButton from "../OpenModalButton";
import ConditionDisplay from "./ConditionDisplay";
import { getCompactResistances } from "../../../utils/characterResistances";
import RestMenu from "./RestMenu";
import { useModal } from "../../../hooks/useModal";
import ResistanceMarker from "./ResistanceMarker";

export default function OtherStatSection() {
  const { character, passivePerception, passiveManasense } = useCharacter();
  const { openModal } = useModal();

  return (
    <div className="flex flex-col bg-gray-800 h-90 w-165 gap-3 border-x-2 rounded-lg">
      <h1 className="text-striking text-center text-3xl underline">
        Status effects
      </h1>
      <ConditionDisplay />
      <div className="flex flex-row justify-between mx-3">
        <div className="max-w-105">
          <h1 className="text-striking text-center text-3xl underline">
            Speed
          </h1>
          <div className="flex flex-row gap-2">
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
            <div className=" mb-2">
              <h1 className="text-striking text-center text-3xl underline mb-2">
                Resistances
              </h1>
              <div className="flex flex-wrap w-max max-w-120 gap-1">
                {Object.entries(getCompactResistances(character.resistances))
                  .filter(([, value]) => value > 0)
                  .map(([type, value]) => (
                    <ResistanceMarker damageType={type} value={value} />
                  ))}
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
              openModal({
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
          <RestMenu />
        </div>
      </div>
    </div>
  );
}
