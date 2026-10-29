import type { Advantage } from "../types/Feats";
import rawAdvantages from "../JSON/advantages.json";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import { lookupActions } from "./actions";

export const advantages: Advantage[] = rawAdvantages.map((raw) => {
  return {
    ...raw,
    unlockedActions: lookupActions(raw.unlockedActions),
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.speeds),
  };
});

export default advantages;
