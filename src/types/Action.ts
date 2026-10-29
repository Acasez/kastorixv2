import type { Skill } from "./Skills";

export type Action = {
  name: string;
  actions: ActionCost;
  trigger?: string;
  requirement?: string;
  manaCost?: number;
  focusCost?: number;
  description: string;
  traits: ActionTrait[];
  skill: Skill[];
  sourceType: string;
  source?: string;
  techniqueRank: TechniqueRank;
};

export type ActionCost = "0" | "1" | "2" | "3" | "R";

export type CreatureActionCost = "0" | "1" | "2" | "3" | "R" | "L";

export type ActionTrait =
  | "Attack"
  | "Move"
  | "Traverse"
  | "Item"
  | "Skill"
  | "Magic"
  | "Spellshaping"
  | "Aura"
  | "Mental"
  | "Defensive"
  | "Soul"
  | "Verbal"
  | "Stance"
  | "Attunement"
  | "Brawling"
  | "Combat Manuever"
  | "Tactical"
  | "Blade Art"
  | "Golem"
  | "Creature";

export type TechniqueRank = "Simple" | "Advanced" | "Complex" | "Masterwork";

/* export type ActionTrait = {
  name: string;
  effect: string;
}; */
