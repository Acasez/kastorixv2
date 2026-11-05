import type { Trait } from "../../types/Trait";
import Tooltip from "../Tooltip";

type TraitComponentProps = {
  trait: Trait;
  className?: string;
};

export default function TraitComponent({
  trait,
  className,
}: TraitComponentProps) {
  const effectWithParameter = trait.parameter
    ? trait.effect.replace(/X/g, trait.parameter)
    : trait.effect;

  const content = trait.flavor + "\n" + effectWithParameter;

  return (
    <Tooltip
      key={trait.name}
      content={content}
      align="left"
      contentClassName="whitespace-pre-line"
    >
      <span
        className={`rounded border border-sky-700 bg-sky-950/60 px-1.5 py-0.5 text-xs text-sky-100 ${className}`}
      >
        {trait.parameter ? `${trait.name} (${trait.parameter})` : trait.name}
      </span>
    </Tooltip>
  );
}
