import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type CreatureTrack = {
  current: number;
  max: number;
};

export type Creature = {
  name: string;
  traits: string;
  senses: string;
  skills: string;
  languages: string;
  size: string;
  stats: Record<"PHY" | "DEX" | "INT" | "WIL", number>;
  health: CreatureTrack;
  aura: CreatureTrack;
  mana: CreatureTrack;
  savingThrows: Record<"Fortitude" | "Reflex" | "Will", number>;
  armor: string;
  resistances: string;
  speeds: string;
  strikes: string;
  actions: string;
  spells: string;
  passives: string;
};

export type CreatureContextType = {
  creature: Creature;
  setCreature: Dispatch<SetStateAction<Creature>>;
  updateCreature: (patch: Partial<Creature>) => void;
};

export const CreatureContext = createContext<CreatureContextType | undefined>(
  undefined,
);

export function useCreature(): CreatureContextType {
  const context = useContext(CreatureContext);
  if (!context) {
    throw new Error("useCreature must be used within a CreatureProvider");
  }
  return context;
}
