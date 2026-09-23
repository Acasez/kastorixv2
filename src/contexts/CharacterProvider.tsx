// CharacterProvider.tsx — the only file exporting a component
import {
  useState,
  type ReactNode,
  type ChangeEvent,
  useMemo,
  useCallback,
} from "react";
import { CharacterContext, type Character } from "./CharacterContext";
import { getProficiency } from "../constants/Proficiency";
import type { StatKey } from "../types/StatKey";
import { getCharacterResistances } from "../utils/characterResistances";

const defaultCharacter: Character = {
  name: "",
  level: 1,
  generalFeats: [],
  arcaneFeats: [],
  advantages: [],
  ancestryFeats: [],
  knownSpells: [],
  metamagics: [],
  weapons: [],
  armor: "",
  selections: {},
  background: null,
  species: null,
  baseStats: { PHY: 0, DEX: 0, INT: 0, WIL: 0 },
  skillProficiencies: {},
  saveProficiencies: {},
  health: { current: 10, max: 10 },
  aura: { current: 10, max: 10 },
  mana: { current: 10, max: 10 },
  speeds: { Land: 5, Swim: 0, Climb: 0, Burrow: 0, Glide: 0, Fly: 0 },
  resistances: {},
  spellShaping: {
    verbal: "Standard",
    somatic: "Two Handed",
    totalBonus: "",
  },
  gold: 0,
  inventory: "",
};

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character>(defaultCharacter);

  const resetCharacter = useCallback(() => {
    setCharacter(defaultCharacter);
  }, []);

  const updateCharacter = useCallback(
    (patch: Partial<Character>) =>
      setCharacter((prev) => ({ ...prev, ...patch })),
    [],
  );

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateCharacter({
      level: Math.min(20, Math.max(0, Number(e.target.value))),
    });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateCharacter({ name: e.target.value });

  const handleGoldChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateCharacter({
      gold: Math.min(99999, Math.max(0, Number(e.target.value))),
    });

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

  const characterWithResistances = {
    ...character,
    resistances: getCharacterResistances(character),
  };

  return (
    <CharacterContext.Provider
      value={{
        character: characterWithResistances,
        setCharacter,
        resetCharacter,
        updateCharacter,
        handleLevelChange,
        handleNameChange,
        ...derivedStats,
        handleGoldChange,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}
