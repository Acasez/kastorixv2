import type { Action } from "./Action";
import type { StatKey } from "./StatKey";

export type Trait = {
  name: string;
  appliesTo: TraitCategory[];
  parameter?: string;
  flavor: string;
  effect: string;
  specialAction: Action | null;
  type: string;
  modifiable: string;
  attackStat: StatKey | "DEX/PHY" | null;
  damageStat: StatKey | "None" | null;
  MAPChange: number | null;
  spellshapingDCChange: number;
};

export type RawTrait = {
  name: string;
  appliesTo: string;
  effect: string;
  flavor: string;
  specialAction: string;
  type: string;
  modifiable: string;
  attackStat: string;
  damageStat: string;
  MAPChange: string;
  spellshapingDCChange: number;
};

export type TraitCategory = "Weapons" | "Spells" | "Actions" | "Creatures";
