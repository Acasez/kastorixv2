import ActionButton from "./ActionButton";

export default function SaveLoadButtons() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <ActionButton label="Save Character" isHighlighted={true} />
      <ActionButton label="Load Character" isHighlighted={true} />
      <ActionButton label="Export Character" isHighlighted={true} />
      <ActionButton label="Import Character" isHighlighted={true} />
    </div>
  );
}
