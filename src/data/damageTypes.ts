// data/damageTypes.ts
import type {
  DamageGroup,
  DamageInstance,
  DamageType,
  DiceRoll,
  Rarity,
} from "../types/DamageTypes";
import rawDamageTypes from "../JSON/damage_types.json";

export const damageTypes: DamageType[] = rawDamageTypes.map((raw) => ({
  ...raw,
  damageGroup: raw.damageGroup as DamageGroup,
  rarity: raw.rarity as Rarity,
}));

export const damageTypesByName: Record<string, DamageType> = Object.fromEntries(
  damageTypes.map((dt) => [dt.name.toLocaleLowerCase(), dt]),
);

export function createDamageInstances(
  diceString: string | undefined,
  damageTypeString: string | undefined,
  contextName: string = "unknown",
): DamageInstance[] {
  const damageInstances: DamageInstance[] = [];

  if (diceString && damageTypeString) {
    const diceRoll = parseDiceString(diceString);
    const damageType = damageTypesByName[damageTypeString.toLowerCase()];

    if (damageType) {
      damageInstances.push({
        name: damageType,
        amount: diceRoll,
      });
    } else {
      console.warn(
        `Unknown damage type: ${damageTypeString} for ${contextName}`,
      );
    }
  }

  return damageInstances;
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

export default damageTypes;
