import { CreatureProvider } from "../../contexts/CreatureProvider";
import CreatureEditor from "./CreatureEditor";

type CreatureBlockProps = {
  onRemove: () => void;
};

export default function CreatureBlock({ onRemove }: CreatureBlockProps) {
  return (
    <CreatureProvider>
      <CreatureEditor onRemove={onRemove} />
    </CreatureProvider>
  );
}
