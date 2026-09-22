// CharacterContext.tsx — types, context, and hook. No components!
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ProficiencyTierName } from "../constants/Proficiency";
import type { StatKey } from "../types/StatKey";
import type { SpeedTypes } from "../types/SpeedTypes";
import type { Spellshaping } from "../types/Spells";

export type Character = {
  name: string;
  level: number;
  generalFeats: string[];
  arcaneFeats: string[];
  advantages: string[];
  ancestryFeats: string[];
  knownSpells: string[];
  metamagics: string[];
  weapons: string[];
  armor: string;
  selections: Record<string, string>;
  background: string | null;
  species: string | null;
  baseStats: Record<StatKey, number>;
  skillProficiencies: Record<string, ProficiencyTierName>;
  saveProficiencies: Record<string, ProficiencyTierName>;
  health: Track;
  aura: Track;
  mana: Track;
  speeds: Record<SpeedTypes, number>;
  resistances: Record<string, number>;
  spellShaping: Spellshaping;
  gold: number;
  inventory: string;
};

export type Track = {
  current: number;
  max: number;
};

export type CharacterContextType = {
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
  updateCharacter: (patch: Partial<Character>) => void;
  handleLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passivePerception: number;
  passiveManasense: number;
  handleGoldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined,
);

export function useCharacter(): CharacterContextType {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
}
