import type { Action } from "./Action";
import type { Species } from "./Species";

export type Background = {
  name: string;
  description: string;
  generalFeat: GeneralFeat;
};

export type GeneralFeat = {
  name: string;
  description: string;
  unlockedAction: Action;
  prerequisites: string;
  level: number;
  repeatable: boolean;
  unlockedFeats: string;
  speeds: string;
  resistances: string;
  combatManeuversLearned: string;
  health: string;
  choice: string;
};

export type ArcaneFeat = {
  name: string;
  description: string;
  unlockedAction: Action;
  prerequisites: string;
  level: number;
  repeatable: boolean;
  unlockedFeats: string;
  spellsLearned: string;
  metamagicsLearned: string;
  choice: string;
  gadgets: string;
};

export type Advantage = {
  name: string;
  description: string;
  unlockedAction: Action;
  level: number;
  unlockedFeats: string;
  speeds: string;
  resistances: string;
  spellsLearned: string;
  metamagicsLearned: string;
  choice: string;
  health: string;
  mana: string;
};

export type AncestryFeat = {
  name: string;
  description: string;
  unlockedAction: Action;
  type: AncestryFeatType;
  species: Species[];
  prerequisites: string;
  level: number;
  unlockedFeats: string;
  speeds: string;
  resistances: string;
};

export type AncestryFeatType = "Cultural" | "Biological";
