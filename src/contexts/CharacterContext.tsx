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
import type { Species } from "../types/Species";
import type { GeneralFeat } from "../types/Feats";

export type Character = {
  name: string;
  level: number;
  generalFeats: GeneralFeat[];
  species: Species | null;
  baseStats: Record<StatKey, number>;
  skillProficiencies: Record<string, ProficiencyTierName>;
  saveProficiencies: Record<string, ProficiencyTierName>;
  health: Track;
  aura: Track;
  mana: Track;
  speeds: Record<SpeedTypes, number>;
  spellShaping: Spellshaping;
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
