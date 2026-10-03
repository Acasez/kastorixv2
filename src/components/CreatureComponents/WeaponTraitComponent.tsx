import Tooltip from "../Tooltip";
import weaponTraits from "../../JSON/weapon_traits.json";

type WeaponTraitComponentProps = {
  trait: string;
};

export default function WeaponTraitComponent({
  trait,
}: WeaponTraitComponentProps) {
  function normalizeTraitName(traitName: string) {
    return traitName
      .replace(/\s*\([^)]*\)/g, "")
      .trim()
      .toLowerCase();
  }

  function getTraitDescription(traitName: string) {
    const normalizedName = normalizeTraitName(traitName);
    return weaponTraits.find(
      (trait) => normalizeTraitName(trait.name) === normalizedName,
    )?.effect;
  }
  return (
    <Tooltip
      key={trait}
      content={getTraitDescription(trait) ?? "No description available."}
      align="left"
      contentClassName="whitespace-pre-line"
    >
      <span className="rounded border border-sky-700 bg-sky-950/60 px-1.5 py-0.5 text-xs text-sky-100">
        {trait}
      </span>
    </Tooltip>
  );
}
