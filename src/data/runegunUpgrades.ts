import rawRunegunUpgrades from "../JSON/runegun_upgrades.json";
import type { RunegunUpgrades } from "../types/Upgrades";
import { lookupActions } from "./actions";

export const runegunUpgrades: RunegunUpgrades[] = rawRunegunUpgrades.map(
  (raw) => {
    return {
      ...raw,
      unlockedActions: lookupActions(raw.unlockedActions),
      level: Number(raw.level),
    };
  },
);

export default runegunUpgrades;
