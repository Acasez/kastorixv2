interface ConditionMarkerProps {
  condition: string;
}

export default function ConditionMarker({ condition }: ConditionMarkerProps) {
  return (
    <span
      key={condition}
      className="bg-gray-600 text-text-light px-3 py-1 rounded-lg text-sm"
    >
      {condition}
    </span>
  );
}
