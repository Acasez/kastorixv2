// data/damageTypes.ts
import type { DamageGroup, DamageType, Rarity } from "../types/DamageTypes";
import rawDamageTypes from "../JSON/damage_types.json";

export const damageTypes: DamageType[] = rawDamageTypes.map((raw) => ({
  ...raw,
  damageGroup: raw.damageGroup as DamageGroup,
  rarity: raw.rarity as Rarity,
}));

export const damageTypesByName: Record<string, DamageType> = Object.fromEntries(
  damageTypes.map((dt) => [dt.name.toLocaleLowerCase(), dt]),
);

export default damageTypes;
