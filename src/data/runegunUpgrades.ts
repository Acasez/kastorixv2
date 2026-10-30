import rawRunegunUpgrades from "../JSON/runegun_upgrades.json";
import type { RunegunUpgrades } from "../types/Upgrades";

export const runegunUpgrades: RunegunUpgrades[] = rawRunegunUpgrades.map(
  (raw) => {
    return {
      ...raw,
      level: Number(raw.level),
    };
  },
);

export default runegunUpgrades;
