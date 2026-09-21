import { useState } from "react";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import { useCharacter } from "../../../contexts/CharacterContext";
import WeaponComponent from "./WeaponComponent";
import weapons from "../../../JSON/weapons.json";
import ModalWrapper from "../../ModalViews/ModalWrapper";

export default function StrikesSection() {
  const { character, updateCharacter } = useCharacter();
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);

  const openWeaponModal = () => {
    openWeaponModalForReplacement();
  };

  const openWeaponModalForReplacement = (replaceWeapon?: string) => {
    setModalRequest({
      type: "weapon",
      title: replaceWeapon ? `Replace ${replaceWeapon}` : `Select Weapon`,
      selectionKey: "",
      level: 0,
      replaceWeapon,
      excludedTypes: ["Golem"],
    });
  };

  const onRemoveWeapon = (weapon: string) => {
    updateCharacter({
      weapons: character.weapons.filter((name) => name !== weapon),
    });
  };
  return (
    <div className="p-4 text-white">
      <h2 className="text-xl mb-2">Weapons and Strikes</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2 mt-3">
          {weapons
            .filter((weapon) => character.weapons.includes(weapon.name))
            .map((weapon) => (
              <WeaponComponent
                key={weapon.name}
                weapon={weapon}
                onReplaceWeapon={openWeaponModalForReplacement}
                onRemoveWeapon={onRemoveWeapon}
              />
            ))}
        </div>

        <div>
          <button
            type="button"
            className="bg-button-add text-white px-3 py-1 rounded border-2"
            onClick={() => openWeaponModal()}
          >
            +
          </button>
        </div>
      </div>
      {modalRequest && (
        <ModalWrapper
          request={modalRequest}
          closeModal={() => setModalRequest(null)}
        />
      )}
    </div>
  );
}
