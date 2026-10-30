import type { Price } from "./Item";

export type Potion = {
  name: string;
  effect: string;
  duration: string;
  category: PotionCategory;
  price?: Price;
  level: number;
};

export type PotionCategory =
  | "Healing"
  | "Enhancement"
  | "Mana"
  | "Cleansing"
  | "Poison";
