import type { ActionCost } from "./Action";

export type CombatManeuvers = {
  name: string;
  action: ActionCost;
  traits: CombatManeuverTrait;
  description: string;
  prerequisites: string;
  type: CombatManeuverType;
  level: number;
};

export type CombatManeuverTrait =
  | "Attack"
  | "Brawling"
  | "Tactical"
  | "Acrobatics"
  | "Draining"
  | "Blade Art";

export type CombatManeuverType =
  | "Basic"
  | "Simple"
  | "Advanced"
  | "Complex"
  | "Masterwork";
