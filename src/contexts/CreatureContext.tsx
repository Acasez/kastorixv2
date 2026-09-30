import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ProficiencyTierName } from "../constants/Proficiency";
import type { SpeedTypes } from "../types/SpeedTypes";

export type CreatureSaveKey = "Fortitude" | "Reflex" | "Will";

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
  savingThrows: Record<CreatureSaveKey, ProficiencyTierName>;
  armor: string;
  resistances: Partial<Record<string, number>>;
  speeds: Partial<Record<SpeedTypes, number>>;
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
