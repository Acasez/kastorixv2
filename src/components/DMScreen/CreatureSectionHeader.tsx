import type { ReactNode } from "react";
import CreatureHeader from "./CreatureHeader";
import CreaturePlusButton from "./CreaturePlusButton";

type CreatureSectionHeaderProps = {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  isAdding?: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

export default function CreatureSectionHeader({
  title,
  onAdd,
  addLabel = "Add",
  isAdding,
  disabled,
  children,
}: CreatureSectionHeaderProps) {
  return (
    <div className="relative border-b border-bg-wood-border pb-1">
      <CreatureHeader title={title} />
      {onAdd && (
        <div className="absolute right-0 top-0">
          <div className="relative">
            <CreaturePlusButton
              onAdd={onAdd}
              itemLabel={addLabel}
              isAdding={isAdding}
              disabled={disabled}
            />
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
