import { useState, type ReactNode, type ChangeEvent } from "react";
import { CharacterContext } from "./CharacterContextDefault";

// Define the type for the character data
export type CharacterContextType = {
  characterName: string;
  setCharacterName: (name: string) => void;
  level: number;
  setLevel: (level: number) => void;
  feats: string[];
  setFeats: (feats: string[]) => void;
  species: string;
  setSpecies: (species: string) => void;
  baseStats: Record<string, number>;
  setBaseStats: (stats: Record<string, number>) => void;
  handleLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

// Define the provider props
type CharacterProviderProps = {
  children: ReactNode;
};

// Create the provider component
export function CharacterProvider({ children }: CharacterProviderProps) {
  const [characterName, setCharacterName] = useState<string>("");
  const [level, setLevel] = useState<number>(1);
  const [feats, setFeats] = useState<string[]>([]);
  const [species, setSpecies] = useState<string>("");
  const [baseStats, setBaseStats] = useState<Record<string, number>>({});

  // Handle level change with proper typing
  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLevel = Number(e.target.value);
    if (newLevel >= 0 && newLevel <= 20) {
      setLevel(newLevel);
    }
  };

  // Handle name change with proper typing
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCharacterName(e.target.value);
  };

  return (
    <CharacterContext.Provider
      value={{
        characterName,
        setCharacterName,
        level,
        setLevel,
        feats,
        setFeats,
        species,
        setSpecies,
        baseStats,
        setBaseStats,
        handleLevelChange,
        handleNameChange,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}
