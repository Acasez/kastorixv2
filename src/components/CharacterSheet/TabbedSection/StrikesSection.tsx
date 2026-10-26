import { useCharacter } from "../../../hooks/useCharacter";
import WeaponComponent from "../../CommonCreatureComponents/WeaponComponent";
import weapons from "../../../data/weapons";
import { useWeaponModal } from "../../../hooks/useModalActions";
import AddButton from "./AddButton";

export default function StrikesSection() {
  const { character, updateCharacter } = useCharacter();
  const { openWeaponModal } = useWeaponModal();

  const onRemoveWeapon = (weapon: string) => {
    updateCharacter({
      weapons: character.weapons.filter((name) => name !== weapon),
    });
  };
  return (
    <div className="p-4 text-white">
      <div className="flex flex-row gap-4">
        <h2 className="text-xl mb-2">Weapons and Strikes</h2>
        <AddButton onClick={() => openWeaponModal()} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2 mt-3">
          {weapons
            .filter((weapon) => character.weapons.includes(weapon.name))
            .map((weapon) => (
              <WeaponComponent
                key={weapon.name}
                weapon={weapon}
                onReplaceWeapon={openWeaponModal}
                onRemoveWeapon={onRemoveWeapon}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
