import type { DiceRoll, DamageInstance } from "../types/DamageTypes";

// utils/damage.ts
export function formatDiceRoll(roll: DiceRoll): string {
  let result = `${roll.amount}d${roll.diceSize}`;
  if (roll.bonus) result += `+${roll.bonus}`;
  return result;
}

export function formatDamageInstance(di: DamageInstance): string {
  return `${formatDiceRoll(di.amount)} ${di.name.name}`;
}

// For multiple damage types: "1d8 slashing + 1d6 fire"
export function formatDamageInstances(instances: DamageInstance[]): string {
  return instances.map(formatDamageInstance).join(" + ");
}
