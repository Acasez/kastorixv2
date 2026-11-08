import type { Skill } from "./Skills";
import type { Trait } from "./Trait";

export type Action = {
  name: string;
  actions: ActionCost;
  trigger?: string;
  requirement?: string;
  manaCost?: number;
  focusCost?: number;
  description: string;
  traits: Trait[];
  skill: Skill[];
  sourceType: string;
  source?: string;
  techniqueRank: TechniqueRank;
};

export type ActionCost = "0" | "1" | "2" | "3" | "R";

export type CreatureActionCost = "0" | "1" | "2" | "3" | "R" | "L";

export type TechniqueRank =
  | "Simple"
  | "Advanced"
  | "Complex"
  | "Masterwork"
  | "Blade Art";
