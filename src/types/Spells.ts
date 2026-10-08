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
  traits: SpellTrait[];
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

export type SpellTrait = {
  name: string;
  flavor: string;
  effect: string;
};

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
  spellType: string;
  effect: string;
  dc: string;
  level: string;
};
