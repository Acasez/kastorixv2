// data/armors.ts
import rawArmors from "../JSON/armors.json";
import type { Armor, ArmorType } from "../types/Armor";
import { parseResistances } from "../utils/parseNamedUtils";
import { toNumber } from "../utils/toNumber";
import { parsePrice } from "../utils/prices";

export const armors: Armor[] = rawArmors.map((raw) => ({
  ...raw,
  weakPointDiff: toNumber(raw.weakPointDiff),
  penalties: toNumber(raw.penalties),
  price: parsePrice(raw.price),
  type: raw.type as ArmorType,
  resistances: parseResistances(raw.resistances),
}));

export default armors;
