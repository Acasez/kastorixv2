import { getProficiency } from "../constants/Proficiency";
import { useCharacterStore } from "../stores/useCharacterStore";
import type { StatKey } from "../types/StatKey";

export function useCharacter() {
  const {
    character,
    setCharacter,
    resetCharacter,
    updateCharacter,
    handleLevelChange,
    handleNameChange,
    handleGoldChange,
    handleInventoryChange,
  } = useCharacterStore();

  // Add derived stats as getters
  const derivedStats = (() => {
    const getPassive = (skill: string, stat: StatKey) => {
      const proficiency = character.skillProficiencies[skill] || "Untrained";
      const tier = getProficiency(proficiency);
      return 10 + (tier.bonus || 0) + character.baseStats[stat];
    };
    return {
      passivePerception: getPassive("Perception", "INT"),
      passiveManasense: getPassive("Manasense", "WIL"),
    };
  })();

  return {
    character,
    setCharacter,
    resetCharacter,
    updateCharacter,
    handleLevelChange,
    handleNameChange,
    handleGoldChange,
    handleInventoryChange,
    ...derivedStats,
  };
}
