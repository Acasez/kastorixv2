// data/armors.ts
import rawArmors from "../JSON/armors.json";
import type { Armor, ArmorType } from "../types/Armor";

export const armors: Armor[] = rawArmors.map((raw) => ({
  ...raw,
  weakPointDiff: Number(raw.weakPointDiff),
  penalties: Number(raw.penalties),
  price: Number(raw.price),
  type: raw.type as ArmorType,
}));

// Re-export for convenience
export default armors;
