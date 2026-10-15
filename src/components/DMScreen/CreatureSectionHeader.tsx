import type { ReactNode } from "react";
import CreatureHeader from "./CreatureHeader";
import CreaturePlusButton from "./CreaturePlusButton";

type CreatureSectionHeaderProps = {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  isAdding?: boolean;
  children?: ReactNode;
};

export default function CreatureSectionHeader({
  title,
  onAdd,
  addLabel = "Add",
  isAdding,
  children,
}: CreatureSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-bg-wood-border">
      <div className="w-full pb-1">
        <CreatureHeader title={title} />
      </div>
      <div className="relative shrink-0 -mt-9">
        {onAdd && (
          <CreaturePlusButton
            setIsAdding={onAdd}
            itemLabel={addLabel}
            isAdding={isAdding}
          />
        )}
        {children}
      </div>
    </div>
  );
}
