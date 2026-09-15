export type Armor = {
  name: string;
  resistances: string;
  weakPointDiff: number;
  penalties: number;
  traits: string;
  description: string;
  price: number;
  type: ArmorType;
  phy: number;
};

export type ArmorType = "Unarmed" | "Light" | "Heavy";
