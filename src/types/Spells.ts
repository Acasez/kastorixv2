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
  aspects: string;
  traits: string;
  range: number | string;
  target: string;
  duration: string;
  effect: string;
  upcast: string;
  rank: string;
};

export type SpellRank =
  | "Apprentice"
  | "Adept"
  | "Magus"
  | "Grand Magus"
  | "Archmage";

export type SpellTrait = {
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

export type Metamagic = {
  name: string;
  spellType: string;
  effect: string;
  dc: string;
  level: string;
};
