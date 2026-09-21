import { getProficiency } from "../../../constants/Proficiency";
import { useCharacter } from "../../../contexts/CharacterContext";
import type { Weapon } from "../../../types/Weapons";
import ProficiencyMarker from "../../ProficiencyMarker";
import Tooltip from "../../Tooltip";
import weaponTraits from "../../../JSON/weapon_traits.json";

interface WeaponComponentProps {
  weapon: Weapon;
  onReplaceWeapon: (weaponName: string) => void;
  onRemoveWeapon: (weaponName: string) => void;
}

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

export default function WeaponComponent({
  weapon,
  onReplaceWeapon,
  onRemoveWeapon,
}: WeaponComponentProps) {
  const { character } = useCharacter();

  const weaponTraits = weapon.traits.split(",").map((trait) => trait.trim());
  const attackStat = weaponTraits.includes("Ranged")
    ? character.baseStats.DEX
    : weaponTraits.includes("Finesse")
      ? Math.max(character.baseStats.DEX, character.baseStats.PHY)
      : character.baseStats.PHY;

  const damageBonus = weaponTraits.includes("Ranged")
    ? 0
    : character.baseStats.PHY;

  const multiAttackPenalty = weaponTraits.includes("Agile") ? -4 : -5;

  return (
    <Tooltip
      key={weapon.name}
      content={
        <div className="w-90 max-w-[calc(100vw-2rem)] text-center">
          <h3 className="mb-2 text-base font-normal text-yellow-300 underline">
            {weapon.name}
          </h3>
          <p className="mt-2 whitespace-pre-line">
            <strong>Traits:</strong> {weapon.traits}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>Damage:</strong> {weapon.dice + " " + weapon.damageType}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>Hands:</strong> {weapon.hands}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>Range:</strong> {weapon.range}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>Description:</strong> {weapon.description}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>Price:</strong> {weapon.price}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>Type:</strong> {weapon.type}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>Weapon Group:</strong> {weapon.weaponGroup}
          </p>
        </div>
      }
      contentClassName="whitespace-normal"
    >
      <div
        key={weapon.name}
        role="button"
        tabIndex={0}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          onReplaceWeapon(weapon.name);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onReplaceWeapon(weapon.name);
          }
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          if ((event.target as HTMLElement).closest("button")) return;
          onRemoveWeapon(weapon.name);
        }}
        aria-label={`${weapon.name} strike. Click to replace or right-click to remove.`}
        className="flex w-full flex-col gap-2 rounded-lg border border-gray-500 bg-gray-800 px-3 py-2 text-left shadow-sm transition-colors hover:border-gray-300"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-base font-semibold text-white">
            {weapon.name}
          </span>
          <ProficiencyMarker skillName={weapon.name} defaultTier="Trained" />
          <span className="text-sm text-gray-300">
            Hit{" "}
            <strong className="text-white">
              +
              {attackStat +
                getProficiency(
                  character.skillProficiencies[weapon.name] ?? "Trained",
                ).bonus}
            </strong>
          </span>
          <span className="text-sm text-gray-300">
            MAP <strong className="text-white">{multiAttackPenalty}</strong>
          </span>
          <span className="text-sm text-gray-300">
            Damage{" "}
            <strong className="text-white">
              {weapon.dice} + {damageBonus} {weapon.damageType}
            </strong>
          </span>
          <span className="text-sm text-gray-300">
            Range <strong className="text-white">{weapon.range}</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {weaponTraits.map((trait) => (
            <Tooltip
              key={trait}
              content={
                getTraitDescription(trait) ?? "No description available."
              }
              align="left"
              contentClassName="whitespace-pre-line"
            >
              <span className="rounded border border-sky-700 bg-sky-950/60 px-1.5 py-0.5 text-xs text-sky-100">
                {trait}
              </span>
            </Tooltip>
          ))}
        </div>
      </div>
    </Tooltip>
  );
}
