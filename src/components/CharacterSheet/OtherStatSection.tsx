import { useCharacter } from "../../contexts/CharacterContext";
import ConditionDisplay from "./ConditionDisplay";

export default function OtherStatSection() {
  const { character, passivePerception, passiveManasense } = useCharacter();
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
    </div>
  );
}
