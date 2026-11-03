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
  | "Apprentice"
  | "Adept"
  | "Magus"
  | "Grand Magus"
  | "Archmage";

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
