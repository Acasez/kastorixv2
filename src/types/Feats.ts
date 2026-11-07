import type { Action } from "./Action";
import type { Resistance } from "./DamageTypes";
import type { Species } from "./Species";
import type { Speed } from "./SpeedTypes";
import type { SpellUnlock } from "./Spells";
import type { Trait } from "./Trait";

export type Background = {
  name: string;
  description: string;
  generalFeat: GeneralFeat | null;
};

export type GeneralFeat = {
  name: string;
  traits: Trait[];
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
  traits: Trait[];
  description: string;
  unlockedActions: Action[];
  prerequisites: string;
  level: number;
  repeatable: boolean;
  unlockedFeats: Unlock[];
  spellsLearned: SpellUnlock[];
  metamagicsLearned: string;
  choice: string;
  gadgets: string;
};

export type Advantage = {
  name: string;
  traits: Trait[];
  description: string;
  unlockedActions: Action[];
  prerequisites: string;
  level: number;
  unlockedFeats: Unlock[];
  speeds: Speed[];
  resistances: Resistance[];
  spellsLearned: SpellUnlock[];
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

export type ChoiceType =
  | "generalFeat"
  | "arcaneFeat"
  | "golemUpgrade"
  | "runegunUpgrade"
  | "advantage"
  | "ancestryFeat"
  | "background"
  | "spell"
  | "weapon"
  | "metamagic"
  | "armor"
  | "gadget"
  | "technique";

export type Unlock = {
  type: ChoiceType;
  level: number | "X"; // "X" = use parent level
  preset?: string;
};
