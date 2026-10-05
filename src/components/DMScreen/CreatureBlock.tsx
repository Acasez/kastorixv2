// src/components/DMScreen/CreatureBlock.tsx
import CreatureEditor from "./CreatureEditor";

type CreatureBlockProps = {
  onRemove: () => void;
  blockId: number;
};

export default function CreatureBlock({
  onRemove,
  blockId,
}: CreatureBlockProps) {
  return <CreatureEditor onRemove={onRemove} blockId={blockId} />;
}
