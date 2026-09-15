export type DamageType = {
  name: string;
  damageGroup: DamageGroup;
  resistance: string;
  rarity: Rarity;
};

export type DamageGroup = "Physical" | "Elemental" | "Exotic";

type Rarity = "Common" | "Uncommon" | "Rare" | "Very Rare";
