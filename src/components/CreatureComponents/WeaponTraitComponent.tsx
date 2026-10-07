import Tooltip from "../Tooltip";
import type { WeaponTrait } from "../../types/Weapons";

type WeaponTraitComponentProps = {
  trait: WeaponTrait;
};

export default function WeaponTraitComponent({
  trait,
}: WeaponTraitComponentProps) {
  const content = trait.parameter
    ? trait.effect.replace(/X/g, trait.parameter)
    : trait.effect;

  return (
    <Tooltip
      key={trait.name}
      content={content}
      align="left"
      contentClassName="whitespace-pre-line"
    >
      <span className="rounded border border-sky-700 bg-sky-950/60 px-1.5 py-0.5 text-xs text-sky-100">
        {trait.parameter ? `${trait.name} (${trait.parameter})` : trait.name}
      </span>
    </Tooltip>
  );
}
