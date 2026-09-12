import type { Condition } from "../../constants/Condition";
import NumberInput from "../NumberInput";

interface ConditionMarkerProps {
  condition: Condition;
  onRemove: (condition: Condition) => void;
  onLevelChange: (conditionName: string, newLevel: number) => void;
}

export default function ConditionMarker({
  condition,
  onRemove,
  onLevelChange,
}: ConditionMarkerProps) {
  const changeLevelOfCondition = (level: number) => {
    onLevelChange(condition.name, level);
  };

  return (
    <span className="bg-gray-600 text-text-light px-3 py-1 rounded-lg text-sm flex items-center gap-1">
      {condition.name}
      {condition.type === "Numeric" && (
        <NumberInput
          value={condition.level}
          onChange={changeLevelOfCondition}
          min={0}
        />
      )}
      <button
        onClick={() => onRemove(condition)}
        className="text-text-light hover:text-white focus:outline-none"
      >
        ×
      </button>
    </span>
  );
}
