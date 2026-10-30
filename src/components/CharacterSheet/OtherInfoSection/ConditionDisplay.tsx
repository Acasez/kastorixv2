import { useState } from "react";
import ConditionMarker from "./ConditionMarker";
import type { Condition } from "../../../types/Condition";
import Tooltip from "../../Tooltip";
import AddDropDown from "../../CommonCreatureComponents/AddDropdown";

export default function ConditionDisplay() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const possibleConditions = conditions.filter(
    (condition) =>
      !selectedConditions.some((selected) => selected.name === condition.name),
  );

  const handleAddCondition = (conditionName: string) => {
    const condition = conditions.find((c) => c.name === conditionName);
    if (condition) {
      setSelectedConditions([...selectedConditions, condition as Condition]);
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
          <AddDropDown
            availableTypes={possibleConditions.map((c) => c.name)}
            itemLabel="Condition"
            onSelect={handleAddCondition}
          />
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
              key={condition.name}
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
