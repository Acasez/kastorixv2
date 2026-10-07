// data/weapons.ts
import rawWeapons from "../JSON/weapons.json";
import type { StatKey } from "../types/StatKey";
import type {
  Weapon,
  WeaponGroup,
  WeaponTrait,
  WeaponType,
} from "../types/Weapons";
import { weaponTraitsByName } from "./weaponTraits";

function parseTraitInstance(traitString: string): WeaponTrait {
  // Parse "Deadly (d12)" into {name: "Deadly", parameter: "d12"}
  const match = traitString.trim().match(/^([\w\s]+)(?:\s*\(([^)]+)\))?$/);
  const baseName = match ? match[1].trim() : traitString.trim();
  const parameter = match ? match[2]?.trim() : undefined;

  const baseTrait = weaponTraitsByName[baseName] || {
    name: baseName,
    effect: "",
    specialAction: null,
    type: "",
    modifiable: "",
    attackStat: null,
    damageStat: null,
    MAPChange: null,
  };

  return { ...baseTrait, parameter: parameter || baseTrait.parameter };
}

function parseTraits(traitsString: string): WeaponTrait[] {
  if (!traitsString?.trim()) return [];
  return traitsString.split(",").map(parseTraitInstance);
}

export const weapons: Weapon[] = rawWeapons.map((raw) => ({
  ...raw,
  dice: raw.dice,
  hands: Number(raw.hands),
  range: Number(raw.range),
  price: Number(raw.price.replace(/\s*gp$/, "")),
  type: raw.type as WeaponType,
  weaponGroup: raw.weaponGroup as WeaponGroup,
  traits: parseTraits(raw.traits),
}));

export default weapons;

export function getAttackStatFromWeapon(
  weapon: Weapon,
  baseStats: Record<StatKey, number>,
): number {
  const attackStat = weapon.traits.find((t) => t.attackStat)?.attackStat;

  if (!attackStat) return baseStats.PHY;
  if (attackStat === "DEX/PHY") return Math.max(baseStats.DEX, baseStats.PHY);

  return baseStats[attackStat as StatKey];
}

export function getDamageStatFromWeapon(
  weapon: Weapon,
  baseStats: Record<StatKey, number>,
): number {
  const damageStat = weapon.traits.find((t) => t.damageStat)?.damageStat;

  if (!damageStat) return baseStats.PHY;
  if (damageStat === "None") return 0;

  return baseStats[damageStat as StatKey];
}

export function getMAPFromWeapon(weapon: Weapon): number {
  return weapon.traits.reduce((sum, trait) => sum + (trait.MAPChange || 0), 0);
}
