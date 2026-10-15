import CreatureHeader from "./CreatureHeader";
import CreaturePlusButton from "./CreaturePlusButton";

type CreatureSectionHeaderProps = {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  isAdding?: boolean;
};

export default function CreatureSectionHeader({
  title,
  onAdd,
  addLabel = "Add",
  isAdding,
}: CreatureSectionHeaderProps) {
  return (
    <div className="relative">
      <CreatureHeader title={title} />
      {onAdd && (
        <CreaturePlusButton
          setIsAdding={onAdd}
          itemLabel={addLabel}
          isAdding={isAdding}
        />
      )}
    </div>
  );
}
