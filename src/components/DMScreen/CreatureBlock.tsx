import CreatureEditor from "./CreatureEditor";

type CreatureBlockProps = {
  onRemove: () => void;
};

export default function CreatureBlock({ onRemove }: CreatureBlockProps) {
  return <CreatureEditor onRemove={onRemove} />;
}
