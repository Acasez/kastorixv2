import { useState } from "react";
import conditions from "../../../json/conditions.json";
import ConditionMarker from "./ConditionMarker";
import type { Condition } from "../../../constants/Condition";
import Tooltip from "../../Tooltip";

export default function ConditionDisplay() {
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

  const handleLevelChange = (conditionName: string, newLevel: number) => {
    setSelectedConditions(
      selectedConditions.map((c) =>
        c.name === conditionName ? { ...c, level: newLevel } : c,
      ),
    );
  };

  return (
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
          <Tooltip
            align="center"
            content={condition.effect}
            key={condition.name}
          >
            <ConditionMarker
              key={condition.name} // Use condition.name as the key
              condition={condition}
              onRemove={handleRemoveCondition}
              onLevelChange={handleLevelChange}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
