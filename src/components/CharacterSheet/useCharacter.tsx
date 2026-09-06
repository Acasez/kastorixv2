import { useContext } from "react";
import { type CharacterContextType } from "./CharacterContext";
import { CharacterContext } from "./CharacterContextDefault";

// Custom hook to use the character context

export function useCharacter(): CharacterContextType {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
}
