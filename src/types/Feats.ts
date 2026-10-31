import type { Action } from "./Action";
import type { Resistance } from "./DamageTypes";
import type { Species } from "./Species";
import type { Speed } from "./SpeedTypes";

export type Background = {
  name: string;
  description: string;
  generalFeat: GeneralFeat | null;
};

export type GeneralFeat = {
  name: string;
  description: string;
  unlockedActions: Action[];
  techniques: Action[];
  prerequisites: string;
  level: number;
  repeatable: boolean;
  unlockedFeats: Unlock[];
  speeds: Speed[];
  resistances: Resistance[];
  techniquesLearned: number;
  health: string;
  choice: string;
  quickAccessSlots: number;
  focusPoints: number;
};

export type ArcaneFeat = {
  name: string;
  description: string;
  unlockedActions: Action[];
  prerequisites: string;
  level: number;
  repeatable: boolean;
  unlockedFeats: Unlock[];
  spellsLearned: string;
  metamagicsLearned: string;
  choice: string;
  gadgets: string;
};

export type Advantage = {
  name: string;
  description: string;
  unlockedActions: Action[];
  prerequisites: string;
  level: number;
  unlockedFeats: Unlock[];
  speeds: Speed[];
  resistances: Resistance[];
  spellsLearned: string;
  metamagicsLearned: string;
  choice: string;
  health: string;
  mana: string;
  gadgets: string;
};

export type AncestryFeat = {
  name: string;
  description: string;
  unlockedActions: Action[];
  type: AncestryFeatType;
  species: Species[];
  prerequisites: string;
  level: number;
  unlockedFeats: Unlock[];
  speeds: Speed[];
  resistances: Resistance[];
};

export type AncestryFeatType = "Cultural" | "Biological";

export type FeatTypes =
  | "generalFeat"
  | "arcaneFeat"
  | "golemUpgrade"
  | "runegunUpgrade"
  | "advantage"
  | "ancestryFeat";

export type Unlock = {
  type: FeatTypes;
  level: number;
  preset?: string;
};
