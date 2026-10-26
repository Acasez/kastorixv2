// src/hooks/useModalActions.ts
import type { ModalRequest } from "../components/ModalViews/modalTypes";
import type { Character } from "../stores/useCharacterStore";
import { useModal } from "./useModal";

export function useSpellModal() {
  const { openModal } = useModal();

  const openSpellModal = (rankName: string, replaceSpell?: string) => {
    openModal({
      type: "spell",
      title: replaceSpell
        ? `Replace ${replaceSpell}`
        : `Select ${rankName} Spell`,
      selectionKey: "",
      level: 0,
      rank: rankName,
      replaceSpell,
    });
  };

  return { openSpellModal };
}

export function useWeaponModal() {
  const { openModal } = useModal();

  const openWeaponModal = (replaceWeapon?: string) => {
    openModal({
      type: "weapon",
      title: replaceWeapon ? `Replace ${replaceWeapon}` : "Select Weapon",
      selectionKey: "",
      level: 0,
      replaceWeapon,
      excludedTypes: ["Golem"],
    });
  };

  return { openWeaponModal };
}

export function useGadgetModal() {
  const { openModal } = useModal();

  const openGadgetModal = (character: Character, replaceGadget?: string) => {
    openModal({
      type: "gadget",
      title: replaceGadget ? `Replace ${replaceGadget}` : "Select Gadget",
      selectionKey: "",
      level: character.level,
      replaceGadget,
    } as ModalRequest);
  };

  return { openGadgetModal };
}

export function useMetamagicModal() {
  const { openModal } = useModal();

  const openMetamagicModal = (
    character: Character,
    replaceMetamagic?: string,
  ) => {
    openModal({
      type: "metamagic",
      title: replaceMetamagic
        ? `Replace ${replaceMetamagic}`
        : "Select Metamagic",
      selectionKey: "",
      level: character.level,
      replaceMetamagic,
    } as ModalRequest);
  };

  return { openMetamagicModal };
}
