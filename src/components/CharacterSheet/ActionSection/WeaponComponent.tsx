import { getProficiency } from "../../../constants/Proficiency";
import { useCharacter } from "../../../contexts/CharacterContext";
import type { Weapon } from "../../../types/Weapons";
import ProficiencyMarker from "../../ProficiencyMarker";
import Tooltip from "../../Tooltip";

interface WeaponComponentProps {
  weapon: Weapon;
  onReplaceWeapon: (weaponName: string) => void;
  onRemoveWeapon: (weaponName: string) => void;
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

  return (
    <Tooltip
      key={weapon.name}
      content={
        <div className="w-70 max-w-[calc(100vw-2rem)] text-center">
          <h3 className="mb-2 text-base font-normal text-yellow-300 underline">
            {weapon.name}
          </h3>
          <p className="mt-2 whitespace-pre-line">
            <strong>Description:</strong> {weapon.description}
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
        className="flex items-center gap-1 border border-gray-400 rounded px-2 py-1"
      >
        <span>{weapon.name}</span>
        <ProficiencyMarker skillName={weapon.name} defaultTier="Trained" />
        <span>
          {`(+${
            attackStat +
            getProficiency(
              character.skillProficiencies[weapon.name] ?? "Trained",
            ).bonus
          })`}
        </span>
      </div>
    </Tooltip>
  );
}
