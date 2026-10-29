import type { Advantage } from "../types/Feats";
import rawAdvantages from "../JSON/advantages.json";
import {
  parseSpeeds,
  parseResistances,
  lookupActions,
} from "../utils/parseNamedUtils";

export const advantages: Advantage[] = rawAdvantages.map((raw) => {
  return {
    ...raw,
    unlockedActions: lookupActions(raw.unlockedAction),
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.speeds),
  };
});

export default advantages;
