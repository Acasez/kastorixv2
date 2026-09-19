import type { ActionCost } from "./Action";

export type Spellshaping = {
  verbal: VerbalComponent;
  somatic: SomaticComponent;
  totalBonus: string;
};

export type SomaticComponent = "None" | "One Handed" | "Two Handed";

export type VerbalComponent = "None" | "Standard" | "Attuned";

export type Spell = {
  name: string;
  actions: ActionCost;
  aspects: Aspect[];
  traits: SpellTraits[];
  range: number | string;
  target: string;
  duration: string;
  effect: string;
  upcast: string;
  rank: SpellRank;
};

export type SpellRank =
  | "Apprentice"
  | "Adept"
  | "Magus"
  | "Grand Magus"
  | "Archmage";

export type SpellTraits = {
  name: string;
  flavor: string;
  effect: string;
};

export type Aspect = {
  name: string;
  type: AspectType;
  opposite: Aspect;
  basicMagic: string;
  aura: string;
  infusion: string;
  elementalization: string;
};

export type AspectType = "Fundamental" | "Primal" | "Lesser";
