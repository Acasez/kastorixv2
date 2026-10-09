export type DamageType = {
  name: string;
  damageGroup: DamageGroup;
  resistance: string;
  rarity: Rarity;
};

export type DamageGroup = "Physical" | "Elemental" | "Exotic";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Very Rare";

export type Resistance = {
  name: string;
  amount: number;
};

export type DamageInstance = {
  name: DamageType;
  amount: DiceRoll;
};

export type DiceRoll = {
  diceSize: number; //d4 or d12
  amount: number; //1d4 or 2d4
  bonus?: number; //+4
};
