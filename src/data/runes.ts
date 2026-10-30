// data/runes.ts
import type { ItemType, Runes } from "../types/Item";
import rawRunes from "../JSON/runes.json";
import { parsePrice } from "../utils/prices";

export const runes: Runes[] = rawRunes.map((raw) => ({
  ...raw,
  item: raw.item as ItemType,
  price: parsePrice(raw.price),
  level: Number(raw.level),
  striking: Number(raw.striking),
  auraCleaving: Number(raw.auraCleaving),
  elementalWard: Number(raw.elementalWard),
  hardening: Number(raw.hardening),
}));

export default runes;
