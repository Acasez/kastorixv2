// data/weapons.ts
import rawWeapons from "../JSON/weapons.json";
import type { DamageInstance, DiceRoll } from "../types/DamageTypes";
import type { StatKey } from "../types/StatKey";
import type {
  Weapon,
  WeaponGroup,
  WeaponTrait,
  WeaponType,
} from "../types/Weapons";
import { damageTypesByName } from "./damageTypes";
import { weaponTraitsByName } from "./weaponTraits";

export function parseWeaponTrait(traitString: string): WeaponTrait {
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

export function parseWeaponTraits(traitsString: string): WeaponTrait[] {
  if (!traitsString?.trim()) return [];
  return traitsString.split(",").map(parseWeaponTrait);
}

// Helper to parse "1d8" or "2d6+3" into DiceRoll
function parseDiceString(diceString: string): DiceRoll {
  const match = diceString.match(/^(\d+)d(\d+)(?:\+(\d+))?$/i);
  if (match) {
    return {
      diceSize: Number(match[2]),
      amount: Number(match[1]),
      bonus: match[3] ? Number(match[3]) : undefined,
    };
  }
  // Fallback for malformed strings
  return { diceSize: 6, amount: 1 };
}

export const weapons: Weapon[] = rawWeapons.map((raw) => {
  // Handle single damage type from JSON
  const damageInstances: DamageInstance[] = [];

  if (raw.dice && raw.damageType) {
    const diceRoll = parseDiceString(raw.dice);
    const damageType = damageTypesByName[raw.damageType.toLowerCase()];

    if (damageType) {
      damageInstances.push({
        name: damageType,
        amount: diceRoll,
      });
    } else {
      console.warn(
        `Unknown damage type: ${raw.damageType} for weapon ${raw.name}`,
      );
    }
  }

  return {
    ...raw,
    dice: damageInstances,
    hands: Number(raw.hands),
    range: Number(raw.range),
    price: Number(raw.price.replace(/\s*gp$/, "")),
    type: raw.type as WeaponType,
    weaponGroup: raw.weaponGroup as WeaponGroup,
    traits: parseWeaponTraits(raw.traits),
  };
});

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
