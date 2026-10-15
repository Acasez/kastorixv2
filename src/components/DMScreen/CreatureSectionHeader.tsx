import type { ReactNode } from "react";
import CreatureHeader from "./CreatureHeader";
import CreaturePlusButton from "./CreaturePlusButton";

type CreatureSectionHeaderProps = {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  isAdding?: boolean;
  addDisabled?: boolean;
  children?: ReactNode;
};

export default function CreatureSectionHeader({
  title,
  onAdd,
  addLabel = "Add",
  isAdding,
  addDisabled,
  children,
}: CreatureSectionHeaderProps) {
  return (
    <div className="relative border-b border-bg-wood-border pb-1">
      <CreatureHeader title={title} />
      {onAdd && (
        <div className="absolute right-0 top-0">
          <div className="relative flex items-center gap-1">
            {children}
            <CreaturePlusButton
              onAdd={onAdd}
              itemLabel={addLabel}
              isAdding={isAdding}
              disabled={addDisabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}
