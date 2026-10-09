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
export function formatDamageInstances(
  instances: DamageInstance[],
  damageBonus: number = 0,
): string {
  return instances
    .map((instance) => {
      const dice = instance.amount;
      const totalBonus = (dice.bonus || 0) + damageBonus;

      const diceStr = `${dice.amount}d${dice.diceSize}`;

      if (totalBonus > 0) {
        return `${diceStr} + ${totalBonus} ${instance.name.name}`;
      } else if (totalBonus < 0) {
        return `${diceStr} - ${Math.abs(totalBonus)} ${instance.name.name}`;
      }
      return `${diceStr} ${instance.name.name}`;
    })
    .join(" + ");
}
