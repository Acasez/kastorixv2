// data/weaponTraits.ts
import rawWeaponTraits from "../JSON/weapon_traits.json";
import type { StatKey } from "../types/StatKey";
import type { WeaponTrait, RawWeaponTrait } from "../types/Weapons";
import { actionsByName } from "./actions";

function parseTrait(raw: RawWeaponTrait): WeaponTrait {
  const match = raw.name.match(/^([\w\s]+)(?:\s*\(([^)]+)\))?$/);
  const baseName = match ? match[1].trim() : raw.name;
  const parameter = match ? match[2]?.trim() : undefined;

  return {
    name: baseName,
    parameter,
    effect: raw.effect,
    specialAction: raw.specialAction
      ? actionsByName[raw.specialAction] || null
      : null,
    type: raw.type,
    modifiable: raw.modifiable,
    attackStat: raw.attackStat ? (raw.attackStat as StatKey | "DEX/PHY") : null,
    damageStat: raw.damageStat ? (raw.damageStat as StatKey | "None") : null,
    MAPChange: raw.MAPChange ? Number(raw.MAPChange) : null,
  };
}

export const weaponTraits: WeaponTrait[] = rawWeaponTraits.map(parseTrait);
export const weaponTraitsByName: Record<string, WeaponTrait> =
  Object.fromEntries(weaponTraits.map((t) => [t.name, t]));
export default weaponTraits;
