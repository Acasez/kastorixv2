import rawGolemUpgrades from "../JSON/golem_upgrades.json";
import type { GolemUpgrade } from "../types/Golems";
import { parseResistances, parseSpeeds } from "../utils/parseNamedUtils";
import { lookupActions } from "./actions";
import { lookupWeapons } from "./weapons";

export const golemUpgrades: GolemUpgrade[] = rawGolemUpgrades.map((raw) => {
  return {
    ...raw,
    resistances: parseResistances(raw.resistances),
    speeds: parseSpeeds(raw.speeds),
    golemWeapon: lookupWeapons(raw.golemWeapon),
    unlockedActions: lookupActions(raw.unlockedActions),
    level: Number(raw.level),
    techniques: Number(raw.techniques),
    healthBase: Number(raw.healthBase),
  };
});

export default golemUpgrades;
