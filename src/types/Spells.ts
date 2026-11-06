import type { DamageInstance } from "./DamageTypes";
import type { Saves } from "./StatKey";
import type { Trait } from "./Trait";

export type Spellshaping = {
  verbal: VerbalComponent;
  somatic: SomaticComponent;
  totalBonus: string;
};

export type SomaticComponent = "None" | "One Handed" | "Two Handed";

export type VerbalComponent = "None" | "Standard" | "Attuned";

export type Spell = {
  name: string;
  actions: string;
  aspects: Aspect[];
  traits: Trait[];
  range: number | string;
  target: string;
  duration: string;
  flavor: string;
  effect: string;
  upcast: string;
  rank: SpellRank;
  dice: DamageInstance[];
  save: Saves;
};

export type SpellRank =
  | "Apprentice" //Lvl 0
  | "Adept" //Lvl 4
  | "Magus" //Lvl 8
  | "Grand Magus" //Lvl 12
  | "Archmage"; //Lvl 16

export type Aspect = {
  name: string;
  type: AspectType;
  attuneable: string;
  opposite: Aspect | null;
  basicMagic: string;
  aura: string;
  infusion: string;
  elementalization: string;
};

export type AspectType = "Fundamental" | "Primal" | "Lesser";

export type Metamagic = {
  name: string;
  traits: Trait[];
  aspects: Aspect[];
  effect: string;
  dc: number;
  level: number;
};

export type SpellUnlock = {
  rank: SpellRank;
  amount: number;
  addInt: boolean;
};
