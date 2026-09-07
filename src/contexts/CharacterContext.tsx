// CharacterContext.tsx — types, context, and hook. No components!
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type Character = {
  name: string;
  level: number;
  feats: string[];
  species: string;
  baseStats: Record<string, number>;
};

export type CharacterContextType = {
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
  updateCharacter: (patch: Partial<Character>) => void;
  handleLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
