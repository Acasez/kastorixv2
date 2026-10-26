// src/hooks/useModalActions.ts
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

// ... etc for gadget, metamagic, etc.
