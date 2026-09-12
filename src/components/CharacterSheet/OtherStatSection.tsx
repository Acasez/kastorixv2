import { useState } from "react";
import conditions from "../../json/conditions.json";
import ConditionMarker from "./ConditionMarker";
import type { Condition } from "../../constants/Condition";
import Tooltip from "../Tooltip";

export default function OtherStatSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);

  const handleAddCondition = (condition: Condition) => {
    if (!selectedConditions.some((c) => c.name === condition.name)) {
      setSelectedConditions([...selectedConditions, condition]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveCondition = (conditionToRemove: Condition) => {
    setSelectedConditions(
      selectedConditions.filter((c) => c.name !== conditionToRemove.name),
    );
  };

  return (
    <div className="flex flex-col bg-gray-800 h-90 w-165 gap-3 border-x-2 rounded-lg -mt-2">
      <h1 className="text-striking text-center text-3xl underline">
        Status effects
      </h1>
      <div className="flex w-9/10 h-12 rounded-2xl bg-gray-400 mx-8 items-center">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-2xl m-2 px-3 py-1 bg-black text-text-light rounded-lg"
          >
            +
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 w-38 bg-gray-700 rounded-lg shadow-lg border border-gray-600">
              {conditions.map((condition) => (
                <button
                  key={condition.name}
                  onClick={() => handleAddCondition(condition as Condition)}
                  className="w-full text-left px-4 py-2 text-text-light hover:bg-gray-600 rounded-lg"
                >
                  {condition.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {selectedConditions.map((condition) => (
            <Tooltip align="center" content={condition.effect}>
              <ConditionMarker
                key={condition.name} // Use condition.name as the key
                condition={condition}
                onRemove={handleRemoveCondition}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
