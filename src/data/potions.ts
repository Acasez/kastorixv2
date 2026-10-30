import rawPotions from "../JSON/potions.json";
import type { Potion, PotionCategory } from "../types/Potion";
import { parsePrice } from "../utils/prices";

export const potions: Potion[] = rawPotions.map((raw) => {
  return {
    ...raw,
    category: raw.category as PotionCategory,
    price: parsePrice(raw.price),
    level: 0,
  };
});

export default potions;
