export type ArmorType = "Unarmed" | "Light" | "Heavy" | "Unarmored";

export interface Armor {
  name: string;
  resistances: string;
  weakPointDiff: number;
  penalties: number;
  manaRecovery: string;
  description: string;
  price: number;
  type: ArmorType;
  phy: string;
}
