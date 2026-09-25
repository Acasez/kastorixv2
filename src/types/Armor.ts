export type Armor = {
  name: string;
  resistances: string;
  weakPointDiff: string;
  penalties: string;
  description: string;
  price: string;
  type: string;
  phy: string;
};

export type ArmorTyped = {
  name: string;
  resistances: string;
  weakPointDiff: number;
  penalties: number;
  description: string;
  price: number;
  type: ArmorType;
  phy: number;
};

export type ArmorType = "Unarmed" | "Light" | "Heavy";
