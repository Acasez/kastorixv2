// CharacterProvider.tsx — the only file exporting a component
import { useState, type ReactNode, type ChangeEvent } from "react";
import { CharacterContext, type Character } from "./CharacterContext";

const defaultCharacter: Character = {
  name: "",
  level: 1,
  feats: [],
  species: "",
  baseStats: {},
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

  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        updateCharacter,
        handleLevelChange,
        handleNameChange,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}
