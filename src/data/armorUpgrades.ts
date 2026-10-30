import rawArmorUpgrades from "../JSON/armor_upgrades.json";
import type { ArmorUpgrades } from "../types/Upgrades";

export const armorUpgrades: ArmorUpgrades[] = rawArmorUpgrades.map((raw) => {
  return {
    ...raw,
    level: Number(raw.level),
  };
});

export default armorUpgrades;
