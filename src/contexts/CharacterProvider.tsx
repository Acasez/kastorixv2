// CharacterProvider.tsx — the only file exporting a component
import { useState, type ReactNode, type ChangeEvent, useMemo } from "react";
import { CharacterContext, type Character } from "./CharacterContext";
import { getProficiency } from "../constants/Proficiency";
import type { StatKey } from "../types/StatKey";

const defaultCharacter: Character = {
  name: "",
  level: 1,
  feats: [],
  species: "",
  baseStats: { PHY: 0, DEX: 0, INT: 0, WIL: 0 },
  skillProficiencies: {},
  saveProficiencies: {},
  health: { current: 10, max: 10 },
  aura: { current: 10, max: 10 },
  mana: { current: 10, max: 10 },
  speeds: { Land: 5, Swim: 0, Climb: 0, Burrow: 0, Glide: 0, Fly: 0 },
  spellShaping: {
    proficiency: "2",
    verbal: false,
    somatic: false,
    totalBonus: "",
  },
};

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character>(defaultCharacter);

  const updateCharacter = (patch: Partial<Character>) =>
    setCharacter((prev) => ({ ...prev, ...patch }));

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateCharacter({
      level: Math.min(20, Math.max(0, Number(e.target.value))),
    });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateCharacter({ name: e.target.value });

  // Combined derived stats
  const derivedStats = useMemo(() => {
    const getPassive = (skill: string, stat: StatKey) => {
      const proficiency = character.skillProficiencies[skill] || "Untrained";
      const tier = getProficiency(proficiency);
      return 10 + (tier.bonus || 0) + character.baseStats[stat];
    };

    return {
      passivePerception: getPassive("Perception", "INT"),
      passiveManasense: getPassive("Manasense", "WIL"),
    };
  }, [character.skillProficiencies, character.baseStats]);

  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        updateCharacter,
        handleLevelChange,
        handleNameChange,
        ...derivedStats,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}
