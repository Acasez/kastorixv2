export type Action = {
  name: string;
  actions: ActionCost;
  trigger: string;
  requirement: string;
  description: string;
  traits: ActionTrait[];
};

export interface ActionData {
  name: string;
  description: string;
  actions: string;
  trigger?: string;
  requirement?: string;
  traits?: string;
  sourceType: string;
  source?: string;
}

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

/* export type ActionTrait = {
  name: string;
  effect: string;
}; */
