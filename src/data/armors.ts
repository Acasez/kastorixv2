// data/armors.ts
import rawArmors from "../JSON/armors.json";
import type { Armor, ArmorType } from "../types/Armor";
import type { Resistance } from "../types/DamageTypes";

function parseResistances(resistancesString: string): Resistance[] {
  if (!resistancesString?.trim()) return [];

  return resistancesString
    .split(",")
    .map((part) => {
      const match = part.trim().match(/\((\d+)\)\s*([\w\s]+)/);
      if (!match) return null;
      return {
        name: match[2].trim(),
        amount: Number(match[1]),
      };
    })
    .filter(Boolean) as Resistance[];
}

export const armors: Armor[] = rawArmors.map((raw) => ({
  ...raw,
  weakPointDiff: Number(raw.weakPointDiff),
  penalties: Number(raw.penalties),
  price: Number(raw.price),
  type: raw.type as ArmorType,
  resistances: parseResistances(raw.resistances), // ✅ Parse string to array
}));

export default armors;
