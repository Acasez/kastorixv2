import type { Resistance } from "./DamageTypes";
import type { Price } from "./Item";

export type ArmorType = "Unarmed" | "Light" | "Heavy" | "Unarmored";

export interface Armor {
  name: string;
  resistances: Resistance[];
  weakPointDiff?: number;
  penalties?: number;
  manaRecovery: string;
  description: string;
  price?: Price;
  type: ArmorType;
  phy: string;
}
