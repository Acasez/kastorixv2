import type { Armor } from "../types/Armor";

export function getArmorPenalty(
  armor: Armor | undefined,
  armorPenalties: string,
): number {
  if (!armor) return 0;

  const applies =
    armor.type === "Heavy"
      ? armorPenalties === "Light" || armorPenalties === "Heavy"
      : armorPenalties === armor.type;

  return applies ? Number(armor.penalties) : 0;
}
