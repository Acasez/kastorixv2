import ActionButton from "./ActionButton";

export default function SaveLoadButtons() {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <ActionButton
        label="Save Character"
        isHighlighted={true}
        className="text-xs px-2 py-1"
      />
      <ActionButton
        label="Load Character"
        isHighlighted={true}
        className="text-xs px-2 py-1"
      />
      <ActionButton
        label="Export Character"
        isHighlighted={true}
        className="text-xs px-1 py-1"
      />
      <ActionButton
        label="Import Character"
        isHighlighted={true}
        className="text-xs px-2 py-1"
      />
    </div>
  );
}
