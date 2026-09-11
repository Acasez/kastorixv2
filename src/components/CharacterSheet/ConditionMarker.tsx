import type { Condition } from "../../constants/Condition";

interface ConditionMarkerProps {
  condition: Condition;
  onRemove: (condition: Condition) => void;
}

export default function ConditionMarker({
  condition,
  onRemove,
}: ConditionMarkerProps) {
  return (
    <span className="bg-gray-600 text-text-light px-3 py-1 rounded-lg text-sm flex items-center gap-1">
      {condition.name}
      <button
        onClick={() => onRemove(condition)}
        className="text-remove hover:text-white focus:outline-none"
      >
        ×
      </button>
    </span>
  );
}
