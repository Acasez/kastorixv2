import { createContext } from "react";
import type { CharacterContextType } from "./CharacterContext";

// Create the context with a default value

export const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined,
);
